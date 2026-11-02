import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { hostOf, kindOf } from '../../data/sites';
import { useElementWidth } from '../../hooks/useElementWidth';
import { useBrowser } from '../../state/BrowserContext';
import type { BrowserTab } from '../../state/types';
import { ColorDot, Grow } from '../../styled/MUI/Common.styles';
import {
  NewTabButton,
  TabBar,
  TabClose,
  TabHost,
  TabItem,
  TabList,
  TabMoreButton,
  TabText,
  TabTitle,
  WorkspaceChip,
  WorkspaceName,
} from '../../styled/MUI/TabStrip.styles';
import { splitOverflowTabs } from '../../utils/tabOverflow';
import Favicon from '../Favicon/Favicon';
import Icon from '../Icon/Icon';
import OverflowTabsMenu from '../OverflowTabsMenu/OverflowTabsMenu';
import WindowControls from '../WindowControls/WindowControls';
import WorkspaceMenu from '../WorkspaceMenu/WorkspaceMenu';

interface TabButtonProps {
  tab: BrowserTab;
  iconUrl?: string | null;
  isActive: boolean;
  isLoading: boolean;
  onSelect(id: string): void;
  onClose(id: string): void;
}

function TabButton({ tab, iconUrl, isActive, isLoading, onSelect, onClose }: TabButtonProps) {
  const isInternal = kindOf(tab.url) === 'internal';

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(tab.id);
    }
  }

  function handleClose(event: MouseEvent) {
    event.stopPropagation();
    onClose(tab.id);
  }

  return (
    <TabItem
      role="tab"
      tabIndex={0}
      aria-selected={isActive}
      title={tab.title}
      $isActive={isActive}
      $isPinned={tab.pinned}
      onClick={() => onSelect(tab.id)}
      onKeyDown={handleKeyDown}
    >
      <Favicon url={tab.url} iconUrl={iconUrl} isLoading={isLoading} />
      {!tab.pinned && (
        <>
          <TabText>
            <TabTitle $isActive={isActive}>{tab.title}</TabTitle>
            <TabHost>
              {isInternal ? 'Synapse' : hostOf(tab.url)}
              {tab.sleeping ? ' · sleeping' : ''}
            </TabHost>
          </TabText>
          <TabClose
            className="tab-close"
            $isVisible={isActive}
            aria-label="Close tab"
            onClick={handleClose}
          >
            <Icon name="x" size={14} />
          </TabClose>
        </>
      )}
    </TabItem>
  );
}

export default function TabStrip() {
  const { ws, tab: activeTab, tabsOf, loading, pageInfo, activate, closeTab, newTab } = useBrowser();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [overflowAnchor, setOverflowAnchor] = useState<HTMLElement | null>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabListWidth = useElementWidth(tabListRef);
  const { visibleTabs, hiddenTabs } = splitOverflowTabs(tabsOf(ws.id), activeTab?.id, tabListWidth);

  return (
    <TabBar role="tablist" aria-label="Tabs">
      <WorkspaceChip
        aria-haspopup="menu"
        aria-label={`Switch workspace, current ${ws.name}`}
        onClick={event => setMenuAnchor(event.currentTarget)}
      >
        <ColorDot $color={ws.color} $size={12} />
        <WorkspaceName>{ws.name}</WorkspaceName>
        <Icon name="chev" size={14} />
      </WorkspaceChip>
      <TabList ref={tabListRef}>
        {visibleTabs.map(tab => (
          <TabButton
            key={tab.id}
            tab={tab}
            iconUrl={pageInfo[tab.id]?.favicon}
            isActive={tab.id === activeTab?.id}
            isLoading={!!loading[tab.id]}
            onSelect={activate}
            onClose={closeTab}
          />
        ))}
        {hiddenTabs.length > 0 && (
          <TabMoreButton
            aria-haspopup="menu"
            title="More open tabs"
            onClick={event => setOverflowAnchor(event.currentTarget)}
          >
            <Icon name="tabs" size={16} />
            <b>+{hiddenTabs.length}</b>
            <Icon name="chev" size={13} />
          </TabMoreButton>
        )}
        <NewTabButton aria-label="New tab" title="New tab (Alt+T)" onClick={newTab}>
          <Icon name="plus" size={18} />
        </NewTabButton>
        <Grow />
      </TabList>
      <WindowControls />
      <WorkspaceMenu anchorElement={menuAnchor} onClose={() => setMenuAnchor(null)} />
      <OverflowTabsMenu
        anchorElement={overflowAnchor}
        hiddenTabs={hiddenTabs}
        onClose={() => setOverflowAnchor(null)}
      />
    </TabBar>
  );
}
