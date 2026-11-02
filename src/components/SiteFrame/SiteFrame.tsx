import ButtonBase from '@mui/material/ButtonBase';
import { useEffect, useRef, useState } from 'react';
import { kindOf, siteFor, siteHtml } from '../../data/sites';
import { useBrowser } from '../../state/BrowserContext';
import type { BrowserTab } from '../../state/types';
import { ActionLink, ToolButton } from '../../styled/MUI/Common.styles';
import { SelectionBar } from '../../styled/MUI/Overlay.styles';
import { ExternalBar, FrameHost } from '../../styled/MUI/Page.styles';
import Icon from '../Icon/Icon';

interface FrameMessage {
  synapse?: number;
  type?: 'nav' | 'selection' | 'deselect';
  url?: string;
  newTab?: boolean;
  text?: string;
  rect?: { x: number; y: number; w: number };
}

interface Selection {
  text: string;
  left: number;
  top: number;
}

const SELECTION_BAR_WIDTH = 150;

export default function SiteFrame({ tab }: { tab: BrowserTab }) {
  const browser = useBrowser();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);
  const kind = kindOf(tab.url);
  const site = kind === 'site' ? siteFor(tab.url) : null;
  const level = browser.state.settings.trackers;
  const { navigate, openTab } = browser;

  useEffect(() => {
    function handleMessage(event: MessageEvent<FrameMessage>) {
      const message = event.data;
      if (!message?.synapse || event.source !== frameRef.current?.contentWindow) return;
      if (message.type === 'nav' && message.url) {
        if (message.newTab) openTab(message.url, { from: tab });
        else navigate(tab.id, message.url);
      } else if (message.type === 'selection' && message.text && message.rect) {
        const { x, y, w } = message.rect;
        setSelection({ text: message.text, left: Math.max(8, x + w / 2 - SELECTION_BAR_WIDTH / 2), top: Math.max(8, y - 44) });
      } else if (message.type === 'deselect') {
        setSelection(null);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [tab, navigate, openTab]);

  function handleClip() {
    if (selection) browser.addClip(selection.text);
    setSelection(null);
  }

  function handleNote() {
    if (selection) browser.addNote(selection.text);
    setSelection(null);
  }

  return (
    <>
      {kind === 'external' && !isNoticeDismissed && (
        <ExternalBar>
          <Icon name="info" size={16} />
          <span className="text">
            This page is loaded inside Synapse’s frame. Many sites refuse to be shown this way and will look blank.
          </span>
          <ActionLink $small href={tab.url} target="_blank" rel="noopener">
            <Icon name="open" size={14} />
            Open in a browser tab
          </ActionLink>
          <ToolButton $size={28} aria-label="Dismiss" onClick={() => setIsNoticeDismissed(true)}>
            <Icon name="x" size={14} />
          </ToolButton>
        </ExternalBar>
      )}
      <FrameHost>
        {site ? (
          <iframe
            key={`${tab.url}|${level}`}
            ref={frameRef}
            title={tab.title}
            sandbox="allow-scripts"
            srcDoc={siteHtml(site, level)}
          />
        ) : (
          <iframe
            key={tab.url}
            ref={frameRef}
            title={tab.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            src={tab.url}
          />
        )}
        {selection && (
          <SelectionBar style={{ left: selection.left, top: selection.top }}>
            <ButtonBase onClick={handleClip}>
              <Icon name="bookmark" size={14} />
              Clip
            </ButtonBase>
            <ButtonBase onClick={handleNote}>
              <Icon name="note" size={14} />
              Note
            </ButtonBase>
          </SelectionBar>
        )}
      </FrameHost>
    </>
  );
}

