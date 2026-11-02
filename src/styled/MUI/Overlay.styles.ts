import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import type { ToastTone } from '../../state/BrowserContext';
import type { BrowserTokens } from '../theme/theme';
import { omitProps } from '../../utils/styled';

export const ToastStack = styled('div')({
  position: 'fixed',
  left: '50%',
  bottom: 20,
  zIndex: 1500,
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
  pointerEvents: 'none',
});

export const ToastCard = styled('div', { shouldForwardProp: omitProps('$tone') })<{ $tone: ToastTone }>(
  ({ theme, $tone }) => {
    const palette = { ok: theme.browser.success, warn: theme.browser.warning, err: theme.browser.error }[$tone];
    return {
      minWidth: 280,
      maxWidth: 460,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: theme.spacing(1.375, 1.5),
      borderRadius: 14,
      fontSize: 14,
      fontWeight: 500,
      pointerEvents: 'auto',
      color: palette.ink,
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      boxShadow: '0 16px 40px rgba(20, 32, 74, .18)',
      animation: 'synapse-toast-in .2s ease-out',
      '@keyframes synapse-toast-in': { from: { transform: 'translateY(8px)', opacity: 0 } },
      '& .toast-icon': {
        width: 24,
        height: 24,
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        borderRadius: '50%',
        color: theme.browser.paper,
        background: palette.solid,
      },
      '& .toast-message': { flex: 1 },
    };
  },
);

export const ToastDismiss = styled(ButtonBase)(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: 8,
  color: theme.browser.muted,
  '&:hover': { background: theme.browser.press },
}));

export const PaletteDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': { background: theme.browser.scrim, backdropFilter: 'blur(3px)' },
  '& .MuiPaper-root': {
    width: 660,
    maxWidth: 'calc(100vw - 16px)',
    margin: 0,
    marginTop: '12vh',
    alignSelf: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 40px 90px rgba(20, 32, 74, .35)',
    animation: 'synapse-dialog-in .2s cubic-bezier(.2, .9, .3, 1.2)',
    '@keyframes synapse-dialog-in': { from: { opacity: 0, transform: 'translateY(14px) scale(.96)' } },
  },
}));

export type PaletteTone = keyof BrowserTokens['paletteTones'];

export const PaletteTop = styled('div')(({ theme }) => ({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: theme.spacing(0, 2.5),
  color: theme.browser.muted,
  '& input': { fontSize: 17, color: theme.browser.navy },
  '& kbd': { borderRadius: 4, padding: '3px 9px', fontSize: 11.5 },
}));

export const PaletteChips = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: 8,
  padding: theme.spacing(0, 2.5, 1.5),
  borderBottom: `1px solid ${theme.browser.hairlineSoft}`,
}));

export const PaletteChip = styled(ButtonBase, { shouldForwardProp: omitProps('$isOn') })<{ $isOn: boolean }>(
  ({ theme, $isOn }) => ({
    height: 30,
    gap: 6,
    padding: theme.spacing(0, 1.625),
    borderRadius: 6,
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 500,
    color: $isOn ? theme.browser.paper : theme.browser.chips[1].ink,
    background: $isOn ? theme.browser.chipActive : theme.browser.panel,
    boxShadow: $isOn ? '0 4px 10px rgba(85, 96, 200, .3)' : 'none',
    transition: 'transform .15s, background-color .15s',
    '&:hover': { transform: 'translateY(-1px)', background: $isOn ? theme.browser.chipActive : theme.browser.soft },
  }),
);

export const PaletteBody = styled('div')(({ theme }) => ({
  maxHeight: 'min(58vh, 480px)',
  overflow: 'auto',
  padding: theme.spacing(0.75, 1.5, 1.25),
}));

export const PaletteSection = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5, 1.25, 0.75),
  fontSize: 11.5,
  fontWeight: 650,
  letterSpacing: '.07em',
  textTransform: 'uppercase',
  color: theme.browser.muted,
}));

export const PaletteRow = styled(ButtonBase, { shouldForwardProp: omitProps('$isOn', '$tone') })<{
  $isOn: boolean;
  $tone: PaletteTone;
}>(({ theme, $isOn, $tone }) => {
  const tone = theme.browser.paletteTones[$tone];
  return {
    width: '100%',
    minHeight: 54,
    gap: 14,
    margin: '1px 0',
    padding: theme.spacing(1, 1.25),
    justifyContent: 'flex-start',
    borderRadius: 8,
    fontFamily: 'inherit',
    textAlign: 'left',
    background: $isOn ? theme.browser.softBlue : 'transparent',
    boxShadow: $isOn ? `inset 0 0 0 1.5px ${theme.browser.hoverBlue}` : 'none',
    transition: 'background-color .12s',
    '& .row-icon': {
      width: 36,
      height: 36,
      flex: 'none',
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      color: tone.ink,
      background: tone.bg,
      transform: $isOn ? 'scale(1.06) rotate(-3deg)' : 'none',
      transition: 'transform .15s',
    },
    '& .row-text': { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 },
    '& .row-title, & .row-sub': { maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    '& .row-title': { fontSize: 14.5, fontWeight: 550, color: theme.browser.navy },
    '& .row-sub': { fontSize: 12.5, color: theme.browser.ink3 },
    '& .row-key': {
      flex: 'none',
      padding: '2px 8px',
      borderRadius: 4,
      font: `500 11.5px ${theme.browser.mono}`,
      color: theme.browser.ink3,
      background: $isOn ? theme.browser.paper : theme.browser.panel,
      border: `1px solid ${theme.browser.hairline}`,
      borderBottomWidth: 2,
    },
    '& .row-action': {
      height: 30,
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: theme.spacing(0, 1.5),
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 500,
      color: $isOn ? theme.browser.paper : theme.browser.rail.ink,
      background: $isOn ? theme.browser.link : theme.browser.paper,
      border: `1px solid ${$isOn ? theme.browser.link : theme.browser.hairline}`,
      transition: 'background-color .15s, color .15s',
    },
    '& .row-go': {
      flex: 'none',
      display: 'grid',
      color: theme.browser.link,
      opacity: $isOn ? 1 : 0,
      transform: $isOn ? 'none' : 'translateX(-6px)',
      transition: 'opacity .15s, transform .15s',
    },
  };
});

export const PaletteEmpty = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  padding: theme.spacing(5, 2.5),
  textAlign: 'center',
  color: theme.browser.muted,
  '& b': { fontSize: 15, color: theme.browser.navy },
  '& span': { fontSize: 13 },
}));

export const PaletteFoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 18,
  padding: theme.spacing(1.25, 2.5),
  fontSize: 12.5,
  color: theme.browser.ink3,
  background: theme.browser.softBlue3,
  borderTop: `1px solid ${theme.browser.hairlineSoft}`,
  '& > span': { display: 'inline-flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' },
  '& .foot-tip': { gap: 6, color: theme.browser.muted },
}));

export const SelectionBar = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 20,
  display: 'flex',
  gap: 2,
  padding: 4,
  borderRadius: 9,
  background: theme.browser.ink,
  boxShadow: theme.browser.e3,
  '& button': {
    height: 26,
    gap: 6,
    padding: theme.spacing(0, 1.25),
    borderRadius: 6,
    fontFamily: 'inherit',
    fontSize: 12,
    fontWeight: 500,
    color: theme.browser.paper,
    '&:hover': { background: 'rgba(255, 255, 255, .15)' },
  },
}));
