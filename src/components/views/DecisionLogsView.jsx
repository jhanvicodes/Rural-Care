import React, { useState } from 'react';
import { FileText, CheckCircle2, AlertTriangle, Search, Filter, ArrowRight, Route } from 'lucide-react';

export default function DecisionLogsView({ decisionLog, onSelectLog }) {
  const [search, setSearch] = useState('');
  const [filterEngine, setFilterEngine] = useState('ALL');

  const filteredLogs = (decisionLog || []).filter((log) => {
    const matchesSearch =
      log.id?.toLowerCase().includes(search.toLowerCase()) ||
      log.request?.condition?.toLowerCase().includes(search.toLowerCase()) ||
      log.request?.originLabel?.toLowerCase().includes(search.toLowerCase()) ||
      log.selected?.hospital?.shortLabel?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterEngine === 'CONSTRAINT') return log.engine === 'CONSTRAINT';
    if (filterEngine === 'NAIVE') return log.engine === 'NAIVE';
    return true;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Historical Decision Logs</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Audit trail of every algorithmic dispatch decision, hospital candidate evaluation, and constraint override.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-[#E2E8F0] gap-1 text-xs">
            {['ALL', 'CONSTRAINT', 'NAIVE'].map((e) => (
              <button
                key={e}
                onClick={() => setFilterEngine(e)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterEngine === e
                    ? 'bg-[#0D5C46] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {e === 'ALL' ? 'All Engines' : e === 'CONSTRAINT' ? 'Multi-Factor' : 'Naive Dijkstra'}
              </button>
            ))}
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Dispatch # or Village..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38D9A9]"
            />
          </div>
        </div>
      </div>

      {/* Decision Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B] space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto text-[#94A3B8]">
              <FileText size={20} />
            </div>
            <p className="font-bold text-sm text-[#0F172A]">No dispatch records match your search</p>
            <p>Trigger an emergency from the Command Center to record live dispatch decisions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC]">
                <tr>
                  <th className="px-6 py-3.5">Dispatch ID</th>
                  <th className="px-6 py-3.5">Emergency Incident</th>
                  <th className="px-6 py-3.5">Origin Village</th>
                  <th className="px-6 py-3.5">Assigned Unit</th>
                  <th className="px-6 py-3.5">Destination Hospital</th>
                  <th className="px-6 py-3.5">Engine Score</th>
                  <th className="px-6 py-3.5 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredLogs.map((log) => {
                  const isConstraint = log.engine === 'CONSTRAINT';
                  const isCritical = log.request?.urgency === 1;

                  return (
                    <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#0F172A]">
                        {log.id?.replace('DISPATCH-', 'ER-')}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span>{log.request?.emoji}</span>
                          <div>
                            <div className="font-bold text-[#0F172A]">{log.request?.condition}</div>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                isCritical ? 'bg-[#FFE4E6] text-[#E11D48]' : 'bg-[#FEF3C7] text-[#D97706]'
                              }`}
                            >
                              {log.request?.urgencyLabel}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-[#475569]">
                        {log.request?.originLabel}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-[#D97706]">
                          {log.selected?.ambulance?.id}
                        </span>
                        <div className="text-[10px] text-[#64748B]">ETA {log.selected?.pickupTime}m</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F172A]">
                          {log.selected?.hospital?.shortLabel}
                        </div>
                        <div className="text-[10px] text-[#059669]">
                          {log.overflow ? '⚠️ Overflow Apex' : 'Optimal Route'}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-[#0D5C46]">
                        {isConstraint
                          ? `Cost: ${log.selected?.finalCost?.toFixed(1)}`
                          : `${log.selected?.totalTravelTime}m (Travel)`}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onSelectLog(log)}
                          className="px-3 py-1.5 bg-[#0D5C46] hover:bg-[#094736] text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ml-auto"
                        >
                          <span>Inspect</span>
                          <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
