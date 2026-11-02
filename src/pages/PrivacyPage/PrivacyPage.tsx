import type { TrackerLevel } from '../../data/sites';
import Icon from '../../components/Icon/Icon';
import { useBrowser } from '../../state/BrowserContext';
import { ColorDot, ToggleSwitch } from '../../styled/MUI/Common.styles';
import { CardHeader, IconTile, OptionCard, PageFrame, PageHead, SettingRow, SurfaceCard } from '../../styled/MUI/Page.styles';
import { Note, OptionStack, RadioDot, ScoreHero, ScoreRing, TwoColumns } from '../../styled/MUI/Settings.styles';

const LEVELS: { key: TrackerLevel; title: string; description: string }[] = [
  { key: 'standard', title: 'Standard', description: 'Blocks known cross-site trackers. Sites keep working.' },
  { key: 'strict', title: 'Strict', description: 'Also blocks fingerprinting. A few sites may break.' },
  { key: 'off', title: 'Off', description: 'Nothing is blocked. Not recommended.' },
];
const SCORE_BY_LEVEL: Record<TrackerLevel, number> = { strict: 40, standard: 28, off: 0 };

export default function PrivacyPage() {
  const browser = useBrowser();
  const { state } = browser;
  const level = state.settings.trackers;
  const isolatedShare = state.workspaces.filter(w => w.isolate).length / Math.max(1, state.workspaces.length);
  const score = Math.min(100, SCORE_BY_LEVEL[level] + 45 + Math.round(15 * isolatedShare));
  const label = score >= 85 ? 'strong' : score >= 60 ? 'good' : 'in need of attention';

  return (
    <PageFrame>
      <PageHead>
        <div>
          <h1>Privacy and security</h1>
          <p>Protection is on by default. Demo sites list their third-party requests at the bottom of each page.</p>
        </div>
      </PageHead>
      <ScoreHero>
        <ScoreRing $percent={score}>
          <b>{score}</b>
          <span>/100</span>
        </ScoreRing>
        <div className="hero-text">
          <h2>Your protection is {label}</h2>
          <p>Tracker protection is {level}, HTTPS-only is on and third-party cookies are blocked.</p>
        </div>
        <div className="hero-stats">
          <div>
            <b>{state.stats.blocked}</b>
            <span>Trackers blocked</span>
          </div>
          <div>
            <b>{state.stats.upgraded}</b>
            <span>Upgraded to HTTPS</span>
          </div>
          <div>
            <b>{state.stats.cookies}</b>
            <span>Cookies cleared</span>
          </div>
        </div>
      </ScoreHero>
      <TwoColumns>
        <div>
          <SurfaceCard>
            <CardHeader>
              <IconTile>
                <Icon name="shield" size={18} />
              </IconTile>
              <div>
                <h2>Tracker protection</h2>
                <p>Choose how much of the web’s tracking Synapse blocks.</p>
              </div>
            </CardHeader>
            <OptionStack role="radiogroup">
              {LEVELS.map(option => (
                <OptionCard
                  key={option.key}
                  role="radio"
                  aria-checked={level === option.key}
                  $isOn={level === option.key}
                  onClick={() => browser.setSetting('trackers', option.key)}
                >
                  <RadioDot $isOn={level === option.key} />
                  <span>
                    <b>{option.title}</b>
                    <small>{option.description}</small>
                  </span>
                </OptionCard>
              ))}
            </OptionStack>
            <Note>Open any demo site and scroll to the bottom to see which requests were blocked.</Note>
          </SurfaceCard>
        </div>
        <div>
          <SurfaceCard>
            <CardHeader>
              <IconTile>
                <Icon name="grid" size={18} />
              </IconTile>
              <div>
                <h2>Workspace isolation</h2>
                <p>Isolated workspaces keep site permissions separate.</p>
              </div>
            </CardHeader>
            {state.workspaces.map(workspace => (
              <SettingRow key={workspace.id}>
                <div className="row-text">
                  <b>
                    <ColorDot $color={workspace.color} />
                    {workspace.name}
                  </b>
                  <span>{workspace.isolate ? 'Permissions are kept separate' : 'Shares permissions with other workspaces'}</span>
                </div>
                <ToggleSwitch
                  checked={workspace.isolate}
                  slotProps={{ input: { 'aria-label': `Isolate ${workspace.name}` } }}
                  onChange={() => browser.updateWorkspace(workspace.id, { isolate: !workspace.isolate })}
                />
              </SettingRow>
            ))}
          </SurfaceCard>
        </div>
      </TwoColumns>
    </PageFrame>
  );
}
