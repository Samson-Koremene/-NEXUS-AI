
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-40 active:scale-95';
  const variants = {
    primary: 'bg-white text-[#0f1012] hover:bg-zinc-200 focus-visible:ring-white/20',
    secondary: 'bg-white/5 border border-white/10 hover:bg-white/10 text-white focus-visible:ring-white/20 shadow-sm shadow-black/10',
    ghost: 'bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5 focus-visible:ring-white/10',
    danger: 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 focus-visible:ring-rose-500/20',
  };
  const sizes = {
    sm: 'h-8 px-2.5 text-[11px]',
    md: 'h-9 px-3.5 py-1.5 text-xs',
    lg: 'h-11 px-6 text-sm',
    icon: 'h-9 w-9',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
