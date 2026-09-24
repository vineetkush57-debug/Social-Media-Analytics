import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { fetchPropagation } from '../services/api';
import { GitBranch, Radio, Zap, Users, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const PropagationPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropagation('AI Autonomous Agents')
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-xs text-slate-400 animate-pulse">Tracing Information Cascade...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
            <GitBranch className="w-3.5 h-3.5" />
            <span>SIH 2026 SIGNATURE FEATURE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            HOW INFORMATION MOVES
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-stage information cascade tracing, viral origin attribution, and network propagation flow analysis.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">TOTAL CASCADE REACH</span>
            <span className="font-extrabold text-emerald-400 font-mono text-base">
              {data?.total_cascade_reach?.toLocaleString()} Users
            </span>
          </div>
        </div>
      </div>

      {/* Origin Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
          <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">ORIGIN USER</span>
          <div className="text-lg font-bold text-white mt-1 font-mono">{data?.origin_user}</div>
          <span className="text-xs text-slate-400">Platform: {data?.origin_platform}</span>
        </GlassCard>

        <GlassCard>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">FIRST DETECTED</span>
          <div className="text-lg font-bold text-white mt-1 font-mono">{data?.first_detected}</div>
          <span className="text-xs text-slate-400">Early Baseline</span>
        </GlassCard>

        <GlassCard>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">MAJOR AMPLIFIER</span>
          <div className="text-lg font-bold text-white mt-1 font-mono">{data?.major_amplifier}</div>
          <span className="text-xs text-slate-400">Primary Viral Catalyst</span>
        </GlassCard>

        <GlassCard>
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">COMMUNITIES REACHED</span>
          <div className="text-lg font-bold text-white mt-1 font-mono">{data?.communities_reached} Clusters</div>
          <span className="text-xs text-slate-400">Cross-Platform Spread</span>
        </GlassCard>
      </div>

      {/* Multi-Stage Visual Cascade Flow */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">VIRAL CASCADE TRANSMISSION STAGES</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {data?.cascade_steps?.map((step, idx) => (
            <GlassCard key={idx} className="relative flex flex-col justify-between border-t-4 border-t-indigo-500">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase">{step.stage}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{step.timestamp}</span>
                </div>

                <div className="text-sm font-bold text-white mb-1 font-mono">{step.actor}</div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-300 mb-2">
                  {step.platform}
                </span>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">{step.description}</p>
              </div>

              <div className="border-t border-white/[0.08] pt-2 flex justify-between text-[11px]">
                <span className="text-slate-500">Reach: <strong className="text-emerald-400 font-mono">+{step.reach.toLocaleString()}</strong></span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Information Velocity Curve */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">VIRAL TRANSMISSION VELOCITY & REACH CURVE</h3>
          <Zap className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.timeline_series || []}>
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="mentions" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
              <Area type="monotone" dataKey="velocity" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
