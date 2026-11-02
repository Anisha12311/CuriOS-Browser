import { hostOf, kindOf } from '../../data/sites';
import Favicon from '../../components/Favicon/Favicon';
import Icon from '../../components/Icon/Icon';
import { useBrowser } from '../../state/BrowserContext';
import { ActionButton, EmptyState } from '../../styled/MUI/Common.styles';
import { ItemCard, ItemList, ItemMain, PillHint } from '../../styled/MUI/Library.styles';
import { PageFrame, PageHead } from '../../styled/MUI/Page.styles';
import { timeAgo } from '../../utils/time';

export default function RestorePage() {
  const browser = useBrowser();
  const closed = browser.state.closed;

  return (
    <PageFrame>
      <PageHead>
        <div>
          <h1>Restore session</h1>
          <p>Tabs you closed recently. Reopen them one at a time, newest first.</p>
        </div>
        <ActionButton onClick={browser.saveSnapshot}>
          <Icon name="dl" size={15} />
          Save snapshot now
        </ActionButton>
      </PageHead>
      {!closed.length && <EmptyState>No recently closed tabs.</EmptyState>}
      <ItemList>
        {closed.map((entry, index) => (
          <ItemCard key={`${entry.tab.id}-${entry.at}`}>
            <ItemMain disabled={index > 0} onClick={browser.reopenClosed}>
              <Favicon url={entry.tab.url} size={28} />
              <span className="item-text">
                <b>{entry.tab.title}</b>
                <span>
                  {kindOf(entry.tab.url) === 'internal' ? 'Synapse' : hostOf(entry.tab.url)} · closed {timeAgo(entry.at)}
                </span>
              </span>
              {index === 0 && (
                <PillHint>
                  <Icon name="undo" size={14} />
                  Reopen
                </PillHint>
              )}
            </ItemMain>
          </ItemCard>
        ))}
      </ItemList>
    </PageFrame>
  );
}
