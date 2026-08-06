import React from 'react';
import { cn } from '../../utils';
import { StatusBadgeProps, StatusVariant } from './StatusBadge.types';

const statusStyles: Record<
  StatusVariant,
  { dot: string; text: string; bg: string; defaultLabel: string; animatePulse: boolean }
> = {
  online: {
    dot: 'bg-[#22C55E] shadow-[0_0_8px_#22C55E]',
    text: 'text-[#22C55E]',
    bg: 'bg-[#22C55E]/10 border-[#22C55E]/30',
    defaultLabel: 'ULTRON Core Online',
    animatePulse: true,
  },
  offline: {
    dot: 'bg-[#EF4444]',
    text: 'text-[#EF4444]',
    bg: 'bg-[#EF4444]/10 border-[#EF4444]/30',
    defaultLabel: 'ULTRON Core Offline',
    animatePulse: false,
  },
  working: {
    dot: 'bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]',
    text: 'text-[#00D9FF]',
    bg: 'bg-[#00D9FF]/10 border-[#00D9FF]/30',
    defaultLabel: 'System Executing',
    animatePulse: true,
  },
  warning: {
    dot: 'bg-[#F59E0B]',
    text: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/30',
    defaultLabel: 'Warning Threshold',
    animatePulse: false,
  },
  error: {
    dot: 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]',
    text: 'text-[#EF4444]',
    bg: 'bg-[#EF4444]/10 border-[#EF4444]/30',
    defaultLabel: 'System Exception',
    animatePulse: true,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className,
}) => {
  const current = statusStyles[status];
  const displayLabel = label || current.defaultLabel;

  return (
    <div
      className={cn(
        'inline-flex items-center space-x-2 px-3 py-1 rounded-full border backdrop-blur-sm text-xs font-medium tracking-wide select-none',
        current.bg,
        current.text,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {current.animatePulse && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              current.dot
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', current.dot)} />
      </span>
      <span>● {displayLabel}</span>
    </div>
  );
};
