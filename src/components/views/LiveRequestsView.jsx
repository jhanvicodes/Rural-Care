import React from 'react';
import { Zap, Clock, AlertTriangle, MapPin, ArrowRight, Activity, Plus } from 'lucide-react';

export default function LiveRequestsView({
  activeDispatches,
  queuedRequests,
  onOpenNewDispatch,
  onSwitchToMap,
}) {
  const activeList = Array.from(activeDispatches.values());

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Live Requests &amp; Priority Queue</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Active in-flight emergency dispatches and pending priority queue requests.
          </p>
        </div>

        <button
          onClick={onOpenNewDispatch}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0D5C46] hover:bg-[#094736] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus size={15} className="text-[#38D9A9]" />
          <span>New Emergency</span>
        </button>
      </div>

      {/* Active Dispatches Section */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span>Active In-Transit Dispatches ({activeList.length})</span>
        </div>

        {activeList.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
            No active emergencies currently in transit.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeList.map((d) => (
              <div
                key={d.request?.dispatchId}
                className="p-5 bg-white rounded-2xl border border-[#E11D48] shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{d.request?.emoji}</span>
                      <div>
                        <div className="font-bold text-sm text-[#0F172A]">{d.request?.condition}</div>
                        <span className="text-[11px] text-[#E11D48] font-bold">{d.request?.urgencyLabel} PRIORITY</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFE4E6] text-[#E11D48]">
                      ETA {d.selected?.pickupTime}m
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#64748B]">Patient / Origin:</span>
                      <div className="font-semibold text-[#0F172A] mt-0.5">{d.request?.originLabel}</div>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Assigned Unit:</span>
                      <div className="font-mono font-bold text-[#D97706] mt-0.5">{d.selected?.ambulance?.id}</div>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Destination:</span>
                      <div className="font-semibold text-[#059669] mt-0.5">{d.selected?.hospital?.shortLabel}</div>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Total Travel:</span>
                      <div className="font-mono font-bold text-[#0F172A] mt-0.5">{d.selected?.totalTravelTime} mins</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onSwitchToMap}
                  className="w-full py-2 bg-[#0D5C46] text-white rounded-xl text-xs font-semibold hover:bg-[#094736] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Track Live on Map</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Priority Queue Section */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
          <Clock size={14} className="text-[#F59E0B]" />
          <span>Priority Queue Waiting Buffer ({queuedRequests?.length || 0})</span>
        </div>

        {queuedRequests?.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
            Priority queue is clear. All available units dispatched.
          </div>
        ) : (
          <div className="space-y-2">
            {queuedRequests.map((req, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-xl border border-[#FDE68A] flex items-center justify-between text-xs shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold flex items-center justify-center text-[11px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-[#0F172A]">{req.condition} ({req.originLabel})</div>
                    <span className="text-[11px] text-[#64748B]">Specialty Req: {req.specialty}</span>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFE4E6] text-[#E11D48]">
                  {req.urgencyLabel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
