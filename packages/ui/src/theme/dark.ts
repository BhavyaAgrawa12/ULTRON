import { colors, spacing, radius, shadows, typography, animation, zIndex } from '../tokens';

export const darkTheme = {
  name: 'dark',
  colors,
  spacing,
  radius,
  shadows,
  typography,
  animation,
  zIndex,
} as const;

export type Theme = typeof darkTheme;
