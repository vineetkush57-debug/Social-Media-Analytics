import React, { useState, useEffect } from 'react';
import { Search, Camera, X, TrendingUp, Users, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { globalSearch } from '../services/api';

export const GlobalSearchModal = ({ isOpen, onClose, navigateTo, onSearchEntity, onOpenImageUpload }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await globalSearch(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleOpenEntityDashboard = (targetQuery) => {
    onClose();
    if (onSearchEntity) {
      onSearchEntity(targetQuery || query);
    } else if (navigateTo) {
      navigateTo('/entity', targetQuery || query);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleOpenEntityDashboard(query.trim());
    }
  };

  const handleTriggerUpload = () => {
    onClose();
    if (onOpenImageUpload) onOpenImageUpload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-dark-900 border border-white/10 rounded-2xl max-w-2xl w-full p-4 shadow-2xl relative overflow-hidden">
        {/* Form Input Bar */}
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-3 px-3 py-2 border-b border-white/10 mb-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search person, brand ('Virat Kohli', 'Puma'), hashtag, event, or topic..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button type="submit" className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold">
            Search
          </button>
        </form>

        {/* Real Screenshot Upload Trigger Bar */}
        <div className="flex items-center justify-between px-2 pb-3 mb-3 border-b border-white/5 text-xs">
          <span className="text-slate-400">Or analyze from screenshot:</span>
          <button
            onClick={handleTriggerUpload}
            type="button"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold transition-all group"
          >
            <Camera className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>📷 Upload Screenshot</span>
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[55vh] overflow-y-auto space-y-4 px-2">
          {query.trim() && (
            <div
              onClick={() => handleOpenEntityDashboard(query.trim())}
              className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 hover:border-indigo-500/60 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-indigo-200">
                    Open Entity Intelligence Dashboard for "{query.trim()}"
                  </span>
                  <p className="text-[10px] text-slate-400">Deep 8-section AI telemetry, sentiment, audience & network graph</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </div>
          )}

          {loading && <div className="text-center py-6 text-xs text-slate-400">Searching global intelligence index...</div>}

          {!loading && !query.trim() && (
            <div className="py-6 text-center text-xs text-slate-500 space-y-2">
              <p>Quick search suggestions:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Virat Kohli", "Puma", "AI Agents", "Cybersecurity", "SIH 2026", "#Cricket"].map((suggest, i) => (
                  <button
                    key={i}
                    onClick={() => handleOpenEntityDashboard(suggest)}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-500/40 text-xs font-semibold text-indigo-300 hover:text-white"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results && (
            <>
              {/* Related Topics */}
              {results.related_topics.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 text-indigo-400" /> Matching Topics
                  </div>
                  <div className="space-y-1.5">
                    {results.related_topics.map((t, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleOpenEntityDashboard(t.topic)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/30 cursor-pointer text-xs transition-all"
                      >
                        <span className="font-semibold text-white">{t.topic}</span>
                        <span className="text-emerald-400 font-mono">+{t.growth}% mentions</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Influencers */}
              {results.influencers.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center">
                    <Users className="w-3 h-3 mr-1 text-purple-400" /> Matching Users / People
                  </div>
                  <div className="space-y-1.5">
                    {results.influencers.map((u, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleOpenEntityDashboard(u.handle)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/30 cursor-pointer text-xs transition-all"
                      >
                        <div>
                          <span className="font-bold text-white">@{u.handle}</span>
                          <span className="ml-2 text-slate-400">({u.platform})</span>
                        </div>
                        <span className="text-indigo-400 font-mono">Score: {u.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
