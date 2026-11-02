import Divider from '@mui/material/Divider';
import { useNativeOverlay } from '../../hooks/useNativeOverlay';
import { useBrowser } from '../../state/BrowserContext';
import { MenuItemHint, MenuItemLabel, StyledMenu, StyledMenuItem } from '../../styled/MUI/Menu.styles';
import Icon, { type IconName } from '../Icon/Icon';

interface MainMenuProps {
  anchorElement: HTMLElement | null;
  onClose(): void;
}

interface MenuEntry {
  id: string;
  label: string;
  icon: IconName;
  hint?: string;
  onSelect(): void;
}

export default function MainMenu({ anchorElement, onClose }: MainMenuProps) {
  useNativeOverlay(!!anchorElement);
  const browser = useBrowser();
  const openPage = (name: string) => () => browser.openInternal(name);
  const groups: MenuEntry[][] = [
    [
      { id: 'graph', label: 'Research graph', icon: 'graph', hint: 'Alt+G', onSelect: openPage('graph') },
      { id: 'library', label: 'Bookmarks and history', icon: 'bookmark', onSelect: openPage('library') },
      { id: 'workspaces', label: 'Workspaces', icon: 'grid', onSelect: openPage('workspaces') },
      { id: 'privacy', label: 'Privacy and security', icon: 'shield', onSelect: openPage('privacy') },
    ],
    [
      {
        id: 'reopen',
        label: 'Reopen closed tab',
        icon: 'undo',
        hint: browser.state.closed.length ? String(browser.state.closed.length) : undefined,
        onSelect: browser.reopenClosed,
      },
      { id: 'restore', label: 'Restore session…', icon: 'clock', onSelect: openPage('restore') },
      { id: 'snapshot', label: 'Save session snapshot', icon: 'dl', onSelect: browser.saveSnapshot },
      {
        id: 'layout',
        label: browser.state.settings.vtabs ? 'Show tabs on top' : 'Show tabs in sidebar',
        icon: 'menu',
        onSelect: browser.toggleVtabs,
      },
    ],
    [{ id: 'settings', label: 'Settings', icon: 'gear', onSelect: openPage('settings') }],
  ];

  function handleSelect(entry: MenuEntry) {
    onClose();
    entry.onSelect();
  }

  return (
    <StyledMenu
      open={!!anchorElement}
      anchorEl={anchorElement}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {groups.flatMap((group, groupIndex) => [
        ...(groupIndex > 0 ? [<Divider key={`divider-${group[0].id}`} sx={{ my: 0.75 }} />] : []),
        ...group.map(entry => (
          <StyledMenuItem key={entry.id} onClick={() => handleSelect(entry)}>
            <Icon name={entry.icon} size={16} />
            <MenuItemLabel>{entry.label}</MenuItemLabel>
            {entry.hint && <MenuItemHint>{entry.hint}</MenuItemHint>}
          </StyledMenuItem>
        )),
      ])}
    </StyledMenu>
  );
}
