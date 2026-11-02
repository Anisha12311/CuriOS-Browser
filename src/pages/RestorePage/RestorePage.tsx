import { hostOf, kindOf } from '../../data/urls';
import Favicon from '../../components/Favicon/Favicon';
import Icon from '../../components/Icon/Icon';
import { useBrowser } from '../../state/BrowserContext';
import { ActionButton, EmptyState, ToolButton } from '../../styled/MUI/Common.styles';
import { DayLabel, ItemCard, ItemList, ItemMain, PillHint } from '../../styled/MUI/Library.styles';
import { IconTile, PageFrame, PageHead } from '../../styled/MUI/Page.styles';
import { timeAgo } from '../../utils/time';

export default function RestorePage() {
  const browser = useBrowser();
  const { closed, snapshots, workspaces } = browser.state;

  function workspaceName(id: string) {
    return workspaces.find(workspace => workspace.id === id)?.name ?? 'a deleted workspace';
  }

  return (
    <PageFrame>
      <PageHead>
        <div>
          <h1>Restore session</h1>
          <p>Save the tabs you have open in {browser.ws.name} and reopen them any time, or bring back tabs you closed.</p>
        </div>
        <ActionButton onClick={browser.saveSnapshot}>
          <Icon name="dl" size={15} />
          Save snapshot now
        </ActionButton>
      </PageHead>

      <DayLabel>Snapshots</DayLabel>
      {!snapshots.length && <EmptyState sx={{ mb: 3 }}>Saved snapshots appear here. They keep every open tab except new tabs.</EmptyState>}
      <ItemList sx={{ mb: 3 }}>
        {snapshots.map(snapshot => (
          <ItemCard key={snapshot.id}>
            <ItemMain onClick={() => browser.restoreSnapshot(snapshot.id)}>
              <IconTile $size={28}>
                <Icon name="tabs" size={15} />
              </IconTile>
              <span className="item-text">
                <b>{snapshot.name}</b>
                <span>
                  {snapshot.tabs.length} {snapshot.tabs.length === 1 ? 'tab' : 'tabs'} from {workspaceName(snapshot.ws)} ·{' '}
                  {snapshot.tabs
                    .slice(0, 3)
                    .map(page => hostOf(page.url))
                    .join(', ')}
                  {snapshot.tabs.length > 3 ? '…' : ''}
                </span>
              </span>
              <PillHint>
                <Icon name="undo" size={14} />
                Open
              </PillHint>
            </ItemMain>
            <span className="item-actions">
              <ToolButton $size={32} aria-label="Delete snapshot" onClick={() => browser.deleteSnapshot(snapshot.id)}>
                <Icon name="trash" size={15} />
              </ToolButton>
            </span>
          </ItemCard>
        ))}
      </ItemList>

      <DayLabel>Recently closed</DayLabel>
      {!closed.length && <EmptyState>No recently closed tabs.</EmptyState>}
      <ItemList>
        {closed.map((entry, index) => (
          <ItemCard key={`${entry.tab.id}-${entry.at}`}>
            <ItemMain disabled={index > 0} onClick={browser.reopenClosed}>
              <Favicon url={entry.tab.url} size={28} />
              <span className="item-text">
                <b>{entry.tab.title}</b>
                <span>
                  {kindOf(entry.tab.url) === 'internal' ? 'CuriOS' : hostOf(entry.tab.url)} · closed {timeAgo(entry.at)}
                </span>
              </span>
              {index === 0 && (
                <PillHint>
                  <Icon name="undo" size={14} />
                  Reopen
                </PillHint>
              )}
            </ItemMain>
          </ItemCard>
        ))}
      </ItemList>
    </PageFrame>
  );
}
