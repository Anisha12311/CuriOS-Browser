import { useState } from 'react';
import { hostOf } from '../../data/sites';
import Favicon from '../../components/Favicon/Favicon';
import Icon from '../../components/Icon/Icon';
import { useBrowser } from '../../state/BrowserContext';
import { ActionButton, BareInput, EmptyState, Grow, ToolButton } from '../../styled/MUI/Common.styles';
import {
  CardGrid,
  DayLabel,
  FolderHead,
  ItemCard,
  ItemList,
  ItemMain,
  SearchField,
  SegmentButton,
  Segmented,
  TabRow,
  TopBar,
  UnderlineTab,
} from '../../styled/MUI/Library.styles';
import { IconTile, PageFrame, PageHead } from '../../styled/MUI/Page.styles';
import { clockTime, dayLabel } from '../../utils/time';

type LibraryTab = 'bookmarks' | 'history';
const MAX_HISTORY_ROWS = 150;

export default function LibraryPage() {
  const browser = useBrowser();
  const { state, ws, tab } = browser;
  const [activeTab, setActiveTab] = useState<LibraryTab>('bookmarks');
  const [isAllWorkspaces, setIsAllWorkspaces] = useState(false);
  const [query, setQuery] = useState('');
  const lowerQuery = query.trim().toLowerCase();
  const isVisible = (item: { ws: string; title: string; url: string }) =>
    (isAllWorkspaces || item.ws === ws.id) && `${item.title} ${item.url}`.toLowerCase().includes(lowerQuery);
  const bookmarks = state.bookmarks.filter(isVisible);
  const history = state.history.filter(isVisible).slice(0, MAX_HISTORY_ROWS);
  const folders = [...new Set(bookmarks.map(bookmark => bookmark.folder))];
  const historyByDay = new Map<string, typeof history>();
  history.forEach(entry => {
    const label = dayLabel(entry.ts);
    historyByDay.set(label, [...(historyByDay.get(label) ?? []), entry]);
  });

  function openUrl(url: string) {
    if (tab) browser.navigate(tab.id, url);
  }

  return (
    <PageFrame>
      <PageHead>
        <div>
          <h1>Library</h1>
          <p>Everything you saved and visited, in one place.</p>
        </div>
      </PageHead>
      <TopBar>
        <SearchField onSubmit={event => event.preventDefault()}>
          <Icon name="search" size={17} />
          <BareInput
            placeholder="Search bookmarks and history"
            value={query}
            inputProps={{ 'aria-label': 'Search bookmarks and history' }}
            onChange={event => setQuery(event.target.value)}
          />
        </SearchField>
        <Segmented>
          <SegmentButton $isOn={!isAllWorkspaces} onClick={() => setIsAllWorkspaces(false)}>
            {ws.name}
          </SegmentButton>
          <SegmentButton $isOn={isAllWorkspaces} onClick={() => setIsAllWorkspaces(true)}>
            All workspaces
          </SegmentButton>
        </Segmented>
      </TopBar>
      <TabRow role="tablist">
        <UnderlineTab role="tab" $isOn={activeTab === 'bookmarks'} onClick={() => setActiveTab('bookmarks')}>
          <Icon name="bookmark" size={16} />
          Bookmarks <span className="count">{bookmarks.length}</span>
        </UnderlineTab>
        <UnderlineTab role="tab" $isOn={activeTab === 'history'} onClick={() => setActiveTab('history')}>
          <Icon name="clock" size={16} />
          History <span className="count">{history.length}</span>
        </UnderlineTab>
        <Grow />
        {activeTab === 'history' && (
          <ActionButton $small sx={{ mb: 0.75 }} onClick={browser.clearHistory}>
            <Icon name="trash" size={14} />
            Clear history
          </ActionButton>
        )}
      </TabRow>
      {activeTab === 'bookmarks' && (
        <>
          {!bookmarks.length && (
            <EmptyState>{lowerQuery ? 'No bookmarks match.' : 'Press the star in the address bar on any page to save it here.'}</EmptyState>
          )}
          {folders.map(folder => {
            const items = bookmarks.filter(bookmark => bookmark.folder === folder);
            return (
              <section key={folder}>
                <FolderHead>
                  <IconTile $size={30}>
                    <Icon name="folder" size={16} />
                  </IconTile>
                  <b>{folder}</b>
                  <span className="count">{items.length}</span>
                </FolderHead>
                <CardGrid>
                  {items.map(bookmark => (
                    <ItemCard key={bookmark.id}>
                      <ItemMain onClick={() => openUrl(bookmark.url)}>
                        <Favicon url={bookmark.url} size={32} />
                        <span className="item-text">
                          <b>{bookmark.title}</b>
                          <span>{hostOf(bookmark.url)}</span>
                        </span>
                      </ItemMain>
                      <span className="item-actions">
                        <ToolButton $size={32} aria-label="Remove bookmark" onClick={() => browser.removeBookmark(bookmark.id)}>
                          <Icon name="trash" size={15} />
                        </ToolButton>
                      </span>
                    </ItemCard>
                  ))}
                </CardGrid>
              </section>
            );
          })}
        </>
      )}
      {activeTab === 'history' && (
        <>
          {!history.length && <EmptyState>{lowerQuery ? 'No history matches.' : 'Pages you visit will be listed here.'}</EmptyState>}
          {[...historyByDay.entries()].map(([label, entries]) => (
            <section key={label}>
              <DayLabel>{label}</DayLabel>
              <ItemList>
                {entries.map(entry => (
                  <ItemCard key={entry.id}>
                    <ItemMain onClick={() => openUrl(entry.url)}>
                      <span className="item-clock">{clockTime(entry.ts)}</span>
                      <Favicon url={entry.url} size={28} />
                      <span className="item-text">
                        <b>{entry.title}</b>
                        <span>{hostOf(entry.url)}</span>
                      </span>
                    </ItemMain>
                    <span className="item-actions">
                      <ToolButton $size={32} aria-label="Remove from history" onClick={() => browser.removeHistory(entry.id)}>
                        <Icon name="x" size={14} />
                      </ToolButton>
                    </span>
                  </ItemCard>
                ))}
              </ItemList>
            </section>
          ))}
        </>
      )}
    </PageFrame>
  );
}
