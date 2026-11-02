import ButtonBase from '@mui/material/ButtonBase';
import { alpha, styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export const PanelRoot = styled('aside')(({ theme }) => ({
  width: 300,
  flex: 'none',
  display: 'flex',
  flexDirection: 'column',
  background: theme.browser.panel,
  borderLeft: `1px solid ${theme.browser.chromeLine}`,
  [theme.breakpoints.down('lg')]: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    width: 320,
    boxShadow: '-12px 0 32px rgba(20, 23, 28, .16)',
  },
}));

export const PanelTabs = styled('div')(({ theme }) => ({
  height: 52,
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: theme.spacing(0, 1, 0, 1.25),
  borderBottom: `1px solid ${theme.browser.line}`,
}));

export const PanelTab = styled(ButtonBase, { shouldForwardProp: omitProps('$isActive') })<{
  $isActive: boolean;
}>(({ theme, $isActive }) => ({
  height: 32,
  gap: 4,
  padding: theme.spacing(0, 1.5),
  borderRadius: 16,
  fontFamily: 'inherit',
  fontSize: 13,
  fontWeight: 500,
  color: $isActive ? theme.browser.ink : theme.browser.ink2,
  background: $isActive ? theme.browser.paper : 'transparent',
  boxShadow: $isActive ? `0 0 0 1px ${theme.browser.line}` : 'none',
  '& .count': { fontWeight: 400, color: theme.browser.ink3 },
}));

export const PanelBody = styled('div')(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
}));

export const PanelCard = styled('div', { shouldForwardProp: omitProps('$isNote') })<{ $isNote?: boolean }>(
  ({ theme, $isNote = false }) => ({
    padding: theme.spacing(1.5, 2),
    borderRadius: 12,
    background: $isNote ? theme.browser.note.bg : theme.browser.paper,
    border: `1px solid ${$isNote ? theme.browser.note.border : theme.browser.line}`,
    '& .text': { fontSize: 14, lineHeight: '20px', overflowWrap: 'anywhere' },
    '& .meta': {
      marginTop: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: theme.browser.ink3,
    },
  }),
);

export const LinkButton = styled(ButtonBase)(({ theme }) => ({
  minWidth: 0,
  flex: 1,
  justifyContent: 'flex-start',
  fontFamily: 'inherit',
  fontSize: 12,
  fontWeight: 500,
  color: theme.palette.primary.main,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '&:hover': { textDecoration: 'underline' },
}));

export const NoteComposer = styled('form')(({ theme }) => ({
  flex: 'none',
  borderRadius: 16,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.line}`,
  boxShadow: '0 1px 2px rgba(20, 36, 84, .04)',
  transition: 'border-color .15s, box-shadow .15s',
  '&:focus-within': { borderColor: theme.browser.focusBorder, boxShadow: `0 0 0 4px ${theme.browser.focusRing}` },
  '& .composer-field': {
    display: 'block',
    height: 'auto',
    padding: theme.spacing(1.5, 1.75, 0.5),
    fontSize: 14,
    lineHeight: '21px',
    '& textarea::placeholder': { color: theme.browser.ink3, opacity: 1 },
  },
  '& .composer-foot': {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: theme.spacing(0.75, 1, 1, 1.5),
  },
}));

export const AttachChip = styled('span')(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  color: theme.browser.ink3,
  '& .chip-text': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  '& b': { fontWeight: 500, color: theme.browser.ink2 },
}));

export const NoteCardRoot = styled('article', { shouldForwardProp: omitProps('$isEditing') })<{ $isEditing: boolean }>(
  ({ theme, $isEditing }) => {
    const note = theme.browser.note;
    return {
      position: 'relative',
      flex: 'none',
      padding: theme.spacing(1.5, 1.75, 1.25),
      borderRadius: 16,
      color: note.ink,
      background: `linear-gradient(160deg, ${note.bg}, ${note.bgEnd})`,
      border: `1px solid ${note.border}`,
      boxShadow: $isEditing ? `0 0 0 4px ${theme.browser.focusRing}` : '0 2px 6px rgba(120, 90, 0, .08)',
      transition: 'box-shadow .15s, transform .15s',
      '&:hover': { boxShadow: '0 8px 18px rgba(120, 90, 0, .14)' },
      '&:hover .note-actions, & .note-actions:focus-within': { opacity: 1 },
      '& .note-head': { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
      '& .note-kind': {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '.05em',
        textTransform: 'uppercase',
        color: note.label,
      },
      '& .note-time': { fontSize: 11.5, color: note.label },
      '& .note-actions': { marginLeft: 'auto', display: 'flex', gap: 2, opacity: 0, transition: 'opacity .15s' },
      '& .note-text': {
        display: 'block',
        width: '100%',
        padding: 0,
        textAlign: 'left',
        fontSize: 14,
        lineHeight: '21px',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        cursor: 'text',
      },
      '& .note-edit': { width: '100%', fontSize: 14, lineHeight: '21px', color: note.ink, padding: 0 },
      '& .note-foot': {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: theme.spacing(1.25),
        paddingTop: theme.spacing(1),
        borderTop: `1px dashed ${note.border}`,
      },
    };
  },
);

export const NoteIconButton = styled(ButtonBase, { shouldForwardProp: omitProps('$isOn') })<{ $isOn?: boolean }>(
  ({ theme, $isOn = false }) => ({
    width: 26,
    height: 26,
    borderRadius: 8,
    color: $isOn ? theme.browser.note.label : alpha(theme.browser.note.ink, 0.55),
    '&:hover': { color: theme.browser.note.ink, background: alpha(theme.browser.note.label, 0.14) },
  }),
);

export const NotePageLink = styled(ButtonBase)(({ theme }) => ({
  minWidth: 0,
  maxWidth: '100%',
  gap: 6,
  padding: theme.spacing(0.25, 1, 0.25, 0.5),
  borderRadius: 8,
  fontFamily: 'inherit',
  fontSize: 12,
  fontWeight: 500,
  color: theme.browser.note.ink,
  background: alpha(theme.browser.paper, 0.6),
  '& .link-text': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  '&:hover': { background: theme.browser.paper },
}));

export const NotesEmpty = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  padding: theme.spacing(3.5, 2.5),
  borderRadius: 16,
  textAlign: 'center',
  color: theme.browser.ink3,
  fontSize: 13,
  lineHeight: 1.5,
  border: `1.5px dashed ${theme.browser.hoverBlue}`,
  background: theme.browser.softBlue3,
  '& .empty-icon': {
    width: 44,
    height: 44,
    display: 'grid',
    placeItems: 'center',
    marginBottom: 4,
    borderRadius: 14,
    color: theme.browser.note.label,
    background: `linear-gradient(160deg, ${theme.browser.note.bg}, ${theme.browser.note.bgEnd})`,
    border: `1px solid ${theme.browser.note.border}`,
  },
  '& b': { fontSize: 14.5, fontWeight: 600, color: theme.browser.navy },
}));

export const TrailRow = styled(ButtonBase, { shouldForwardProp: omitProps('$isActive') })<{
  $isActive: boolean;
}>(({ theme, $isActive }) => ({
  width: '100%',
  minHeight: 48,
  gap: 10,
  padding: theme.spacing(1, 1.25),
  justifyContent: 'flex-start',
  borderRadius: 12,
  fontFamily: 'inherit',
  fontSize: 13,
  background: theme.browser.paper,
  border: `1px solid ${$isActive ? theme.palette.primary.main : theme.browser.line}`,
  '&:hover': { borderColor: theme.browser.ink3 },
  '& .label': { flex: 1, minWidth: 0, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  '& .sub': { fontSize: 11.5, color: theme.browser.ink3, whiteSpace: 'nowrap' },
}));

export const PanelFoot = styled('div')(({ theme }) => ({
  flex: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.browser.line}`,
}));

export const MiniTrail = styled('svg')(({ theme }) => ({
  width: '100%',
  height: 100,
  display: 'block',
  borderRadius: 10,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.line}`,
  '& line': { stroke: theme.browser.graph.edgeSoft, strokeWidth: 1.5 },
  '& circle': { stroke: theme.browser.ink3, strokeWidth: 1.5, fill: theme.browser.paper },
  '& circle.note': { fill: theme.browser.note.bg },
  '& circle.question': { fill: theme.browser.question.bg },
  '& circle.current': { fill: theme.palette.primary.main, stroke: theme.palette.primary.main },
}));
