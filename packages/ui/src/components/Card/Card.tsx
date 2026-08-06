import React from 'react';
import { cn } from '../../utils';
import { CardProps } from './Card.types';

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, header, footer, hoverable = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-[#121821] border border-[#1E293B] rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-200',
          hoverable && 'hover:border-[#00D9FF]/30 hover:shadow-[0_0_20px_rgba(0,217,255,0.15)]',
          className
        )}
        {...props}
      >
        {header && (
          <div className="px-5 py-4 border-b border-[#1E293B] font-mono text-xs uppercase tracking-wider text-[#94A3B8]">
            {header}
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-[#1E293B] bg-[#0B0F14]/50 text-xs text-[#64748B]">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
