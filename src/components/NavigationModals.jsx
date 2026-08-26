import React from 'react';
import {
  X,
  Truck,
  Building2,
  Package,
  FileText,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function NavigationModals({
  activeTab,
  onClose,
  ambulances,
  hospitals,
  decisionLog,
  stats,
  onSelectDecisionLog,
  engine,
}) {
  if (!activeTab || activeTab === 'command' || activeTab === 'settings') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] flex items-center justify-center text-[#0D5C46]">
              {activeTab === 'ambulances' && <Truck size={20} />}
              {activeTab === 'hospitals' && <Building2 size={20} />}
              {activeTab === 'inventory' && <Package size={20} />}
              {activeTab === 'logs' && <FileText size={20} />}
              {activeTab === 'analytics' && <BarChart3 size={20} />}
              {activeTab === 'requests' && <Clock size={20} />}
              {activeTab === 'network' && <Cpu size={20} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {activeTab === 'ambulances' && 'Ambulance Fleet Status'}
                {activeTab === 'hospitals' && 'Hospitals & Medical Infrastructure'}
                {activeTab === 'inventory' && 'Pharmaceutical & Medical Supplies'}
                {activeTab === 'logs' && 'Historical Decision Logs'}
                {activeTab === 'analytics' && 'Algorithmic Benchmark & Analytics'}
                {activeTab === 'requests' && 'Live & Queued Requests'}
                {activeTab === 'network' && 'Graph Road Topology & Weights'}
              </h3>
              <p className="text-xs text-[#64748B]">Real-time operational telemetry &amp; live parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* AMBULANCES VIEW */}
          {activeTab === 'ambulances' && (
            <div className="space-y-3">
              {ambulances.map((amb) => (
                <div
                  key={amb.id}
                  className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#F59E0B] font-bold">
                      🚑
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0F172A]">{amb.id}</div>
                      <div className="text-xs text-[#64748B]">
                        Current Node: <strong>{amb.currentNode}</strong> · Base: <strong>{amb.stationedAt}</strong>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      amb.status === 'IDLE'
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : amb.status === 'EN_ROUTE_PICKUP'
                        ? 'bg-[#E0F2FE] text-[#0369A1]'
                        : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}
                  >
                    {amb.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* HOSPITALS VIEW */}
          {activeTab === 'hospitals' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {hospitals.map((hosp) => (
                <div key={hosp.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-[#0F172A]">{hosp.shortLabel}</div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[#475569]">
                      Tier {hosp.tier}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#64748B]">
                    <div className="flex justify-between">
                      <span>Available Beds:</span>
                      <strong className="text-[#15803D]">{hosp.availableBeds} / {hosp.totalBeds}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Queue Wait:</span>
                      <strong className="text-[#D97706]">{hosp.queueWaitMin} min</strong>
                    </div>
                    <div>
                      <span>Specialties:</span>
                      <div className="text-[#0F172A] font-semibold mt-0.5">{hosp.specialties.join(', ')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INVENTORY VIEW */}
          {activeTab === 'inventory' && (
            <div className="space-y-3">
              {hospitals.map((hosp) => (
                <div key={hosp.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm">
                  <div className="text-sm font-bold text-[#0F172A] mb-2">{hosp.label}</div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-[#E2E8F0] text-center">
                      <span className="text-[#64748B]">Stents</span>
                      <div className="text-base font-bold text-[#0F172A] mt-1">{hosp.inventory.stents}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-[#E2E8F0] text-center">
                      <span className="text-[#64748B]">Antivenom Vials</span>
                      <div className="text-base font-bold text-[#0F172A] mt-1">{hosp.inventory.antivenom}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-[#E2E8F0] text-center">
                      <span className="text-[#64748B]">IV Bags</span>
                      <div className="text-base font-bold text-[#0F172A] mt-1">{hosp.inventory.iv}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DECISION LOGS VIEW */}
          {activeTab === 'logs' && (
            <div className="space-y-2.5">
              {decisionLog.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#64748B]">No historical decisions recorded yet.</div>
              ) : (
                decisionLog.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => {
                      onSelectDecisionLog(log);
                      onClose();
                    }}
                    className="w-full text-left p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#38D9A9] hover:bg-white transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0F172A]">{log.id}</span>
                        <span className="text-xs font-bold text-[#E11D48]">{log.request?.condition}</span>
                      </div>
                      <div className="text-[11px] text-[#64748B] mt-0.5">
                        Selected: <strong>{log.selected?.hospital?.shortLabel}</strong> via <strong>{log.selected?.ambulance?.id}</strong>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#0D5C46]">View Inspection →</span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* ANALYTICS VIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-xs space-y-2">
                <div className="font-bold text-[#166534] flex items-center gap-1.5">
                  <TrendingUp size={16} />
                  <span>Engine Routing Divergence Metric</span>
                </div>
                <p className="text-[#1F2937]">
                  The Multi-Factor Constraint-Aware Engine evaluates clinical specialties, bed capacity, doctor queue wait times, and medication penalties. The baseline Naive Dijkstra engine purely minimizes travel distance.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                  <span className="text-[#64748B]">Total Dispatches Handled:</span>
                  <div className="text-xl font-bold text-[#0F172A] mt-1">{stats?.total || 0}</div>
                </div>
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                  <span className="text-[#64748B]">Overflow Incidents:</span>
                  <div className="text-xl font-bold text-[#E11D48] mt-1">{stats?.overflow || 0}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
