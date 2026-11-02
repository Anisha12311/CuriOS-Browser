import { useState } from 'react';
import Icon from '../../components/Icon/Icon';
import NewWorkspaceDialog from '../../components/NewWorkspaceDialog/NewWorkspaceDialog';
import { useBrowser } from '../../state/BrowserContext';
import type { Workspace } from '../../state/types';
import { ActionButton, BareInput, ToolButton } from '../../styled/MUI/Common.styles';
import { SearchField } from '../../styled/MUI/Library.styles';
import { PageFrame, PageHead } from '../../styled/MUI/Page.styles';
import {
  NewWorkspaceTile,
  PillAction,
  WorkspaceCardInner,
  WorkspaceCardRoot,
  WorkspaceGrid,
} from '../../styled/MUI/Workspaces.styles';
import { timeAgo } from '../../utils/time';

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const browser = useBrowser();
  const { state } = browser;
  const isCurrent = workspace.id === state.activeWs;
  const graph = state.graph[workspace.id];
  const stats = [
    { label: 'Tabs', value: browser.tabsOf(workspace.id).length },
    { label: 'Nodes', value: workspace.graph ? (graph?.nodes.length ?? 0) : '-' },
    { label: 'Clips', value: state.clips.filter(clip => clip.ws === workspace.id).length },
    { label: 'Saved', value: state.bookmarks.filter(bookmark => bookmark.ws === workspace.id).length },
  ];

  function handleOpenGraph() {
    browser.switchWs(workspace.id);
    browser.openInternal('graph');
  }

  return (
    <WorkspaceCardRoot $color={workspace.color} $isCurrent={isCurrent}>
      <WorkspaceCardInner $color={workspace.color}>
        <div className="card-top">
          <span className="card-avatar">{workspace.name.charAt(0).toUpperCase()}</span>
          {isCurrent && <span className="card-badge">Current</span>}
          <ToolButton
            $size={32}
            aria-label={`Delete ${workspace.name}`}
            title="Delete workspace"
            onClick={() => browser.deleteWorkspace(workspace.id)}
          >
            <Icon name="trash" size={16} />
          </ToolButton>
        </div>
        <h3>{workspace.name}</h3>
        <div className="card-role">{isCurrent ? 'Open now' : `Last active ${timeAgo(workspace.active)}`}</div>
        <div className="card-tags">
          <span className="card-tag">
            <Icon name="shield" size={13} />
            {workspace.isolate ? 'Isolated' : 'Shared data'}
          </span>
          <span className="card-tag">
            <Icon name="graph" size={13} />
            {workspace.graph ? 'Graph on' : 'Graph off'}
          </span>
        </div>
        <div className="card-stats">
          {stats.map(stat => (
            <div key={stat.label}>
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="card-foot">
          <PillAction $color={workspace.color} disabled={isCurrent} onClick={() => browser.switchWs(workspace.id)}>
            {isCurrent ? 'Currently open' : 'Switch to workspace'}
          </PillAction>
          {workspace.graph && (
            <ToolButton $size={42} aria-label={`Open graph of ${workspace.name}`} onClick={handleOpenGraph}>
              <Icon name="graph" size={20} />
            </ToolButton>
          )}
        </div>
      </WorkspaceCardInner>
    </WorkspaceCardRoot>
  );
}

export default function WorkspacesPage() {
  const { state } = useBrowser();
  const [query, setQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const lowerQuery = query.trim().toLowerCase();
  const workspaces = state.workspaces
    .filter(workspace => workspace.name.toLowerCase().includes(lowerQuery))
    .sort((a, b) => Number(b.id === state.activeWs) - Number(a.id === state.activeWs) || b.active - a.active);

  return (
    <PageFrame $width="full">
      <PageHead>
        <div>
          <h1>Workspaces</h1>
          <p>
            Keep each line of research separate. Every workspace has its own tabs, graph, clips, bookmarks and
            history.
          </p>
        </div>
        <ActionButton $variant="primary" onClick={() => setIsDialogOpen(true)}>
          <Icon name="plus" size={16} />
          New workspace
        </ActionButton>
      </PageHead>
      <SearchField onSubmit={event => event.preventDefault()} sx={{ mb: 4 }}>
        <Icon name="search" size={17} />
        <BareInput
          placeholder="Search workspaces"
          value={query}
          inputProps={{ 'aria-label': 'Search workspaces' }}
          onChange={event => setQuery(event.target.value)}
        />
      </SearchField>
      <WorkspaceGrid>
        {workspaces.map(workspace => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
        {!lowerQuery && (
          <NewWorkspaceTile onClick={() => setIsDialogOpen(true)}>
            <Icon name="graph" size={40} />
            <b>Start a new line of research.</b>
            <span>Begin empty with its own tabs, graph and history.</span>
            <em>Create workspace →</em>
          </NewWorkspaceTile>
        )}
      </WorkspaceGrid>
      {isDialogOpen && <NewWorkspaceDialog isOpen onClose={() => setIsDialogOpen(false)} />}
    </PageFrame>
  );
}
