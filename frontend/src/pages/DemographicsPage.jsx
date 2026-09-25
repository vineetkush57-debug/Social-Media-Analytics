import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { fetchDemographics } from '../services/api';
import { Users, Globe, Shield, ShieldAlert, AlertCircle, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const DemographicsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchDemographics()
      .then((res) => setData(res))
      .catch((err) => {
        console.error(err);
        setError("Unable to load audience analytics.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const parseItems = (dictObj, arrObj) => {
    if (Array.isArray(arrObj) && arrObj.length > 0) {
      return arrObj.map((item) => ({
        name: String(item.label || item.name || ''),
        percentage: Number(item.value ?? item.percentage ?? 0),
      }));
    }
    if (dictObj && typeof dictObj === 'object') {
      return Object.entries(dictObj).map(([name, percentage]) => ({
        name: String(name),
        percentage: Number(percentage || 0),
      }));
    }
    return [];
  };

  const ageData = parseItems(data?.age_brackets, data?.age_distribution);
  const geoData = parseItems(data?.geographic_distribution, data?.geographic_reach);
  const langData = parseItems(data?.languages, data?.language_distribution);
  const interestData = parseItems(data?.professional_interests, data?.interest_domains);

  const COLORS = ['#6366F1', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B'];

  if (loading) {
    return (
      <div className="p-8 space-y-4 max-w-[1600px] mx-auto">
        <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center space-x-3 animate-pulse">
          <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
          <span className="text-xs font-bold text-indigo-300">Loading audience & demographic insights...</span>
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
          {data?.disclaimer || "Demographic values are aggregated estimates based on available public/demo signals."}
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
            {ageData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-500">
                No age distribution data available.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Geographic Distribution */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">GEOGRAPHIC REGION REACH (%)</h3>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="h-64">
            {geoData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-500">
                No geographic distribution data available.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Professional Interests */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">PROFESSIONAL INTEREST DOMAINS</h3>
            <span className="text-[10px] text-slate-400 font-mono">Domain Affinity</span>
          </div>

          <div className="h-64">
            {interestData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-500">
                No professional domain data available.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Languages Breakdown */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">LANGUAGE DISTRIBUTION (%)</h3>
            <span className="text-[10px] text-slate-400 font-mono">NLP Language Signals</span>
          </div>

          <div className="space-y-4 pt-2">
            {langData.length > 0 ? (
              langData.map((item, idx) => (
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
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No language distribution data available.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
