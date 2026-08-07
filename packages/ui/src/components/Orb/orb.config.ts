import { colors } from '../../tokens';
import { OrbState, OrbSize } from './Orb.types';

export const orbConfig = {
  interaction: {
    maxTranslation: 16, // Max translation offset in px
    maxTilt: 6, // Max 3D tilt angle in deg
    smoothingFactor: 0.08,
  },
  sizes: {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  } as Record<OrbSize, string>,
  particleCount: 8,
  ringCount: 2,
  states: {
    idle: {
      primary: colors.accent.primary,
      secondary: colors.accent.secondary,
      shadow: 'rgba(0, 217, 255, 0.4)',
      glowBlur: 'blur-xl',
      ringOpacity: 0.3,
      hasParticles: false,
    },
    wake: {
      primary: '#00F0FF',
      secondary: '#38BDF8',
      shadow: 'rgba(0, 240, 255, 0.7)',
      glowBlur: 'blur-2xl',
      ringOpacity: 0.8,
      hasParticles: false,
    },
    thinking: {
      primary: colors.accent.secondary,
      secondary: colors.accent.primary,
      shadow: 'rgba(122, 92, 255, 0.6)',
      glowBlur: 'blur-xl',
      ringOpacity: 0.7,
      hasParticles: false,
    },
    listening: {
      primary: '#10B981',
      secondary: colors.accent.primary,
      shadow: 'rgba(16, 185, 129, 0.5)',
      glowBlur: 'blur-xl',
      ringOpacity: 0.5,
      hasParticles: false,
    },
    speaking: {
      primary: '#38BDF8',
      secondary: colors.accent.primary,
      shadow: 'rgba(56, 189, 248, 0.6)',
      glowBlur: 'blur-2xl',
      ringOpacity: 0.6,
      hasParticles: false,
    },
    executing: {
      primary: '#00E5FF',
      secondary: '#A855F7',
      shadow: 'rgba(0, 229, 255, 0.7)',
      glowBlur: 'blur-2xl',
      ringOpacity: 0.9,
      hasParticles: false,
    },
    researching: {
      primary: '#8B5CF6',
      secondary: colors.accent.primary,
      shadow: 'rgba(139, 92, 246, 0.6)',
      glowBlur: 'blur-xl',
      ringOpacity: 0.7,
      hasParticles: true,
    },
    memory: {
      primary: colors.accent.primary,
      secondary: colors.accent.secondary,
      shadow: 'rgba(122, 92, 255, 0.6)',
      glowBlur: 'blur-xl',
      ringOpacity: 0.6,
      hasParticles: true,
    },
    offline: {
      primary: colors.text.muted,
      secondary: '#334155',
      shadow: 'rgba(100, 116, 139, 0.2)',
      glowBlur: 'blur-md',
      ringOpacity: 0.1,
      hasParticles: false,
    },
    error: {
      primary: colors.status.error,
      secondary: '#991B1B',
      shadow: 'rgba(239, 68, 68, 0.6)',
      glowBlur: 'blur-xl',
      ringOpacity: 0.6,
      hasParticles: false,
    },
  } as Record<
    OrbState,
    {
      primary: string;
      secondary: string;
      shadow: string;
      glowBlur: string;
      ringOpacity: number;
      hasParticles: boolean;
    }
  >,
} as const;
