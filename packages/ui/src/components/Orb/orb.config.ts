import { colors } from '../../tokens';
import { OrbState, OrbSize } from './Orb.types';

export const orbConfig = {
  interaction: {
    maxTranslation: 10, // Max translation offset in px
    maxTilt: 4, // Max 3D tilt angle in deg
    smoothingFactor: 0.06,
  },
  // Responsive pixel sizes: 64px sm, 96px md, 160px lg (default hero), 220px xl
  pixelSizes: {
    sm: 64,
    md: 96,
    lg: 160,
    xl: 220,
  } as Record<OrbSize, number>,
  particleCaps: {
    researching: 10, // 8-12 particles cap
    memory: 7, // 6-8 particles cap
  } as Record<string, number>,
  bloom: {
    blurClass: 'blur-3xl',
    spreadPx: 45,
    blurPx: 80,
  },
  // Light Temperature Palette per HELIOS V3 Freeze Specs
  states: {
    idle: {
      primary: colors.accent.primary, // Cool Cyan (#00D9FF)
      secondary: colors.accent.secondary,
      shadow: 'rgba(0, 217, 255, 0.45)',
      ringOpacity: 0.3,
      haloOpacity: 0.25,
      particleCount: 0,
    },
    wake: {
      primary: '#00F0FF', // Bright Cyan
      secondary: '#38BDF8',
      shadow: 'rgba(0, 240, 255, 0.8)',
      ringOpacity: 0.85,
      haloOpacity: 0.6,
      particleCount: 0,
    },
    thinking: {
      primary: '#7A5CFF', // Cyan -> Violet Transition (#7A5CFF)
      secondary: colors.accent.primary,
      shadow: 'rgba(122, 92, 255, 0.65)',
      ringOpacity: 0.75,
      haloOpacity: 0.5,
      particleCount: 0,
    },
    listening: {
      primary: '#10B981', // Emerald
      secondary: colors.accent.primary,
      shadow: 'rgba(16, 185, 129, 0.55)',
      ringOpacity: 0.55,
      haloOpacity: 0.4,
      particleCount: 0,
    },
    speaking: {
      primary: '#38BDF8', // Sky Blue
      secondary: colors.accent.primary,
      shadow: 'rgba(56, 189, 248, 0.65)',
      ringOpacity: 0.65,
      haloOpacity: 0.45,
      particleCount: 0,
    },
    executing: {
      primary: '#00E5FF', // Crisp Brighter Cyan (#00E5FF)
      secondary: '#A855F7',
      shadow: 'rgba(0, 229, 255, 0.75)',
      ringOpacity: 0.9,
      haloOpacity: 0.7,
      particleCount: 0,
    },
    researching: {
      primary: '#8B5CF6', // Violet
      secondary: colors.accent.primary,
      shadow: 'rgba(139, 92, 246, 0.65)',
      ringOpacity: 0.75,
      haloOpacity: 0.5,
      particleCount: 10,
    },
    memory: {
      primary: '#7A5CFF', // Violet Dominant
      secondary: colors.accent.primary,
      shadow: 'rgba(122, 92, 255, 0.65)',
      ringOpacity: 0.65,
      haloOpacity: 0.5,
      particleCount: 7,
    },
    offline: {
      primary: '#64748B', // Neutral Grey (#64748B)
      secondary: '#334155',
      shadow: 'rgba(100, 116, 139, 0.15)',
      ringOpacity: 0.15,
      haloOpacity: 0.1,
      particleCount: 0,
    },
    error: {
      primary: '#EF4444', // Warm Red (#EF4444)
      secondary: '#991B1B',
      shadow: 'rgba(239, 68, 68, 0.65)',
      ringOpacity: 0.65,
      haloOpacity: 0.4,
      particleCount: 0,
    },
  } as Record<
    OrbState,
    {
      primary: string;
      secondary: string;
      shadow: string;
      ringOpacity: number;
      haloOpacity: number;
      particleCount: number;
    }
  >,
} as const;
