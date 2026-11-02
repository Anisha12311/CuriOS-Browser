import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import type { NodeType } from '../../state/types';
import { omitProps } from '../../utils/styled';

export const GraphRoot = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: theme.browser.graph.canvas,
}));

export const GraphBar = styled('div')(({ theme }) => ({
  height: 64,
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(0, 3),
  background: theme.browser.paper,
  borderBottom: `1px solid ${theme.browser.chromeLine}`,
  '& .bar-title': { display: 'flex', flexDirection: 'column', lineHeight: 1.2 },
  '& .bar-title b': { fontSize: 18, fontWeight: 600, color: theme.browser.navy },
  '& .bar-title span': { fontSize: 12.5, color: theme.browser.ink3 },
}));

export const GraphMain = styled('div')({ position: 'relative', flex: 1, minHeight: 0, display: 'flex' });

export const Canvas = styled('div')(({ theme }) => ({
  position: 'relative',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  cursor: 'grab',
  touchAction: 'none',
  backgroundColor: theme.browser.graph.canvas,
  backgroundImage: `radial-gradient(${theme.browser.graph.dot} 1.2px, transparent 1.2px)`,
  '&:active': { cursor: 'grabbing' },
}));

export const World = styled('div')({ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0' });

export const EdgeLayer = styled('svg')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  overflow: 'visible',
  '& path': { fill: 'none', stroke: theme.browser.graph.edge, strokeWidth: 2 },
  '& path.soft': { stroke: theme.browser.graph.edgeSoft, strokeDasharray: '5 5' },
  '& path.bad': { stroke: theme.browser.graph.edgeBad, strokeDasharray: '6 5' },
  '& path.highlight': { stroke: theme.browser.graph.edgeHighlight, strokeWidth: 3 },
}));

export const EdgeLabel = styled('span', { shouldForwardProp: omitProps('$isBad') })<{ $isBad: boolean }>(
  ({ theme, $isBad }) => ({
    position: 'absolute',
    zIndex: 2,
    transform: 'translate(-50%, -50%)',
    padding: '1px 8px',
    borderRadius: 999,
    fontSize: 11.5,
    whiteSpace: 'nowrap',
    color: $isBad ? theme.browser.danger : theme.browser.link,
    background: theme.browser.paper,
    border: `1px solid ${$isBad ? theme.browser.error.border : theme.browser.hairline}`,
    boxShadow: '0 2px 8px rgba(31, 60, 140, .08)',
  }),
);

export const NodeCard = styled('div', { shouldForwardProp: omitProps('$type', '$isSelected') })<{
  $type: NodeType;
  $isSelected: boolean;
}>(({ theme, $type, $isSelected }) => {
  const b = theme.browser;
  const look = {
    page: { width: 240, height: 84, background: b.paper, border: b.hairline, radius: 14, ink: b.navy, label: b.muted },
    note: { width: 220, height: 104, background: `linear-gradient(160deg, ${b.note.bg}, ${b.note.bgEnd})`, border: 'transparent', radius: '6px 6px 22px 6px', ink: b.note.ink, label: b.note.label },
    question: { width: 240, height: 76, background: b.question.bg, border: b.question.border, radius: 22, ink: b.question.ink, label: b.question.label },
  }[$type];
  return {
    position: 'absolute',
    zIndex: 3,
    width: look.width,
    height: look.height,
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    padding: theme.spacing(0, 1.75, 0, 1.5),
    overflow: 'hidden',
    cursor: 'pointer',
    userSelect: 'none',
    borderRadius: look.radius,
    background: look.background,
    border: `1.5px solid ${$isSelected ? b.link : look.border}`,
    boxShadow: $isSelected ? `0 0 0 3px ${b.focusRing}, 0 14px 30px rgba(31, 60, 140, .16)` : '0 4px 14px rgba(31, 60, 140, .09)',
    transform: $type === 'note' ? 'rotate(-1deg)' : 'none',
    transition: 'box-shadow .15s, border-color .15s, opacity .15s',
    '& .node-body': { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 },
    '& .node-kind': { display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: look.label },
    '& .node-title': {
      fontSize: 13.5,
      lineHeight: '18px',
      fontWeight: $type === 'page' ? 600 : 500,
      color: look.ink,
      display: '-webkit-box',
      WebkitLineClamp: $type === 'note' ? 3 : 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    '& .node-host': { fontSize: 12, color: b.ink3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    '& .node-star': { position: 'absolute', top: 8, right: 10, color: b.star },
  };
});

export const FloatingTools = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 6,
  left: 14,
  top: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: 6,
  borderRadius: 14,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  boxShadow: '0 8px 22px rgba(31, 60, 140, .1)',
}));

export const ZoomBox = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 6,
  top: 14,
  right: 14,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: '4px 6px',
  borderRadius: 12,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  boxShadow: '0 6px 18px rgba(31, 60, 140, .08)',
  '& .zoom-value': { minWidth: 44, textAlign: 'center', fontSize: 13 },
}));

export const FilterPill = styled(ButtonBase, { shouldForwardProp: omitProps('$isOn') })<{ $isOn: boolean }>(
  ({ theme, $isOn }) => ({
    height: 32,
    gap: 6,
    padding: theme.spacing(0, 1.75),
    borderRadius: 999,
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 500,
    color: $isOn ? theme.browser.paper : theme.browser.chips[1].ink,
    background: $isOn ? theme.browser.chips[1].ink : theme.browser.chips[1].bg,
  }),
);

export const Inspector = styled('aside')(({ theme }) => ({
  width: 340,
  flex: 'none',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  background: theme.browser.paper,
  borderLeft: `1px solid ${theme.browser.chromeLine}`,
  boxShadow: '-12px 0 32px rgba(31, 60, 140, .08)',
  '& .inspector-head': {
    height: 56,
    flex: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1.5, 0, 2),
    borderBottom: `1px solid ${theme.browser.line}`,
  },
  '& .inspector-body': { display: 'flex', flexDirection: 'column', gap: theme.spacing(1.5), padding: theme.spacing(2, 2.5) },
  '& h3': { margin: 0, fontSize: 17, lineHeight: 1.3, color: theme.browser.navy },
  '& .inspector-url': { fontFamily: theme.browser.mono, fontSize: 11.5, color: theme.browser.ink3, wordBreak: 'break-all' },
  '& .inspector-text': {
    padding: theme.spacing(1.25, 1.5),
    borderRadius: 9,
    border: `1px solid ${theme.browser.line}`,
    alignItems: 'flex-start',
    '&.Mui-focused': { borderColor: theme.palette.primary.main },
  },
  '& .connection': { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
}));
