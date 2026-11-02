import { styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export const ContentRoot = styled('main')(({ theme }) => ({
  position: 'relative',
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  background: theme.browser.paper,
}));

export const PageScroll = styled('div')({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
});

export const FrameHost = styled('div')({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  '& iframe': { position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 },
});

export const ExternalBar = styled('div')(({ theme }) => ({
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: theme.spacing(1, 1.75),
  color: theme.browser.warning.ink,
  background: theme.browser.warning.bg,
  borderBottom: `1px solid ${theme.browser.warning.border}`,
  '& .text': { flex: 1 },
}));

export const PreviewNotice = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2.5),
  padding: theme.spacing(1.75, 2),
  borderRadius: 14,
  color: theme.browser.warning.ink,
  background: theme.browser.warning.bg,
  border: `1px solid ${theme.browser.warning.border}`,
  '& span': { flex: 1 },
}));

export const PageFrame = styled('div', { shouldForwardProp: omitProps('$width') })<{
  $width?: 'narrow' | 'wide' | 'full';
}>(({ theme, $width = 'wide' }) => ({
  maxWidth: { narrow: 760, wide: 1200, full: 'none' }[$width],
  margin: '0 auto',
  padding: theme.spacing(4, 5, 8),
  [theme.breakpoints.down('md')]: { padding: theme.spacing(3, 2, 6) },
}));

export const PageHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  '& h1': {
    margin: 0,
    fontSize: 28,
    lineHeight: '36px',
    fontWeight: 600,
    letterSpacing: '-.01em',
    color: theme.browser.navy,
  },
  '& p': { margin: theme.spacing(0.5, 0, 0), maxWidth: 640, color: theme.browser.ink2 },
}));

export const SurfaceCard = styled('section')(({ theme }) => ({
  overflow: 'hidden',
  borderRadius: 20,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  boxShadow: theme.browser.cardShadow,
}));

export const CardHeader = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: theme.spacing(2.25, 2.75),
  borderBottom: `1px solid ${theme.browser.hairlineSoft}`,
  '& h2': { margin: 0, fontSize: 16, fontWeight: 600, color: theme.browser.navy },
  '& p': { margin: '2px 0 0', fontSize: 13, color: theme.browser.ink2 },
}));

export const IconTile = styled('span', { shouldForwardProp: omitProps('$size') })<{ $size?: number }>(
  ({ theme, $size = 38 }) => ({
    width: $size,
    height: $size,
    flex: 'none',
    display: 'grid',
    placeItems: 'center',
    borderRadius: 12,
    color: theme.browser.link,
    background: theme.browser.softBlue2,
  }),
);

export const SettingRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(1.75, 2.75),
  '& + &': { borderTop: `1px solid ${theme.browser.hairlineSoft}` },
  '& .row-text': { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 },
  '& .row-text b': { fontSize: 14.5, fontWeight: 500, color: theme.browser.navy, display: 'flex', alignItems: 'center', gap: 8 },
  '& .row-text span': { fontSize: 13, color: theme.browser.ink2 },
}));

export const OptionCard = styled('button', { shouldForwardProp: omitProps('$isOn') })<{ $isOn: boolean }>(
  ({ theme, $isOn }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    width: '100%',
    padding: theme.spacing(1.75, 2),
    borderRadius: 14,
    font: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    color: theme.browser.ink,
    background: $isOn ? theme.browser.softBlue : theme.browser.paper,
    border: `1px solid ${$isOn ? theme.browser.link : theme.browser.hairline}`,
    boxShadow: $isOn ? '0 8px 18px rgba(58, 100, 224, .12)' : 'none',
    transition: 'border-color .15s, background-color .15s',
    '&:hover': { borderColor: $isOn ? theme.browser.link : theme.browser.hoverBlue },
    '& b': { display: 'block', fontSize: 14.5 },
    '& small': { display: 'block', marginTop: 2, fontSize: 13, color: theme.browser.ink2 },
  }),
);
