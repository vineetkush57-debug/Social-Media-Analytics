import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { fetchAuditTrail } from '../services/api';
import { Cpu, Database, Server, Layout, Smile, Users, TrendingUp, Network, ArrowRight, ShieldCheck, Lock, Hash, CheckCircle2 } from 'lucide-react';

export const ArchitecturePage = () => {
  const [auditLog, setAuditLog] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(true);

  useEffect(() => {
    fetchAuditTrail()
      .then((data) => {
        setAuditLog(data || []);
      })
      .catch((err) => {
        console.error('Failed to load audit trail:', err);
      })
      .finally(() => setLoadingAudit(false));
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 font-bold uppercase mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>SIH 2026 TECHNICAL BLUEPRINT</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            SYSTEM ARCHITECTURE & AI PIPELINE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end data flow visualization from raw social media feeds down to React presentation layers.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PRODUCTION-READY DESIGN</span>
        </div>
      </div>

      {/* Main End-to-End Pipeline Flow */}
      <GlassCard className="p-8 space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 text-center mb-6">
          END-TO-END DATA PROCESSING & INTELLIGENCE PIPELINE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-center">
          <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-mono text-indigo-400 font-bold">STAGE 1</span>
            <div className="text-xs font-bold text-white uppercase">SOCIAL PLATFORMS</div>
            <span className="text-[10px] text-slate-400">X, Telegram, IG, Reddit, YT</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-600">
            <ArrowRight className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="p-4 rounded-xl bg-cyan-600/10 border border-cyan-500/30 flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-mono text-cyan-400 font-bold">STAGE 2</span>
            <div className="text-xs font-bold text-white uppercase">INGESTION & PARSING</div>
            <span className="text-[10px] text-slate-400">REST APIs / Upload Ingestion</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-600">
            <ArrowRight className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-500/30 flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-mono text-purple-400 font-bold">STAGE 3</span>
            <div className="text-xs font-bold text-white uppercase">4 AI/ML ENGINES</div>
            <span className="text-[10px] text-slate-400">NLP + NetworkX + TF-IDF</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-600">
            <ArrowRight className="w-5 h-5 text-purple-400" />
          </div>

          <div className="p-4 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">STAGE 4</span>
            <div className="text-xs font-bold text-white uppercase">FASTAPI + REACT</div>
            <span className="text-[10px] text-slate-400">SentientX Dark UI Workspace</span>
          </div>
        </div>
      </GlassCard>

      {/* 4 AI Intelligence Engines Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">FOUR CORE INTELLIGENCE ENGINES</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">1. SENTIMENT & EMOTION ENGINE</h4>
                <span className="text-[10px] text-slate-400 font-mono">TextBlob + Polarity Calibration</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes text polarity (-1.0 to +1.0) and scores 6 emotional dimensions (Excitement, Anxiety, Anger, Supportive, Against, Sarcasm) with AI confidence ratings.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">2. AUDIENCE INTELLIGENCE ENGINE</h4>
                <span className="text-[10px] text-slate-400 font-mono">Aggregated Signal Clustering</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Derives age bracket distributions, geographic reach, language composition, and professional affinity while enforcing strict privacy preservation.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">3. TREND & ANOMALY ENGINE</h4>
                <span className="text-[10px] text-slate-400 font-mono">TF-IDF + Trajectory Projection</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts n-gram keywords and hashtags, measures velocity growth (+240%), and calculates estimated forecast trajectory scores.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">4. NETWORK & PROPAGATION ENGINE</h4>
                <span className="text-[10px] text-slate-400 font-mono">NetworkX Directed Graph Analytics</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates Degree Centrality, Betweenness Centrality, PageRank, and Louvain community detection to isolate key hubs and trace multi-stage viral cascades.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* OSINT Audit Trail & Data Provenance Ledger */}
      <GlassCard className="p-6 space-y-4 border border-indigo-500/20">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                OSINT AUDIT TRAIL & DATA PROVENANCE LEDGER
              </h3>
              <p className="text-[11px] text-slate-400">
                Immutable cryptographic ledger recording data provenance, collector agent IDs, and SHA-256 integrity hashes.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>LEDGER IMMUTABLE</span>
          </span>
        </div>

        {loadingAudit ? (
          <div className="p-4 text-xs font-mono text-slate-400 animate-pulse text-center">
            Fetching cryptographic audit trail...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-[10px] text-slate-400 border-b border-white/10 uppercase">
                  <th className="py-2.5 px-3">Audit Event</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Collector Agent</th>
                  <th className="py-2.5 px-3">Data Provenance</th>
                  <th className="py-2.5 px-3">SHA256 Hash Checksum</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLog.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-semibold text-white">{row.action}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{new Date(row.timestamp * 1000).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{row.collector_agent}</td>
                    <td className="py-2.5 px-3 text-slate-300">{row.provenance}</td>
                    <td className="py-2.5 px-3 text-indigo-300 font-mono text-[10px] truncate max-w-[200px]" title={row.sha256_hash}>
                      {row.sha256_hash}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

