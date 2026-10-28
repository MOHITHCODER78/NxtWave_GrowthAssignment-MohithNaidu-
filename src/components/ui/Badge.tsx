import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'cyan' | 'purple' | 'amber' | 'zinc' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'zinc',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-medium rounded-full border transition-colors select-none';

  const variants = {
    emerald:
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    cyan:
      'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
    purple:
      'bg-purple-500/10 text-purple-400 border-purple-500/25',
    amber:
      'bg-amber-500/10 text-amber-400 border-amber-500/25',
    zinc:
      'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
    outline:
      'bg-transparent text-zinc-400 border-zinc-700/60',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 tracking-wide',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const dotColors = {
    emerald: 'bg-emerald-400',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    amber: 'bg-amber-400',
    zinc: 'bg-zinc-400',
    outline: 'bg-zinc-400',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
