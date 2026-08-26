import React from 'react';
import { BarChart3, TrendingUp, Cpu, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AnalyticsView({ stats, decisionLog, engine }) {
  const total = stats?.total || 0;
  const overflow = stats?.overflow || 0;
  const completed = stats?.completed || 0;

  // Calculate divergence count
  const divergences = decisionLog.filter((log) => {
    if (log.engine !== 'CONSTRAINT') return false;
    const naiveChoice = log.evaluations?.find((e) => e.travelTime != null);
    return naiveChoice && naiveChoice.hospital?.id !== log.selected?.hospital?.id;
  }).length;

  const divergencePct = total > 0 ? Math.round((divergences / total) * 100) : 0;

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] space-y-6 select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Algorithmic Benchmark &amp; Analytics</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Evaluating Multi-Factor Constraint-Aware routing effectiveness against baseline Dijkstra distance-only routing.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
          <span className="text-[11px] font-bold text-[#64748B] uppercase">Total Incidents Handled</span>
          <div className="text-3xl font-bold text-[#0F172A] mt-1 font-sans">{total}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
          <span className="text-[11px] font-bold text-[#64748B] uppercase">Completed Dispatches</span>
          <div className="text-3xl font-bold text-[#059669] mt-1 font-sans">{completed}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
          <span className="text-[11px] font-bold text-[#64748B] uppercase">Routing Divergence Rate</span>
          <div className="text-3xl font-bold text-[#0D5C46] mt-1 font-sans">{divergencePct}%</div>
          <p className="text-[10px] text-[#64748B] mt-1">{divergences} instances where constraint prevented misdirection</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
          <span className="text-[11px] font-bold text-[#64748B] uppercase">Apex Overflow Events</span>
          <div className="text-3xl font-bold text-[#E11D48] mt-1 font-sans">{overflow}</div>
          <p className="text-[10px] text-[#64748B] mt-1">When local facilities lacked specialty capacity</p>
        </div>
      </div>

      {/* Comparison Explanatory Card */}
      <div className="p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
          <Cpu size={18} className="text-[#0D5C46]" />
          <span>Algorithmic Comparison: Why Multi-Factor Routing Saves Lives</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FEF3C7] space-y-2">
            <span className="font-bold text-[#92400E]">Baseline Naive Dijkstra</span>
            <p className="text-[#78350F] leading-relaxed">
              Minimizes road travel distance only. In rural scenarios, it frequently sends critical cardiac patients to local clinics that <strong>lack cardiologists, stents, or ICU beds</strong>, requiring dangerous secondary transfers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] space-y-2">
            <span className="font-bold text-[#065F46]">RuralCare Multi-Factor Engine</span>
            <p className="text-[#047857] leading-relaxed">
              Enforces hard clinical feasibility (specialist availability &amp; open beds), adds queue waiting time penalties, and balances pharmaceutical inventory to direct the ambulance to the true optimal care center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
