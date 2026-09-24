import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { fetchSentiment } from '../services/api';
import { Smile, Frown, Meh, Sparkles, Brain, CheckCircle2 } from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area 
} from 'recharts';

export const SentimentPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentiment()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-xs text-slate-400 animate-pulse">Loading AI Sentiment Intelligence...</div>;
  }

  const emotionData = Object.entries(data?.emotions || {}).map(([name, score]) => ({
    name,
    score,
  }));

  const platformData = Object.entries(data?.platform_wise || {}).map(([name, val]) => ({
    name,
    positive: val.positive,
    neutral: val.neutral,
    negative: val.negative,
  }));

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold uppercase mb-1">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI NATURAL LANGUAGE UNDERSTANDING</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            SENTIMENT & EMOTION INTELLIGENCE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deep neural classification of polarity, confidence, and emotional intensity across social media streams.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI-GENERATED ESTIMATES</span>
        </div>
      </div>

      {/* Top Polarity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-slate-400">POSITIVE SENTIMENT</span>
            <Smile className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">{data?.distribution?.positive}</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Constructive & Supportive Signals</span>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-slate-400">NEUTRAL SENTIMENT</span>
            <Meh className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">{data?.distribution?.neutral}</div>
          <span className="text-[10px] text-cyan-400 mt-1 block">Informational & Factual Dispatches</span>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-slate-400">NEGATIVE SENTIMENT</span>
            <Frown className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">{data?.distribution?.negative}</div>
          <span className="text-[10px] text-rose-400 mt-1 block">Critical & Anxiety Signals</span>
        </GlassCard>
      </div>

      {/* Emotion Spectrum Radar & Platform-wise Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Spectrum */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">EMOTIONAL SPECTRUM RADAR (%)</h3>
            <span className="text-[10px] text-slate-400 font-mono">6 Emotional Dimensions</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionData} layout="vertical">
                <XAxis type="number" stroke="#64748B" fontSize={11} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="score" fill="#06B6D4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Platform-wise Sentiment */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">PLATFORM-WISE SENTIMENT BREAKDOWN</h3>
            <span className="text-[10px] text-slate-400 font-mono">Stack Comparison</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="positive" fill="#10B981" stackId="a" />
                <Bar dataKey="neutral" fill="#06B6D4" stackId="a" />
                <Bar dataKey="negative" fill="#F43F5E" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Sentiment Over Time Timeline */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">SENTIMENT TRAJECTORY OVER TIME</h3>
          <span className="text-[10px] text-indigo-400 font-mono">Diurnal Pattern</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.timeline || []}>
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="positive" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
              <Area type="monotone" dataKey="neutral" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.15} />
              <Area type="monotone" dataKey="negative" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Recent AI Analyzed Feed */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">RECENTLY CLASSIFIED POST STREAM</h3>
          <span className="text-[10px] text-slate-400 font-mono">TEXT → SENTIMENT → EMOTION → CONFIDENCE</span>
        </div>

        <div className="space-y-4">
          {data?.recent_analyzed?.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">@{post.user}</span>
                  <span className="text-slate-400">({post.platform})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {post.ai_label}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">Conf: {Math.round(post.confidence * 100)}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{post.text}</p>

              <div className="flex items-center space-x-3 pt-2 text-[11px]">
                <span className={`px-2 py-0.5 rounded font-bold capitalize ${
                  post.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  post.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {post.sentiment}
                </span>

                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                  Emotion: {post.primary_emotion}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
