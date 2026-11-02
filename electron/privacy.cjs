const { dialog, ipcMain, session } = require("electron");

// Well-known third-party tracker domains. A request is blocked when its host is one of these or a subdomain.
const TRACKERS = {
  advertising: [
    "doubleclick.net", "googlesyndication.com", "googleadservices.com", "adservice.google.com", "2mdn.net",
    "amazon-adsystem.com", "adnxs.com", "criteo.com", "criteo.net", "taboola.com", "outbrain.com",
    "pubmatic.com", "rubiconproject.com", "openx.net", "adsrvr.org", "moatads.com", "casalemedia.com",
    "media.net", "smartadserver.com", "yieldmo.com", "sharethrough.com", "teads.tv", "bidswitch.net",
    "adform.net", "quantserve.com", "zemanta.com", "33across.com", "indexww.com", "contextweb.com",
  ],
  analytics: [
    "google-analytics.com", "scorecardresearch.com", "hotjar.com", "hotjar.io", "mixpanel.com",
    "segment.io", "cdn.segment.com", "amplitude.com", "fullstory.com", "clarity.ms", "nr-data.net",
    "chartbeat.com", "chartbeat.net", "mouseflow.com", "crazyegg.com", "bat.bing.com", "quantcount.com",
    "heapanalytics.com", "kissmetrics.com", "newrelic.com",
  ],
  social: [
    "connect.facebook.net", "ads-twitter.com", "analytics.twitter.com", "px.ads.linkedin.com", "snap.licdn.com",
    "analytics.tiktok.com", "ct.pinterest.com", "sc-static.net", "tr.snapchat.com",
  ],
  // Strict only: blocking these can break some sites.
  strict: ["googletagmanager.com", "fpjs.io", "fpcdn.io", "fingerprint.com", "branch.io", "adjust.com", "appsflyer.com"],
};

const ASK_PERMISSIONS = {
  geolocation: "your location",
  notifications: "to show notifications",
  media: "your camera or microphone",
  "clipboard-read": "to read your clipboard",
  "display-capture": "to share your screen",
  midi: "your MIDI devices",
};
const ALWAYS_ALLOWED = new Set(["fullscreen", "clipboard-sanitized-write", "pointerLock", "window-management"]);

function hostMatches(host, domains) {
  return domains.some((domain) => host === domain || host.endsWith("." + domain));
}

// Two-label approximation of "same site"; good enough to avoid blocking a site's own requests.
function siteOf(host) {
  return host.split(".").slice(-2).join(".");
}

function createPrivacy(win, tabIdFor) {
  let level = "standard";
  const decisions = new Map();
  const pendingByTab = new Map();
  let flushTimer = null;

  function blockedDomains() {
    if (level === "off") return [];
    const standard = [...TRACKERS.advertising, ...TRACKERS.analytics, ...TRACKERS.social];
    return level === "strict" ? [...standard, ...TRACKERS.strict] : standard;
  }

  function recordBlock(tabId) {
    pendingByTab.set(tabId, (pendingByTab.get(tabId) ?? 0) + 1);
    if (flushTimer) return;
    // Batched so a page loading 40 trackers sends one message, not 40.
    flushTimer = setTimeout(() => {
      flushTimer = null;
      if (!win.isDestroyed()) win.webContents.send("privacy:blocked", Object.fromEntries(pendingByTab));
      pendingByTab.clear();
    }, 500);
  }

  function applyToSession(target) {
    target.webRequest.onBeforeRequest({ urls: ["http://*/*", "https://*/*"] }, (details, callback) => {
      const tabId = tabIdFor(details.webContentsId);
      if (!tabId || details.resourceType === "mainFrame") return callback({});
      let requestHost;
      let pageHost;
      try {
        requestHost = new URL(details.url).hostname;
        pageHost = new URL(details.webContents?.getURL() || details.referrer || details.url).hostname;
      } catch {
        return callback({});
      }
      const isThirdParty = siteOf(requestHost) !== siteOf(pageHost);
      if (isThirdParty && hostMatches(requestHost, blockedDomains())) {
        recordBlock(tabId);
        return callback({ cancel: true });
      }
      callback({});
    });

    target.setPermissionCheckHandler((contents, permission, origin) => {
      if (ALWAYS_ALLOWED.has(permission)) return true;
      if (contents && !tabIdFor(contents.id)) return false;
      return decisions.get(`${origin}|${permission}`) === true;
    });

    target.setPermissionRequestHandler(async (contents, permission, callback, details) => {
      if (ALWAYS_ALLOWED.has(permission)) return callback(true);
      const purpose = ASK_PERMISSIONS[permission];
      if (!purpose || !tabIdFor(contents.id)) return callback(false);
      let origin = "This site";
      try {
        origin = new URL(details.requestingUrl || contents.getURL()).origin;
      } catch {
        // Keep the generic name.
      }
      const key = `${origin}|${permission}`;
      if (decisions.has(key)) return callback(decisions.get(key));
      const { response, checkboxChecked } = await dialog.showMessageBox(win, {
        type: "question",
        buttons: ["Allow", "Block"],
        defaultId: 1,
        cancelId: 1,
        title: "Permission request",
        message: `${origin} wants ${purpose}`,
        detail: "You can change this later by restarting CuriOS.",
        checkboxLabel: "Remember my choice for this site",
        checkboxChecked: true,
      });
      const isAllowed = response === 0;
      if (checkboxChecked) decisions.set(key, isAllowed);
      callback(isAllowed);
    });
  }

  applyToSession(session.defaultSession);
  ipcMain.handle("privacy:cache-size", () => session.defaultSession.getCacheSize());
  ipcMain.handle("privacy:clear-data", async (_event, { cookies, cache }) => {
    const target = session.defaultSession;
    // Cookies plus every kind of site storage, which signs you out of websites.
    if (cookies) await target.clearStorageData();
    if (cache) {
      await target.clearCache();
      await target.clearHostResolverCache();
    }
  });
  ipcMain.on("privacy:set-level", (_event, nextLevel) => {
    if (["standard", "strict", "off"].includes(nextLevel)) level = nextLevel;
  });
}

module.exports = { createPrivacy };
