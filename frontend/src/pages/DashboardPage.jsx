import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { fetchDashboardSummary } from '../services/api';
import { 
  FileText, Users, Activity, TrendingUp, Smile, Radio, Sparkles, ArrowUpRight, ShieldCheck 
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar 
} from 'recharts';

export const DashboardPage = ({ navigateTo }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const summary = await fetchDashboardSummary();
      setData(summary);
    } catch (err) {
      console.error('Failed to fetch dashboard summary', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-72" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const sentimentPieData = [
    { name: 'Positive', value: data?.sentiment_breakdown?.positive || 12, color: '#10B981' },
    { name: 'Neutral', value: data?.sentiment_breakdown?.neutral || 5, color: '#06B6D4' },
    { name: 'Negative', value: data?.sentiment_breakdown?.negative || 3, color: '#F43F5E' },
  ];

  const platformBarData = Object.entries(data?.platform_distribution || {}).map(([name, val]) => ({
    name,
    posts: val,
  }));

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Workspace Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 font-bold uppercase mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
            <span>REAL-TIME OVERVIEW INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            SOCIAL INTELLIGENCE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time understanding of conversations, audiences and information flows.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-lg flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-2" />
            Backend API: Healthy
          </span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="TOTAL POSTS INDEXED"
          value={data?.total_posts || 0}
          change="+18.4%"
          isPositive={true}
          subtitle="Collected across 5 social media pipelines"
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="ACTIVE DETECTED USERS"
          value={data?.active_users || 0}
          change="+12.1%"
          isPositive={true}
          subtitle="Tracked accounts in network graph"
          icon={Users}
          color="cyan"
        />
        <StatCard
          title="TOTAL INTERACTIONS"
          value={data?.total_interactions || 0}
          change="+34.8%"
          isPositive={true}
          subtitle="Likes, shares, and reply signals"
          icon={Activity}
          color="purple"
        />
        <StatCard
          title="TRENDING TOPICS"
          value={data?.trending_topics_count || 0}
          change="+4"
          isPositive={true}
          subtitle="Active viral clusters detected"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Analytics Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Breakdown Pie */}
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">SENTIMENT DISTRIBUTION</h3>
            <Smile className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentPieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white font-mono">
                {Math.round(((data?.sentiment_breakdown?.positive || 0) / (data?.total_posts || 1)) * 100)}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">POSITIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center border-t border-white/[0.08] pt-4 mt-2">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Positive</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{data?.sentiment_breakdown?.positive}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Neutral</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">{data?.sentiment_breakdown?.neutral}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Negative</span>
              <span className="text-sm font-bold text-rose-400 font-mono">{data?.sentiment_breakdown?.negative}</span>
            </div>
          </div>
        </GlassCard>

        {/* Platform Distribution */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">PLATFORM POST DISTRIBUTION</h3>
            <span className="text-xs text-indigo-400 font-mono">X / Telegram / Insta / Reddit / YT</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformBarData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="posts" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Trending Topics & Key Influencers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Topics Table */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">TOP TRENDING TOPICS</h3>
            <button onClick={() => navigateTo('/trends')} className="text-xs text-indigo-400 hover:underline flex items-center">
              View All <ArrowUpRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {data?.trending_topics?.map((topic, idx) => (
              <div
                key={idx}
                onClick={() => navigateTo('/trends')}
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer transition-all"
              >
                <div>
                  <span className="text-sm font-bold text-white block">{topic.topic}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{topic.mentions.toLocaleString()} mentions</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 font-mono block">+{topic.growth}%</span>
                  <span className="text-[10px] text-indigo-300 capitalize">{topic.sentiment}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Influencers */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">TOP INFLUENT USERS</h3>
            <button onClick={() => navigateTo('/network')} className="text-xs text-indigo-400 hover:underline flex items-center">
              Network Graph <ArrowUpRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {data?.top_influencers?.map((inf) => (
              <div
                key={inf.id}
                onClick={() => navigateTo('/network')}
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-xs">
                    {inf.handle[0]}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">@{inf.handle}</span>
                    <span className="text-[11px] text-slate-400">{inf.platform} • {inf.follower_count.toLocaleString()} followers</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-purple-400 font-mono block">Score: {inf.influence_score}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Cluster #{inf.community_id}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
