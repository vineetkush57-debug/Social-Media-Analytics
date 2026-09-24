import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { fetchTrends } from '../services/api';
import { TrendingUp, Flame, ArrowUpRight, Hash, Sparkles, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const TrendsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchTrends()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-xs text-slate-400 animate-pulse">Loading Trend Intelligence...</div>;
  }

  const filteredTopics = (data?.topics || []).filter((t) => {
    if (activeTab === 'trending') return t.status === 'trending';
    if (activeTab === 'rising') return t.status === 'rising';
    if (activeTab === 'falling') return t.status === 'falling';
    return true;
  });

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 font-bold uppercase mb-1">
            <Flame className="w-3.5 h-3.5 text-indigo-400" />
            <span>ANOMALY & VIRAL DETECTION</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            TREND INTELLIGENCE & FORECASTING
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time keyword frequency tracking, momentum velocity scoring, and trajectory prediction.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{data?.projection_label || "Estimated trend projection"}</span>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex space-x-2 border-b border-white/[0.08] pb-3">
        {[
          { id: 'all', label: 'ALL TOPICS' },
          { id: 'trending', label: '🔥 HIGHLY TRENDING' },
          { id: 'rising', label: '🚀 RISING ANOMALIES' },
          { id: 'falling', label: '📉 SUBSIDING / FALLING' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((item, idx) => (
          <GlassCard key={idx} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {item.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  item.status === 'trending' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  item.status === 'rising' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {item.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{item.topic}</h3>

              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-2xl font-extrabold text-white font-mono">{item.mentions.toLocaleString()}</span>
                <span className={`text-xs font-bold font-mono ${item.growth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.growth > 0 ? `+${item.growth}%` : `${item.growth}%`}
                </span>
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">Forecast Score: <strong className="text-indigo-400 font-mono">{item.forecast_score}/100</strong></span>
              <span className="text-slate-500">{item.first_detected}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Multi-Topic Growth Timeline */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">TOPIC VELOCITY & TRAJECTORY GRAPH</h3>
          <Activity className="w-4 h-4 text-indigo-400" />
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.trend_timeline || []}>
              <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="AI Autonomous Agents" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} />
              <Area type="monotone" dataKey="Cybersecurity Protocol" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.15} />
              <Area type="monotone" dataKey="Green Tech" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Hashtag Frequency Cloud */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">TOP DETECTED HASHTAG FREQUENCY CLOUD</h3>
          <Hash className="w-4 h-4 text-purple-400" />
        </div>

        <div className="flex flex-wrap gap-3">
          {data?.hashtags?.map((tag, idx) => (
            <span
              key={idx}
              className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 text-xs font-bold font-mono text-indigo-300 hover:text-white hover:bg-indigo-600/20 cursor-pointer transition-all"
            >
              {tag}
            </span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
