import React from 'react';
import { motion } from 'framer-motion';
import { orbConfig } from './orb.config';
import { coreVariants } from './animations';
import { OrbState } from './Orb.types';

interface OrbCoreProps {
  state: OrbState;
}

export const OrbCore: React.FC<OrbCoreProps> = React.memo(({ state }) => {
  const currentConfig = orbConfig.states[state];

  return (
    <motion.div
      className="relative w-full h-full rounded-full border border-white/20 shadow-2xl backdrop-blur-md overflow-hidden"
      style={{
        background: `radial-gradient(circle at 35% 35%, ${currentConfig.primary}, ${currentConfig.secondary} 70%, #05070A 100%)`,
        boxShadow: `0 0 30px ${currentConfig.shadow}, inset 0 0 15px rgba(255, 255, 255, 0.25)`,
      }}
      variants={coreVariants}
      animate={state}
    >
      {/* Interior light sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
    </motion.div>
  );
});

OrbCore.displayName = 'OrbCore';
