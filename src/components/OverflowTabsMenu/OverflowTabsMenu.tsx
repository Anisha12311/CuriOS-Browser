import ButtonBase from '@mui/material/ButtonBase';
import { hostOf, kindOf } from '../../data/urls';
import { useNativeOverlay } from '../../hooks/useNativeOverlay';
import { useBrowser } from '../../state/BrowserContext';
import type { BrowserTab } from '../../state/types';
import { Grow, ToolButton } from '../../styled/MUI/Common.styles';
import {
  ClearAllButton,
  OverflowHead,
  OverflowList,
  OverflowPopover,
  OverflowRow,
} from '../../styled/MUI/Menu.styles';
import { timeAgo } from '../../utils/time';
import Favicon from '../Favicon/Favicon';
import Icon from '../Icon/Icon';

interface OverflowTabsMenuProps {
  anchorElement: HTMLElement | null;
  hiddenTabs: BrowserTab[];
  onClose(): void;
}

export default function OverflowTabsMenu({ anchorElement, hiddenTabs, onClose }: OverflowTabsMenuProps) {
  useNativeOverlay(!!anchorElement && hiddenTabs.length > 0);
  const { activate, closeTab, toast } = useBrowser();

  function handleSelect(id: string) {
    onClose();
    activate(id);
  }

  function handleClose(id: string) {
    closeTab(id);
    if (hiddenTabs.length <= 1) onClose();
  }

  function handleClearAll() {
    onClose();
    hiddenTabs.forEach(tab => closeTab(tab.id));
    toast(`Closed ${hiddenTabs.length} tab${hiddenTabs.length === 1 ? '' : 's'}. You can reopen them from the menu.`, 'warn');
  }

  return (
    <OverflowPopover
      open={!!anchorElement && hiddenTabs.length > 0}
      anchorEl={anchorElement}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <OverflowHead>
        <b>More open tabs</b>
        <span>most recent first</span>
        <Grow />
        <ClearAllButton onClick={handleClearAll}>
          <Icon name="x" size={13} />
          Clear all
        </ClearAllButton>
      </OverflowHead>
      <OverflowList role="menu">
        {hiddenTabs.map(tab => (
          <OverflowRow key={tab.id}>
            <ButtonBase className="row-main" role="menuitem" onClick={() => handleSelect(tab.id)}>
              <Favicon url={tab.url} size={32} />
              <span className="row-text">
                <b>{tab.title}</b>
                <span>{kindOf(tab.url) === 'internal' ? 'CuriOS' : hostOf(tab.url)}</span>
              </span>
              <span className="row-ago">{timeAgo(tab.last)}</span>
            </ButtonBase>
            <ToolButton $size={30} aria-label="Close tab" sx={{ mr: 0.5 }} onClick={() => handleClose(tab.id)}>
              <Icon name="x" size={14} />
            </ToolButton>
          </OverflowRow>
        ))}
      </OverflowList>
    </OverflowPopover>
  );
}
