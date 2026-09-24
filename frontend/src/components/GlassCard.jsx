import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const GlassCard = ({ children, className = '', hover = true, glow = false }) => {
  return (
    <div
      className={twMerge(
        'glass-panel rounded-xl p-5 border border-white/[0.08] relative overflow-hidden transition-all duration-300',
        hover && 'glass-panel-hover',
        glow && 'glow-indigo',
        className
      )}
    >
      {/* Background ambient light */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      {children}
    </div>
  );
};
