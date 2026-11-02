import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
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

export const NoteForm = styled('form')(({ theme }) => ({
  display: 'flex',
  gap: 6,
  '& .field': {
    flex: 1,
    height: 36,
    padding: theme.spacing(0, 1.5),
    borderRadius: 8,
    background: theme.browser.paper,
    border: `1px solid ${theme.browser.line}`,
    '&.Mui-focused': { borderColor: theme.palette.primary.main },
  },
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
