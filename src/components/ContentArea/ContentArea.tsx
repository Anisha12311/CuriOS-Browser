import type { ComponentType } from 'react';
import { internalName, kindOf } from '../../data/sites';
import GraphPage from '../../pages/GraphPage/GraphPage';
import LibraryPage from '../../pages/LibraryPage/LibraryPage';
import NewTabPage from '../../pages/NewTabPage/NewTabPage';
import PrivacyPage from '../../pages/PrivacyPage/PrivacyPage';
import RestorePage from '../../pages/RestorePage/RestorePage';
import SearchPage from '../../pages/SearchPage/SearchPage';
import SettingsPage from '../../pages/SettingsPage/SettingsPage';
import WorkspacesPage from '../../pages/WorkspacesPage/WorkspacesPage';
import { useBrowser } from '../../state/BrowserContext';
import { ContentRoot, PageScroll } from '../../styled/MUI/Page.styles';
import { isNativeUrl } from '../../services/nativeTabs';
import NativeTabView from '../NativeTabView/NativeTabView';
import SiteFrame from '../SiteFrame/SiteFrame';

const PAGE_BY_NAME: Record<string, ComponentType> = {
  newtab: NewTabPage,
  graph: GraphPage,
  library: LibraryPage,
  privacy: PrivacyPage,
  restore: RestorePage,
  settings: SettingsPage,
  workspaces: WorkspacesPage,
};

export default function ContentArea() {
  const { tab } = useBrowser();
  if (!tab) return <ContentRoot />;

  if (isNativeUrl(tab.url)) {
    return (
      <ContentRoot>
        <NativeTabView key={tab.id} tab={tab} />
      </ContentRoot>
    );
  }

  if (kindOf(tab.url) !== 'internal') {
    return (
      <ContentRoot>
        <SiteFrame key={tab.id} tab={tab} />
      </ContentRoot>
    );
  }

  const name = internalName(tab.url);
  const Page = PAGE_BY_NAME[name] ?? NewTabPage;
  return (
    <ContentRoot>
      <PageScroll key={tab.id}>
        {name === 'search' ? <SearchPage key={tab.url} tab={tab} /> : <Page />}
      </PageScroll>
    </ContentRoot>
  );
}
