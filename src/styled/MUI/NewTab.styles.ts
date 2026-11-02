import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export const NewTabFrame = styled('div')(({ theme }) => ({
  maxWidth: 980,
  margin: '0 auto',
  padding: theme.spacing(3, 3, 6),
}));

export const Hero = styled('div')(({ theme }) => ({
  position: 'relative',
  isolation: 'isolate',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(1, 0, 1.75),
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-40px -10% auto',
    height: 240,
    zIndex: -1,
    pointerEvents: 'none',
    background: theme.browser.heroGlow,
  },
  '& h1': {
    margin: theme.spacing(2.75, 0, 3.25),
    fontSize: 28,
    lineHeight: '34px',
    fontWeight: 600,
    letterSpacing: '-.02em',
    color: theme.browser.navy,
  },
}));

export const WorkspacePill = styled(ButtonBase)(({ theme }) => ({
  height: 30,
  gap: 8,
  padding: theme.spacing(0, 1.75),
  borderRadius: 999,
  fontFamily: 'inherit',
  fontSize: 13,
  fontWeight: 500,
  color: theme.browser.rail.ink,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  boxShadow: '0 4px 12px rgba(31, 60, 140, .06)',
  '&:hover': { borderColor: theme.browser.hoverBlue },
}));

export const HeroSearch = styled('form')(({ theme }) => ({
  position: 'relative',
  zIndex: 30,
  width: '100%',
  maxWidth: 680,
  height: 54,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: theme.spacing(0, 1, 0, 2.75),
  borderRadius: 30,
  color: theme.browser.ink3,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  boxShadow: '0 14px 36px rgba(31, 60, 140, .12)',
  transition: 'box-shadow .15s, border-color .15s',
  '&:focus-within': {
    borderColor: theme.browser.focusBorder,
    boxShadow: `0 0 0 4px ${theme.browser.focusRing}, 0 14px 36px rgba(31, 60, 140, .12)`,
  },
  '& input': { fontSize: 16 },
  '& .search-go': { height: 40, borderRadius: 20, padding: theme.spacing(0, 3.25) },
}));

export const HeroSuggestions = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  right: 0,
  zIndex: 30,
  padding: theme.spacing(1),
  borderRadius: 20,
  textAlign: 'left',
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  boxShadow: '0 20px 44px rgba(31, 60, 140, .18)',
}));

export const TryRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
  marginTop: theme.spacing(2.5),
  fontSize: 13,
  color: theme.browser.ink3,
}));

export const TryChip = styled(ButtonBase, { shouldForwardProp: omitProps('$tone') })<{ $tone: number }>(
  ({ theme, $tone }) => {
    const chip = theme.browser.chips[$tone % theme.browser.chips.length];
    return {
      height: 34,
      gap: 7,
      padding: theme.spacing(0, 2),
      borderRadius: 999,
      fontFamily: 'inherit',
      fontSize: 13.5,
      fontWeight: 500,
      color: chip.ink,
      background: chip.bg,
      border: `1.5px solid ${chip.border}`,
      transition: 'transform .15s, box-shadow .15s',
      '&::before': { content: '""', width: 7, height: 7, borderRadius: '50%', background: 'currentColor', opacity: 0.55 },
      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 14px rgba(31, 60, 140, .12)' },
    };
  },
);

export const StatGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2.5),
  [theme.breakpoints.down('md')]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
}));

export const StatCard = styled(ButtonBase, { shouldForwardProp: omitProps('$tint') })<{ $tint: number }>(
  ({ theme, $tint }) => {
    const tint = theme.browser.statTints[$tint % theme.browser.statTints.length];
    return {
      flexDirection: 'column',
      alignItems: 'stretch',
      borderRadius: 12,
      fontFamily: 'inherit',
      textAlign: 'left',
      background: tint.bg,
      border: `1px solid ${tint.border}`,
      transition: 'transform .18s, box-shadow .18s, border-color .18s',
      '&:hover': {
        background: theme.browser.paper,
        transform: 'translateY(-2px)',
        borderColor: theme.browser.hoverBlue,
        boxShadow: theme.browser.liftShadow,
      },
      '& .stat-head': { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing(1.75, 2, 0) },
      '& .stat-tag': {
        height: 26,
        padding: theme.spacing(0, 1.5),
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 6,
        fontSize: 12.5,
        fontWeight: 500,
        color: theme.browser.rail.ink,
        background: theme.browser.paper,
        border: `1px solid ${theme.browser.hairline}`,
      },
      '& .stat-number': { display: 'flex', alignItems: 'baseline', gap: 10, padding: theme.spacing(1.5, 2.25, 2) },
      '& .stat-number b': { fontSize: 26, lineHeight: '30px', fontWeight: 600, color: theme.browser.navy },
      '& .stat-number span': { fontSize: 13, color: theme.browser.ink3 },
    };
  },
);

export const StatBadge = styled('span', { shouldForwardProp: omitProps('$tone') })<{
  $tone: 'success' | 'warning' | 'error';
}>(({ theme, $tone }) => ({
  height: 24,
  padding: theme.spacing(0, 1.25),
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  color: theme.browser[$tone].ink,
  background: theme.browser[$tone].bg,
}));

export const SuggestCard = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  columnGap: theme.spacing(2),
  alignItems: 'center',
  marginTop: theme.spacing(2.25),
  padding: theme.spacing(2, 2.5),
  borderRadius: 12,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  borderLeft: `4px solid ${theme.browser.suggest.accent}`,
  boxShadow: '0 8px 24px rgba(31, 60, 140, .07)',
  '& .suggest-head': { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, color: theme.browser.suggest.ink },
  '& .suggest-icon': { width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: 8, background: theme.browser.suggest.soft },
  '& h3': { gridColumn: 1, margin: theme.spacing(1, 0, 0), fontSize: 15, fontWeight: 600, color: theme.browser.navy },
  '& .suggest-actions': { gridColumn: 2, gridRow: '1 / span 2', display: 'flex', gap: 10, flexWrap: 'wrap' },
}));

export const SuggestButton = styled(ButtonBase, { shouldForwardProp: omitProps('$isPrimary') })<{
  $isPrimary?: boolean;
}>(({ theme, $isPrimary = false }) => ({
  height: 36,
  gap: 8,
  padding: theme.spacing(0, 2),
  borderRadius: 8,
  fontFamily: 'inherit',
  fontSize: 13.5,
  fontWeight: 550,
  color: $isPrimary ? theme.browser.paper : theme.browser.navy,
  background: $isPrimary ? theme.browser.suggest.button : theme.browser.paper,
  border: `1px solid ${$isPrimary ? theme.browser.suggest.button : theme.browser.hairline}`,
  '&:hover': { filter: 'brightness(.96)', transform: 'translateY(-1px)' },
}));

export const Section = styled('section')(({ theme }) => ({
  marginTop: theme.spacing(3.25),
  '& h2': { margin: theme.spacing(0, 0, 1.5), fontSize: 14, fontWeight: 600, color: theme.browser.navy },
}));

export const TileGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: theme.spacing(2),
  [theme.breakpoints.down('md')]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
}));

export const JumpTile = styled(ButtonBase, { shouldForwardProp: omitProps('$tone') })<{ $tone: number }>(
  ({ theme, $tone }) => ({
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2, 2, 0),
    borderRadius: 12,
    overflow: 'hidden',
    fontFamily: 'inherit',
    textAlign: 'left',
    background: theme.browser.paper,
    border: `1px solid ${theme.browser.hairline}`,
    boxShadow: '0 4px 14px rgba(31, 60, 140, .04)',
    transition: 'transform .15s, box-shadow .2s, border-color .2s',
    '&:hover': { transform: 'translateY(-3px)', borderColor: theme.browser.hoverBlue, boxShadow: '0 16px 32px rgba(31, 60, 140, .12)' },
    '&:hover .tile-open': { color: theme.browser.paper, background: theme.browser.link, borderColor: theme.browser.link },
    '& .tile-icon': {
      width: 42,
      height: 42,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 12,
      color: theme.browser.paper,
      background: theme.browser.tiles[$tone % theme.browser.tiles.length],
    },
    '& .tile-corner': { position: 'absolute', top: 14, right: 14, color: theme.browser.hoverBlue },
    '& b': { marginTop: theme.spacing(1.5), fontSize: 14, fontWeight: 600, color: theme.browser.navy },
    '& .tile-desc': {
      maxWidth: '100%',
      margin: theme.spacing(0.5, 0, 2),
      fontSize: 12.5,
      color: theme.browser.ink3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& .tile-foot': {
      alignSelf: 'stretch',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      margin: theme.spacing(0, -2),
      padding: theme.spacing(1.25, 2),
      fontSize: 12,
      background: theme.browser.softBlue3,
      borderTop: `1px solid ${theme.browser.hairlineSoft}`,
    },
    '& .tile-open': {
      height: 26,
      gap: 4,
      padding: theme.spacing(0, 1.25),
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 8,
      fontWeight: 500,
      color: theme.browser.rail.ink,
      background: theme.browser.paper,
      border: `1px solid ${theme.browser.hairline}`,
      transition: 'background-color .15s, color .15s',
    },
    '& .tile-count': { fontWeight: 500, color: theme.browser.ink3, whiteSpace: 'nowrap' },
  }),
);

export const ContinueGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
  gap: theme.spacing(2),
}));

export const ContinueCard = styled(ButtonBase)(({ theme }) => ({
  gap: 14,
  padding: theme.spacing(1.75, 2),
  justifyContent: 'flex-start',
  borderRadius: 12,
  fontFamily: 'inherit',
  textAlign: 'left',
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  '&:hover': { transform: 'translateY(-2px)', borderColor: theme.browser.hoverBlue, boxShadow: theme.browser.liftShadow },
  '& .card-text': { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  '& .card-text b': { fontSize: 13.5, fontWeight: 600, color: theme.browser.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  '& .card-text span': { fontSize: 12.5, color: theme.browser.ink3 },
}));
