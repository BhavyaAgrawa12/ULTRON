import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../../utils';
import { orbConfig } from './orb.config';
import { createOrbEngine } from './OrbEngine';
import { OrbProps, OrbState } from './Orb.types';
import { OrbGlow } from './OrbGlow';
import { OrbCore } from './OrbCore';
import { OrbRing } from './OrbRing';
import { OrbHalo } from './OrbHalo';
import { OrbParticles } from './OrbParticles';

export const Orb: React.FC<OrbProps> = ({
  engine: externalEngine,
  state: propState,
  size = 'lg', // Default size upgraded to lg (160px) for Project HELIOS V2
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

  // Accessibility check for prefers-reduced-motion
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

  const springConfig = { damping: 25, stiffness: 120 };
  const translateX = useSpring(mouseX, springConfig);
  const translateY = useSpring(mouseY, springConfig);

  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;

      // Restrict strictly to 10px max translation & 4deg max 3D tilt per HELIOS V2 specs
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
      {/* 1. Ambient Background Aura Glow */}
      <OrbGlow state={currentState} />

      {/* 2. Selective Orbiting Particles (researching & memory only) */}
      <OrbParticles state={currentState} />

      {/* 3. Radial Energy Halo Ring */}
      <OrbHalo state={currentState} />

      {/* 4. Dual Counter-Rotating Energy Rings */}
      <OrbRing state={currentState} />

      {/* 5. Center Sphere Core with Specular Lens Highlight */}
      <OrbCore state={currentState} />
    </motion.div>
  );
};

Orb.displayName = 'Orb';
