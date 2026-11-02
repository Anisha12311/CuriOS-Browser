import ButtonBase from '@mui/material/ButtonBase';
import InputBase from '@mui/material/InputBase';
import Switch from '@mui/material/Switch';
import { alpha, styled, type Theme } from '@mui/material/styles';
import { omitProps } from '../../utils/styled';

export type ActionVariant = 'default' | 'primary' | 'danger';

export const Grow = styled('span')({ flex: 1, minWidth: 0 });

export const ToolButton = styled(ButtonBase, { shouldForwardProp: omitProps('$size', '$active') })<{
  $size?: number;
  $active?: boolean;
}>(({ theme, $size = 40, $active = false }) => ({
  width: $size,
  height: $size,
  flex: 'none',
  borderRadius: '50%',
  color: $active ? theme.palette.primary.main : theme.browser.ink2,
  background: $active ? theme.browser.soft : 'transparent',
  transition: 'background-color .15s',
  '&:hover': { background: $active ? theme.browser.soft : theme.browser.hover },
  '&.Mui-disabled': { opacity: 0.4 },
}));

interface ActionStyleProps {
  $variant?: ActionVariant;
  $small?: boolean;
}

function actionStyles({ theme, $variant = 'default', $small = false }: ActionStyleProps & { theme: Theme }) {
  const b = theme.browser;
  const base = {
    height: $small ? 32 : 40,
    padding: $small ? '0 12px' : '0 16px',
    gap: $small ? 6 : 8,
    borderRadius: $small ? 8 : 10,
    fontFamily: 'inherit',
    fontSize: $small ? 13 : 14,
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
    color: b.ink,
    background: b.paper,
    border: `1px solid ${b.line}`,
    transition: 'background-color .15s, border-color .15s, filter .15s',
    '& svg': { fontSize: $small ? 14 : 16 },
    '&.Mui-disabled': { opacity: 0.5 },
  };
  if ($variant === 'primary') {
    return {
      ...base,
      color: b.paper,
      border: '1px solid transparent',
      background: b.primaryGradient,
      boxShadow: b.primaryShadow,
      '&:hover': { filter: 'brightness(.94)' },
    };
  }
  if ($variant === 'danger') {
    return {
      ...base,
      color: b.danger,
      borderColor: alpha(b.danger, 0.35),
      '&:hover': { background: alpha(b.danger, 0.08), borderColor: b.danger },
    };
  }
  return {
    ...base,
    '&:hover': { background: b.softBlue, borderColor: b.hoverBlue, color: b.linkHover },
  };
}

export const ActionButton = styled(ButtonBase, { shouldForwardProp: omitProps('$variant', '$small') })<ActionStyleProps>(
  actionStyles,
);

/** An external link that looks like an ActionButton. */
export const ActionLink = styled('a', { shouldForwardProp: omitProps('$variant', '$small') })<ActionStyleProps>(
  ({ theme, ...props }) => ({
    ...actionStyles({ theme, ...props }),
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
  }),
);

export const BareInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  height: '100%',
  fontSize: 14,
  color: theme.browser.ink,
  '& input::placeholder': { color: theme.browser.ink3, opacity: 1 },
}));

export const ToggleSwitch = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 3,
    '&.Mui-checked': {
      transform: 'translateX(18px)',
      color: theme.browser.paper,
      '& + .MuiSwitch-track': { background: theme.palette.primary.main, opacity: 1 },
    },
  },
  '& .MuiSwitch-thumb': { width: 20, height: 20, boxShadow: theme.browser.e1 },
  '& .MuiSwitch-track': { borderRadius: 13, background: theme.browser.muted, opacity: 1 },
}));

export const ColorDot = styled('span', { shouldForwardProp: omitProps('$color', '$size', '$round') })<{
  $color: string;
  $size?: number;
  $round?: boolean;
}>(({ $color, $size = 10, $round = false }) => ({
  width: $size,
  height: $size,
  flex: 'none',
  display: 'inline-block',
  borderRadius: $round ? '50%' : 3,
  background: $color,
}));

export const FaviconBox = styled('span', { shouldForwardProp: omitProps('$color', '$size') })<{
  $color?: string;
  $size: number;
}>(({ theme, $color, $size }) => ({
  width: $size,
  height: $size,
  flex: 'none',
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  borderRadius: Math.round($size * 0.3),
  color: theme.browser.ink2,
  background: $color ?? theme.browser.panel,
  boxShadow: $color ? 'none' : `inset 0 0 0 1px ${theme.browser.line}`,
  '&::after': $color
    ? {
        content: '""',
        position: 'absolute',
        inset: Math.round($size * 0.28),
        borderRadius: '50%',
        background: alpha(theme.browser.paper, 0.85),
      }
    : undefined,
}));

export const FaviconImage = styled('img', { shouldForwardProp: omitProps('$size') })<{ $size: number }>(
  ({ $size }) => ({
    width: $size,
    height: $size,
    flex: 'none',
    objectFit: 'contain',
    borderRadius: Math.round($size * 0.25),
  }),
);

export const Spinner = styled('span', { shouldForwardProp: omitProps('$size') })<{ $size: number }>(
  ({ theme, $size }) => ({
    width: $size,
    height: $size,
    flex: 'none',
    borderRadius: '50%',
    border: `2px solid ${theme.browser.line}`,
    borderTopColor: theme.palette.primary.main,
    animation: 'synapse-spin .7s linear infinite',
    '@keyframes synapse-spin': { to: { transform: 'rotate(360deg)' } },
  }),
);

export const EmptyState = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  border: `1.5px dashed ${theme.browser.hoverBlue}`,
  background: theme.browser.softBlue3,
  color: theme.browser.ink3,
  textAlign: 'center',
  fontSize: 13.5,
}));

export const SectionLabel = styled('div')(({ theme }) => ({
  fontSize: 11.5,
  fontWeight: 600,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  color: theme.browser.ink3,
}));

export const Kbd = styled('kbd')(({ theme }) => ({
  fontFamily: theme.browser.mono,
  fontSize: 11,
  padding: '1px 7px',
  borderRadius: 5,
  background: theme.browser.softBlue,
  border: `1px solid ${theme.browser.line}`,
  borderBottomWidth: 2,
  color: theme.browser.ink2,
}));
