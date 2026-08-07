import { colors } from '../../tokens';
import { OrbState, OrbSize } from './Orb.types';

export const orbConfig = {
  interaction: {
    maxTranslation: 10, // Max translation offset in px (refined from 16px)
    maxTilt: 4, // Max 3D tilt angle in deg (refined from 6deg)
    smoothingFactor: 0.06,
  },
  sizes: {
    sm: 'w-16 h-16', // 64px
    md: 'w-36 h-36', // 144px
    lg: 'w-40 h-40', // 160px (Default Welcome Hero)
    xl: 'w-48 h-48', // 192px
  } as Record<OrbSize, string>,
  particleCount: 10,
  ringCount: 2,
  states: {
    idle: {
      primary: colors.accent.primary,
      secondary: colors.accent.secondary,
      shadow: 'rgba(0, 217, 255, 0.45)',
      glowBlur: 'blur-3xl',
      ringOpacity: 0.35,
      haloOpacity: 0.25,
      hasParticles: false,
    },
    wake: {
      primary: '#00F0FF',
      secondary: '#38BDF8',
      shadow: 'rgba(0, 240, 255, 0.8)',
      glowBlur: 'blur-3xl',
      ringOpacity: 0.85,
      haloOpacity: 0.6,
      hasParticles: false,
    },
    thinking: {
      primary: colors.accent.secondary,
      secondary: colors.accent.primary,
      shadow: 'rgba(122, 92, 255, 0.65)',
      glowBlur: 'blur-3xl',
      ringOpacity: 0.75,
      haloOpacity: 0.5,
      hasParticles: false,
    },
    listening: {
      primary: '#10B981',
      secondary: colors.accent.primary,
      shadow: 'rgba(16, 185, 129, 0.55)',
      glowBlur: 'blur-3xl',
      ringOpacity: 0.55,
      haloOpacity: 0.4,
      hasParticles: false,
    },
    speaking: {
      primary: '#38BDF8',
      secondary: colors.accent.primary,
      shadow: 'rgba(56, 189, 248, 0.65)',
      glowBlur: 'blur-3xl',
      ringOpacity: 0.65,
      haloOpacity: 0.45,
      hasParticles: false,
    },
    executing: {
      primary: '#00E5FF',
      secondary: '#A855F7',
      shadow: 'rgba(0, 229, 255, 0.75)',
      glowBlur: 'blur-3xl',
      ringOpacity: 0.9,
      haloOpacity: 0.7,
      hasParticles: false,
    },
    researching: {
      primary: '#8B5CF6',
      secondary: colors.accent.primary,
      shadow: 'rgba(139, 92, 246, 0.65)',
      glowBlur: 'blur-3xl',
      ringOpacity: 0.75,
      haloOpacity: 0.5,
      hasParticles: true,
    },
    memory: {
      primary: colors.accent.primary,
      secondary: colors.accent.secondary,
      shadow: 'rgba(122, 92, 255, 0.65)',
      glowBlur: 'blur-3xl',
      ringOpacity: 0.65,
      haloOpacity: 0.5,
      hasParticles: true,
    },
    offline: {
      primary: colors.text.muted,
      secondary: '#334155',
      shadow: 'rgba(100, 116, 139, 0.15)',
      glowBlur: 'blur-xl',
      ringOpacity: 0.15,
      haloOpacity: 0.1,
      hasParticles: false,
    },
    error: {
      primary: colors.status.error,
      secondary: '#991B1B',
      shadow: 'rgba(239, 68, 68, 0.65)',
      glowBlur: 'blur-3xl',
      ringOpacity: 0.65,
      haloOpacity: 0.4,
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
      haloOpacity: number;
      hasParticles: boolean;
    }
  >,
} as const;
