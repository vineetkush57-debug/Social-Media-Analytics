import { 
  LayoutDashboard, Search, Database, Smile, Users, TrendingUp, Network, 
  GitBranch, Clock, AlertTriangle, Cpu, Sparkles, ChevronRight
} from 'lucide-react';

export const Sidebar = ({ currentRoute, navigateTo }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'entity', label: 'Entity Intelligence', icon: Search, path: '/entity' },
    { id: 'sources', label: 'Sources', icon: Database, path: '/sources' },
    { id: 'sentiment', label: 'Sentiment', icon: Smile, path: '/sentiment' },
    { id: 'demographics', label: 'Audience', icon: Users, path: '/demographics' },
    { id: 'trends', label: 'Trends', icon: TrendingUp, path: '/trends' },
    { id: 'network', label: 'Network', icon: Network, path: '/network' },
    { id: 'propagation', label: 'Propagation', icon: GitBranch, path: '/propagation' },
    { id: 'timeline', label: 'Timeline', icon: Clock, path: '/timeline' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, path: '/alerts', badge: '4' },
    { id: 'architecture', label: 'Architecture', icon: Cpu, path: '/architecture' },
  ];

  return (
    <aside className="w-64 bg-dark-900/90 backdrop-blur-xl border-r border-white/[0.08] flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Platform Logo */}
      <div 
        className="p-6 border-b border-white/[0.08] flex items-center space-x-3 cursor-pointer group"
        onClick={() => navigateTo('/')}
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">SIH 2026 #26152</div>
          <div className="text-sm font-bold text-white tracking-tight">SENTIENT INTELLIGENCE</div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
          Analytics Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 opacity-80" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-white/[0.08] bg-dark-950/50">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>FastAPI + SQLite Engine</span>
          </div>
          <span className="text-indigo-400 font-mono text-[10px]">v2.6.0</span>
        </div>
      </div>
    </aside>
  );
};
