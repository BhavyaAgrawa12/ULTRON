import React from 'react';
import { cn } from '../../utils';
import { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#00D9FF] text-[#05070A] font-semibold hover:bg-[#38BDF8] active:bg-[#0284C7] shadow-[0_0_15px_rgba(0,217,255,0.3)] border border-[#00D9FF]/40',
  secondary:
    'bg-[#121821] text-[#F8FAFC] font-medium hover:bg-[#1A2330] active:bg-[#222E3F] border border-[#1E293B]',
  danger:
    'bg-[#EF4444] text-white font-semibold hover:bg-[#DC2626] active:bg-[#B91C1C] shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-[#EF4444]/40',
  ghost:
    'bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#121821] active:bg-[#1A2330]',
  outline:
    'bg-transparent text-[#00D9FF] border border-[#00D9FF]/50 hover:bg-[#00D9FF]/10 active:bg-[#00D9FF]/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00D9FF]/50 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
