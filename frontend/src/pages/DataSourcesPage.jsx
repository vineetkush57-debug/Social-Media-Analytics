import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { uploadPostsFile, triggerSeedDemo } from '../services/api';
import { Database, Upload, CheckCircle2, RefreshCw, FileText, AlertCircle, Sparkles } from 'lucide-react';

export const DataSourcesPage = ({ onRefreshData }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const sources = [
    { name: 'X (Twitter)', posts: 1420, users: 340, status: 'Active Ingestion', live: 'Demo Mode', color: 'indigo' },
    { name: 'Telegram', posts: 890, users: 180, status: 'Active Ingestion', live: 'Demo Mode', color: 'cyan' },
    { name: 'Instagram', posts: 650, users: 120, status: 'Active Ingestion', live: 'Demo Mode', color: 'purple' },
    { name: 'Reddit', posts: 920, users: 210, status: 'Active Ingestion', live: 'Demo Mode', color: 'rose' },
    { name: 'YouTube', posts: 410, users: 95, status: 'Active Ingestion', live: 'Demo Mode', color: 'emerald' },
  ];

  const processFile = async (file) => {
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);
    try {
      const res = await uploadPostsFile(file);
      setUploadStatus({ type: 'success', data: res });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      setUploadStatus({ 
        type: 'error', 
        text: err.response?.data?.detail || err.message || 'Failed to process file upload.' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processFile(file);
    }
    e.target.value = ''; // Reset input so same file can be re-selected
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const res = await triggerSeedDemo();
      setSeedMessage({ type: 'success', text: res.message });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      setSeedMessage({ type: 'error', text: 'Error triggering seed demo database.' });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 font-bold uppercase mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>INGESTION PIPELINES</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            DATA SOURCES & FILE INGESTION
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage active social media feeds, upload custom JSON/CSV datasets, or trigger demo database re-seeding.
          </p>
        </div>

        <button
          onClick={handleSeedDemo}
          disabled={seeding}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
          <span>SEED DEMO DATASET</span>
        </button>
      </div>

      {seedMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
          seedMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{seedMessage.text}</span>
        </div>
      )}

      {/* Social Platforms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {sources.map((src, idx) => (
          <GlassCard key={idx} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">{src.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="space-y-1 mb-4">
                <div className="text-2xl font-bold text-white font-mono">{src.posts.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Posts Indexed</div>
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-3 text-[11px] text-slate-400 flex justify-between">
              <span>{src.users} users</span>
              <span className="text-indigo-400 font-mono">{src.live}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* CSV / JSON Drag & Drop Upload Section */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`glass-panel p-8 rounded-2xl transition-all border-2 border-dashed ${
          isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' : 'border-white/10 hover:border-indigo-500/40'
        }`}
      >
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
            <Upload className={`w-6 h-6 ${isDragging ? 'animate-bounce' : ''}`} />
          </div>

          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            {isDragging ? 'DROP YOUR CSV / JSON FILE HERE' : 'DYNAMIC FILE INGESTION ENGINE'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Drag and drop or select custom CSV/JSON files (supports <code className="text-indigo-300 font-mono">post_text</code>, <code className="text-indigo-300 font-mono">entity</code>, <code className="text-indigo-300 font-mono">entity_type</code>, <code className="text-indigo-300 font-mono">hashtags</code>, <code className="text-indigo-300 font-mono">likes</code>, <code className="text-indigo-300 font-mono">sentiment</code>).
          </p>

          <label className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-indigo-600/30 cursor-pointer transition-all">
            <FileText className="w-4 h-4" />
            <span>{uploading ? 'PROCESSING & VALIDATING FILE...' : 'SELECT CSV / JSON FILE'}</span>
            <input type="file" accept=".csv,.json,.txt" onChange={handleFileChange} disabled={uploading} className="hidden" />
          </label>

          {/* Upload Results Validation Logging */}
          {uploadStatus && (
            <div className="mt-6 text-left space-y-3">
              {uploadStatus.type === 'success' ? (
                <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{uploadStatus.data.message}</span>
                  </div>

                  {/* Diagnostic Counts Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2 border-t border-emerald-500/20 font-mono">
                    <div className="p-2 rounded bg-black/20">
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Rows Read</span>
                      <strong className="text-white">{uploadStatus.data.rows_read}</strong>
                    </div>
                    <div className="p-2 rounded bg-black/20">
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Valid Content</span>
                      <strong className="text-cyan-400">{uploadStatus.data.rows_valid}</strong>
                    </div>
                    <div className="p-2 rounded bg-black/20">
                      <span className="text-[10px] text-emerald-400 block uppercase font-sans">Inserted DB</span>
                      <strong className="text-emerald-400 font-bold">{uploadStatus.data.rows_inserted}</strong>
                    </div>
                    <div className="p-2 rounded bg-black/20">
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Skipped</span>
                      <strong className="text-amber-400">{uploadStatus.data.rows_skipped}</strong>
                    </div>
                  </div>

                  {uploadStatus.data.rows_skipped > 0 && uploadStatus.data.skip_reasons && (
                    <div className="text-[11px] text-amber-300 font-mono">
                      Skip reasons: {JSON.stringify(uploadStatus.data.skip_reasons)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-semibold text-rose-300 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{uploadStatus.text}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
