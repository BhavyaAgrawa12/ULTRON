import { Variants } from 'framer-motion';

export const coreVariants: Variants = {
  idle: {
    scale: [1, 1.04, 1],
    opacity: [0.92, 1, 0.92],
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
  },
  wake: {
    scale: [0.85, 1.2, 1.02, 1],
    opacity: [0.6, 1, 0.95, 1],
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
  thinking: {
    scale: [0.98, 1.05, 0.98],
    rotate: [0, 180, 360],
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  },
  listening: {
    scale: [1, 1.08, 1],
    opacity: [0.85, 1, 0.85],
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
  },
  speaking: {
    scale: [1, 1.1, 0.97, 1.06, 1],
    transition: { duration: 1.3, repeat: Infinity, ease: 'easeInOut' },
  },
  executing: {
    scale: [1, 1.08, 1],
    rotate: [0, 360],
    transition: { duration: 1.1, repeat: Infinity, ease: 'linear' },
  },
  researching: {
    scale: [0.98, 1.06, 0.98],
    transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
  },
  memory: {
    scale: [1.06, 0.94, 1.06],
    opacity: [0.88, 1, 0.88],
    transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
  },
  offline: {
    scale: 1,
    opacity: 0.3,
    transition: { duration: 0.5 },
  },
  error: {
    scale: [1, 1.03, 0.97, 1],
    x: [0, -1.5, 1.5, -1, 0],
    transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const outerRingVariants: Variants = {
  idle: {
    rotate: [0, 360],
    scale: 1,
    transition: { duration: 16, repeat: Infinity, ease: 'linear' },
  },
  wake: {
    scale: [0.8, 1.3, 1.1],
    opacity: [0, 0.95, 0.65],
    transition: { duration: 0.85, ease: 'easeOut' },
  },
  thinking: {
    rotate: [0, -360],
    scale: [1, 1.06, 1],
    transition: { duration: 5, repeat: Infinity, ease: 'linear' },
  },
  listening: {
    scale: [1, 1.12, 1],
    opacity: [0.4, 0.8, 0.4],
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
  },
  speaking: {
    scale: [1, 1.22, 1],
    opacity: [0.7, 0.25, 0.7],
    transition: { duration: 1.3, repeat: Infinity, ease: 'easeInOut' },
  },
  executing: {
    rotate: [0, 720],
    scale: [1, 1.12, 1],
    transition: { duration: 2.2, repeat: Infinity, ease: 'linear' },
  },
  researching: {
    rotate: [0, 360],
    scale: [1, 1.06, 1],
    transition: { duration: 3.5, repeat: Infinity, ease: 'linear' },
  },
  memory: {
    rotate: [360, 0],
    scale: [1.12, 0.94, 1.12],
    transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
  },
  offline: {
    scale: 1,
    opacity: 0.1,
  },
  error: {
    scale: [1, 1.04, 1],
    opacity: [0.35, 0.65, 0.35],
    transition: { duration: 0.9, repeat: Infinity },
  },
};

export const innerRingVariants: Variants = {
  idle: {
    rotate: [360, 0],
    scale: 0.9,
    transition: { duration: 12, repeat: Infinity, ease: 'linear' },
  },
  thinking: {
    rotate: [0, 360],
    scale: [0.88, 0.96, 0.88],
    transition: { duration: 3.5, repeat: Infinity, ease: 'linear' },
  },
  executing: {
    rotate: [-360, 360],
    scale: [0.9, 1.02, 0.9],
    transition: { duration: 1.8, repeat: Infinity, ease: 'linear' },
  },
};
