import { useState, type ReactNode } from 'react';
import { ENGINES } from '../../data/sites';
import Icon, { type IconName } from '../../components/Icon/Icon';
import { useBrowser } from '../../state/BrowserContext';
import type { Settings } from '../../state/types';
import { ActionButton, ToggleSwitch } from '../../styled/MUI/Common.styles';
import { IconTile, OptionCard, PageFrame, PageHead, SettingRow, SurfaceCard } from '../../styled/MUI/Page.styles';
import {
  CardTitle,
  OptionGrid,
  RadioDot,
  SectionHead,
  SettingsColumns,
  SettingsNav,
  SettingsNavItem,
  ShortcutKey,
} from '../../styled/MUI/Settings.styles';

type SectionKey = 'tabs' | 'search' | 'privacy' | 'keys';

const SECTIONS: { key: SectionKey; title: string; icon: IconName; description: string }[] = [
  { key: 'tabs', title: 'Tabs and layout', icon: 'tabs', description: 'Vertical tabs, sidebar and toolbar' },
  { key: 'search', title: 'Search', icon: 'search', description: 'Default search engine' },
  { key: 'privacy', title: 'Privacy', icon: 'shield', description: 'Trackers and cookies' },
  { key: 'keys', title: 'Shortcuts', icon: 'info', description: 'Keyboard commands' },
];
const SHORTCUTS = [
  ['Alt+T', 'New tab'],
  ['Alt+W', 'Close tab'],
  ['Alt+Shift+T', 'Reopen closed tab'],
  ['Alt+L', 'Focus the address bar'],
  ['Alt+D', 'Bookmark this page'],
  ['Alt+G', 'Open the research graph'],
  ['Alt+1 to 9', 'Switch workspace'],
  ['Alt+Left / Right', 'Back / forward'],
  ['Ctrl+K', 'Search tabs'],
];

function Row({ icon, title, description, children }: { icon?: IconName; title: string; description?: string; children: ReactNode }) {
  return (
    <SettingRow>
      {icon && (
        <IconTile>
          <Icon name={icon} size={17} />
        </IconTile>
      )}
      <div className="row-text">
        <b>{title}</b>
        {description && <span>{description}</span>}
      </div>
      {children}
    </SettingRow>
  );
}

export default function SettingsPage() {
  const browser = useBrowser();
  const settings = browser.state.settings;
  const [sectionKey, setSectionKey] = useState<SectionKey>('tabs');
  const section = SECTIONS.find(item => item.key === sectionKey) ?? SECTIONS[0];
  const toggle = (key: keyof Pick<Settings, 'vtabs' | 'railOpen' | 'hideAi' | 'searchSuggestions'>) => () =>
    browser.setSetting(key, !settings[key]);

  return (
    <PageFrame>
      <PageHead>
        <div>
          <h1>Settings</h1>
          <p>Make Synapse yours. Everything is stored on this device.</p>
        </div>
      </PageHead>
      <SettingsColumns>
        <SettingsNav aria-label="Settings sections">
          {SECTIONS.map(item => (
            <SettingsNavItem key={item.key} $isOn={item.key === sectionKey} onClick={() => setSectionKey(item.key)}>
              <span className="nav-icon">
                <Icon name={item.icon} size={16} />
              </span>
              {item.title}
            </SettingsNavItem>
          ))}
        </SettingsNav>
        <div>
          <SectionHead>
            <IconTile $size={44}>
              <Icon name={section.icon} size={20} />
            </IconTile>
            <div>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </div>
          </SectionHead>
          {sectionKey === 'tabs' && (
            <SurfaceCard>
              <Row icon="tabs" title="Vertical tabs" description="Show tabs in a list on the left instead of a strip on top.">
                <ToggleSwitch checked={settings.vtabs} slotProps={{ input: { 'aria-label': 'Vertical tabs' } }} onChange={toggle('vtabs')} />
              </Row>
              <Row icon="menu" title="Expanded sidebar" description="Show workspace names next to their icons.">
                <ToggleSwitch checked={settings.railOpen} slotProps={{ input: { 'aria-label': 'Expanded sidebar' } }} onChange={toggle('railOpen')} />
              </Row>
              <Row icon="spark" title="Show the assistant button" description="A placeholder for a feature that is coming later.">
                <ToggleSwitch checked={!settings.hideAi} slotProps={{ input: { 'aria-label': 'Show the assistant button' } }} onChange={toggle('hideAi')} />
              </Row>
            </SurfaceCard>
          )}
          {sectionKey === 'search' && (
            <SurfaceCard>
              <CardTitle>
                <b>Web search engine</b>
                <small>Anything you type that is not a web address is searched with this engine.</small>
              </CardTitle>
              <OptionGrid>
                {(Object.keys(ENGINES) as Settings['engine'][]).map(key => (
                  <OptionCard key={key} role="radio" aria-checked={settings.engine === key} $isOn={settings.engine === key} onClick={() => browser.setSetting('engine', key)}>
                    <RadioDot $isOn={settings.engine === key} />
                    <b>{ENGINES[key].name}</b>
                  </OptionCard>
                ))}
              </OptionGrid>
              <Row icon="search" title="Show search suggestions" description="Sends what you type in the address bar to the search engine to suggest searches.">
                <ToggleSwitch
                  checked={settings.searchSuggestions}
                  slotProps={{ input: { 'aria-label': 'Show search suggestions' } }}
                  onChange={toggle('searchSuggestions')}
                />
              </Row>
            </SurfaceCard>
          )}
          {sectionKey === 'privacy' && (
            <SurfaceCard>
              <Row icon="shield" title="Privacy and security" description={`Tracker protection: ${settings.trackers}.`}>
                <ActionButton $variant="primary" onClick={() => browser.openInternal('privacy')}>
                  Open
                </ActionButton>
              </Row>
            </SurfaceCard>
          )}
          {sectionKey === 'keys' && (
            <SurfaceCard>
              {SHORTCUTS.map(([keys, action]) => (
                <Row key={keys} title={action}>
                  <ShortcutKey>{keys}</ShortcutKey>
                </Row>
              ))}
            </SurfaceCard>
          )}
        </div>
      </SettingsColumns>
    </PageFrame>
  );
}
