import React from 'react';
import { StatusBadge, colors } from '@ultron/ui';

export const StatusBar: React.FC = () => {
  return (
    <div
      className="h-8 w-full flex items-center justify-between px-4 text-xs font-mono border-t border-[#1E293B] bg-[#05070A]/90 backdrop-blur-md select-none"
      style={{ borderColor: colors.surface.border }}
    >
      <div className="flex items-center space-x-3">
        <StatusBadge status="online" label="Core Online" />
      </div>
      <div className="text-[10px] tracking-widest text-[#64748B] uppercase">
        System Operational
      </div>
    </div>
  );
};
