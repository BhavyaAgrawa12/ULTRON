import React from 'react';
import { motion } from 'framer-motion';
import { orbConfig } from './orb.config';
import { OrbState } from './Orb.types';

interface OrbHaloProps {
  state: OrbState;
}

export const OrbHalo: React.FC<OrbHaloProps> = React.memo(({ state }) => {
  const currentConfig = orbConfig.states[state];

  return (
    <motion.div
      className="absolute -inset-6 rounded-full border border-dashed pointer-events-none"
      style={{
        borderColor: currentConfig.primary,
        opacity: currentConfig.haloOpacity,
        boxShadow: `inset 0 0 25px ${currentConfig.shadow}, 0 0 20px ${currentConfig.shadow}`,
      }}
      animate={{
        rotate: state === 'executing' ? [0, -360] : [0, 360],
        scale: state === 'speaking' ? [1, 1.15, 1] : [1, 1.04, 1],
      }}
      transition={{
        rotate: { duration: state === 'executing' ? 10 : 25, repeat: Infinity, ease: 'linear' },
        scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      }}
    />
  );
});

OrbHalo.displayName = 'OrbHalo';
