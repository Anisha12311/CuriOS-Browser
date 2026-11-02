import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export const SearchField = styled('form')(({ theme }) => ({
  height: 48,
  flex: '1 1 320px',
  maxWidth: 560,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: theme.spacing(0, 2),
  borderRadius: 14,
  color: theme.browser.ink3,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.line}`,
  boxShadow: '0 2px 8px rgba(31, 60, 140, .05)',
  '&:focus-within': { borderColor: theme.browser.focusBorder, boxShadow: `0 0 0 3px ${theme.browser.focusRing}` },
  '& input': { fontSize: 15 },
}));

export const Segmented = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  flex: 'none',
  gap: 2,
  padding: 3,
  borderRadius: 20,
  background: theme.browser.bg,
}));

export const SegmentButton = styled(ButtonBase, { shouldForwardProp: omitProps('$isOn') })<{ $isOn: boolean }>(
  ({ theme, $isOn }) => ({
    height: 32,
    padding: theme.spacing(0, 2),
    borderRadius: 16,
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    color: $isOn ? theme.browser.ink : theme.browser.ink2,
    background: $isOn ? theme.browser.soft : 'transparent',
  }),
);

export const TopBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  margin: theme.spacing(1, 0, 2.5),
}));

export const TabRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: theme.spacing(2.5),
  borderBottom: `1px solid ${theme.browser.hairline}`,
}));

export const UnderlineTab = styled(ButtonBase, { shouldForwardProp: omitProps('$isOn') })<{ $isOn: boolean }>(
  ({ theme, $isOn }) => ({
    height: 44,
    gap: 8,
    marginBottom: -1,
    padding: theme.spacing(0, 2),
    borderRadius: '8px 8px 0 0',
    fontFamily: 'inherit',
    fontSize: 14.5,
    fontWeight: $isOn ? 600 : 500,
    color: $isOn ? theme.browser.linkHover : theme.browser.ink2,
    borderBottom: `3px solid ${$isOn ? theme.browser.link : 'transparent'}`,
    '&:hover': { background: theme.browser.softBlue3, color: theme.browser.linkHover },
    '& .count': {
      padding: '1px 8px',
      borderRadius: 999,
      fontSize: 12,
      color: theme.browser.link,
      background: theme.browser.softBlue2,
    },
  }),
);

export const FolderHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: theme.spacing(0.75, 0.5, 1.5),
  '& b': { fontSize: 15.5, fontWeight: 600, color: theme.browser.navy },
  '& .count': { padding: '1px 9px', borderRadius: 999, fontSize: 12.5, color: theme.browser.ink3, background: theme.browser.hairlineSoft },
}));

export const CardGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2.75),
}));

export const ItemCard = styled('div')(({ theme }) => ({
  position: 'relative',
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  borderRadius: 14,
  background: theme.browser.paper,
  border: `1px solid ${theme.browser.hairline}`,
  transition: 'border-color .15s, box-shadow .15s',
  '&:hover': { borderColor: theme.browser.hoverBlue, boxShadow: '0 8px 20px rgba(31, 60, 140, .08)' },
  '&:hover .item-actions, & .item-actions:focus-within': { opacity: 1 },
  '& .item-actions': { display: 'flex', gap: 2, paddingRight: 8, opacity: 0, transition: 'opacity .15s' },
}));

export const ItemMain = styled(ButtonBase)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  gap: 12,
  padding: theme.spacing(1.5, 1.75),
  justifyContent: 'flex-start',
  fontFamily: 'inherit',
  textAlign: 'left',
  '& .item-text': { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  '& .item-text b': { fontSize: 14.5, fontWeight: 500, color: theme.browser.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  '& .item-text span': { fontSize: 12.5, color: theme.browser.ink3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  '& .item-clock': { width: 52, flex: 'none', fontSize: 12.5, color: theme.browser.ink3, fontVariantNumeric: 'tabular-nums' },
}));

export const DayLabel = styled('div')(({ theme }) => ({
  padding: theme.spacing(2.25, 0.5, 1.25),
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  color: theme.browser.ink3,
}));

export const ItemList = styled('div')({ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 860 });

export const SearchResult = styled(ButtonBase)(({ theme }) => ({
  display: 'block',
  width: '100%',
  fontFamily: 'inherit',
  textAlign: 'left',
  '& .result-head': { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: theme.browser.ink3 },
  '& .result-title': { marginTop: 2, fontSize: 18, color: theme.browser.searchLink },
  '& .result-snippet': { marginTop: 2, color: theme.browser.ink2 },
  '&:hover .result-title': { textDecoration: 'underline' },
}));

export const PillHint = styled('span')(({ theme }) => ({
  height: 32,
  flex: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: theme.spacing(0, 1.5),
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  color: theme.browser.paper,
  background: theme.browser.primaryGradient,
  boxShadow: theme.browser.primaryShadow,
}));
