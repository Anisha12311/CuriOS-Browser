import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export const SettingsColumns = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '250px minmax(0, 1fr)',
  alignItems: 'start',
  gap: theme.spacing(3.5),
  [theme.breakpoints.down('md')]: { gridTemplateColumns: 'minmax(0, 1fr)' },
}));

export const SettingsNav = styled('nav')(({ theme }) => ({
  position: 'sticky',
  top: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: theme.spacing(1),
  borderRadius: 18,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  boxShadow: '0 6px 20px rgba(31, 60, 140, .06)',
  [theme.breakpoints.down('md')]: { position: 'static', flexDirection: 'row', overflowX: 'auto' },
}));

export const SettingsNavItem = styled(ButtonBase, { shouldForwardProp: omitProps('$isOn') })<{ $isOn: boolean }>(
  ({ theme, $isOn }) => ({
    gap: 12,
    padding: theme.spacing(1.125, 1.25),
    justifyContent: 'flex-start',
    borderRadius: 12,
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    color: $isOn ? theme.browser.linkHover : theme.browser.rail.ink,
    background: $isOn ? theme.browser.softBlue2 : 'transparent',
    '&:hover': { background: $isOn ? theme.browser.softBlue2 : theme.browser.softBlue3 },
    '& .nav-icon': {
      width: 32,
      height: 32,
      flex: 'none',
      display: 'grid',
      placeItems: 'center',
      borderRadius: 10,
      color: $isOn ? theme.browser.paper : theme.browser.ink3,
      background: $isOn ? theme.browser.blueGradient : theme.browser.panel,
    },
  }),
);

export const SectionHead = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  marginBottom: theme.spacing(2.25),
  '& h2': { margin: 0, fontSize: 21, fontWeight: 620, color: theme.browser.navy },
  '& p': { margin: '2px 0 0', fontSize: 13.5, color: theme.browser.ink3 },
}));

export const CardTitle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  padding: theme.spacing(2, 2.5, 0.5),
  '& b': { fontSize: 15, fontWeight: 600, color: theme.browser.navy },
  '& small': { fontSize: 13, color: theme.browser.ink3 },
}));

export const OptionGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 10,
  padding: theme.spacing(1.75, 2.5, 2.5),
}));

export const RadioDot = styled('span', { shouldForwardProp: omitProps('$isOn') })<{ $isOn: boolean }>(
  ({ theme, $isOn }) => ({
    width: 20,
    height: 20,
    flex: 'none',
    marginTop: 1,
    borderRadius: '50%',
    border: `2px solid ${$isOn ? theme.browser.link : theme.browser.hoverBlue}`,
    background: $isOn
      ? `radial-gradient(circle, ${theme.browser.link} 0 5px, ${theme.browser.paper} 6px)`
      : theme.browser.paper,
  }),
);

export const ShortcutKey = styled('kbd')(({ theme }) => ({
  padding: '4px 10px',
  borderRadius: 8,
  font: `500 12.5px ${theme.browser.mono}`,
  color: theme.browser.rail.ink,
  background: theme.browser.panel,
  border: `1px solid ${theme.browser.hairline}`,
  borderBottomWidth: 2,
}));

export const ScoreHero = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
  margin: theme.spacing(1, 0, 3),
  padding: theme.spacing(2.75, 3.25),
  borderRadius: 22,
  background: `linear-gradient(120deg, ${theme.browser.softBlue2} 0%, ${theme.browser.softBlue3} 60%, ${theme.browser.paper} 100%)`,
  border: `1px solid ${theme.browser.hairline}`,
  boxShadow: '0 14px 36px rgba(31, 60, 140, .08)',
  '& .hero-text': { flex: '1 1 260px', minWidth: 0 },
  '& .hero-text h2': { margin: '0 0 4px', fontSize: 20, fontWeight: 600, color: theme.browser.navy },
  '& .hero-text p': { margin: 0, fontSize: 14, color: theme.browser.ink2 },
  '& .hero-stats': { display: 'flex', flexWrap: 'wrap', gap: 12 },
  '& .hero-stats > div': {
    minWidth: 120,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1.25, 2),
    borderRadius: 14,
    background: theme.browser.paper,
    border: `1px solid ${theme.browser.hairline}`,
  },
  '& .hero-stats b': { fontSize: 22, fontWeight: 600, color: theme.browser.navy },
  '& .hero-stats span': { fontSize: 12.5, color: theme.browser.ink2 },
}));

export const ScoreRing = styled('div', { shouldForwardProp: omitProps('$percent') })<{ $percent: number }>(
  ({ theme, $percent }) => ({
    width: 92,
    height: 92,
    flex: 'none',
    display: 'grid',
    placeContent: 'center',
    textAlign: 'center',
    borderRadius: '50%',
    background: `radial-gradient(closest-side, ${theme.browser.paper} 78%, transparent 80%), conic-gradient(${theme.browser.link} ${$percent}%, ${theme.browser.hairline} 0)`,
    '& b': { fontSize: 26, lineHeight: 1, color: theme.browser.navy },
    '& span': { fontSize: 11.5, color: theme.browser.ink3 },
  }),
);

export const TwoColumns = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
  alignItems: 'start',
  gap: theme.spacing(3),
  '& > div': { display: 'flex', flexDirection: 'column', gap: theme.spacing(2.5) },
  [theme.breakpoints.down('md')]: { gridTemplateColumns: 'minmax(0, 1fr)' },
}));

export const OptionStack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2, 2.25, 1),
}));

export const Note = styled('p')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1.5, 2.75, 2.25),
  fontSize: 13,
  color: theme.browser.ink2,
}));
