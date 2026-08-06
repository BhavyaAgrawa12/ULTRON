import React from 'react';
import { cn } from '../../utils';
import { SidebarShellProps } from './SidebarShell.types';

export const SidebarShell: React.FC<SidebarShellProps> = ({
  children,
  headerSlot,
  footerSlot,
  isCollapsed = false,
  className,
  ...props
}) => {
  return (
    <aside
      className={cn(
        'h-full bg-[#0B0F14] border-r border-[#1E293B] flex flex-col transition-all duration-300 select-none overflow-hidden',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
      {...props}
    >
      {headerSlot && (
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between font-mono text-xs text-[#94A3B8]">
          {headerSlot}
        </div>
      )}

      <div className="flex-1 p-3 overflow-y-auto space-y-1">
        {children}
      </div>

      {footerSlot && (
        <div className="p-3 border-t border-[#1E293B] bg-[#05070A]/40 text-xs text-[#64748B]">
          {footerSlot}
        </div>
      )}
    </aside>
  );
};
