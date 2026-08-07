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
      className={`absolute inset-0 rounded-full ${currentConfig.glowBlur} transition-colors duration-500 pointer-events-none`}
      style={{
        backgroundColor: currentConfig.primary,
        boxShadow: `0 0 50px ${currentConfig.shadow}`,
      }}
      animate={{
        scale: state === 'wake' ? [1, 1.3, 1.1] : state === 'executing' ? [1, 1.1, 1] : [1, 1.05, 1],
        opacity: state === 'offline' ? 0.2 : 0.85,
      }}
      transition={{
        duration: state === 'executing' ? 1 : 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

OrbGlow.displayName = 'OrbGlow';
