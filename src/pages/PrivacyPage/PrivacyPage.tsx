import { useEffect, useState } from 'react';
import { useConfirm } from '../../components/ConfirmDialog/ConfirmProvider';
import Icon from '../../components/Icon/Icon';
import type { TrackerLevel } from '../../data/urls';
import { hasNativeTabs } from '../../services/nativeTabs';
import { useBrowser } from '../../state/BrowserContext';
import { ActionButton } from '../../styled/MUI/Common.styles';
import { CardHeader, IconTile, OptionCard, PageFrame, PageHead, SettingRow, SurfaceCard } from '../../styled/MUI/Page.styles';
import { Note, OptionStack, RadioDot, ScoreHero, TwoColumns } from '../../styled/MUI/Settings.styles';

const LEVELS: { key: TrackerLevel; title: string; description: string }[] = [
  { key: 'standard', title: 'Standard', description: 'Blocks known third-party ad, analytics and social trackers.' },
  { key: 'strict', title: 'Strict', description: 'Also blocks tag managers and fingerprinting scripts. A few sites may break.' },
  { key: 'off', title: 'Off', description: 'Nothing is blocked.' },
];

type SiteData = 'cookies' | 'cache';

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PrivacyPage() {
  const browser = useBrowser();
  const confirm = useConfirm();
  const { state, tab, pageInfo } = browser;
  const level = state.settings.trackers;
  const levelTitle = LEVELS.find(option => option.key === level)?.title ?? level;
  const isDesktop = hasNativeTabs();
  const lastTabBlocked = tab ? (pageInfo[tab.id]?.blockedCount ?? 0) : 0;
  const [cacheSize, setCacheSize] = useState<number | null>(null);
  const [busy, setBusy] = useState<SiteData | null>(null);

  function refreshCacheSize() {
    window.desktop?.privacy?.cacheSize().then(setCacheSize, () => setCacheSize(null));
  }

  useEffect(refreshCacheSize, []);

  async function clearHistory() {
    const isConfirmed = await confirm({
      title: 'Clear browsing history?',
      message: 'Visited pages, recently closed tabs and recent searches in every workspace will be removed. Bookmarks and graphs are kept.',
      confirmLabel: 'Clear history',
    });
    if (isConfirmed) browser.clearHistory(true);
  }

  async function clearSiteData(kind: SiteData) {
    const isConfirmed = await confirm(
      kind === 'cookies'
        ? {
            title: 'Clear cookies and site data?',
            message: 'Logins and data that websites store on this device will be deleted. You will be signed out of most websites.',
            confirmLabel: 'Clear cookies',
          }
        : {
            title: 'Clear cached images and files?',
            message: 'Pages may load a little more slowly the next time you visit them.',
            confirmLabel: 'Clear cache',
          },
    );
    if (!isConfirmed) return;
    setBusy(kind);
    try {
      await window.desktop?.privacy?.clearData({ [kind]: true });
      browser.toast(kind === 'cookies' ? 'Cookies and site data cleared' : 'Cache cleared', 'warn');
      refreshCacheSize();
    } catch {
      browser.toast('Could not clear the data. Try again.', 'err');
    } finally {
      setBusy(null);
    }
  }

  return (
    <PageFrame>
      <PageHead>
        <div>
          <h1>Privacy and security</h1>
          <p>CuriOS blocks known trackers on every page and asks before a site uses your camera, location or other devices.</p>
        </div>
      </PageHead>
      <ScoreHero>
        <IconTile $size={64}>
          <Icon name="shield" size={30} />
        </IconTile>
        <div className="hero-text">
          <h2>Tracker protection: {levelTitle}</h2>
          <p>
            {isDesktop
              ? 'Counts below are real requests CuriOS stopped while you browsed.'
              : 'Tracker blocking runs in the desktop app (npm start); the browser preview cannot block requests.'}
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <b>{state.stats.blocked.toLocaleString()}</b>
            <span>Trackers blocked</span>
          </div>
          <div>
            <b>{lastTabBlocked.toLocaleString()}</b>
            <span>On the current tab</span>
          </div>
          <div>
            <b>{state.stats.upgraded.toLocaleString()}</b>
            <span>Typed addresses upgraded to HTTPS</span>
          </div>
        </div>
      </ScoreHero>
      <TwoColumns>
        <div>
          <SurfaceCard>
            <CardHeader>
              <IconTile>
                <Icon name="shield" size={18} />
              </IconTile>
              <div>
                <h2>Tracker protection</h2>
                <p>Only requests to other sites are blocked; a site’s own content always loads.</p>
              </div>
            </CardHeader>
            <OptionStack role="radiogroup">
              {LEVELS.map(option => (
                <OptionCard
                  key={option.key}
                  role="radio"
                  aria-checked={level === option.key}
                  $isOn={level === option.key}
                  onClick={() => browser.setSetting('trackers', option.key)}
                >
                  <RadioDot $isOn={level === option.key} />
                  <span>
                    <b>{option.title}</b>
                    <small>{option.description}</small>
                  </span>
                </OptionCard>
              ))}
            </OptionStack>
            <Note>Changes apply to the next requests pages make. Reload a page to apply them to it fully.</Note>
          </SurfaceCard>
        </div>
        <div>
          <SurfaceCard>
            <CardHeader>
              <IconTile>
                <Icon name="loc" size={18} />
              </IconTile>
              <div>
                <h2>Site permissions</h2>
                <p>Sites must ask before using your location, camera, microphone, notifications or screen.</p>
              </div>
            </CardHeader>
            <Note>
              When a site asks, CuriOS shows an Allow or Block prompt. If you tick “Remember my choice”, it applies
              to that site until CuriOS restarts. Anything else a site requests, such as USB or serial devices, is
              blocked.
            </Note>
          </SurfaceCard>
          <SurfaceCard sx={{ mt: 2.5 }}>
            <CardHeader>
              <IconTile>
                <Icon name="trash" size={18} />
              </IconTile>
              <div>
                <h2>Your data</h2>
                <p>Stored only on this device, in CuriOS’s database.</p>
              </div>
            </CardHeader>
            <SettingRow>
              <div className="row-text">
                <b>Browsing history</b>
                <span>Visited pages and recently closed tabs in every workspace. Bookmarks and the graph are kept.</span>
              </div>
              <ActionButton $variant="danger" $small onClick={clearHistory}>
                Clear
              </ActionButton>
            </SettingRow>
            {isDesktop && (
              <>
                <SettingRow>
                  <div className="row-text">
                    <b>Cookies and site data</b>
                    <span>Signs you out of most websites.</span>
                  </div>
                  <ActionButton $variant="danger" $small disabled={busy === 'cookies'} onClick={() => clearSiteData('cookies')}>
                    {busy === 'cookies' ? 'Clearing…' : 'Clear'}
                  </ActionButton>
                </SettingRow>
                <SettingRow>
                  <div className="row-text">
                    <b>Cached images and files</b>
                    <span>{cacheSize === null ? 'Pages may load more slowly the next time you visit.' : `Uses ${formatBytes(cacheSize)}.`}</span>
                  </div>
                  <ActionButton $variant="danger" $small disabled={busy === 'cache'} onClick={() => clearSiteData('cache')}>
                    {busy === 'cache' ? 'Clearing…' : 'Clear'}
                  </ActionButton>
                </SettingRow>
              </>
            )}
          </SurfaceCard>
        </div>
      </TwoColumns>
    </PageFrame>
  );
}
