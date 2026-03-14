// ═══════════════════════════════════════════════════
//  styles/theme.ts  —  design tokens
// ═══════════════════════════════════════════════════

export const theme = {
  bg:      '#ffffff',
  bg2:     '#f5f7fa',
  bg3:     '#eef1f6',
  surface:  '#f0f2f5',
  surface2: '#e8ebf0',

  border:  'rgba(0,0,0,0.08)',
  border2: 'rgba(0,0,0,0.14)',

  text:    '#111827',
  text2:   '#4b5563',
  text3:   '#9ca3af',

  accent:     '#2563eb',
  accent2:    '#1d4ed8',
  accentGlow: 'rgba(37,99,235,0.25)',

  green:    '#16a34a',
  greenDim: 'rgba(22,163,74,0.12)',
  red:      '#dc2626',
  redDim:   'rgba(220,38,38,0.1)',
  amber:    '#d97706',

  zones: {
    colors: ['#2563eb', '#16a34a', '#d97706', '#7c3aed'],
    dim:    [
      'rgba(37,99,235,0.1)',
      'rgba(22,163,74,0.1)',
      'rgba(217,119,6,0.1)',
      'rgba(124,58,237,0.1)',
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
