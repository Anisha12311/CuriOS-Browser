import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export const RailRoot = styled('nav', { shouldForwardProp: omitProps('$isOpen') })<{ $isOpen: boolean }>(
  ({ theme, $isOpen }) => ({
    width: $isOpen ? 248 : 68,
    flex: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: theme.spacing(1.5),
    overflow: 'hidden',
    color: theme.browser.rail.ink,
    background: theme.browser.rail.background,
    borderRight: `1px solid ${theme.browser.rail.border}`,
    transition: 'width .18s ease',
  }),
);

export const RailHead = styled('div', { shouldForwardProp: omitProps('$isOpen') })<{ $isOpen: boolean }>(
  ({ theme, $isOpen }) => ({
    display: 'flex',
    flexDirection: $isOpen ? 'row' : 'column',
    alignItems: 'center',
    gap: $isOpen ? theme.spacing(1.5) : 6,
    minHeight: 44,
    padding: '0 2px',
    marginBottom: theme.spacing(1),
    '& b': {
      flex: 1,
      minWidth: 0,
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: '-.01em',
      color: theme.browser.rail.title,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  }),
);

export const RailLogo = styled('span')(({ theme }) => ({
  width: 36,
  height: 36,
  flex: 'none',
  display: 'grid',
  placeItems: 'center',
  borderRadius: 11,
  color: theme.browser.paper,
  background: theme.browser.rail.logo,
}));

export const RailToggle = styled(ButtonBase)(({ theme }) => ({
  width: 28,
  height: 28,
  flex: 'none',
  borderRadius: 8,
  color: theme.browser.rail.ink,
  '&:hover': { background: theme.browser.rail.hover },
}));

export const RailSearch = styled(ButtonBase, { shouldForwardProp: omitProps('$isOpen') })<{
  $isOpen: boolean;
}>(({ theme, $isOpen }) => ({
  height: 40,
  width: '100%',
  flex: 'none',
  gap: theme.spacing(1.5),
  justifyContent: $isOpen ? 'flex-start' : 'center',
  padding: $isOpen ? theme.spacing(0, 1) : 0,
  marginBottom: theme.spacing(1),
  borderRadius: 10,
  fontFamily: 'inherit',
  fontSize: 14.5,
  color: theme.browser.rail.searchInk,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.rail.searchBorder}`,
  boxShadow: '0 2px 8px rgba(31, 95, 255, .08)',
  '& .label': { flex: 1, textAlign: 'left' },
}));

export const RailSection = styled('div')(({ theme }) => ({
  padding: theme.spacing(4, 1.25, 1),
  fontSize: 11.5,
  fontWeight: 600,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  color: theme.browser.rail.muted,
}));

export const RailList = styled('div')({ display: 'flex', flexDirection: 'column', gap: 2 });

export const RailItem = styled(ButtonBase, { shouldForwardProp: omitProps('$isOpen', '$isActive', '$onDark') })<{
  $isOpen: boolean;
  $isActive: boolean;
  $onDark?: boolean;
}>(({ theme, $isOpen, $isActive, $onDark = false }) => {
  const rail = theme.browser.rail;
  return {
    height: 44,
    width: '100%',
    flex: 'none',
    gap: theme.spacing(1.5),
    justifyContent: $isOpen ? 'flex-start' : 'center',
    padding: $isOpen ? theme.spacing(0, 1) : 0,
    borderRadius: 12,
    fontFamily: 'inherit',
    fontSize: 14.5,
    fontWeight: $isActive ? 600 : 500,
    color: $isActive ? theme.browser.brand : $onDark ? rail.footInk : rail.ink,
    background: $isActive ? rail.activeBg : 'transparent',
    boxShadow: $isActive ? rail.activeShadow : 'none',
    transition: 'background-color .15s, transform .15s',
    '&:hover': {
      background: $isActive ? rail.activeBg : $onDark ? rail.footHover : rail.hover,
      transform: $isOpen && !$isActive ? 'translateX(3px)' : 'none',
    },
    '& .label': {
      flex: 1,
      minWidth: 0,
      textAlign: 'left',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  };
});

export const RailIcon = styled('span')({
  width: 26,
  height: 26,
  flex: 'none',
  display: 'grid',
  placeItems: 'center',
});

export const RailCount = styled('span', { shouldForwardProp: omitProps('$isActive') })<{ $isActive: boolean }>(
  ({ theme, $isActive }) => ({
    minWidth: 22,
    height: 20,
    padding: '0 6px',
    flex: 'none',
    borderRadius: 10,
    fontSize: 12,
    lineHeight: '20px',
    textAlign: 'center',
    color: $isActive ? theme.browser.paper : theme.browser.rail.ink,
    background: $isActive ? theme.browser.brand : theme.browser.rail.countBg,
  }),
);

export const RailFoot = styled('div')(({ theme }) => ({
  marginTop: 'auto',
  paddingTop: theme.spacing(1.5),
  borderTop: `1px solid ${theme.browser.rail.hover}`,
}));
