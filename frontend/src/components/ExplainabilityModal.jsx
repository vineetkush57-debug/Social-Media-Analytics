import React, { useState, useEffect } from 'react';
import { Brain, X, ShieldCheck, CheckCircle2, Cpu, FileText, Layers, Hash } from 'lucide-react';
import { fetchExplainability } from '../services/api';

export const ExplainabilityModal = ({ isOpen, onClose, insightType = 'sentiment', itemId = 'demo' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchExplainability(insightType, itemId)
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isOpen, insightType, itemId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-dark-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden max-h-[85vh] flex flex-col justify-between">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase">
              EXPLAINABLE AI (XAI) REASONING ENGINE
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Model Decision Rationale</h2>
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Synthesizing model reasoning & data provenance chain...
            </div>
          ) : (
            <>
              {/* Conclusion Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 font-bold uppercase">
                  <span>{data?.insight_type}</span>
                  <span>Confidence: {Math.round((data?.confidence_score || 0.9) * 100)}%</span>
                </div>
                <p className="text-sm font-bold text-white font-sans">{data?.conclusion}</p>
              </div>

              {/* Step-by-Step Reasoning Pipeline */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  STEP-BY-STEP AI REASONING CHAIN
                </span>
                <div className="space-y-2">
                  {data?.explainability_steps?.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <span className="text-xs font-bold text-indigo-300 block">{step.step}</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features & Tokens Weights */}
              {data?.top_key_features?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    FEATURE IMPORTANCE WEIGHTS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {data.top_key_features.map((feat, idx) => (
                      <div key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs flex items-center space-x-2">
                        <span className="font-bold text-white">{feat.token}</span>
                        <span className="text-cyan-400 font-mono text-[10px]">({feat.weight > 0 ? `+${feat.weight}` : feat.weight})</span>
                        <span className="text-[10px] text-slate-500">[{feat.type}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Provenance Ledger */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Model: <strong className="text-slate-200">{data?.model_lineage}</strong></span>
                <span>Hash: <strong className="text-purple-400">{data?.data_provenance_hash}</strong></span>
              </div>
            </>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider"
          >
            Close Reasoning Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
