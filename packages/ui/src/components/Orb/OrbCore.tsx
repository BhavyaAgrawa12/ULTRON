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
        boxShadow: `0 0 55px ${currentConfig.shadow}, inset 0 0 30px rgba(255, 255, 255, 0.45)`,
      }}
      variants={coreVariants}
      animate={state}
    >
      {/* Thermal Convection Layer A (8s cycle) */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${currentConfig.primary} 0%, ${currentConfig.secondary} 60%, #05070A 100%)`,
        }}
        animate={{
          scale: [1, 1.04, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Thermal Convection Layer B (11s cycle) */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 60% 65%, ${currentConfig.secondary} 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.3, 0.65, 0.3],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Thermal Convection Layer C (14s plasma sheen) */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none mix-blend-soft-light"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`,
        }}
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Central Energy Nucleus ("Eye" Visual Anchor Focal Point) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none z-50"
        style={{
          background: 'radial-gradient(circle, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 40%, transparent 100%)',
          boxShadow: `0 0 15px #FFFFFF, 0 0 30px ${currentConfig.primary}`,
        }}
      />

      {/* Organic Micro Noise Grain Texture (Locked strictly at 1% opacity) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.01] pointer-events-none mix-blend-overlay z-45">
        <filter id="orbNoiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#orbNoiseFilter)" />
      </svg>

      {/* Top-Left Specular Lens Sheen Highlight */}
      <div className="absolute top-2.5 left-3.5 w-14 h-14 rounded-full bg-gradient-to-br from-white/60 via-white/15 to-transparent blur-[1px] pointer-events-none z-45" />
    </motion.div>
  );
});

OrbCore.displayName = 'OrbCore';
