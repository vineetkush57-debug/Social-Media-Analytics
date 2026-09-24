import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, Play, Sparkles, Database, Smile, Users, TrendingUp, Network, GitBranch, ShieldCheck } from 'lucide-react';

export const SihDemoModal = ({ isOpen, onClose, navigateTo }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "1. Data Collection & Multi-Source Ingestion",
      icon: Database,
      route: "/sources",
      color: "indigo",
      summary: "Simultaneous ingestion of unstructured social media posts across X, Telegram, Instagram, Reddit, and YouTube.",
      detail: "The system collects live feeds, validates post signatures, extracts raw text, metadata, and timestamps into the central data pipeline."
    },
    {
      title: "2. AI Sentiment & Emotion Intelligence Engine",
      icon: Smile,
      route: "/sentiment",
      color: "cyan",
      summary: "Deep NLP analysis computing polarity and fine-grained emotional spectra.",
      detail: "Posts are classified into positive, neutral, negative along with emotional attributes (Excitement, Anxiety, Anger, Supportive, Sarcasm) with AI confidence ratings."
    },
    {
      title: "3. Audience & Demographic Clustering",
      icon: Users,
      route: "/demographics",
      color: "emerald",
      summary: "Aggregated, privacy-preserving audience profile estimation.",
      detail: "Derives age bracket composition, geographic concentration (e.g. 38.5% North America, 32% APAC), language distribution, and professional domain interests."
    },
    {
      title: "4. Emerging Trend & Anomaly Detection",
      icon: TrendingUp,
      route: "/trends",
      color: "purple",
      summary: "Detects viral topic acceleration (+240% growth in AI Autonomous Agents).",
      detail: "TF-IDF keyword extraction identifies rising hashtags and projects trend trajectory using estimated forecast scoring."
    },
    {
      title: "5. Key Influencer Detection & Centrality Analysis",
      icon: Network,
      route: "/network",
      color: "indigo",
      summary: "Graph topology modeling using NetworkX algorithms.",
      detail: "Computes PageRank, Degree Centrality, and Betweenness Centrality to isolate key hubs (e.g. @AlexVanguard with 94.5 influence score)."
    },
    {
      title: "6. Information Propagation Cascade Mapping",
      icon: GitBranch,
      route: "/propagation",
      color: "rose",
      summary: "Traces the exact viral origin and transmission path.",
      detail: "Origin (Telegram whitepaper) → Amplification (DevPulse) → Key Influencer (@AlexVanguard) → Reddit Communities → Global YouTube Media."
    },
    {
      title: "7. Executive Synthesis & Actionable Insight",
      icon: ShieldCheck,
      route: "/dashboard",
      color: "emerald",
      summary: "Actionable intelligence report generated for SIH Judges.",
      detail: "The AI platform equips decision makers with early threat warnings, audience alignment data, and precise viral cascade intervention points."
    }
  ];

  const stepData = steps[currentStep];
  const StepIcon = stepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      if (navigateTo) navigateTo(steps[nextIdx].route);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      if (navigateTo) navigateTo(steps[prevIdx].route);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-dark-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">SIH 2026 GUIDED DEMO</span>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Autonomous Technology Scenario</h2>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="flex space-x-1.5 mb-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                if (navigateTo) navigateTo(s.route);
              }}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentStep
                  ? 'bg-indigo-500 glow-indigo scale-y-125'
                  : idx < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Current Step Content */}
        <div className="glass-panel rounded-xl p-6 border border-white/10 mb-6 bg-dark-800/80">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{stepData.title}</h3>
              <span className="text-xs text-indigo-400 font-mono">Target Route: {stepData.route}</span>
            </div>
          </div>

          <p className="text-sm font-semibold text-slate-200 mb-2">{stepData.summary}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{stepData.detail}</p>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">
            Step {currentStep + 1} of {steps.length}
          </span>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Next Demo Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish Demonstration</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
