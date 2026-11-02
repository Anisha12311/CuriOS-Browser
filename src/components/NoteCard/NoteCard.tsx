import { useState, type KeyboardEvent } from 'react';
import { useBrowser } from '../../state/BrowserContext';
import type { GraphNode } from '../../state/types';
import { BareInput } from '../../styled/MUI/Common.styles';
import { NoteCardRoot, NoteIconButton, NotePageLink } from '../../styled/MUI/Panel.styles';
import { timeAgo } from '../../utils/time';
import Favicon from '../Favicon/Favicon';
import Icon from '../Icon/Icon';

interface NoteCardProps {
  note: GraphNode;
  /** The page the note was written about, if any. */
  page: GraphNode | null;
  onOpenPage(url: string): void;
}

export default function NoteCard({ note, page, onOpenPage }: NoteCardProps) {
  const browser = useBrowser();
  const [draft, setDraft] = useState<string | null>(null);
  const isEditing = draft !== null;

  function save() {
    const text = draft?.trim();
    if (text && text !== note.text) browser.updateNode(note.id, { text });
    setDraft(null);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') setDraft(null);
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) save();
  }

  return (
    <NoteCardRoot $isEditing={isEditing}>
      <div className="note-head">
        <span className="note-kind">
          <Icon name="note" size={13} />
          Note
        </span>
        <span className="note-time">· {timeAgo(note.ts)}</span>
        <span className="note-actions">
          <NoteIconButton aria-label="Edit note" title="Edit" onClick={() => setDraft(note.text ?? '')}>
            <Icon name="edit" size={14} />
          </NoteIconButton>
          <NoteIconButton aria-label="Delete note" title="Delete" onClick={() => browser.removeNode(note.id)}>
            <Icon name="trash" size={14} />
          </NoteIconButton>
        </span>
        <NoteIconButton
          $isOn={!!note.star}
          aria-label={note.star ? 'Unstar note' : 'Star note'}
          aria-pressed={!!note.star}
          title={note.star ? 'Unstar' : 'Star'}
          onClick={() => browser.updateNode(note.id, { star: !note.star })}
        >
          <Icon name={note.star ? 'starFilled' : 'star'} size={15} />
        </NoteIconButton>
      </div>
      {isEditing ? (
        <BareInput
          className="note-edit"
          multiline
          autoFocus
          value={draft}
          inputProps={{ 'aria-label': 'Edit note' }}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={save}
        />
      ) : (
        <span className="note-text" role="button" tabIndex={0} title="Click to edit" onClick={() => setDraft(note.text ?? '')}>
          {note.text || 'Empty note'}
        </span>
      )}
      {page?.url && (
        <div className="note-foot">
          <NotePageLink title={page.url} onClick={() => onOpenPage(page.url!)}>
            <Favicon url={page.url} size={14} />
            <span className="link-text">{page.title}</span>
          </NotePageLink>
        </div>
      )}
    </NoteCardRoot>
  );
}
