import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export const ToolbarRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  height: 52,
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0, 1.5),
  background: theme.browser.paper,
  borderBottom: `1px solid ${theme.browser.line}`,
}));

export const AddressWrap = styled('div')({ position: 'relative', flex: 1, minWidth: 0 });

export const AddressPill = styled('div')(({ theme }) => ({
  height: 38,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: theme.spacing(0, 1, 0, 0.5),
  borderRadius: 19,
  background: theme.browser.panel,
  border: `1px solid ${theme.browser.line}`,
  '&:focus-within': {
    background: theme.browser.paper,
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${theme.browser.soft}`,
  },
}));

export const PillButton = styled(ButtonBase, { shouldForwardProp: omitProps('$tone') })<{
  $tone?: 'default' | 'warn' | 'on';
}>(({ theme, $tone = 'default' }) => ({
  width: 32,
  height: 32,
  flex: 'none',
  borderRadius: 16,
  color:
    $tone === 'warn'
      ? theme.browser.danger
      : $tone === 'on'
        ? theme.palette.primary.main
        : theme.browser.ink2,
  '&:hover': { background: theme.browser.hover },
  '&.Mui-disabled': { opacity: 0.35 },
}));

export const Suggestions = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 44,
  left: 0,
  right: 0,
  zIndex: 60,
  padding: theme.spacing(1),
  borderRadius: 16,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.line}`,
  boxShadow: theme.browser.e3,
}));

export const SuggestionRow = styled('div', { shouldForwardProp: omitProps('$isOn') })<{
  $isOn: boolean;
}>(({ theme, $isOn }) => ({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: theme.spacing(0, 1.25),
  borderRadius: 8,
  cursor: 'pointer',
  color: $isOn ? theme.browser.ink : theme.browser.ink2,
  background: $isOn ? theme.browser.soft : 'transparent',
  '& .label': { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  '& .sub': { fontSize: 12, color: theme.browser.ink3, whiteSpace: 'nowrap' },
}));

export const AssistantButton = styled(ButtonBase)(({ theme }) => ({
  width: 40,
  height: 40,
  flex: 'none',
  borderRadius: '50%',
  color: theme.browser.ink3,
  border: `1px dashed ${theme.browser.ink3}`,
  '&:hover': { background: theme.browser.hover },
}));

export const LoadBar = styled('div', { shouldForwardProp: omitProps('$isLoading') })<{
  $isLoading: boolean;
}>(({ theme, $isLoading }) => ({
  position: 'absolute',
  left: 0,
  bottom: -1,
  height: 2,
  width: 0,
  background: theme.palette.primary.main,
  animation: $isLoading ? 'synapse-load .35s ease-out forwards' : 'none',
  '@keyframes synapse-load': { from: { width: 0 }, to: { width: '100%' } },
}));
