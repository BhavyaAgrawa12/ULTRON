import React from 'react';
import { Cpu, Minus, Square, X } from 'lucide-react';
import { colors } from '@ultron/ui';

export const TitleBar: React.FC = () => {
  return (
    <div
      className="h-12 w-full flex items-center justify-between px-4 select-none font-mono border-b border-[#1E293B] bg-[#05070A]/90 backdrop-blur-md"
      style={{ borderColor: colors.surface.border }}
    >
      {/* Brand & Logo */}
      <div className="flex items-center space-x-2.5">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
          <Cpu className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold tracking-widest text-[#F8FAFC]">
          ULTRON
        </span>
      </div>

      {/* Application Name Center */}
      <div className="text-[11px] tracking-widest uppercase text-[#64748B]">
        ULTRON — AI Operating Companion Platform
      </div>

      {/* Window Controls Placeholder */}
      <div className="flex items-center space-x-3 text-[#64748B]">
        <div className="p-1 rounded hover:bg-[#121821] hover:text-[#F8FAFC] transition-colors">
          <Minus className="w-3.5 h-3.5" />
        </div>
        <div className="p-1 rounded hover:bg-[#121821] hover:text-[#F8FAFC] transition-colors">
          <Square className="w-3 h-3" />
        </div>
        <div className="p-1 rounded hover:bg-[#EF4444]/20 hover:text-[#EF4444] transition-colors">
          <X className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
