import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

const NO_DRAG = { WebkitAppRegion: 'no-drag' };

export const TabBar = styled('header')(({ theme }) => ({
  height: 58,
  flex: 'none',
  display: 'flex',
  alignItems: 'flex-end',
  padding: theme.spacing(0, 0, 0, 1.5),
  background: theme.browser.paper,
  borderBottom: `1px solid ${theme.browser.chromeLine}`,
  overflow: 'hidden',
  WebkitAppRegion: 'drag',
}));

export const WorkspaceChip = styled(ButtonBase)(({ theme }) => ({
  ...NO_DRAG,
  alignSelf: 'center',
  height: 36,
  flex: 'none',
  marginRight: theme.spacing(1.5),
  padding: theme.spacing(0, 1.5),
  gap: 7,
  borderRadius: 12,
  fontFamily: 'inherit',
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  color: theme.browser.ink,
  background: theme.browser.softBlue3,
  '&:hover': { background: theme.browser.softBlue },
}));

export const WorkspaceName = styled('span')({
  maxWidth: 150,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const TabList = styled('div')({
  flex: 1,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  overflow: 'hidden',
});

export const TabItem = styled('div', { shouldForwardProp: omitProps('$isActive', '$isPinned') })<{
  $isActive: boolean;
  $isPinned: boolean;
}>(({ theme, $isActive, $isPinned }) => ({
  ...NO_DRAG,
  position: 'relative',
  height: 48,
  flex: $isPinned ? '0 0 52px' : '1 1 200px',
  minWidth: $isPinned ? 52 : 130,
  maxWidth: $isPinned ? 52 : 240,
  display: 'flex',
  alignItems: 'center',
  justifyContent: $isPinned ? 'center' : 'flex-start',
  gap: 10,
  padding: $isPinned ? 0 : theme.spacing(0, 1, 0, 2),
  borderRadius: '12px 12px 0 0',
  cursor: 'pointer',
  userSelect: 'none',
  color: $isActive ? theme.browser.ink : theme.browser.ink2,
  background: $isActive ? theme.browser.paper : 'transparent',
  boxShadow: $isActive ? `inset 0 3px 0 ${theme.browser.brand}` : 'none',
  zIndex: $isActive ? 2 : 1,
  '&:hover': { background: $isActive ? theme.browser.paper : theme.browser.softBlue3 },
  '&:hover .tab-close': { opacity: 1 },
  '&:not(:last-of-type)::after': $isActive
    ? undefined
    : {
        content: '""',
        position: 'absolute',
        right: 0,
        top: 14,
        bottom: 14,
        width: 1,
        background: theme.browser.line,
      },
  '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: -2 },
}));

export const TabText = styled('span')({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

export const TabTitle = styled('span', { shouldForwardProp: omitProps('$isActive') })<{
  $isActive: boolean;
}>(({ theme, $isActive }) => ({
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: $isActive ? 500 : 400,
  color: $isActive ? theme.browser.ink : theme.browser.ink2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const TabHost = styled('span')(({ theme }) => ({
  fontSize: 11.5,
  lineHeight: '15px',
  color: theme.browser.ink3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const TabClose = styled(ButtonBase, { shouldForwardProp: omitProps('$isVisible') })<{
  $isVisible: boolean;
}>(({ theme, $isVisible }) => ({
  width: 24,
  height: 24,
  flex: 'none',
  borderRadius: 8,
  color: theme.browser.ink2,
  opacity: $isVisible ? 1 : 0,
  '&:hover': { background: theme.browser.press },
}));

export const TabMoreButton = styled(ButtonBase)(({ theme }) => ({
  ...NO_DRAG,
  alignSelf: 'center',
  height: 36,
  flex: 'none',
  gap: 8,
  margin: theme.spacing(0, 0.75),
  padding: theme.spacing(0, 1.5),
  borderRadius: 12,
  fontFamily: 'inherit',
  fontSize: 13,
  fontWeight: 600,
  color: theme.browser.linkHover,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  boxShadow: '0 4px 12px rgba(31, 60, 140, .08)',
  '&:hover': { background: theme.browser.softBlue, borderColor: theme.browser.hoverBlue },
}));

export const NewTabButton = styled(ButtonBase)(({ theme }) => ({
  ...NO_DRAG,
  alignSelf: 'center',
  width: 36,
  height: 36,
  flex: 'none',
  marginLeft: theme.spacing(1),
  borderRadius: 12,
  color: theme.browser.ink2,
  '&:hover': { background: theme.browser.hover },
}));

export const WindowActions = styled('div')({
  ...NO_DRAG,
  alignSelf: 'flex-start',
  flex: 'none',
  display: 'flex',
  height: 44,
  marginLeft: 8,
});

export const WindowButton = styled(ButtonBase, { shouldForwardProp: omitProps('$isClose') })<{
  $isClose?: boolean;
}>(({ theme, $isClose = false }) => ({
  width: 46,
  height: 44,
  color: theme.browser.ink,
  '&:hover': {
    background: $isClose ? theme.browser.windowClose : theme.browser.windowHover,
    color: $isClose ? theme.browser.paper : theme.browser.ink,
  },
}));
