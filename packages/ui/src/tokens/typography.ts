export const fontFamilies = {
  heading: '"Space Grotesk", system-ui, sans-serif',
  body: '"Inter", system-ui, sans-serif',
  code: '"JetBrains Mono", monospace',
} as const;

export const fontSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '48px',
} as const;

export const typography = {
  fontFamilies,
  fontSizes,
} as const;

export type TypographyToken = typeof typography;
