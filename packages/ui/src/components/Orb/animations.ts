import { Variants } from 'framer-motion';

export const coreVariants: Variants = {
  idle: {
    scale: [1, 1.012, 1], // Breathing strictly under 1.2%
    y: [0, -6, 0], // Micro floating offset
    opacity: [0.94, 1, 0.94],
    transition: {
      scale: { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }, // Phase-shifted light breathing
      y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }, // Independent 5s float loop
      opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  // Narrative Wake Sequence (Under 0.85s)
  wake: {
    scale: [0.3, 1.2, 1.012, 1],
    opacity: [0.2, 1, 0.95, 1],
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
  thinking: {
    scale: [0.99, 1.025, 0.99],
    transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
  },
  listening: {
    scale: [1, 1.03, 1],
    opacity: [0.85, 1, 0.85],
    transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
  },
  speaking: {
    scale: [1, 1.04, 0.98, 1.03, 1],
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
  },
  executing: {
    scale: [1, 1.03, 1],
    transition: { duration: 1.8, repeat: Infinity, ease: 'linear' },
  },
  researching: {
    scale: [0.99, 1.03, 0.99],
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
  },
  memory: {
    scale: [1.02, 0.98, 1.02],
    opacity: [0.88, 1, 0.88],
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  },
  offline: {
    scale: 1,
    opacity: 0.3,
    transition: { duration: 0.5 },
  },
  error: {
    scale: [1, 1.02, 0.98, 1],
    x: [0, -1, 1, -0.5, 0],
    transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
  },
};

// SVG Outer Ring Clockwise Rotation (28s)
export const outerRingVariants: Variants = {
  idle: {
    rotate: [0, 360],
    scale: 1,
    transition: { duration: 28, repeat: Infinity, ease: 'linear' },
  },
  wake: {
    scale: [0.2, 1.25, 1],
    opacity: [0, 0.95, 0.65],
    transition: { duration: 0.85, ease: 'easeOut', delay: 0.15 }, // Staggered wake narrative
  },
  thinking: {
    rotate: [0, -360],
    scale: [1, 1.04, 1],
    transition: { duration: 18, repeat: Infinity, ease: 'linear' },
  },
  listening: {
    scale: [1, 1.06, 1],
    opacity: [0.4, 0.8, 0.4],
    transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
  },
  speaking: {
    scale: [1, 1.08, 1],
    opacity: [0.7, 0.25, 0.7],
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
  },
  executing: {
    rotate: [0, 360],
    scale: [1, 1.05, 1],
    transition: { duration: 10, repeat: Infinity, ease: 'linear' },
  },
  researching: {
    rotate: [0, 360],
    scale: [1, 1.04, 1],
    transition: { duration: 20, repeat: Infinity, ease: 'linear' },
  },
  memory: {
    rotate: [360, 0],
    scale: [1.06, 0.96, 1.06],
    transition: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
  },
  offline: {
    scale: 1,
    opacity: 0.1,
  },
  error: {
    scale: [1, 1.02, 1],
    opacity: [0.35, 0.65, 0.35],
    transition: { duration: 0.9, repeat: Infinity },
  },
};

// SVG Inner Ring Counter-Clockwise Rotation (22s)
export const innerRingVariants: Variants = {
  idle: {
    rotate: [360, 0],
    scale: 0.92,
    transition: { duration: 22, repeat: Infinity, ease: 'linear' },
  },
  wake: {
    scale: [0.1, 1.15, 0.92],
    opacity: [0, 0.8, 0.5],
    transition: { duration: 0.85, ease: 'easeOut', delay: 0.25 }, // Staggered wake narrative
  },
  thinking: {
    rotate: [0, 360],
    scale: [0.9, 0.95, 0.9],
    transition: { duration: 15, repeat: Infinity, ease: 'linear' },
  },
  executing: {
    rotate: [-360, 360],
    scale: [0.9, 1.02, 0.9],
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
  },
};
