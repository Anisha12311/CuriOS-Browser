import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export const ShellRoot = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  fontSize: 14,
  lineHeight: '20px',
  color: theme.browser.ink,
  background: theme.browser.paper,
  WebkitFontSmoothing: 'antialiased',
}));

export const ShellBody = styled('div')({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  display: 'flex',
});

export const VerticalTabsRoot = styled('aside')(({ theme }) => ({
  width: 272,
  flex: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: theme.spacing(1.5),
  overflow: 'auto',
  background: theme.browser.panel,
  borderRight: `1px solid ${theme.browser.line}`,
}));

export const VerticalTab = styled(ButtonBase, { shouldForwardProp: omitProps('$isActive') })<{ $isActive: boolean }>(
  ({ theme, $isActive }) => ({
    width: '100%',
    height: 48,
    flex: 'none',
    gap: theme.spacing(1.5),
    padding: theme.spacing(0, 1, 0, 1.5),
    justifyContent: 'flex-start',
    borderRadius: 12,
    fontFamily: 'inherit',
    textAlign: 'left',
    background: $isActive ? theme.browser.softBlue2 : 'transparent',
    boxShadow: $isActive ? `inset 3px 0 0 ${theme.browser.brand}` : 'none',
    '&:hover': { background: $isActive ? theme.browser.softBlue2 : theme.browser.hover },
    '& .tab-text': { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
    '& .tab-title': {
      fontSize: 13,
      fontWeight: $isActive ? 500 : 400,
      color: theme.browser.ink,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& .tab-host': { fontSize: 11.5, color: theme.browser.ink3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  }),
);
