export const animation = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.16, 1, 0.3, 1)',
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type AnimationToken = typeof animation;
