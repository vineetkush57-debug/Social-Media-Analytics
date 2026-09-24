import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { StatCard } from '../components/StatCard';
import { fetchEntityIntelligence } from '../services/api';
import { 
  Search, Radio, Sparkles, User, Tag, Briefcase, Calendar, Box, Hash, 
  MessageSquare, TrendingUp, Smile, Users, Network, Clock, ShieldCheck, 
  ArrowUpRight, Share2, Activity, Zap, Brain, ChevronRight, RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area 
} from 'recharts';

export const EntityDashboardPage = ({ entityQuery = 'Virat Kohli', navigateTo, onSearchEntity }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(entityQuery);

  const loadEntity = async (q) => {
    setLoading(true);
    try {
      const res = await fetchEntityIntelligence(q || 'Virat Kohli');
      setData(res);
    } catch (err) {
      console.error('Failed to load entity intelligence', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchInput(entityQuery);
    loadEntity(entityQuery);
  }, [entityQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      if (onSearchEntity) onSearchEntity(searchInput.trim());
      else loadEntity(searchInput.trim());
    }
  };

  const getEntityIcon = (type) => {
    switch (type) {
      case 'Person': return User;
      case 'Brand': return Tag;
      case 'Organization': return Briefcase;
      case 'Event': return Calendar;
      case 'Product': return Box;
      case 'Hashtag': return Hash;
      default: return MessageSquare;
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto select-none animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-96" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const EntityIcon = getEntityIcon(data?.entity_type);

  const sentimentPieData = [
    { name: 'Positive', value: data?.sentiment?.positive || 1, color: '#10B981' },
    { name: 'Neutral', value: data?.sentiment?.neutral || 1, color: '#06B6D4' },
    { name: 'Negative', value: data?.sentiment?.negative || 1, color: '#F43F5E' },
  ];

  const emotionData = Object.entries(data?.sentiment?.emotions || {}).map(([name, score]) => ({ name, score }));
  const platformData = Object.entries(data?.overview?.platforms || {}).map(([name, pct]) => ({ name, percentage: pct }));
  const ageData = Object.entries(data?.audience?.age_groups || {}).map(([name, pct]) => ({ name, percentage: pct }));

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Header Bar with Search Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 font-bold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENTITY & TOPIC INTELLIGENCE ENGINE</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
              {data?.query}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
              <EntityIcon className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              <span>{data?.entity_type}</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated multi-platform entity dashboard analyzing discussion volume, sentiment trajectory, network nodes, and related entities.
          </p>
        </div>

        {/* Entity Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Person, Brand, Event, Hashtag..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            ANALYZE ENTITY
          </button>
        </form>
      </div>

      {/* Demo Data Mode Banner */}
      {data?.is_demo_mode && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>DEMO DATA MODE — Consistent simulated entity telemetry active.</span>
          </div>
          <span className="text-[10px] font-mono text-amber-400">SIH 2026 Engine</span>
        </div>
      )}

      {/* Section 8: AI Summary (Prominent Top Banner) */}
      <GlassCard className="border-l-4 border-l-indigo-500 p-6 bg-gradient-to-r from-indigo-900/20 to-transparent">
        <div className="flex items-center space-x-2 mb-2 text-xs font-mono font-bold text-indigo-400 uppercase">
          <Brain className="w-4 h-4" />
          <span>DATA-GROUNDED AI EXECUTIVE SUMMARY</span>
        </div>
        <p className="text-sm font-semibold text-slate-100 leading-relaxed font-sans">
          "{data?.ai_summary}"
        </p>
      </GlassCard>

      {/* Section 1: Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="TOTAL MENTIONS"
          value={data?.overview?.total_mentions || 0}
          change="+240%"
          isPositive={true}
          subtitle="Indexed across social pipelines"
          icon={MessageSquare}
          color="indigo"
        />
        <StatCard
          title="TOTAL ENGAGEMENT"
          value={(data?.overview?.likes_count + data?.overview?.shares_count + data?.overview?.replies_count) || 0}
          change="+38.2%"
          isPositive={true}
          subtitle="Likes, retweets & replies"
          icon={Activity}
          color="cyan"
        />
        <StatCard
          title="TOTAL REACH / VIEWS"
          value={data?.overview?.views_count || 0}
          change="+112%"
          isPositive={true}
          subtitle="Estimated audience impressions"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="ENGAGEMENT RATE"
          value={`${data?.overview?.engagement_rate}%`}
          change="+4.5%"
          isPositive={true}
          subtitle="Interactions per 100 views"
          icon={Zap}
          color="emerald"
        />
      </div>

      {/* Section 2 & Section 3: Sentiment & Trending Discussions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 2: Sentiment Distribution & Timeline */}
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">SENTIMENT CLASSIFICATION</h3>
            <Smile className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentPieData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                  {sentimentPieData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-emerald-400 font-mono">
                {Math.round(((data?.sentiment?.positive || 1) / ((data?.sentiment?.positive || 1) + (data?.sentiment?.neutral || 1) + (data?.sentiment?.negative || 1))) * 100)}%
              </span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">POSITIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center border-t border-white/[0.08] pt-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Positive</span>
              <span className="font-bold text-emerald-400 font-mono">{data?.sentiment?.positive}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Neutral</span>
              <span className="font-bold text-cyan-400 font-mono">{data?.sentiment?.neutral}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Negative</span>
              <span className="font-bold text-rose-400 font-mono">{data?.sentiment?.negative}</span>
            </div>
          </div>
        </GlassCard>

        {/* Emotional Spectrum */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">EMOTIONAL INTENSITY RADAR (%)</h3>
            <span className="text-[10px] text-slate-400 font-mono">AI Emotion Classifier</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionData} layout="vertical">
                <XAxis type="number" stroke="#64748B" fontSize={11} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="#6366F1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Section 3: Trending Discussions & Hashtags */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">TRENDING DISCUSSIONS & HASHTAGS</h3>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold">RISING KEYWORDS</span>
              <div className="flex flex-wrap gap-1.5">
                {data?.trending_discussions?.rising_keywords?.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold">RELATED HASHTAGS CLOUD</span>
              <div className="flex flex-wrap gap-1.5">
                {data?.trending_discussions?.related_hashtags?.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-400">Velocity Acceleration</span>
              <span className="font-bold text-emerald-400 font-mono">{data?.trending_discussions?.topic_growth}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Section 7: Related Entities (Prominent Feature Section) */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">AUTOMATED GRAPH CONNECTIONS</span>
            <h3 className="text-base font-extrabold text-white">RELATED PEOPLE, BRANDS, ORGANIZATIONS & EVENTS</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Click any entity to inspect dashboard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.related_entities?.map((item, idx) => {
            const RelIcon = getEntityIcon(item.type);
            return (
              <div
                key={idx}
                onClick={() => {
                  if (onSearchEntity) onSearchEntity(item.name);
                  else loadEntity(item.name);
                }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-indigo-600/20 hover:border-indigo-500/40 cursor-pointer transition-all group flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition-transform">
                    <RelIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-200">{item.name}</h4>
                    <span className="text-[10px] text-slate-400">{item.type} • {item.relationship}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-emerald-400">{item.relevance}% Match</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 ml-auto mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Section 4 & Section 5: Audience Insights & Network Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 4: Audience Insights */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">AUDIENCE DEMOGRAPHIC BREAKDOWN</h3>
            <Users className="w-4 h-4 text-purple-400" />
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="percentage" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Section 5: Network Analysis */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">NETWORK GRAPH INFLUENCE</h3>
              <Network className="w-4 h-4 text-indigo-400" />
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex justify-between text-xs">
                <span className="text-slate-400">Influential Account Hubs</span>
                <span className="font-bold text-indigo-400 font-mono">{data?.network?.influential_nodes} Active Accounts</span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex justify-between text-xs">
                <span className="text-slate-400">Detected Network Clusters</span>
                <span className="font-bold text-cyan-400 font-mono">{data?.network?.communities_count} Communities</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold">TOP DISCUSSING ACCOUNTS</span>
                <div className="space-y-1.5">
                  {data?.network?.top_discussing_users?.map((u, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-white/[0.02]">
                      <span className="font-bold text-white">@{u.handle} ({u.platform})</span>
                      <span className="text-purple-400 font-mono">Influence: {u.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.08] pt-3 text-[11px] text-slate-400">
            Propagation: <span className="text-slate-200">{data?.network?.propagation_summary}</span>
          </div>
        </GlassCard>
      </div>

      {/* Section 6: Chronological Timeline Spikes */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">EVENT STREAM AUDIT</span>
            <h3 className="text-base font-extrabold text-white">IMPORTANT DISCUSSION CHRONOLOGICAL SPIKES</h3>
          </div>
          <Clock className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data?.timeline_spikes?.map((spike, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 relative">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-indigo-400 font-bold">{spike.time}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {spike.event_type}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{spike.description}</p>
              <div className="text-[10px] font-mono text-emerald-400 pt-1">
                Reach: +{spike.reach.toLocaleString()} impressions
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
