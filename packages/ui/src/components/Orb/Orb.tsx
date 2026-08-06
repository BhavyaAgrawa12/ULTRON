import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '../../utils';
import { OrbProps, OrbState, OrbSize } from './Orb.types';
import { colors } from '../../tokens';

const sizeMap: Record<OrbSize, string> = {
  sm: 'w-12 h-12',
  md: 'w-24 h-24',
  lg: 'w-36 h-36',
  xl: 'w-48 h-48',
};

const stateColors: Record<OrbState, { primary: string; secondary: string; shadow: string }> = {
  idle: {
    primary: colors.accent.primary,
    secondary: colors.accent.secondary,
    shadow: 'rgba(0, 217, 255, 0.4)',
  },
  thinking: {
    primary: colors.accent.secondary,
    secondary: colors.accent.primary,
    shadow: 'rgba(122, 92, 255, 0.5)',
  },
  speaking: {
    primary: '#38BDF8',
    secondary: colors.accent.primary,
    shadow: 'rgba(56, 189, 248, 0.5)',
  },
  executing: {
    primary: '#00E5FF',
    secondary: '#A855F7',
    shadow: 'rgba(0, 229, 255, 0.6)',
  },
  listening: {
    primary: '#10B981',
    secondary: colors.accent.primary,
    shadow: 'rgba(16, 185, 129, 0.4)',
  },
  offline: {
    primary: colors.text.muted,
    secondary: '#334155',
    shadow: 'rgba(100, 116, 139, 0.2)',
  },
  error: {
    primary: colors.status.error,
    secondary: '#991B1B',
    shadow: 'rgba(239, 68, 68, 0.5)',
  },
};

const pulseVariants: Variants = {
  idle: {
    scale: [1, 1.05, 1],
    opacity: [0.85, 1, 0.85],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  thinking: {
    scale: [0.98, 1.06, 0.98],
    rotate: [0, 180, 360],
    transition: { duration: 2, repeat: Infinity, ease: 'linear' },
  },
  speaking: {
    scale: [1, 1.12, 0.96, 1.08, 1],
    opacity: [0.9, 1, 0.9, 1, 0.9],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
  executing: {
    scale: [1, 1.08, 1],
    rotate: [0, 360],
    transition: { duration: 0.8, repeat: Infinity, ease: 'linear' },
  },
  listening: {
    scale: [1, 1.15, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
  },
  offline: {
    scale: 1,
    opacity: 0.4,
  },
  error: {
    scale: [1, 1.04, 1],
    opacity: [0.8, 1, 0.8],
    transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const Orb: React.FC<OrbProps> = ({
  state = 'idle',
  size = 'md',
  className,
}) => {
  const currentColors = stateColors[state];

  return (
    <div
      className={cn(
        'relative flex items-center justify-center pointer-events-none select-none',
        sizeMap[size],
        className
      )}
      aria-label={`ULTRON Orb State: ${state}`}
      role="img"
    >
      {/* Outer ambient blur halo */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          backgroundColor: currentColors.primary,
          boxShadow: `0 0 40px ${currentColors.shadow}`,
        }}
        variants={pulseVariants}
        animate={state}
      />

      {/* Core Orb sphere */}
      <motion.div
        className="relative w-full h-full rounded-full border border-white/20 shadow-2xl backdrop-blur-md overflow-hidden"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${currentColors.primary}, ${currentColors.secondary} 70%, #05070A 100%)`,
          boxShadow: `0 0 25px ${currentColors.shadow}, inset 0 0 15px rgba(255, 255, 255, 0.2)`,
        }}
        variants={pulseVariants}
        animate={state}
      >
        {/* Interior energy sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
};
