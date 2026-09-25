import React from 'react';
import { Search, Camera, Calendar, Filter, Play, Radio, RefreshCw } from 'lucide-react';
import { triggerSeedDemo } from '../services/api';

export const Topbar = ({ 
  selectedPlatform, 
  setSelectedPlatform, 
  dateRange, 
  setDateRange, 
  onOpenSearch, 
  onOpenImageUpload,
  onStartSihDemo,
  onRefreshData
}) => {
  const [seeding, setSeeding] = React.useState(false);

  const handleReSeed = async () => {
    setSeeding(true);
    try {
      await triggerSeedDemo();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="h-16 bg-dark-900/80 backdrop-blur-xl border-b border-white/[0.08] fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-6 select-none">
      {/* Search Bar & Screenshot Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:border-white/20 transition-all text-xs w-64 text-left"
        >
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span>Search person, brand, hashtag...</span>
          <kbd className="ml-auto text-[10px] bg-white/[0.06] px-1.5 py-0.5 rounded text-slate-500 font-mono">⌘K</kbd>
        </button>

        {/* Real Upload Screenshot Trigger */}
        <button
          onClick={onOpenImageUpload}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-inner transition-all group"
        >
          <Camera className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Upload Screenshot</span>
        </button>

        {/* Demo Mode Badge */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold">
          <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>DEMO MODE / SIMULATED DATA</span>
        </div>
      </div>

      {/* Controls Right */}
      <div className="flex items-center space-x-3">
        {/* Re-seed demo button */}
        <button
          onClick={handleReSeed}
          disabled={seeding}
          title="Re-seed consistent demo database"
          className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        {/* Platform Dropdown */}
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs">
          <Filter className="w-3 h-3 text-slate-400 mr-1" />
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
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

        {/* Date Range Dropdown */}
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs">
          <Calendar className="w-3 h-3 text-slate-400 mr-1" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
          >
            <option value="24h" className="bg-dark-900">Last 24 Hours</option>
            <option value="7d" className="bg-dark-900">Last 7 Days</option>
            <option value="30d" className="bg-dark-900">Last 30 Days</option>
          </select>
        </div>

        {/* SIH DEMO Scenario Button */}
        <button
          onClick={onStartSihDemo}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all transform hover:scale-[1.02]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>SIH DEMO SCENARIO</span>
        </button>
      </div>
    </header>
  );
};
