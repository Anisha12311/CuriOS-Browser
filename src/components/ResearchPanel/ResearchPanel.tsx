import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { kindOf } from '../../data/urls';
import { useBrowser } from '../../state/BrowserContext';
import type { PanelTab as PanelTabKey } from '../../state/types';
import { ActionButton, BareInput, EmptyState, Grow, ToolButton } from '../../styled/MUI/Common.styles';
import {
  LinkButton,
  AttachChip,
  NoteComposer,
  NotesEmpty,
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
import NoteCard from '../NoteCard/NoteCard';

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
  const notes = graph.nodes
    .filter(node => node.type === 'note')
    .sort((a, b) => Number(!!b.star) - Number(!!a.star) || b.ts - a.ts);
  const nodeById = new Map(graph.nodes.map(node => [node.id, node]));
  const pageOfNote = (noteId: string) => {
    const edge = graph.edges.find(link => link.a === noteId && link.label === 'note');
    const page = edge ? nodeById.get(edge.b) : undefined;
    return page?.type === 'page' ? page : null;
  };
  const isOnWebPage = !!tab && kindOf(tab.url) === 'external';
  const pages = graph.nodes.filter(node => node.type === 'page').sort((a, b) => b.ts - a.ts);
  const countByTab: Record<PanelTabKey, number> = { clips: clips.length, notes: notes.length, trail: pages.length };
  const activeTab = state.panel.tab;

  function addNote() {
    const text = noteDraft.trim();
    if (!text) return;
    browser.addNote(text);
    setNoteDraft('');
  }

  function handleAddNote(event: FormEvent) {
    event.preventDefault();
    addNote();
  }

  function handleNoteKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      addNote();
    }
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
            <NoteComposer onSubmit={handleAddNote}>
              <BareInput
                className="composer-field"
                multiline
                minRows={3}
                maxRows={8}
                placeholder={isOnWebPage ? 'What did you learn from this page?' : 'Write a note…'}
                value={noteDraft}
                inputProps={{ 'aria-label': 'New note' }}
                onChange={event => setNoteDraft(event.target.value)}
                onKeyDown={handleNoteKeyDown}
              />
              <div className="composer-foot">
                <AttachChip title={isOnWebPage ? tab.url : undefined}>
                  {isOnWebPage ? (
                    <>
                      <Favicon url={tab.url} size={14} />
                      <span className="chip-text">
                        On <b>{tab.title}</b>
                      </span>
                    </>
                  ) : (
                    <span className="chip-text">Ctrl+Enter to save</span>
                  )}
                </AttachChip>
                <ActionButton $variant="primary" $small type="submit" disabled={!noteDraft.trim()}>
                  Save note
                </ActionButton>
              </div>
            </NoteComposer>
            {!notes.length && (
              <NotesEmpty>
                <span className="empty-icon">
                  <Icon name="note" size={22} />
                </span>
                <b>Capture your thinking</b>
                Notes are linked to the page you are reading and appear on the research graph.
              </NotesEmpty>
            )}
            {notes.map(note => (
              <NoteCard key={note.id} note={note} page={pageOfNote(note.id)} onOpenPage={openUrl} />
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
