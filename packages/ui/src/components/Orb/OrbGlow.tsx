import React from 'react';
import { motion } from 'framer-motion';
import { orbConfig } from './orb.config';
import { OrbState } from './Orb.types';

interface OrbGlowProps {
  state: OrbState;
}

export const OrbGlow: React.FC<OrbGlowProps> = React.memo(({ state }) => {
  const currentConfig = orbConfig.states[state];

  return (
    <motion.div
      className={`absolute -inset-10 rounded-full ${orbConfig.bloom.blurClass} transition-colors duration-700 pointer-events-none z-0`}
      style={{
        backgroundColor: currentConfig.primary,
        boxShadow: `0 0 ${orbConfig.bloom.blurPx}px ${currentConfig.shadow}`,
      }}
      animate={{
        scale: state === 'wake' ? [1, 1.35, 1.1] : state === 'executing' ? [1, 1.15, 1] : [1, 1.06, 1],
        opacity: state === 'offline' ? 0.15 : 0.85,
      }}
      transition={{
        duration: state === 'executing' ? 1.2 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

OrbGlow.displayName = 'OrbGlow';
