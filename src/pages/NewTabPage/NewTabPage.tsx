import { hostOf } from '../../data/sites';
import Favicon from '../../components/Favicon/Favicon';
import HeroSearchBox from '../../components/HeroSearchBox/HeroSearchBox';
import Icon, { type IconName } from '../../components/Icon/Icon';
import { useBrowser } from '../../state/BrowserContext';
import { ColorDot } from '../../styled/MUI/Common.styles';
import {
  ContinueCard,
  ContinueGrid,
  Hero,
  JumpTile,
  NewTabFrame,
  Section,
  StatBadge,
  StatCard,
  StatGrid,
  SuggestButton,
  SuggestCard,
  TileGrid,
  TryChip,
  TryRow,
  WorkspacePill,
} from '../../styled/MUI/NewTab.styles';
import { greeting, timeAgo } from '../../utils/time';

const TRY_QUERIES = ['soil sampling', 'wetlands', 'mangrove', 'rail timetable'];
const JUMP_TILES: { page: string; icon: IconName; title: string; description: string }[] = [
  { page: 'graph', icon: 'graph', title: 'Research graph', description: 'Map what you have found' },
  { page: 'library', icon: 'bookmark', title: 'Library', description: 'Bookmarks and history' },
  { page: 'workspaces', icon: 'grid', title: 'Workspaces', description: 'Switch or create' },
  { page: 'privacy', icon: 'shield', title: 'Privacy', description: 'Trackers and permissions' },
  { page: 'settings', icon: 'gear', title: 'Settings', description: 'Make Synapse yours' },
];
const RECENT_PAGE_COUNT = 3;

export default function NewTabPage() {
  const browser = useBrowser();
  const { state, ws, tab } = browser;
  const graph = state.graph[ws.id] ?? { nodes: [], edges: [] };
  const clips = state.clips.filter(clip => clip.ws === ws.id);
  const bookmarks = state.bookmarks.filter(bookmark => bookmark.ws === ws.id);
  const tabCount = browser.tabsOf(ws.id).length;
  const nodeCount = ws.graph ? graph.nodes.length : 0;
  const recentPages = graph.nodes
    .filter(node => node.type === 'page')
    .sort((a, b) => b.ts - a.ts)
    .slice(0, RECENT_PAGE_COUNT);
  const lastPage = recentPages[0];
  const countByPage: Record<string, string> = {
    graph: `${nodeCount} nodes`,
    library: `${bookmarks.length} saved`,
    workspaces: `${state.workspaces.length} total`,
    privacy: state.settings.trackers,
    settings: 'Prefs',
  };
  const stats = [
    { tag: 'Tabs', label: 'Open tabs', value: tabCount, badge: tabCount > 5 ? 'Busy' : 'Active', tone: tabCount > 5 ? 'warning' : 'success', onOpen: () => browser.openInternal('workspaces') },
    { tag: 'Graph', label: 'Graph nodes', value: nodeCount, badge: nodeCount ? 'Growing' : 'Empty', tone: nodeCount ? 'success' : 'error', onOpen: () => browser.openInternal('graph') },
    { tag: 'Clips', label: 'Clips', value: clips.length, badge: clips.length ? 'Saved' : 'None yet', tone: clips.length ? 'success' : 'error', onOpen: () => browser.setPanelTab('clips') },
    { tag: 'Library', label: 'Saved pages', value: bookmarks.length, badge: bookmarks.length ? 'Saved' : 'None yet', tone: bookmarks.length ? 'success' : 'error', onOpen: () => browser.openInternal('library') },
  ] as const;

  function search(value: string) {
    if (value.trim() && tab) browser.navigate(tab.id, value);
  }


  return (
    <NewTabFrame>
      <Hero>
        <WorkspacePill onClick={() => browser.openInternal('workspaces')}>
          <ColorDot $color={ws.color} $size={9} $round />
          {ws.name}
          <Icon name="chev" size={13} />
        </WorkspacePill>
        <h1>{greeting()}. What are you researching?</h1>
        <HeroSearchBox onSearch={search} />
        <TryRow>
          <span>Try</span>
          {TRY_QUERIES.map((tryQuery, index) => (
            <TryChip key={tryQuery} $tone={index} onClick={() => search(tryQuery)}>
              {tryQuery}
            </TryChip>
          ))}
        </TryRow>
      </Hero>
      <StatGrid>
        {stats.map((stat, index) => (
          <StatCard key={stat.tag} $tint={index} onClick={stat.onOpen}>
            <span className="stat-head">
              <span className="stat-tag">{stat.tag}</span>
              <StatBadge $tone={stat.tone}>{stat.badge}</StatBadge>
            </span>
            <span className="stat-number">
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </span>
          </StatCard>
        ))}
      </StatGrid>
      {lastPage && (
        <SuggestCard>
          <div className="suggest-head">
            <span className="suggest-icon">
              <Icon name="spark" size={16} />
            </span>
            Suggested for you
          </div>
          <h3>Pick up where you left off: {lastPage.title}</h3>
          <div className="suggest-actions">
            <SuggestButton $isPrimary onClick={() => search(lastPage.url ?? '')}>
              <Icon name="open" size={15} />
              Continue
            </SuggestButton>
            <SuggestButton onClick={() => browser.openInternal('graph')}>
              <Icon name="graph" size={15} />
              Open graph
            </SuggestButton>
          </div>
        </SuggestCard>
      )}
      <Section>
        <h2>Jump to</h2>
        <TileGrid>
          {JUMP_TILES.map((tile, index) => (
            <JumpTile key={tile.page} $tone={index} onClick={() => browser.openInternal(tile.page)}>
              <span className="tile-corner">
                <Icon name="open" size={15} />
              </span>
              <span className="tile-icon">
                <Icon name={tile.icon} size={22} />
              </span>
              <b>{tile.title}</b>
              <span className="tile-desc">{tile.description}</span>
              <span className="tile-foot">
                <span className="tile-open">
                  <Icon name="chevr" size={13} />
                  Open
                </span>
                <span className="tile-count">{countByPage[tile.page]}</span>
              </span>
            </JumpTile>
          ))}
        </TileGrid>
      </Section>
      {recentPages.length > 0 && (
        <Section>
          <h2>Continue researching</h2>
          <ContinueGrid>
            {recentPages.map(page => (
              <ContinueCard key={page.id} onClick={() => search(page.url ?? '')}>
                <Favicon url={page.url ?? ''} size={34} />
                <span className="card-text">
                  <b>{page.title}</b>
                  <span>
                    {hostOf(page.url ?? '')} · {timeAgo(page.ts)}
                  </span>
                </span>
              </ContinueCard>
            ))}
          </ContinueGrid>
        </Section>
      )}
    </NewTabFrame>
  );
}
