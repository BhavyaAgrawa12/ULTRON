import React from 'react';
import { motion } from 'framer-motion';
import { orbConfig } from './orb.config';
import { OrbState } from './Orb.types';

interface OrbParticlesProps {
  state: OrbState;
}

export const OrbParticles: React.FC<OrbParticlesProps> = React.memo(({ state }) => {
  // Only render particles for researching or memory states to preserve 60 FPS
  if (state !== 'researching' && state !== 'memory') {
    return null;
  }

  const particleArray = Array.from({ length: orbConfig.particleCount });

  return (
    <div className="absolute -inset-4 pointer-events-none overflow-visible">
      {particleArray.map((_, i) => {
        const angle = (i / orbConfig.particleCount) * 360;
        const radius = 60;
        const isMemory = state === 'memory';

        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: isMemory ? '#7A5CFF' : '#00D9FF',
              boxShadow: `0 0 6px ${isMemory ? '#7A5CFF' : '#00D9FF'}`,
            }}
            animate={
              isMemory
                ? {
                    x: [
                      Math.cos((angle * Math.PI) / 180) * radius,
                      Math.cos((angle * Math.PI) / 180) * 10,
                      Math.cos((angle * Math.PI) / 180) * radius,
                    ],
                    y: [
                      Math.sin((angle * Math.PI) / 180) * radius,
                      Math.sin((angle * Math.PI) / 180) * 10,
                      Math.sin((angle * Math.PI) / 180) * radius,
                    ],
                    opacity: [0.3, 0.9, 0.3],
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
                    opacity: [0.4, 0.8, 0.4],
                  }
            }
            transition={{
              duration: isMemory ? 2.4 : 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          />
        );
      })}
    </div>
  );
});

OrbParticles.displayName = 'OrbParticles';
