import Dialog from '@mui/material/Dialog';
import { alpha, styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';
import { ActionButton } from './Common.styles';

export type ConfirmTone = 'danger' | 'primary';

export const ConfirmRoot = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': { background: theme.browser.scrim, backdropFilter: 'blur(4px)' },
  '& .MuiPaper-root': {
    width: 420,
    maxWidth: 'calc(100% - 32px)',
    margin: 16,
    borderRadius: 22,
    overflow: 'hidden',
    border: `1px solid ${theme.browser.hairlineSoft}`,
    boxShadow: '0 24px 60px rgba(20, 36, 84, .22), 0 4px 14px rgba(20, 36, 84, .08)',
  },
  '& .confirm-body': {
    display: 'flex',
    gap: theme.spacing(2),
    padding: theme.spacing(3, 3, 2.5),
  },
  '& .confirm-text': { flex: 1, minWidth: 0, paddingTop: 2 },
  '& .confirm-text h3': { margin: 0, fontSize: 18, fontWeight: 650, color: theme.browser.navy, lineHeight: 1.3 },
  '& .confirm-text p': { margin: theme.spacing(0.75, 0, 0), fontSize: 14, lineHeight: 1.5, color: theme.browser.ink2 },
  '& .confirm-foot': {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    padding: theme.spacing(1.75, 3),
    background: theme.browser.softBlue3,
    borderTop: `1px solid ${theme.browser.hairlineSoft}`,
  },
}));

export const ConfirmIcon = styled('span', { shouldForwardProp: omitProps('$tone') })<{ $tone: ConfirmTone }>(
  ({ theme, $tone }) => ({
    width: 44,
    height: 44,
    flex: 'none',
    display: 'grid',
    placeItems: 'center',
    borderRadius: 14,
    color: $tone === 'danger' ? theme.browser.error.ink : theme.palette.primary.main,
    background: $tone === 'danger' ? theme.browser.error.bg : theme.browser.softBlue,
    border: `1px solid ${$tone === 'danger' ? theme.browser.error.border : theme.browser.soft}`,
  }),
);

export const DangerButton = styled(ActionButton)(({ theme }) => ({
  color: theme.browser.paper,
  background: theme.browser.error.solid,
  borderColor: theme.browser.error.solid,
  boxShadow: `0 6px 16px ${alpha(theme.browser.error.solid, 0.3)}`,
  '&:hover': { background: theme.browser.danger, borderColor: theme.browser.danger },
}));
