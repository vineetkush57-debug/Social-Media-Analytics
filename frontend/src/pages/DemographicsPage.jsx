import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { fetchDemographics } from '../services/api';
import { Users, Globe, Shield, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const DemographicsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemographics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-xs text-slate-400 animate-pulse">Loading Audience Intelligence...</div>;
  }

  const ageData = Object.entries(data?.age_brackets || {}).map(([name, percentage]) => ({ name, percentage }));
  const geoData = Object.entries(data?.geographic_distribution || {}).map(([name, percentage]) => ({ name, percentage }));
  const langData = Object.entries(data?.languages || {}).map(([name, percentage]) => ({ name, percentage }));
  const interestData = Object.entries(data?.professional_interests || {}).map(([name, percentage]) => ({ name, percentage }));

  const COLORS = ['#6366F1', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B'];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 font-bold uppercase mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>AGGREGATED AUDIENCE CLUSTERING</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            AUDIENCE & DEMOGRAPHIC INSIGHTS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Anonymized aggregate population segment estimation derived from multi-platform public signal analysis.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>PRIVACY PRESERVING</span>
        </div>
      </div>

      {/* Privacy Disclaimer Note */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs flex items-center space-x-3">
        <ShieldAlert className="w-5 h-5 text-indigo-400 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong className="font-bold">Privacy Note: </strong>
          {data?.disclaimer || "Demographic values are aggregated estimates based on available public/demo signals. No personal identity info exposed."}
        </p>
      </div>

      {/* Grid of Demographic Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Brackets */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">AGE BRACKET DISTRIBUTION (%)</h3>
            <span className="text-[10px] text-slate-400 font-mono">Demographic Composition</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="percentage" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Geographic Distribution */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">GEOGRAPHIC REGION REACH (%)</h3>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical">
                <XAxis type="number" stroke="#64748B" fontSize={11} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="percentage" fill="#06B6D4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Professional Interests */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">PROFESSIONAL INTEREST DOMAINS</h3>
            <span className="text-[10px] text-slate-400 font-mono">Domain Affinity</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={interestData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="percentage"
                  nameKey="name"
                >
                  {interestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F111A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Languages Breakdown */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">LANGUAGE DISTRIBUTION (%)</h3>
            <span className="text-[10px] text-slate-400 font-mono">NLP Language Signals</span>
          </div>

          <div className="space-y-4 pt-2">
            {langData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{item.name}</span>
                  <span className="font-mono text-cyan-400">{item.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
