import { useState } from 'react';
import { useNativeOverlay } from '../../hooks/useNativeOverlay';
import { useBrowser } from '../../state/BrowserContext';
import { BareInput, ColorDot, Kbd } from '../../styled/MUI/Common.styles';
import {
  MenuFoot,
  MenuHead,
  MenuList,
  MenuPrimary,
  MenuSearch,
  MenuSquareButton,
  RadioMark,
  WorkspacePopover,
  WorkspaceRow,
} from '../../styled/MUI/Menu.styles';
import Icon from '../Icon/Icon';

interface WorkspaceMenuProps {
  anchorElement: HTMLElement | null;
  onClose(): void;
}

export default function WorkspaceMenu({ anchorElement, onClose }: WorkspaceMenuProps) {
  useNativeOverlay(!!anchorElement);
  const { state, tabsOf, switchWs, openInternal } = useBrowser();
  const [query, setQuery] = useState('');
  const lowerQuery = query.trim().toLowerCase();
  const workspaces = state.workspaces.filter(w => w.name.toLowerCase().includes(lowerQuery));

  function handlePick(id: string) {
    switchWs(id);
    onClose();
  }

  function handleManage() {
    openInternal('workspaces');
    onClose();
  }

  return (
    <WorkspacePopover
      open={!!anchorElement}
      anchorEl={anchorElement}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <MenuHead>
        <b>Switch workspace</b>
        <span>{state.workspaces.length} workspaces</span>
      </MenuHead>
      <MenuSearch>
        <Icon name="search" size={15} />
        <BareInput
          autoFocus
          placeholder="Search workspaces"
          value={query}
          inputProps={{ 'aria-label': 'Search workspaces' }}
          onChange={event => setQuery(event.target.value)}
        />
      </MenuSearch>
      <MenuList role="menu">
        {workspaces.map(workspace => {
          const isActive = workspace.id === state.activeWs;
          return (
            <WorkspaceRow
              key={workspace.id}
              role="menuitemradio"
              aria-checked={isActive}
              $isActive={isActive}
              onClick={() => handlePick(workspace.id)}
            >
              <RadioMark $isOn={isActive} />
              <ColorDot $color={workspace.color} $round />
              <span className="row-name">{workspace.name}</span>
              <span className="row-meta">{tabsOf(workspace.id).length} tabs</span>
              <Kbd>Alt+{state.workspaces.indexOf(workspace) + 1}</Kbd>
            </WorkspaceRow>
          );
        })}
      </MenuList>
      <MenuFoot>
        <MenuPrimary onClick={handleManage}>
          <Icon name="plus" size={16} />
          New workspace
        </MenuPrimary>
        <MenuSquareButton aria-label="Manage workspaces" title="Manage workspaces" onClick={handleManage}>
          <Icon name="grid" size={16} />
        </MenuSquareButton>
      </MenuFoot>
    </WorkspacePopover>
  );
}
