import { internalName, kindOf } from '../../data/urls';
import { useBrowser } from '../../state/BrowserContext';
import type { Workspace } from '../../state/types';
import { Kbd } from '../../styled/MUI/Common.styles';
import {
  RailCount,
  RailFoot,
  RailHead,
  RailIcon,
  RailItem,
  RailList,
  RailLogo,
  RailRoot,
  RailSearch,
  RailSection,
  RailToggle,
} from '../../styled/MUI/Rail.styles';
import Icon, { type IconName } from '../Icon/Icon';

const EXPLORE_PAGES: { name: string; label: string; icon: IconName }[] = [
  { name: 'workspaces', label: 'Workspaces', icon: 'grid' },
  { name: 'graph', label: 'Research graph', icon: 'graph' },
  { name: 'library', label: 'Library', icon: 'bookmark' },
  { name: 'privacy', label: 'Privacy', icon: 'shield' },
  { name: 'restore', label: 'Restore', icon: 'undo' },
];

function workspaceIcon(workspace: Workspace): IconName {
  const name = workspace.name.toLowerCase();
  if (/field|loc|map/.test(name)) return 'loc';
  if (/thesis|paper|write|note/.test(name)) return 'note';
  if (/trip|travel|plan/.test(name)) return 'globe';
  return 'folder';
}

interface RailProps {
  onOpenPalette(): void;
}

export default function Rail({ onOpenPalette }: RailProps) {
  const { state, tab, tabsOf, switchWs, openInternal, toggleRail } = useBrowser();
  const isOpen = state.settings.railOpen;
  const currentPage = tab && kindOf(tab.url) === 'internal' ? internalName(tab.url) : '';

  return (
    <RailRoot $isOpen={isOpen} aria-label="Workspaces">
      <RailHead $isOpen={isOpen}>
        <RailLogo>
          <Icon name="logo" size={22} />
        </RailLogo>
        {isOpen && <b>CuriOS Browser</b>}
        <RailToggle
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          title={isOpen ? 'Collapse' : 'Expand'}
          onClick={toggleRail}
        >
          <Icon name={isOpen ? 'chevl' : 'chevr'} size={18} />
        </RailToggle>
      </RailHead>
      <RailSearch $isOpen={isOpen} title="Search (Ctrl+K)" onClick={onOpenPalette}>
        <Icon name="search" size={17} />
        {isOpen && (
          <>
            <span className="label">Search</span>
            <Kbd>Ctrl K</Kbd>
          </>
        )}
      </RailSearch>
      {isOpen && <RailSection>Workspaces</RailSection>}
      <RailList>
        {state.workspaces.map((workspace, index) => {
          const isActive = workspace.id === state.activeWs;
          return (
            <RailItem
              key={workspace.id}
              $isOpen={isOpen}
              $isActive={isActive}
              title={`${workspace.name} (Alt+${index + 1})`}
              aria-label={workspace.name}
              onClick={() => switchWs(workspace.id)}
            >
              <RailIcon>
                <Icon name={workspaceIcon(workspace)} size={20} />
              </RailIcon>
              {isOpen && (
                <>
                  <span className="label">{workspace.name}</span>
                  <RailCount $isActive={isActive}>{tabsOf(workspace.id).length}</RailCount>
                </>
              )}
            </RailItem>
          );
        })}
        <RailItem
          $isOpen={isOpen}
          $isActive={false}
          aria-label="New workspace"
          title="New workspace"
          onClick={() => openInternal('workspaces')}
        >
          <RailIcon>
            <Icon name="plus" size={20} />
          </RailIcon>
          {isOpen && <span className="label">New workspace</span>}
        </RailItem>
      </RailList>
      {isOpen && <RailSection>Explore</RailSection>}
      <RailList sx={isOpen ? undefined : { mt: 2 }}>
        {EXPLORE_PAGES.map(page => (
          <RailItem
            key={page.name}
            $isOpen={isOpen}
            $isActive={currentPage === page.name}
            aria-label={page.label}
            title={page.label}
            onClick={() => openInternal(page.name)}
          >
            <RailIcon>
              <Icon name={page.icon} size={20} />
            </RailIcon>
            {isOpen && <span className="label">{page.label}</span>}
          </RailItem>
        ))}
      </RailList>
      <RailFoot>
        <RailItem
          $isOpen={isOpen}
          $isActive={currentPage === 'settings'}
          $onDark
          aria-label="Settings"
          title="Settings"
          onClick={() => openInternal('settings')}
        >
          <RailIcon>
            <Icon name="gear" size={20} />
          </RailIcon>
          {isOpen && <span className="label">Settings</span>}
        </RailItem>
      </RailFoot>
    </RailRoot>
  );
}
