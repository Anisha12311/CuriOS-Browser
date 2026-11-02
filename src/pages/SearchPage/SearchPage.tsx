import { useEffect, useState, type FormEvent } from 'react';
import Icon from '../../components/Icon/Icon';
import { ENGINES, queryOf } from '../../data/urls';
import { hasNativeTabs } from '../../services/nativeTabs';
import { useBrowser } from '../../state/BrowserContext';
import type { BrowserTab } from '../../state/types';
import { ActionButton, ActionLink, BareInput } from '../../styled/MUI/Common.styles';
import { SearchField } from '../../styled/MUI/Library.styles';
import { PageFrame, PreviewNotice } from '../../styled/MUI/Page.styles';

/** Only reached in the browser preview, or for old saved search tabs; the desktop app searches the real web. */
export default function SearchPage({ tab }: { tab: BrowserTab }) {
  const browser = useBrowser();
  const { navigate } = browser;
  const initialQuery = queryOf(tab.url);
  const [query, setQuery] = useState(initialQuery);
  const engine = ENGINES[browser.state.settings.engine];
  const isDesktop = hasNativeTabs();

  useEffect(() => {
    if (isDesktop && initialQuery) navigate(tab.id, initialQuery, { replace: true });
  }, [isDesktop, initialQuery, tab.id, navigate]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) navigate(tab.id, query);
  }

  if (isDesktop) return null;
  return (
    <PageFrame $width="narrow">
      <SearchField onSubmit={handleSubmit} sx={{ maxWidth: 'none', mb: 2 }}>
        <Icon name="search" size={18} />
        <BareInput value={query} inputProps={{ 'aria-label': 'Search' }} onChange={event => setQuery(event.target.value)} />
        <ActionButton $variant="primary" $small type="submit">
          Search
        </ActionButton>
      </SearchField>
      <PreviewNotice>
        <Icon name="info" size={18} />
        <span>
          This is the browser preview, which cannot show web pages. Real {engine.name} search works in the desktop
          app: run <b>npm start</b> and use the CuriOS window.
        </span>
        <ActionLink $small href={engine.url + encodeURIComponent(initialQuery)} target="_blank" rel="noopener">
          <Icon name="open" size={14} />
          Search {engine.name}
        </ActionLink>
      </PreviewNotice>
    </PageFrame>
  );
}
