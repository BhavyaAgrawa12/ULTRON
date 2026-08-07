import React from 'react';
import { motion } from 'framer-motion';
import { orbConfig } from './orb.config';
import { OrbState } from './Orb.types';

interface OrbParticlesProps {
  state: OrbState;
}

export const OrbParticles: React.FC<OrbParticlesProps> = React.memo(({ state }) => {
  const count = orbConfig.states[state]?.particleCount || 0;

  // Unmount particle layer when count is 0 to preserve 60 FPS performance
  if (count <= 0) {
    return null;
  }

  const particleArray = Array.from({ length: count });

  return (
    <div className="absolute -inset-8 pointer-events-none overflow-visible z-10">
      {particleArray.map((_, i) => {
        const angle = (i / count) * 360;
        const radius = 85;
        const isMemory = state === 'memory';

        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
            style={{
              backgroundColor: isMemory ? '#7A5CFF' : '#00D9FF',
              boxShadow: `0 0 10px ${isMemory ? '#7A5CFF' : '#00D9FF'}`,
            }}
            animate={
              isMemory
                ? {
                    x: [
                      Math.cos((angle * Math.PI) / 180) * radius,
                      Math.cos((angle * Math.PI) / 180) * 12,
                      Math.cos((angle * Math.PI) / 180) * radius,
                    ],
                    y: [
                      Math.sin((angle * Math.PI) / 180) * radius,
                      Math.sin((angle * Math.PI) / 180) * 12,
                      Math.sin((angle * Math.PI) / 180) * radius,
                    ],
                    opacity: [0.25, 0.95, 0.25],
                  }
                : {
                    rotate: [0, 360],
                    x: [
                      Math.cos((angle * Math.PI) / 180) * radius,
                      Math.cos(((angle + 180) * Math.PI) / 180) * radius,
                    ],
                    y: [
                      Math.sin((angle * Math.PI) / 180) * radius,
                      Math.sin(((angle + 180) * Math.PI) / 180) * radius,
                    ],
                    opacity: [0.35, 0.9, 0.35],
                  }
            }
            transition={{
              duration: isMemory ? 2.6 : 3.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.12,
            }}
          />
        );
      })}
    </div>
  );
});

OrbParticles.displayName = 'OrbParticles';
