import React from 'react';
import { cn } from '../../utils';
import { LayoutContainerProps } from './LayoutContainer.types';

export const LayoutContainer: React.FC<LayoutContainerProps> = ({
  children,
  headerSlot,
  footerSlot,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative min-h-screen w-full bg-[#05070A] text-[#F8FAFC] flex flex-col overflow-hidden selection:bg-[#00D9FF] selection:text-[#05070A]',
        className
      )}
      {...props}
    >
      {/* Background dark grid ambient styling */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {headerSlot && (
        <header className="relative z-10 w-full border-b border-[#1E293B] bg-[#05070A]/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
          {headerSlot}
        </header>
      )}

      <main className="relative z-10 flex-1 w-full flex flex-col overflow-auto">
        {children}
      </main>

      {footerSlot && (
        <footer className="relative z-10 w-full border-t border-[#1E293B] bg-[#05070A]/80 backdrop-blur-md px-6 py-2.5 flex items-center justify-between text-xs text-[#64748B] font-mono">
          {footerSlot}
        </footer>
      )}
    </div>
  );
};
