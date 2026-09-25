import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { fetchTimeline } from '../services/api';
import { Clock, Filter, Search, Sparkles, MessageSquare, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

export const TimelinePage = ({ navigateTo }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [searchTopic, setSearchTopic] = useState('');

  const loadTimeline = () => {
    setLoading(true);
    setError(null);
    fetchTimeline(searchTopic, filterPlatform, filterSentiment)
      .then((res) => {
        if (Array.isArray(res)) {
          setEvents(res);
        } else if (res && Array.isArray(res.events)) {
          setEvents(res.events);
        } else {
          setEvents([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load activity timeline.");
        setEvents([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTimeline();
    }, 200);
    return () => clearTimeout(timer);
  }, [filterPlatform, filterSentiment, searchTopic]);

  const handleEventClick = (topicName) => {
    if (navigateTo) {
      navigateTo('/entity', topicName);
    }
  };

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

        {/* Filters Header Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Topic Search Input */}
          <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs">
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <input
              type="text"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              placeholder="Filter by topic/person..."
              className="bg-transparent text-white text-xs focus:outline-none w-36 placeholder-slate-500"
            />
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

          {/* Sentiment Filter */}
          <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs">
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-dark-900">All Sentiments</option>
              <option value="positive" className="bg-dark-900">Positive</option>
              <option value="neutral" className="bg-dark-900">Neutral</option>
              <option value="negative" className="bg-dark-900">Negative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center space-x-3 animate-pulse">
          <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
          <span className="text-xs font-bold text-indigo-300">Loading chronological event stream...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>{error}</span>
          </div>
          <button onClick={loadTimeline} className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs text-white">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center space-y-3">
          <Clock className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white uppercase">No timeline events found</h3>
          <p className="text-xs text-slate-400">Try clearing filters or search query to view full event stream.</p>
        </div>
      )}

      {/* Events Stream */}
      {!loading && !error && events.length > 0 && (
        <div className="relative border-l-2 border-indigo-500/30 ml-4 space-y-6">
          {events.map((evt) => (
            <div key={evt.id} className="relative pl-6 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-dark-950 border-2 border-indigo-500 group-hover:bg-indigo-500 transition-all" />

              <GlassCard
                onClick={() => handleEventClick(evt.topic)}
                className="p-4 space-y-2 hover:border-indigo-500/50 cursor-pointer transition-all group-hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-indigo-400 font-bold">{evt.timestamp}</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-bold text-white">{evt.user_handle}</span>
                    <span className="text-slate-400">({evt.platform})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      evt.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      evt.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {evt.sentiment}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {evt.event_type}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans">{evt.content}</p>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-white/5">
                  <span className="flex items-center space-x-1">
                    <span>Topic: <strong className="text-white">{evt.topic}</strong></span>
                    <ExternalLink className="w-3 h-3 text-indigo-400 inline opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span>Estimated Reach: <strong className="text-emerald-400 font-mono">+{Number(evt.reach || 0).toLocaleString()}</strong></span>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
