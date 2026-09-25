import React from 'react';
import { HeroCanvas } from '../components/HeroCanvas';
import { Sparkles, ArrowRight, Play, Radio, Camera, Smile, Users, TrendingUp, Network, GitBranch } from 'lucide-react';

export const LandingPage = ({ navigateTo, onStartSihDemo, onOpenImageUpload }) => {
  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 relative overflow-hidden select-none">
      {/* Navbar */}
      <nav className="h-20 border-b border-white/[0.08] bg-dark-900/60 backdrop-blur-xl fixed top-0 inset-x-0 z-40 flex items-center justify-between px-8">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('/')}>
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">SIH 2026 #26152</span>
            <div className="text-base font-extrabold tracking-tight text-white">SENTIENT INTELLIGENCE</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenImageUpload}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/30 text-xs font-semibold text-indigo-300 transition-all"
          >
            <Camera className="w-4 h-4 text-indigo-400" />
            <span>UPLOAD SCREENSHOT</span>
          </button>
          <button
            onClick={onStartSihDemo}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-all"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400 fill-current" />
            <span>SIH LIVE DEMO</span>
          </button>
          <button
            onClick={() => navigateTo('/dashboard')}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>LAUNCH PLATFORM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-8 min-h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Animated Canvas Background */}
        <HeroCanvas />

        {/* Ambient Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>SIH 2026 PROBLEM STATEMENT 26152 PROTOTYPE</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none font-sans">
            SOCIAL MEDIA<br />
            <span className="gradient-text-indigo">INTELLIGENCE</span>
          </h1>

          <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Understand conversations, detect emerging trends, map influence, and analyze social media screenshots with OCR & Entity AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={() => navigateTo('/dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold tracking-wider uppercase shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.03] flex items-center justify-center space-x-3"
            >
              <span>EXPLORE INTELLIGENCE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenImageUpload}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/30 text-indigo-200 text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center space-x-3 shadow-inner"
            >
              <Camera className="w-4 h-4 text-indigo-400" />
              <span>📷 UPLOAD SCREENSHOT</span>
            </button>

            <button
              onClick={onStartSihDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center space-x-3"
            >
              <Play className="w-4 h-4 text-indigo-400 fill-current" />
              <span>VIEW SIH DEMO</span>
            </button>
          </div>
        </div>
      </section>

      {/* Storytelling Section 1 */}
      <section className="py-24 border-t border-white/[0.08] bg-dark-900/40 relative">
        <div className="max-w-6xl mx-auto px-8 text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">01 / UNIFIED SIGNAL & SCREENSHOT INGESTION</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Text Search & Screenshot Intelligence.<br />
            <span className="gradient-text-cyan">One intelligence layer.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Continuous ingestion from X, Telegram, Instagram, Reddit, YouTube, and screenshot OCR uploads distilled into unified Entity Intelligence.
          </p>
        </div>
      </section>

      {/* Storytelling Section 2: 4 Engines */}
      <section className="py-24 border-t border-white/[0.08] bg-dark-950">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">02 / CORE CAPABILITIES</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2">Four Major Intelligence Engines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">SENTIMENT</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Polarity classification and fine-grained emotional radar (Excitement, Anxiety, Anger, Supportive, Sarcasm).
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">TRENDS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Early anomaly detection, keyword frequency extraction, and AI velocity growth forecasting.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">AUDIENCE</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aggregated, anonymized demographic estimation across age groups, geographic regions, and professional interests.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">NETWORKS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                NetworkX graph topology calculating PageRank, Degree Centrality, and community clusters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Section 4: Information Propagation */}
      <section className="py-24 border-t border-white/[0.08] bg-dark-900/60">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">03 / SIGNATURE PROPAGATION</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2 mb-12">
            How Information Moves Across Networks
          </h2>

          {/* Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            <div className="glass-panel p-5 rounded-xl border border-white/10 relative">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">STAGE 1</span>
              <h4 className="text-sm font-bold text-white mt-1">ORIGIN</h4>
              <p className="text-xs text-slate-400 mt-2">First detected on encrypted Telegram research channel.</p>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-white/10 relative">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">STAGE 2</span>
              <h4 className="text-sm font-bold text-white mt-1">AMPLIFICATION</h4>
              <p className="text-xs text-slate-400 mt-2">Cross-posted to X developers, generating early viral momentum.</p>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-white/10 relative">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">STAGE 3</span>
              <h4 className="text-sm font-bold text-white mt-1">COMMUNITIES</h4>
              <p className="text-xs text-slate-400 mt-2">Pinned on Reddit r/ArtificialIntelligence with 1,400+ replies.</p>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-white/10 relative">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">STAGE 4</span>
              <h4 className="text-sm font-bold text-white mt-1">SPREAD</h4>
              <p className="text-xs text-slate-400 mt-2">Global YouTube deep-dive video triggers secondary wave.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Final CTA */}
      <section className="py-24 border-t border-white/[0.08] bg-dark-950 text-center relative">
        <div className="max-w-3xl mx-auto px-8 space-y-6">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            Explore the Intelligence Layer
          </h2>
          <p className="text-slate-400 text-sm">
            Experience the live production-style SIH 2026 Social Media Analytics Prototype.
          </p>
          <button
            onClick={() => navigateTo('/dashboard')}
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-2xl shadow-indigo-600/40 transition-all inline-flex items-center space-x-2"
          >
            <span>ENTER ANALYTICS WORKSPACE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
