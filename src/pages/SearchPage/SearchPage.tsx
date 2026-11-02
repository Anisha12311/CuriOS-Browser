import Stack from '@mui/material/Stack';
import { useEffect, useState, type FormEvent } from 'react';
import { ENGINES, queryOf, searchSites } from '../../data/sites';
import Favicon from '../../components/Favicon/Favicon';
import Icon from '../../components/Icon/Icon';
import { hasNativeTabs } from '../../services/nativeTabs';
import { useBrowser } from '../../state/BrowserContext';
import type { BrowserTab } from '../../state/types';
import { ActionButton, ActionLink, BareInput, EmptyState } from '../../styled/MUI/Common.styles';
import { SearchField, SearchResult } from '../../styled/MUI/Library.styles';
import { PageFrame, PreviewNotice, SurfaceCard } from '../../styled/MUI/Page.styles';

export default function SearchPage({ tab }: { tab: BrowserTab }) {
  const browser = useBrowser();
  const initialQuery = queryOf(tab.url);
  const [query, setQuery] = useState(initialQuery);
  const results = searchSites(initialQuery);
  const engine = ENGINES[browser.state.settings.engine];
  const isDesktop = hasNativeTabs();
  const { navigate } = browser;

  useEffect(() => {
    // Search tabs saved before real search existed: in the desktop app, send them to the engine.
    if (isDesktop && initialQuery) navigate(tab.id, initialQuery, { replace: true });
  }, [isDesktop, initialQuery, tab.id, navigate]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) browser.navigate(tab.id, query);
  }

  return (
    <PageFrame $width="narrow">
      <SearchField onSubmit={handleSubmit} sx={{ maxWidth: 'none', mb: 2 }}>
        <Icon name="search" size={18} />
        <BareInput value={query} inputProps={{ 'aria-label': 'Search' }} onChange={event => setQuery(event.target.value)} />
        <ActionButton $variant="primary" $small type="submit">
          Search
        </ActionButton>
      </SearchField>
      {!isDesktop && (
        <PreviewNotice>
          <Icon name="info" size={18} />
          <span>
            This is the browser preview, which can only search the built-in demo sites. Real {engine.name} search
            works in the desktop app: run <b>npm start</b> and use the Synapse window.
          </span>
          <ActionLink $small href={engine.url + encodeURIComponent(initialQuery)} target="_blank" rel="noopener">
            <Icon name="open" size={14} />
            Search {engine.name}
          </ActionLink>
        </PreviewNotice>
      )}
      <Stack component="p" color="text.secondary" sx={{ mb: 2.5 }}>
        {results.length} result{results.length === 1 ? '' : 's'} in the built-in demo sites for “{initialQuery}”
      </Stack>
      <Stack spacing={2.75}>
        {results.map(site => (
          <SearchResult key={site.url} onClick={() => browser.navigate(tab.id, site.url)}>
            <span className="result-head">
              <Favicon url={site.url} size={14} />
              {site.host + site.path}
            </span>
            <span className="result-title">{site.title}</span>
            <span className="result-snippet">{site.sections[0].p}</span>
          </SearchResult>
        ))}
        {!results.length && (
          <EmptyState>Nothing in the demo sites matches. Try “soil”, “wetlands”, “mangrove” or “rail”.</EmptyState>
        )}
      </Stack>
      <SurfaceCard sx={{ mt: 4, p: 2.25 }}>
        <b>Search the web</b>
        <Stack component="p" color="text.secondary" sx={{ my: 0.5 }}>
          Synapse does not run its own search engine. This opens {engine.name} in a normal browser tab.
        </Stack>
        <ActionLink
          href={engine.url + encodeURIComponent(initialQuery)}
          target="_blank"
          rel="noopener"
          sx={{ mt: 1.25 }}
        >
          <Icon name="open" size={15} />
          Search with {engine.name}
        </ActionLink>
      </SurfaceCard>
    </PageFrame>
  );
}
