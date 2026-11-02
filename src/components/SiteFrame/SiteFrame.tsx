import { useState } from 'react';
import type { BrowserTab } from '../../state/types';
import { ActionLink, ToolButton } from '../../styled/MUI/Common.styles';
import { ExternalBar, FrameHost } from '../../styled/MUI/Page.styles';
import Icon from '../Icon/Icon';

/** Browser-preview fallback: shows a page in an iframe. The desktop app uses real Electron views instead. */
export default function SiteFrame({ tab }: { tab: BrowserTab }) {
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);

  return (
    <>
      {!isNoticeDismissed && (
        <ExternalBar>
          <Icon name="info" size={16} />
          <span className="text">
            This is the browser preview, where most sites refuse to load inside a frame. Run the desktop app (npm
            start) for real browsing.
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
        <iframe
          key={tab.url}
          title={tab.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          src={tab.url}
        />
      </FrameHost>
    </>
  );
}
