export const shadows = {
  soft: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
  glow: '0 0 15px rgba(0, 217, 255, 0.25)',
  accentGlow: '0 0 20px rgba(122, 92, 255, 0.25)',
  border: 'inset 0 0 0 1px rgba(30, 41, 59, 0.8)',
} as const;

export type ShadowsToken = typeof shadows;
