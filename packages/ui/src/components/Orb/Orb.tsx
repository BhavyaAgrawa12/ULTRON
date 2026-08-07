import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../../utils';
import { orbConfig } from './orb.config';
import { createOrbEngine } from './OrbEngine';
import { OrbProps, OrbState } from './Orb.types';
import { OrbGlow } from './OrbGlow';
import { OrbCore } from './OrbCore';
import { OrbRing } from './OrbRing';
import { OrbParticles } from './OrbParticles';

export const Orb: React.FC<OrbProps> = ({
  engine: externalEngine,
  state: propState,
  size = 'md',
  className,
}) => {
  // Create or reuse pure TS OrbEngine
  const engine = useMemo(() => {
    return externalEngine || createOrbEngine(propState || 'idle');
  }, [externalEngine]);

  const [currentState, setCurrentState] = useState<OrbState>(
    propState || engine.getState()
  );

  // Sync external prop state changes into engine
  useEffect(() => {
    if (propState && propState !== engine.getState()) {
      engine.transition(propState);
    }
  }, [propState, engine]);

  // Subscribe to engine state changes
  useEffect(() => {
    const unsubscribe = engine.subscribe((options) => {
      setCurrentState(options.state);
    });
    return () => {
      unsubscribe();
      if (!externalEngine) {
        engine.destroy();
      }
    };
  }, [engine, externalEngine]);

  // Check prefers-reduced-motion accessibility preference
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Motion values for smooth mouse parallax & 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const translateX = useSpring(mouseX, springConfig);
  const translateY = useSpring(mouseY, springConfig);

  const rotateX = useSpring(
    useMotionValue(0),
    springConfig
  );
  const rotateY = useSpring(
    useMotionValue(0),
    springConfig
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized mouse offset (-1 to 1)
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;

      // Apply max 16px translation limit & max 6deg tilt limit
      const targetX = normX * orbConfig.interaction.maxTranslation;
      const targetY = normY * orbConfig.interaction.maxTranslation;
      const targetTiltY = normX * orbConfig.interaction.maxTilt;
      const targetTiltX = -normY * orbConfig.interaction.maxTilt;

      mouseX.set(targetX);
      mouseY.set(targetY);
      rotateY.set(targetTiltY);
      rotateX.set(targetTiltX);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion, mouseX, mouseY, rotateX, rotateY]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative flex items-center justify-center pointer-events-none select-none perspective-1000',
        orbConfig.sizes[size],
        className
      )}
      style={
        reducedMotion
          ? {}
          : {
              x: translateX,
              y: translateY,
              rotateX,
              rotateY,
            }
      }
      aria-label={`ULTRON Orb State: ${currentState}`}
      role="img"
    >
      {/* Outer ambient glow */}
      <OrbGlow state={currentState} />

      {/* Orbiting particles (Renders only for researching & memory) */}
      <OrbParticles state={currentState} />

      {/* Outer energy ring */}
      <OrbRing state={currentState} />

      {/* Center sphere core */}
      <OrbCore state={currentState} />
    </motion.div>
  );
};

Orb.displayName = 'Orb';
