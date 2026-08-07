import React from 'react';
import { motion } from 'framer-motion';
import { orbConfig } from './orb.config';
import { outerRingVariants, innerRingVariants } from './animations';
import { OrbState } from './Orb.types';

interface OrbRingProps {
  state: OrbState;
}

export const OrbRing: React.FC<OrbRingProps> = React.memo(({ state }) => {
  const currentConfig = orbConfig.states[state];

  return (
    <>
      {/* Outer Energy Ring */}
      <motion.div
        className="absolute -inset-3 rounded-full border border-white/25 pointer-events-none"
        style={{
          borderColor: currentConfig.primary,
          opacity: currentConfig.ringOpacity,
          boxShadow: `0 0 20px ${currentConfig.shadow}`,
        }}
        variants={outerRingVariants}
        animate={state}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_10px_#ffffff]" />
      </motion.div>

      {/* Secondary Counter-Rotating Ring */}
      <motion.div
        className="absolute -inset-1.5 rounded-full border border-dashed border-white/15 pointer-events-none"
        style={{
          borderColor: currentConfig.secondary,
          opacity: currentConfig.ringOpacity * 0.7,
        }}
        variants={innerRingVariants}
        animate={state}
      />
    </>
  );
});

OrbRing.displayName = 'OrbRing';
