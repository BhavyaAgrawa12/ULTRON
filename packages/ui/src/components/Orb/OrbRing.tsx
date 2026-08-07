import React from 'react';
import { motion } from 'framer-motion';
import { orbConfig } from './orb.config';
import { ringVariants } from './animations';
import { OrbState } from './Orb.types';

interface OrbRingProps {
  state: OrbState;
}

export const OrbRing: React.FC<OrbRingProps> = React.memo(({ state }) => {
  const currentConfig = orbConfig.states[state];

  return (
    <motion.div
      className="absolute -inset-2 rounded-full border border-white/20 pointer-events-none"
      style={{
        borderColor: currentConfig.primary,
        opacity: currentConfig.ringOpacity,
        boxShadow: `0 0 15px ${currentConfig.shadow}`,
      }}
      variants={ringVariants}
      animate={state}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/80 shadow-[0_0_8px_#ffffff]" />
    </motion.div>
  );
});

OrbRing.displayName = 'OrbRing';
