import { useState, type FormEvent } from 'react';
import { useBrowser } from '../../state/BrowserContext';
import type { PanelTab as PanelTabKey } from '../../state/types';
import { ActionButton, BareInput, EmptyState, Grow, ToolButton } from '../../styled/MUI/Common.styles';
import {
  LinkButton,
  NoteForm,
  PanelBody,
  PanelCard,
  PanelFoot,
  PanelRoot,
  PanelTab,
  PanelTabs,
  TrailRow,
} from '../../styled/MUI/Panel.styles';
import { timeAgo } from '../../utils/time';
import Favicon from '../Favicon/Favicon';
import Icon from '../Icon/Icon';
import MiniTrailMap from '../MiniTrailMap/MiniTrailMap';

const PANEL_TABS: { key: PanelTabKey; label: string }[] = [
  { key: 'clips', label: 'Clips' },
  { key: 'notes', label: 'Notes' },
  { key: 'trail', label: 'Trail' },
];
const MAX_TRAIL_ROWS = 14;

export default function ResearchPanel() {
  const browser = useBrowser();
  const { state, ws, tab } = browser;
  const [noteDraft, setNoteDraft] = useState('');
  const graph = state.graph[ws.id] ?? { nodes: [], edges: [] };
  const clips = state.clips.filter(clip => clip.ws === ws.id);
  const notes = graph.nodes.filter(node => node.type === 'note');
  const pages = graph.nodes.filter(node => node.type === 'page').sort((a, b) => b.ts - a.ts);
  const countByTab: Record<PanelTabKey, number> = { clips: clips.length, notes: notes.length, trail: pages.length };
  const activeTab = state.panel.tab;

  function handleAddNote(event: FormEvent) {
    event.preventDefault();
    const text = noteDraft.trim();
    if (!text) return;
    browser.addNote(text);
    setNoteDraft('');
  }

  function openUrl(url: string) {
    if (tab) browser.navigate(tab.id, url);
  }

  return (
    <PanelRoot aria-label="Research panel">
      <PanelTabs>
        {PANEL_TABS.map(panelTab => (
          <PanelTab
            key={panelTab.key}
            $isActive={activeTab === panelTab.key}
            onClick={() => browser.setPanelTab(panelTab.key)}
          >
            {panelTab.label} <span className="count">{countByTab[panelTab.key]}</span>
          </PanelTab>
        ))}
        <Grow />
        <ToolButton $size={32} aria-label="Close panel" onClick={browser.togglePanel}>
          <Icon name="x" size={15} />
        </ToolButton>
      </PanelTabs>
      <PanelBody>
        {!ws.graph && <EmptyState>The research graph is off for this workspace.</EmptyState>}
        {ws.graph && activeTab === 'clips' && (
          <>
            {!clips.length && <EmptyState>No clips yet. Select text on a page and choose Clip.</EmptyState>}
            {clips.map(clip => (
              <PanelCard key={clip.id}>
                <div className="text">{clip.text}</div>
                <div className="meta">
                  <Favicon url={clip.url} size={14} />
                  <LinkButton onClick={() => openUrl(clip.url)}>{clip.title}</LinkButton>
                  <ToolButton $size={28} aria-label="Remove clip" onClick={() => browser.removeClip(clip.id)}>
                    <Icon name="x" size={13} />
                  </ToolButton>
                </div>
              </PanelCard>
            ))}
          </>
        )}
        {ws.graph && activeTab === 'notes' && (
          <>
            <NoteForm onSubmit={handleAddNote}>
              <BareInput
                className="field"
                placeholder="Add a note about this page"
                value={noteDraft}
                inputProps={{ 'aria-label': 'New note' }}
                onChange={event => setNoteDraft(event.target.value)}
              />
              <ActionButton $variant="primary" $small type="submit">
                Add
              </ActionButton>
            </NoteForm>
            {!notes.length && <EmptyState>No notes yet.</EmptyState>}
            {notes.map(note => (
              <PanelCard key={note.id} $isNote>
                <div className="text">{note.text}</div>
                <div className="meta">
                  <Grow />
                  <ToolButton $size={28} aria-label="Delete note" onClick={() => browser.removeNode(note.id)}>
                    <Icon name="trash" size={14} />
                  </ToolButton>
                </div>
              </PanelCard>
            ))}
          </>
        )}
        {ws.graph && activeTab === 'trail' && (
          <>
            {!pages.length && <EmptyState>Pages you visit appear here.</EmptyState>}
            {pages.slice(0, MAX_TRAIL_ROWS).map(page => (
              <TrailRow key={page.id} $isActive={tab?.lastNode === page.id} onClick={() => openUrl(page.url ?? '')}>
                <Favicon url={page.url ?? ''} size={16} />
                <span className="label">{page.title}</span>
                <span className="sub">{timeAgo(page.ts)}</span>
              </TrailRow>
            ))}
          </>
        )}
      </PanelBody>
      <PanelFoot>
        {ws.graph && <MiniTrailMap graph={graph} currentNodeId={tab?.lastNode ?? null} />}
        <ActionButton $variant="primary" onClick={() => browser.openInternal('graph')}>
          <Icon name="graph" size={16} />
          Open full graph
        </ActionButton>
      </PanelFoot>
    </PanelRoot>
  );
}
