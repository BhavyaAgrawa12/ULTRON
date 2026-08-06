import React from 'react';
import { cn } from '../../utils';
import { InputProps } from './Input.types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      placeholder = 'Awaiting your objective...',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#64748B] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              'w-full h-11 bg-[#121821] text-[#F8FAFC] placeholder-[#64748B] text-sm rounded-xl px-4 border border-[#1E293B] transition-all duration-200 focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_15px_rgba(239,68,68,0.25)]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#64748B] pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs font-mono text-[#EF4444]">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
