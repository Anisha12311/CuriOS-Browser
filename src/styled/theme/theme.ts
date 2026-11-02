import { alpha, createTheme, lighten } from '@mui/material/styles';

// Design tokens taken from the CuriOS HTML ("Midnight" accent, fade sidebar, white chrome).
export const tokens = {
  bg: '#E6E9F0',
  panel: '#F2F4F8',
  paper: '#FFFFFF',
  ink: '#14171C',
  ink2: '#444C58',
  ink3: '#5B6472',
  muted: '#8A94B6',
  line: '#D3D8E3',
  hairline: '#E3EAF8',
  hairlineSoft: '#EEF2FA',
  chromeLine: '#E6ECF7',
  danger: '#B3261E',
  accent: '#2A47A8',
  soft: '#E4E9F7',
  accent2: '#8FAEFF',
  navy: '#14204A',
  brand: '#1F5FFF',
  link: '#3A64E0',
  linkHover: '#1F4FD8',
  softBlue: '#EEF3FF',
  softBlue2: '#EAF0FF',
  softBlue3: '#F5F8FF',
  hoverBlue: '#A9BCEB',
  focusBorder: '#4A78E6',
  focusRing: '#E1EAFD',
  searchLink: '#0B5FD6',
  windowHover: '#D5D5DA',
  windowClose: '#E81123',
  star: '#C9871A',
  hover: 'rgba(20, 23, 28, .06)',
  press: 'rgba(20, 23, 28, .10)',
  scrim: 'rgba(20, 32, 74, .35)',
  e1: '0 1px 2px rgba(20, 23, 28, .10), 0 1px 3px 1px rgba(20, 23, 28, .06)',
  e2: '0 2px 6px 2px rgba(20, 23, 28, .10), 0 1px 2px rgba(20, 23, 28, .12)',
  e3: '0 4px 12px 4px rgba(20, 23, 28, .10), 0 1px 3px rgba(20, 23, 28, .14)',
  cardShadow: '0 10px 30px rgba(31, 60, 140, .06)',
  liftShadow: '0 12px 26px rgba(31, 60, 140, .1)',
  popShadow: '0 18px 48px rgba(31, 60, 140, .18), 0 2px 8px rgba(31, 60, 140, .08)',
  mono: '"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace',
  primaryGradient: `linear-gradient(180deg, ${lighten('#2A47A8', 0.22)}, #2A47A8)`,
  primaryShadow: `0 6px 16px ${alpha('#2A47A8', 0.24)}`,
  blueGradient: 'linear-gradient(180deg, #5E8BF5, #3A64E0)',
  heroGlow: 'radial-gradient(60% 70% at 50% 30%, rgba(111, 154, 255, .28), rgba(111, 154, 255, 0) 70%)',
  rail: {
    background:
      'linear-gradient(180deg, #FAFBFF 0%, #EEF3FF 22%, #BCD0FF 52%, #6B96FF 78%, #1F5FFF 100%)',
    border: '#E3EAF8',
    ink: '#2E3B6B',
    title: '#14204A',
    muted: '#6A78A6',
    searchBorder: '#D9E3FB',
    searchInk: '#7B88B0',
    hover: 'rgba(255, 255, 255, .65)',
    activeBg: 'rgba(255, 255, 255, .88)',
    activeShadow: '0 6px 16px rgba(31, 95, 255, .22), inset 0 0 0 1px rgba(255, 255, 255, .55)',
    countBg: 'rgba(31, 95, 255, .12)',
    footInk: '#FFFFFF',
    footHover: 'rgba(255, 255, 255, .18)',
    logo: 'linear-gradient(145deg, #5E8BF5, #2F55C8)',
  },
  note: { bg: '#FFF8E1', bgEnd: '#FFEFA8', border: '#F1DFA6', ink: '#4A3A00', label: '#9A6F00' },
  question: { bg: '#F6F1FF', border: '#D9CBF8', ink: '#2E1A66', label: '#7A4BE0', solid: '#8B5CF6' },
  success: { bg: '#EAF8EE', border: '#BFE3CF', ink: '#1A6B43', solid: '#2FAE6B' },
  warning: { bg: '#FFF3E0', border: '#F6D9AC', ink: '#9A5B07', solid: '#F0A02A' },
  error: { bg: '#FDEBEA', border: '#F5C4C0', ink: '#B3261E', solid: '#E5483F' },
  graph: {
    canvas: '#F5F8FE',
    dot: '#CBD6EE',
    edge: '#7FA2EE',
    edgeSoft: '#AAB4C8',
    edgeBad: '#D4453B',
    edgeHighlight: '#3A64E0',
  },
  chips: [
    { bg: '#E9F5EE', ink: '#1E7A4E', border: '#BFE3CF' },
    { bg: '#EEF0FC', ink: '#4252B8', border: '#CDD3F5' },
    { bg: '#FFF2E0', ink: '#B26A0B', border: '#F6D9AC' },
    { bg: '#FDEBF1', ink: '#B8305F', border: '#F5C4D4' },
  ],
  tiles: [
    'linear-gradient(135deg, #6B96FF, #3A64E0)',
    'linear-gradient(135deg, #F5B94A, #E08A1E)',
    'linear-gradient(135deg, #9F7BFF, #6B46E0)',
    'linear-gradient(135deg, #4CC38A, #1E9E68)',
    'linear-gradient(135deg, #8A96B4, #56627F)',
  ],
  statTints: [
    { bg: '#FFF9F3', border: '#F6E3CF' },
    { bg: '#F5FBF8', border: '#D3EBDF' },
    { bg: '#F9F7FF', border: '#E2DAF8' },
    { bg: '#F4F8FF', border: '#D5E2F8' },
  ],
  paletteTones: {
    blue: { bg: '#EEF3FF', ink: '#3A64E0' },
    green: { bg: '#E6F5EC', ink: '#1E7A4E' },
    amber: { bg: '#FFF1DC', ink: '#B26A0B' },
    purple: { bg: '#F0EAFF', ink: '#6B46E0' },
    rose: { bg: '#FDEBF1', ink: '#B8305F' },
    slate: { bg: '#EEF0F6', ink: '#56627F' },
    tab: { bg: '#F4F6FB', ink: '#444C58' },
  },
  chipActive: '#5560C8',
  workspaceColors: ['#0E7C66', '#2F5FD0', '#9A5B05', '#8A3FA0', '#55606E', '#A32B3C'],
  suggest: { accent: '#F28A2E', ink: '#D9701A', soft: '#FFF0E3', button: '#F57C20' },
};

export type BrowserTokens = typeof tokens;

declare module '@mui/material/styles' {
  interface Theme {
    browser: BrowserTokens;
  }
  interface ThemeOptions {
    browser?: BrowserTokens;
  }
}

export const lightTheme = createTheme({
  browser: tokens,
  typography: {
    fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    primary: { main: tokens.accent },
    secondary: { main: tokens.ink2 },
    error: { main: tokens.danger },
    background: { default: tokens.paper, paper: tokens.paper },
    text: { primary: tokens.ink, secondary: tokens.ink2 },
  },
  shape: { borderRadius: 10 },
});
