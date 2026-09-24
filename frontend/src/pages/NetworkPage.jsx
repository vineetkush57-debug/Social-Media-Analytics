import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { GlassCard } from '../components/GlassCard';
import { fetchNetwork } from '../services/api';
import { Network, X, Search, Award, Users, Share2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

export const NetworkPage = () => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadNetwork = async () => {
    setLoading(true);
    try {
      const data = await fetchNetwork();
      setNetworkData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetwork();
  }, []);

  useEffect(() => {
    if (!networkData || !containerRef.current) return;

    // Convert API nodes/edges to Cytoscape format
    const cyElements = [];

    const communityColors = {
      1: '#6366F1', // indigo
      2: '#06B6D4', // cyan
      3: '#8B5CF6', // purple
      4: '#10B981', // emerald
      5: '#F43F5E', // rose
    };

    networkData.nodes.forEach((n) => {
      cyElements.push({
        data: {
          id: n.id,
          label: `@${n.label}`,
          followers: n.followers,
          influence: n.influence_score,
          community: n.community,
          degree: n.degree_centrality,
          betweenness: n.betweenness_centrality,
          pagerank: n.pagerank,
          color: communityColors[n.community] || '#6366F1',
          size: Math.max(24, Math.min(60, n.pagerank * 4.5)),
        },
      });
    });

    networkData.edges.forEach((e, idx) => {
      cyElements.push({
        data: {
          id: `e_${idx}`,
          source: e.source,
          target: e.target,
          type: e.type,
          weight: e.weight,
        },
      });
    });

    const cy = cytoscape({
      container: containerRef.current,
      elements: cyElements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': '#ffffff',
            'font-size': '11px',
            'font-family': 'Inter, sans-serif',
            'font-weight': 'bold',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'width': 'data(size)',
            'height': 'data(size)',
            'border-width': 2,
            'border-color': 'rgba(255,255,255,0.4)',
            'overlay-padding': '4px',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#ffffff',
            'shadow-blur': 25,
            'shadow-color': 'data(color)',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': 'rgba(99, 102, 241, 0.25)',
            'target-arrow-color': 'rgba(99, 102, 241, 0.4)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'cose',
        animate: true,
        padding: 40,
        nodeRepulsion: 8000,
      },
    });

    cy.on('tap', 'node', (evt) => {
      const nodeData = evt.target.data();
      setSelectedNode(nodeData);
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
      }
    });

    cyRef.current = cy;

    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, [networkData]);

  const handleSearchNode = (e) => {
    e.preventDefault();
    if (!cyRef.current || !searchQuery.trim()) return;

    const found = cyRef.current.nodes().filter((n) => 
      n.data('label').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (found.length > 0) {
      cyRef.current.animate({
        center: { eles: found },
        zoom: 1.5,
      });
      found.select();
      setSelectedNode(found.data());
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto select-none relative">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 font-bold uppercase mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>NETWORKX TOPOLOGY GRAPH ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            NETWORK & INFLUENCE INTELLIGENCE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Interactive graph visualizing user nodes, interaction edges, PageRank centrality, and detected community clusters.
          </p>
        </div>

        {/* Stats Summary Bar */}
        <div className="flex items-center space-x-4 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">COMMUNITIES</span>
            <span className="font-bold text-indigo-400 font-mono text-sm">{networkData?.communities_count || 0} Clusters</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">TOP HUB USER</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">@{networkData?.top_hub_user}</span>
          </div>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
        {/* Cytoscape Canvas View */}
        <div className="lg:col-span-3 glass-panel rounded-2xl border border-white/10 relative h-[650px] overflow-hidden">
          {/* Controls Bar Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
            <form onSubmit={handleSearchNode} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find handle..."
                className="px-3 py-1.5 rounded-lg bg-dark-900/90 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none w-36"
              />
              <button type="submit" className="p-1.5 ml-1 rounded-lg bg-indigo-600 text-white text-xs">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <button
              onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.2)}
              className="p-2 rounded-lg bg-dark-900/90 border border-white/10 text-slate-300 hover:text-white text-xs"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)}
              className="p-2 rounded-lg bg-dark-900/90 border border-white/10 text-slate-300 hover:text-white text-xs"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => cyRef.current?.fit()}
              className="p-2 rounded-lg bg-dark-900/90 border border-white/10 text-slate-300 hover:text-white text-xs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Cytoscape Mount Container */}
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Selected Node Details Drawer Panel */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between h-[650px]">
          {selectedNode ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">SELECTED NODE</span>
                  <h3 className="text-xl font-extrabold text-white">{selectedNode.label}</h3>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex justify-between">
                  <span className="text-slate-400">Influence Score</span>
                  <span className="font-bold text-purple-400 font-mono">{selectedNode.influence} / 100</span>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex justify-between">
                  <span className="text-slate-400">PageRank Centrality</span>
                  <span className="font-bold text-cyan-400 font-mono">{selectedNode.pagerank}</span>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex justify-between">
                  <span className="text-slate-400">Betweenness Centrality</span>
                  <span className="font-bold text-emerald-400 font-mono">{selectedNode.betweenness}</span>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex justify-between">
                  <span className="text-slate-400">Community Cluster</span>
                  <span className="font-bold text-indigo-300 font-mono">Cluster #{selectedNode.community}</span>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex justify-between">
                  <span className="text-slate-400">Followers Count</span>
                  <span className="font-bold text-white font-mono">{selectedNode.followers?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-slate-500">
              <Share2 className="w-10 h-10 text-indigo-400/40" />
              <p className="text-xs font-semibold text-slate-400">Click any user node in the graph to inspect detailed network centralities.</p>
            </div>
          )}

          <div className="border-t border-white/10 pt-4 text-[10px] text-slate-500 text-center">
            NetworkX Centrality Calculation Engine
          </div>
        </div>
      </div>
    </div>
  );
};
