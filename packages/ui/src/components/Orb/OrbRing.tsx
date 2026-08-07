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
      {/* Outer SVG Energy Ring (Clockwise 28s) with strictly 2 Satellite Nodes */}
      <motion.div
        className="absolute -inset-6 pointer-events-none z-30"
        variants={outerRingVariants}
        animate={state}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
          style={{ opacity: currentConfig.ringOpacity }}
        >
          <defs>
            <linearGradient id="heliosOuterRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={currentConfig.primary} stopOpacity="0.9" />
              <stop offset="50%" stopColor={currentConfig.secondary} stopOpacity="0.4" />
              <stop offset="100%" stopColor={currentConfig.primary} stopOpacity="0.1" />
            </linearGradient>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Main Vector Ring Path */}
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="url(#heliosOuterRingGrad)"
            strokeWidth="1.5"
            strokeDasharray="18 8 40 12"
          />

          {/* Outer Satellite Node 1 */}
          <circle
            cx="100"
            cy="8"
            r="3.5"
            fill="#FFFFFF"
            filter="url(#nodeGlow)"
          />

          {/* Outer Satellite Node 2 */}
          <circle
            cx="100"
            cy="192"
            r="2.5"
            fill={currentConfig.primary}
            filter="url(#nodeGlow)"
          />
        </svg>
      </motion.div>

      {/* Inner SVG Energy Ring (Counter-Clockwise 22s) with strictly 1 Satellite Node */}
      <motion.div
        className="absolute -inset-3 pointer-events-none z-30"
        variants={innerRingVariants}
        animate={state}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
          style={{ opacity: currentConfig.ringOpacity * 0.75 }}
        >
          <defs>
            <linearGradient id="heliosInnerRingGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={currentConfig.secondary} stopOpacity="0.8" />
              <stop offset="100%" stopColor={currentConfig.primary} stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Inner Counter Vector Ring Path */}
          <circle
            cx="100"
            cy="100"
            r="86"
            fill="none"
            stroke="url(#heliosInnerRingGrad)"
            strokeWidth="1.2"
            strokeDasharray="6 6 30 10"
          />

          {/* Inner Satellite Node 3 (Strictly 3 nodes total across Orb) */}
          <circle
            cx="186"
            cy="100"
            r="2.5"
            fill="#FFFFFF"
            filter="url(#nodeGlow)"
          />
        </svg>
      </motion.div>
    </>
  );
});

OrbRing.displayName = 'OrbRing';
