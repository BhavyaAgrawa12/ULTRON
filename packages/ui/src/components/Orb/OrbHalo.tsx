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
      className="absolute -inset-10 pointer-events-none z-20"
      animate={{
        rotate: state === 'executing' ? [0, -360] : [0, 360],
        scale: state === 'speaking' ? [1, 1.12, 1] : [1, 1.03, 1],
      }}
      transition={{
        rotate: { duration: state === 'executing' ? 12 : 35, repeat: Infinity, ease: 'linear' },
        scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible"
        style={{ opacity: currentConfig.haloOpacity }}
      >
        <circle
          cx="100"
          cy="100"
          r="98"
          fill="none"
          stroke={currentConfig.primary}
          strokeWidth="1"
          strokeDasharray="4 12"
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );
});

OrbHalo.displayName = 'OrbHalo';
