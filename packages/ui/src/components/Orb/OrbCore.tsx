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
      className="absolute inset-0 w-full h-full rounded-full border border-white/35 shadow-2xl backdrop-blur-md overflow-hidden z-40"
      style={{
        background: `radial-gradient(circle at 35% 32%, ${currentConfig.primary} 0%, ${currentConfig.secondary} 60%, #05070A 100%)`,
        boxShadow: `0 0 50px ${currentConfig.shadow}, inset 0 0 25px rgba(255, 255, 255, 0.4)`,
      }}
      variants={coreVariants}
      animate={state}
    >
      {/* Top-Left Specular Lens Highlight */}
      <div className="absolute top-2 left-3 w-12 h-12 rounded-full bg-gradient-to-br from-white/50 via-white/15 to-transparent blur-[1px] pointer-events-none" />

      {/* Interior Radial Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
    </motion.div>
  );
});

OrbCore.displayName = 'OrbCore';
