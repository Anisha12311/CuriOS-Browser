import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import { alpha, styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export const WorkspaceGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: theme.spacing(3, 2.75),
  padding: 6,
  [theme.breakpoints.down('md')]: { gridTemplateColumns: 'minmax(0, 1fr)' },
}));

export const WorkspaceCardRoot = styled('article', { shouldForwardProp: omitProps('$color', '$isCurrent') })<{
  $color: string;
  $isCurrent: boolean;
}>(({ $color, $isCurrent }) => ({
  borderRadius: 28,
  background: alpha($color, 0.07),
  boxShadow: $isCurrent
    ? `0 0 0 2px ${$color}, 0 0 0 8px ${alpha($color, 0.14)}`
    : `0 0 0 6px ${alpha($color, 0.07)}`,
  transition: 'transform .2s, box-shadow .2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 0 0 6px ${alpha($color, 0.12)}, 0 18px 40px -12px ${alpha($color, 0.45)}`,
  },
}));

export const WorkspaceCardInner = styled('div', { shouldForwardProp: omitProps('$color') })<{ $color: string }>(
  ({ theme, $color }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2, 2.25),
    borderRadius: 24,
    border: `2px solid ${alpha(theme.browser.paper, 0.9)}`,
    background: `linear-gradient(180deg, ${alpha($color, 0.09)} 0%, ${theme.browser.paper} 38%, ${theme.browser.paper} 58%, ${alpha($color, 0.2)} 100%)`,
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 220,
      height: 220,
      right: -90,
      top: -110,
      borderRadius: '50%',
      pointerEvents: 'none',
      background: `radial-gradient(circle, ${alpha($color, 0.28)}, transparent 70%)`,
    },
    '& .card-top': { position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    '& .card-avatar': {
      width: 44,
      height: 44,
      display: 'grid',
      placeItems: 'center',
      borderRadius: '50%',
      fontSize: 20,
      color: theme.browser.paper,
      background: `radial-gradient(circle at 30% 25%, ${alpha($color, 0.6)}, ${$color} 60%)`,
      boxShadow: `0 6px 16px -4px ${alpha($color, 0.6)}, inset 0 0 0 3px ${alpha(theme.browser.paper, 0.55)}`,
    },
    '& .card-badge': {
      height: 24,
      gap: 6,
      padding: theme.spacing(0, 1.25),
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 14,
      fontSize: 12,
      fontWeight: 500,
      color: $color,
      background: alpha($color, 0.14),
    },
    '& h3': {
      position: 'relative',
      margin: theme.spacing(1.25, 0, 0),
      fontSize: 20,
      lineHeight: '26px',
      fontWeight: 400,
      color: theme.browser.ink,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& .card-role': { fontSize: 13, color: theme.browser.ink3 },
    '& .card-tags': { display: 'flex', gap: 6, marginTop: theme.spacing(1), flexWrap: 'wrap' },
    '& .card-tag': {
      height: 24,
      gap: 5,
      padding: theme.spacing(0, 1.25),
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 13,
      fontSize: 12,
      fontWeight: 500,
      background: theme.browser.hover,
      '& svg': { color: $color },
    },
    '& .card-stats': { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', margin: theme.spacing(1.5, 0, 0.5) },
    '& .card-stats > div': {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1),
      textAlign: 'center',
      borderLeft: `1px solid ${theme.browser.press}`,
    },
    '& .card-stats > div:first-of-type': { borderLeft: 0 },
    '& .card-stats b': { fontSize: 19, lineHeight: '24px', fontWeight: 400 },
    '& .card-stats span': { fontSize: 12, color: theme.browser.ink3 },
    '& .card-foot': { display: 'flex', gap: 10, marginTop: 'auto', paddingTop: theme.spacing(1.5) },
  }),
);

export const PillAction = styled(ButtonBase, { shouldForwardProp: omitProps('$color') })<{ $color: string }>(
  ({ theme, $color }) => ({
    flex: 1,
    height: 42,
    borderRadius: 21,
    fontFamily: 'inherit',
    fontSize: 14.5,
    fontWeight: 500,
    color: theme.browser.ink,
    background: `linear-gradient(180deg, ${alpha(theme.browser.paper, 0.7)}, ${alpha($color, 0.16)})`,
    boxShadow: `inset 0 0 0 2px ${alpha(theme.browser.paper, 0.95)}, 0 0 0 1px ${alpha($color, 0.25)}`,
    '&:hover': { boxShadow: `inset 0 0 0 2px ${theme.browser.paper}, 0 0 0 1px ${$color}` },
    '&.Mui-disabled': { color: $color, background: alpha($color, 0.1) },
  }),
);

export const NewWorkspaceTile = styled(ButtonBase)(({ theme }) => ({
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  minHeight: 260,
  gap: theme.spacing(1),
  padding: theme.spacing(3),
  borderRadius: 28,
  fontFamily: 'inherit',
  textAlign: 'left',
  color: theme.browser.navy,
  background: `linear-gradient(180deg, ${theme.browser.accent2} 0%, ${theme.browser.softBlue2} 45%, ${theme.browser.paper} 85%)`,
  transition: 'transform .2s, box-shadow .2s',
  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 18px 40px -14px rgba(47, 107, 255, .5)' },
  '& b': { fontSize: 17, fontWeight: 500 },
  '& span': { fontSize: 14, color: theme.browser.ink2 },
  '& em': { marginTop: theme.spacing(1.5), fontStyle: 'normal', fontWeight: 500 },
}));

export const FormDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': { background: theme.browser.scrim, backdropFilter: 'blur(3px)' },
  '& .MuiPaper-root': { width: 440, borderRadius: 22, overflow: 'hidden' },
  '& .dialog-head': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2.25, 2.5, 1.75),
    background: `linear-gradient(180deg, ${theme.browser.softBlue3}, ${theme.browser.paper})`,
    '& h3': { margin: 0, fontSize: 18, fontWeight: 650, color: theme.browser.navy },
  },
  '& .dialog-body': { display: 'flex', flexDirection: 'column', gap: theme.spacing(1), padding: theme.spacing(0, 2.5) },
  '& .dialog-label': { marginTop: theme.spacing(1), fontSize: 13, color: theme.browser.ink3 },
  '& .dialog-field': {
    height: 44,
    padding: theme.spacing(0, 1.75),
    borderRadius: 12,
    background: theme.browser.panel,
    border: '1px solid transparent',
    '&.Mui-focused': { background: theme.browser.paper, borderColor: theme.browser.focusBorder, boxShadow: `0 0 0 4px ${theme.browser.focusRing}` },
  },
  '& .dialog-foot': {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: theme.spacing(2.25),
    padding: theme.spacing(1.75, 2.5),
    background: theme.browser.softBlue3,
    borderTop: `1px solid ${theme.browser.hairlineSoft}`,
  },
}));

export const Swatch = styled(ButtonBase, { shouldForwardProp: omitProps('$color', '$isOn') })<{
  $color: string;
  $isOn: boolean;
}>(({ theme, $color, $isOn }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  color: theme.browser.paper,
  background: $color,
  boxShadow: $isOn ? `0 0 0 2px ${theme.browser.paper}, 0 0 0 4px ${theme.browser.ink}` : 'none',
  transition: 'transform .12s',
  '&:hover': { transform: 'scale(1.08)' },
}));
