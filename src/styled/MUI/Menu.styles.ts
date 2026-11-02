import ButtonBase from '@mui/material/ButtonBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: 260,
    marginTop: 6,
    padding: 8,
    borderRadius: 16,
    boxShadow: theme.browser.popShadow,
    outline: `1px solid ${theme.browser.hairline}`,
  },
  '& .MuiList-root': { padding: 0 },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  minHeight: 40,
  gap: 12,
  padding: theme.spacing(0, 1.5),
  borderRadius: 10,
  fontSize: 14,
  '&:hover': { background: theme.browser.softBlue, color: theme.browser.linkHover },
}));

export const MenuItemLabel = styled('span')({ flex: 1, minWidth: 0 });

export const MenuItemHint = styled('span')(({ theme }) => ({
  fontSize: 12,
  color: theme.browser.ink3,
}));

export const WorkspacePopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: 340,
    marginTop: 6,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: theme.browser.popShadow,
    outline: `1px solid ${theme.browser.hairline}`,
  },
}));

export const MenuHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.25, 1.25),
  '& b': { fontSize: 16, fontWeight: 600, color: theme.browser.navy },
  '& span': { fontSize: 12.5, color: theme.browser.ink3 },
}));

export const MenuSearch = styled('div')(({ theme }) => ({
  height: 40,
  margin: theme.spacing(0, 1.75, 1),
  padding: theme.spacing(0, 1.5),
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 12,
  border: `1px solid ${theme.browser.line}`,
  color: theme.browser.ink3,
  '&:focus-within': {
    borderColor: theme.browser.focusBorder,
    boxShadow: `0 0 0 3px ${theme.browser.focusRing}`,
  },
}));

export const MenuList = styled('div')({ padding: '4px 8px', maxHeight: 300, overflow: 'auto' });

export const WorkspaceRow = styled(ButtonBase, { shouldForwardProp: omitProps('$isActive') })<{
  $isActive: boolean;
}>(({ theme, $isActive }) => ({
  width: '100%',
  height: 48,
  gap: 12,
  padding: theme.spacing(0, 1.5),
  justifyContent: 'flex-start',
  borderRadius: 12,
  fontFamily: 'inherit',
  fontSize: 14.5,
  color: theme.browser.rail.ink,
  background: $isActive ? theme.browser.softBlue2 : 'transparent',
  '&:hover': { background: theme.browser.softBlue3 },
  '& .row-name': {
    flex: 1,
    minWidth: 0,
    textAlign: 'left',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: $isActive ? 700 : 500,
    color: $isActive ? theme.browser.navy : 'inherit',
  },
  '& .row-meta': { fontSize: 12.5, color: theme.browser.ink3 },
}));

export const RadioMark = styled('span', { shouldForwardProp: omitProps('$isOn') })<{ $isOn: boolean }>(
  ({ theme, $isOn }) => ({
    width: 20,
    height: 20,
    flex: 'none',
    position: 'relative',
    borderRadius: '50%',
    border: `2px solid ${$isOn ? theme.browser.link : theme.browser.hoverBlue}`,
    background: theme.browser.paper,
    '&::after': $isOn
      ? { content: '""', position: 'absolute', inset: 3, borderRadius: '50%', background: theme.browser.link }
      : undefined,
  }),
);

export const MenuFoot = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: 8,
  marginTop: 6,
  padding: theme.spacing(1.25, 1.75, 1.75),
  borderTop: `1px solid ${theme.browser.hairlineSoft}`,
}));

export const MenuPrimary = styled(ButtonBase)(({ theme }) => ({
  flex: 1,
  height: 44,
  gap: 8,
  borderRadius: 12,
  fontFamily: 'inherit',
  fontSize: 14.5,
  fontWeight: 500,
  color: theme.browser.paper,
  background: theme.browser.blueGradient,
  boxShadow: `0 6px 14px ${theme.browser.focusRing}`,
  '&:hover': { filter: 'brightness(1.05)' },
}));

export const MenuSquareButton = styled(ButtonBase)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: 12,
  color: theme.browser.ink2,
  border: `1px solid ${theme.browser.line}`,
  '&:hover': { background: theme.browser.softBlue3 },
}));

export const OverflowPopover = styled(WorkspacePopover)({ '& .MuiPaper-root': { width: 380 } });

export const OverflowHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: theme.spacing(1.75, 2, 1.25),
  fontSize: 13,
  color: theme.browser.ink3,
  '& b': { fontSize: 14, fontWeight: 600, color: theme.browser.navy },
}));

export const ClearAllButton = styled(ButtonBase)(({ theme }) => ({
  height: 28,
  gap: 6,
  padding: theme.spacing(0, 1.5),
  borderRadius: 8,
  fontFamily: 'inherit',
  fontSize: 12.5,
  color: theme.browser.ink2,
  border: `1px solid ${theme.browser.line}`,
  '&:hover': {
    color: theme.browser.error.ink,
    background: theme.browser.error.bg,
    borderColor: theme.browser.error.border,
  },
}));

export const OverflowList = styled('div')(({ theme }) => ({
  maxHeight: 360,
  overflow: 'auto',
  padding: theme.spacing(0, 1, 1),
}));

export const OverflowRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 12,
  '&:hover': { background: theme.browser.softBlue3 },
  '& .row-main': {
    flex: 1,
    minWidth: 0,
    gap: 12,
    padding: theme.spacing(1.25, 1, 1.25, 1.25),
    justifyContent: 'flex-start',
    fontFamily: 'inherit',
    textAlign: 'left',
  },
  '& .row-text': { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  '& .row-text b': {
    fontSize: 14,
    fontWeight: 500,
    color: theme.browser.navy,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .row-text span, & .row-ago': {
    fontSize: 12.5,
    color: theme.browser.ink3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .row-ago': { flex: 'none' },
}));
