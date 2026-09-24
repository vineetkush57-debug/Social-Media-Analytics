import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, change, isPositive = true, subtitle, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${colorMap[color] || colorMap.indigo}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-3 mb-2">
        <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
