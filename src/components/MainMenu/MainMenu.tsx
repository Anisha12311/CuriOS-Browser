import type { ReactNode } from 'react';
import { useNativeOverlay } from '../../hooks/useNativeOverlay';
import { useBrowser } from '../../state/BrowserContext';
import {
  MainMenuHead,
  MenuItemHint,
  MenuItemLabel,
  MenuLogo,
  MenuSectionLabel,
  MenuSwitch,
  QuickAction,
  QuickActions,
  StyledMenu,
  StyledMenuItem,
} from '../../styled/MUI/Menu.styles';
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
  trailing?: ReactNode;
  onSelect(): void;
}

export default function MainMenu({ anchorElement, onClose }: MainMenuProps) {
  useNativeOverlay(!!anchorElement);
  const browser = useBrowser();
  const { state, ws } = browser;
  const tabCount = browser.tabsOf(ws.id).length;
  const openPage = (name: string) => () => browser.openInternal(name);
  const quickActions: MenuEntry[] = [
    { id: 'new', label: 'New tab', icon: 'plus', onSelect: browser.newTab },
    { id: 'reopen', label: 'Reopen tab', icon: 'undo', onSelect: browser.reopenClosed },
    { id: 'snapshot', label: 'Snapshot', icon: 'dl', onSelect: browser.saveSnapshot },
  ];
  const sections: { title: string; entries: MenuEntry[] }[] = [
    {
      title: 'Go to',
      entries: [
        { id: 'graph', label: 'Research graph', icon: 'graph', hint: 'Alt+G', onSelect: openPage('graph') },
        { id: 'library', label: 'Bookmarks and history', icon: 'bookmark', onSelect: openPage('library') },
        { id: 'workspaces', label: 'Workspaces', icon: 'grid', onSelect: openPage('workspaces') },
        { id: 'privacy', label: 'Privacy and security', icon: 'shield', onSelect: openPage('privacy') },
      ],
    },
    {
      title: 'Session',
      entries: [
        {
          id: 'restore',
          label: 'Restore session',
          icon: 'clock',
          hint: state.snapshots.length ? String(state.snapshots.length) : undefined,
          onSelect: openPage('restore'),
        },
        {
          id: 'layout',
          label: 'Tabs in sidebar',
          icon: 'menu',
          trailing: <MenuSwitch $isOn={state.settings.vtabs} aria-hidden="true" />,
          onSelect: browser.toggleVtabs,
        },
        { id: 'settings', label: 'Settings', icon: 'gear', onSelect: openPage('settings') },
      ],
    },
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
      <MainMenuHead>
        <MenuLogo>
          <Icon name="logo" size={18} />
        </MenuLogo>
        <span className="head-text">
          <b>{ws.name}</b>
          <span>
            {tabCount} {tabCount === 1 ? 'tab' : 'tabs'} open · {state.stats.blocked.toLocaleString()} trackers blocked
          </span>
        </span>
      </MainMenuHead>
      <QuickActions>
        {quickActions.map(action => (
          <QuickAction
            key={action.id}
            disabled={action.id === 'reopen' && !state.closed.length}
            onClick={() => handleSelect(action)}
          >
            <Icon name={action.icon} size={18} className="quick-icon" />
            {action.label}
          </QuickAction>
        ))}
      </QuickActions>
      {sections.flatMap(section => [
        <MenuSectionLabel key={`label-${section.title}`}>{section.title}</MenuSectionLabel>,
        ...section.entries.map(entry => (
          <StyledMenuItem key={entry.id} onClick={() => handleSelect(entry)}>
            <span className="item-icon">
              <Icon name={entry.icon} size={16} />
            </span>
            <MenuItemLabel>{entry.label}</MenuItemLabel>
            {entry.hint && <MenuItemHint>{entry.hint}</MenuItemHint>}
            {entry.trailing}
          </StyledMenuItem>
        )),
      ])}
    </StyledMenu>
  );
}
