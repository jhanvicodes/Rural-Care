import React from 'react';
import { Network, GitBranch, MapPin, Gauge, ShieldCheck } from 'lucide-react';
import { EDGES_DEF, INITIAL_VILLAGES, INITIAL_HOSPITALS } from '../../data/network.js';

export default function RoutesNetworkView({ onSwitchToMap }) {
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Road Network &amp; Graph Topology</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Dijkstra road weights, distance in kilometers, estimated travel times, and terrain corridors.
          </p>
        </div>

        <button
          onClick={onSwitchToMap}
          className="px-3.5 py-2 bg-[#0D5C46] text-white rounded-xl text-xs font-semibold hover:bg-[#094736] transition-all"
        >
          Open Visual Canvas
        </button>
      </div>

      {/* Network Edges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {EDGES_DEF.map(([from, to, dist, time], idx) => {
          const fromNode = INITIAL_VILLAGES.find((v) => v.id === from) || INITIAL_HOSPITALS.find((h) => h.id === from);
          const toNode = INITIAL_VILLAGES.find((v) => v.id === to) || INITIAL_HOSPITALS.find((h) => h.id === to);

          return (
            <div key={idx} className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#0D5C46]">CORRIDOR #{idx + 1}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                  Paved Highway
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                  <span>{fromNode?.label || from}</span>
                  <span className="text-[#94A3B8]">↔</span>
                  <span>{toNode?.label || to}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[#64748B] font-sans text-[11px]">Distance:</span>
                  <div className="font-bold text-[#0F172A]">{dist} km</div>
                </div>
                <div>
                  <span className="text-[#64748B] font-sans text-[11px]">Travel Time:</span>
                  <div className="font-bold text-[#0D5C46]">{time} min</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
