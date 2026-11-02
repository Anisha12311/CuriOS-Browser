import { useEffect, useState } from 'react';
import { useBrowser } from '../../state/BrowserContext';
import { ShellBody, ShellRoot } from '../../styled/MUI/Shell.styles';
import CommandPalette from '../CommandPalette/CommandPalette';
import ContentArea from '../ContentArea/ContentArea';
import Rail from '../Rail/Rail';
import ResearchPanel from '../ResearchPanel/ResearchPanel';
import TabStrip from '../TabStrip/TabStrip';
import Toasts from '../Toasts/Toasts';
import Toolbar from '../Toolbar/Toolbar';
import VerticalTabs from '../VerticalTabs/VerticalTabs';

export default function BrowserShell() {
  const browser = useBrowser();
  const { state } = browser;
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === 'k') {
        event.preventDefault();
        setIsPaletteOpen(true);
        return;
      }
      if (!event.altKey) return;
      const workspace = /^[1-9]$/.test(event.key) ? state.workspaces[Number(event.key) - 1] : undefined;
      const actionByKey: Record<string, (() => void) | undefined> = {
        t: event.shiftKey ? browser.reopenClosed : browser.newTab,
        w: browser.tab ? () => browser.closeTab(browser.tab!.id) : undefined,
        d: browser.toggleBookmark,
        g: () => browser.openInternal('graph'),
        r: browser.reload,
        arrowleft: browser.back,
        arrowright: browser.forward,
      };
      const action = workspace ? () => browser.switchWs(workspace.id) : actionByKey[key];
      if (action) {
        event.preventDefault();
        action();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [browser, state.workspaces]);

  return (
    <ShellRoot>
      {!state.settings.vtabs && <TabStrip />}
      <Toolbar />
      <ShellBody>
        <Rail onOpenPalette={() => setIsPaletteOpen(true)} />
        {state.settings.vtabs && <VerticalTabs />}
        <ContentArea />
        {state.panel.open && <ResearchPanel />}
      </ShellBody>
      {isPaletteOpen && <CommandPalette isOpen onClose={() => setIsPaletteOpen(false)} />}
      <Toasts />
    </ShellRoot>
  );
}
