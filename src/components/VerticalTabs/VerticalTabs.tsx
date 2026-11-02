import { hostOf, kindOf } from '../../data/urls';
import { useBrowser } from '../../state/BrowserContext';
import { ActionButton, SectionLabel } from '../../styled/MUI/Common.styles';
import { VerticalTab, VerticalTabsRoot } from '../../styled/MUI/Shell.styles';
import Favicon from '../Favicon/Favicon';
import Icon from '../Icon/Icon';

export default function VerticalTabs() {
  const { ws, tab: activeTab, tabsOf, loading, pageInfo, activate, newTab } = useBrowser();
  const tabs = tabsOf(ws.id);

  return (
    <VerticalTabsRoot role="tablist" aria-label="Tabs">
      <ActionButton onClick={newTab} sx={{ justifyContent: 'flex-start', mb: 1 }}>
        <Icon name="plus" size={16} />
        New tab
      </ActionButton>
      <SectionLabel sx={{ px: 1.5, py: 1 }}>Tabs · {tabs.length}</SectionLabel>
      {tabs.map(tab => (
        <VerticalTab
          key={tab.id}
          role="tab"
          aria-selected={tab.id === activeTab?.id}
          $isActive={tab.id === activeTab?.id}
          onClick={() => activate(tab.id)}
        >
          <Favicon url={tab.url} iconUrl={pageInfo[tab.id]?.favicon} size={28} isLoading={!!loading[tab.id]} />
          <span className="tab-text">
            <span className="tab-title">{tab.title}</span>
            <span className="tab-host">{kindOf(tab.url) === 'internal' ? 'CuriOS' : hostOf(tab.url)}</span>
          </span>
        </VerticalTab>
      ))}
    </VerticalTabsRoot>
  );
}
