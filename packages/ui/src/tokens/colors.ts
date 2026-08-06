export const colors = {
  background: {
    primary: '#05070A',
    secondary: '#0B0F14',
  },
  surface: {
    default: '#121821',
    hover: '#1A2330',
    active: '#222E3F',
    border: '#1E293B',
  },
  accent: {
    primary: '#00D9FF',
    secondary: '#7A5CFF',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#64748B',
  },
} as const;

export type ColorsToken = typeof colors;
