import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { fetchTimeline } from '../services/api';
import { Clock, Filter, Sparkles, MessageSquare } from 'lucide-react';

export const TimelinePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => {
    fetchTimeline('', filterPlatform === 'all' ? '' : filterPlatform)
      .then((res) => setEvents(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [filterPlatform]);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold uppercase mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>CHRONOLOGICAL EVENT STREAM</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            INTERACTIVE ACTIVITY TIMELINE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological audit log tracking post publications, sentiment shifts, and viral spikes.
          </p>
        </div>

        {/* Platform Filter */}
        <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-dark-900">All Platforms</option>
            <option value="X" className="bg-dark-900">X (Twitter)</option>
            <option value="Telegram" className="bg-dark-900">Telegram</option>
            <option value="Instagram" className="bg-dark-900">Instagram</option>
            <option value="Reddit" className="bg-dark-900">Reddit</option>
            <option value="YouTube" className="bg-dark-900">YouTube</option>
          </select>
        </div>
      </div>

      {/* Events Stream */}
      {loading ? (
        <div className="p-8 text-xs text-slate-400 animate-pulse">Loading Event Stream...</div>
      ) : (
        <div className="relative border-l-2 border-indigo-500/30 ml-4 space-y-6">
          {events.map((evt) => (
            <div key={evt.id} className="relative pl-6 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-dark-950 border-2 border-indigo-500 group-hover:bg-indigo-500 transition-all" />

              <GlassCard className="p-4 space-y-2 hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-indigo-400 font-bold">{evt.timestamp}</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-bold text-white">{evt.user_handle}</span>
                    <span className="text-slate-400">({evt.platform})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {evt.event_type}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans">{evt.content}</p>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <span>Topic: <strong className="text-white">{evt.topic}</strong></span>
                  <span>Estimated Reach: <strong className="text-emerald-400 font-mono">+{evt.reach.toLocaleString()}</strong></span>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
