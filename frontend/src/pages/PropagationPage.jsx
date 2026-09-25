import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { fetchPropagation } from '../services/api';
import { GitBranch, Radio, Zap, Users, Globe, ArrowRight, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const PropagationPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchPropagation('AI Autonomous Agents')
      .then((res) => setData(res))
      .catch((err) => {
        console.error(err);
        setError("Unable to trace information propagation cascade.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-4 max-w-[1600px] mx-auto">
        <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center space-x-3 animate-pulse">
          <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
          <span className="text-xs font-bold text-indigo-300">Tracing multi-stage information cascade...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>{error}</span>
          </div>
          <button onClick={loadData} className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs text-white">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const cascadeSteps = Array.isArray(data?.cascade_steps) ? data.cascade_steps : [];
  const timelineSeries = Array.isArray(data?.timeline_series) ? data.timeline_series : [];

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
              {Number(data?.total_cascade_reach || 0).toLocaleString()} Users
            </span>
          </div>
        </div>
      </div>

      {/* Origin Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
          <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">ORIGIN USER</span>
          <div className="text-lg font-bold text-white mt-1 font-mono">{data?.origin_user || 'N/A'}</div>
          <span className="text-xs text-slate-400">Platform: {data?.origin_platform || 'N/A'}</span>
        </GlassCard>

        <GlassCard>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">FIRST DETECTED</span>
          <div className="text-lg font-bold text-white mt-1 font-mono">{data?.first_detected || 'N/A'}</div>
          <span className="text-xs text-slate-400">Early Baseline</span>
        </GlassCard>

        <GlassCard>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">MAJOR AMPLIFIER</span>
          <div className="text-lg font-bold text-white mt-1 font-mono">{data?.major_amplifier || 'N/A'}</div>
          <span className="text-xs text-slate-400">Primary Viral Catalyst</span>
        </GlassCard>

        <GlassCard>
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">COMMUNITIES REACHED</span>
          <div className="text-lg font-bold text-white mt-1 font-mono">{data?.communities_reached || 0} Clusters</div>
          <span className="text-xs text-slate-400">Cross-Platform Spread</span>
        </GlassCard>
      </div>

      {/* Multi-Stage Visual Cascade Flow */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">VIRAL CASCADE TRANSMISSION STAGES</h3>

        {cascadeSteps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {cascadeSteps.map((step, idx) => (
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
                  <span className="text-slate-500">Reach: <strong className="text-emerald-400 font-mono">+{Number(step.reach || 0).toLocaleString()}</strong></span>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-xl border border-white/10 text-center text-xs text-slate-400">
            Propagation cascade data unavailable for the selected topic.
          </div>
        )}
      </div>

      {/* Information Velocity Curve */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">VIRAL TRANSMISSION VELOCITY & REACH CURVE</h3>
          <Zap className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="h-72">
          {timelineSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineSeries}>
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
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-500">
              No velocity timeline series data available.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
