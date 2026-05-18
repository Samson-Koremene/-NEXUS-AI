import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from './Button';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-white/10 bg-[#0f1012] px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
