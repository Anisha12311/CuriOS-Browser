const { ipcMain, net } = require("electron");

const MAX_SUGGESTIONS = 8;
const TIMEOUT_MS = 2500;

// Each engine's public autocomplete endpoint returns the OpenSearch shape: [query, [suggestions]].
const SUGGEST_URLS = {
  google: (query) => `https://suggestqueries.google.com/complete/search?client=firefox&ie=utf-8&oe=utf-8&q=${encodeURIComponent(query)}`,
  bing: (query) => `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(query)}`,
  ddg: (query) => `https://duckduckgo.com/ac/?type=list&q=${encodeURIComponent(query)}`,
};

async function fetchSuggestions({ engine, query }) {
  const buildUrl = SUGGEST_URLS[engine];
  const trimmed = String(query ?? "").trim();
  if (!buildUrl || !trimmed) return [];
  try {
    const response = await net.fetch(buildUrl(trimmed), { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) return [];
    const body = await response.json();
    const suggestions = Array.isArray(body) && Array.isArray(body[1]) ? body[1] : [];
    return suggestions.filter((item) => typeof item === "string").slice(0, MAX_SUGGESTIONS);
  } catch {
    // Offline or blocked: the address bar still works without suggestions.
    return [];
  }
}

function registerSearch() {
  ipcMain.handle("search:suggest", (_event, request) => fetchSuggestions(request));
}

module.exports = { registerSearch };
