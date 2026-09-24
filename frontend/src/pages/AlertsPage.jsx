import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { fetchAlerts } from '../services/api';
import { AlertTriangle, ShieldAlert, CheckCircle2, Filter, BellRing } from 'lucide-react';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');

  useEffect(() => {
    fetchAlerts(severityFilter)
      .then((res) => setAlerts(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [severityFilter]);

  const handleDismiss = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-rose-400 font-bold uppercase mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>REAL-TIME THREAT & ANOMALY ALERTS</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            ALERT INTELLIGENCE ENGINE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated threat detection for rapid trend spikes, sentiment shifts, and high-influence viral cascades.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex space-x-2">
          {['all', 'critical', 'warning', 'info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                severityFilter === sev
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      {loading ? (
        <div className="p-8 text-xs text-slate-400 animate-pulse">Scanning Alert Intelligence Logs...</div>
      ) : (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">All alerts resolved / no active warnings.</div>
          ) : (
            alerts.map((alert) => (
              <GlassCard
                key={alert.id}
                className={`p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-rose-500' :
                  alert.severity === 'warning' ? 'border-l-amber-500' : 'border-l-indigo-500'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      alert.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      alert.severity === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs font-bold text-white">{alert.title}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>

                  <div className="flex items-center space-x-4 text-[10px] text-slate-500 font-mono">
                    <span>Platform: {alert.platform}</span>
                    <span>Topic: {alert.topic_name}</span>
                    <span>Time: {alert.timestamp}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 text-xs font-semibold border border-white/10 transition-all flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acknowledge</span>
                </button>
              </GlassCard>
            ))
          )}
        </div>
      )}
    </div>
  );
};
