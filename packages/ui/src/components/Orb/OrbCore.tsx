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
      className="absolute inset-0 w-full h-full rounded-full border border-white/40 shadow-2xl backdrop-blur-md overflow-hidden z-40"
      style={{
        background: `radial-gradient(circle at 35% 30%, ${currentConfig.primary} 0%, ${currentConfig.secondary} 55%, #05070A 100%)`,
        boxShadow: `0 0 55px ${currentConfig.shadow}, inset 0 0 30px rgba(255, 255, 255, 0.45)`,
      }}
      variants={coreVariants}
      animate={state}
    >
      {/* Organic Micro Noise Grain Texture Overlay (3% opacity) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none mix-blend-overlay">
        <filter id="orbNoiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#orbNoiseFilter)" />
      </svg>

      {/* Top-Left Specular Lens Sheen Highlight */}
      <div className="absolute top-2.5 left-3.5 w-14 h-14 rounded-full bg-gradient-to-br from-white/60 via-white/15 to-transparent blur-[1px] pointer-events-none" />

      {/* Interior Radial Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
    </motion.div>
  );
});

OrbCore.displayName = 'OrbCore';
