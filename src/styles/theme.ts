// ═══════════════════════════════════════════════════
//  styles/theme.ts  —  design tokens
// ═══════════════════════════════════════════════════

export const theme = {
  bg:      '#0a1628',
  bg2:     '#0f1e38',
  bg3:     '#162440',
  surface:  '#1a2d4a',
  surface2: '#213559',

  border:  'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.12)',

  text:    '#e8f0fe',
  text2:   '#8fa8cc',
  text3:   '#4d6a8c',

  accent:     '#3b82f6',
  accent2:    '#60a5fa',
  accentGlow: 'rgba(59,130,246,0.3)',

  green:    '#22c55e',
  greenDim: 'rgba(34,197,94,0.15)',
  red:      '#ef4444',
  redDim:   'rgba(239,68,68,0.15)',
  amber:    '#f59e0b',

  zones: {
    colors: ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'],
    dim:    [
      'rgba(59,130,246,0.15)',
      'rgba(34,197,94,0.15)',
      'rgba(245,158,11,0.15)',
      'rgba(168,85,247,0.15)',
    ],
  },

  radius:   '16px',
  radiusSm: '10px',
  miniH:    '72px',
  headerH:  '60px',

  fontMono: "'DM Mono', monospace",
  fontSans: "'DM Sans', sans-serif",
} as const;

export type Theme = typeof theme;

// Augment styled-components DefaultTheme
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
