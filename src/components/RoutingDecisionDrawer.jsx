import React, { useState } from 'react';
import {
  Route,
  X,
  MapPin,
  Truck,
  Building2,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  FileText
} from 'lucide-react';
import PatientRecordModal from './modals/PatientRecordModal.jsx';

export default function RoutingDecisionDrawer({
  log,
  isOpen,
  onClose,
  onSelectAnotherLog,
  allLogs,
}) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPatientRecord, setShowPatientRecord] = useState(false);

  if (!isOpen || !log) return null;

  const { id, engine, request, selected, evaluations, overflow, verdict, trace } = log;
  const isConstraint = engine === 'CONSTRAINT';

  const dispatchCode = id ? id.replace('DISPATCH-', 'ER-') : 'ER-1001';

  // Generate plain English conversational decision reasoning
  const generateConversationalReasoning = () => {
    if (!evaluations || evaluations.length === 0) {
      return {
        points: [verdict || 'Standard route dispatch.'],
        highlight: 'Hospital selected based on shortest road network distance.',
      };
    }

    if (overflow) {
      return {
        points: [
          <span key="overflow1"><strong>No local hospital</strong> satisfied the hard specialty (<strong>{request.specialty}</strong>) and bed-capacity constraints.</span>,
          <span key="overflow2"><strong>{selected?.hospital?.shortLabel || 'Sassoon Apex'}</strong> selected as <strong>Emergency Overflow Fallback</strong> (highest-tier facility).</span>
        ],
        highlight: '⚠️ Overflow override triggered — routing to regional apex center.',
      };
    }

    if (!isConstraint) {
      return {
        points: [
          <span key="naive1">Baseline <strong>Naive Dijkstra</strong> algorithm evaluated all available units purely on <strong>road travel time</strong>.</span>,
          <span key="naive2">Selected <strong>{selected?.hospital?.shortLabel}</strong> (Total travel: <strong>{selected?.totalTravelTime} min</strong>). Clinical specialty, bed occupancy, and medicine shortages were ignored.</span>
        ],
        highlight: `Baseline travel-time optimal route: ${selected?.hospital?.shortLabel}`,
      };
    }

    // Constraint engine reasoning
    const disqualified = evaluations.filter((e) => e.status === 'DISQUALIFIED');
    const points = [];

    if (disqualified.length > 0) {
      disqualified.forEach((d) => {
        const reasons = d.disqualifyReasons?.join(' and ') || 'lacks specialty or beds';
        points.push(
          <span key={d.hospital.id}>
            <strong>{d.hospital.shortLabel}</strong> was evaluated, but <span className="text-[#E11D48] font-semibold">{reasons}</span> on duty.
          </span>
        );
      });
    }

    if (selected?.hospital) {
      points.push(
        <span key="winner">
          <strong>{selected.hospital.shortLabel}</strong> satisfies all hard constraints with an <strong>on-duty {request.specialty} specialist</strong>, open beds, and lowest total response cost ({selected.finalCost?.toFixed(1)}).
        </span>
      );
    }

    return {
      points,
      highlight: `✓ ${selected?.hospital?.shortLabel || 'Hospital'} selected based on clinical specialty & capacity constraints.`,
    };
  };

  const reasoning = generateConversationalReasoning();

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[440px] bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col drawer-slide-in select-none">
      {/* ── Header Row matching Screenshot 2 ── */}
      <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D48] shadow-sm">
            <Route size={20} />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-[#0F172A] tracking-tight leading-tight">
              Routing Decision
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs font-semibold text-[#64748B]">
                {dispatchCode}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  request.urgency === 1 ? 'bg-[#FFE4E6] text-[#E11D48]' : 'bg-[#FEF3C7] text-[#D97706]'
                }`}
              >
                {request.urgencyLabel}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Scrollable Inspector Body ── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* ── Vertical Timeline Stepper matching Screenshot 2 ── */}
        <div className="relative pl-6 space-y-5">
          <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-[#E2E8F0]" />

          {/* STEP 1: ORIGIN */}
          <div className="relative flex items-start gap-3">
            <div className="absolute -left-[23px] top-0.5 w-[20px] h-[20px] rounded-full bg-white border-2 border-[#10B981] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Origin
              </span>
              <div className="text-sm font-bold text-[#0F172A]">
                {request.originLabel || request.origin}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">
                {request.condition} · <span className="font-semibold text-[#E11D48]">{request.specialty}</span>
              </div>
            </div>
          </div>

          {/* STEP 2: ASSIGNED UNIT */}
          <div className="relative flex items-start gap-3">
            <div className="absolute -left-[23px] top-2 w-[20px] h-[20px] rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[10px] shadow-sm">
              🚑
            </div>
            <div className="w-full bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#92400E] uppercase tracking-wider">
                    Assigned Unit
                  </span>
                  <div className="text-sm font-bold text-[#78350F]">
                    {selected?.ambulance?.id || 'AMB-01'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold text-[#92400E]">
                    ETA: {selected?.pickupTime || 4}m
                  </span>
                  <div className="text-[10px] text-[#B45309]">
                    Total {selected?.totalTravelTime || 30} min
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: DESTINATION */}
          <div className="relative flex items-start gap-3">
            <div className="absolute -left-[23px] top-0.5 w-[20px] h-[20px] rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
              +
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Destination
              </span>
              <div className="text-sm font-bold text-[#0F172A]">
                {selected?.hospital?.label || 'Hospital'}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">
                {selected?.hospital?.specialties?.join(' · ')}
              </div>
            </div>
          </div>
        </div>

        {/* ── DECISION LOGIC CARD matching Screenshot 2 ── */}
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#166534] tracking-wider uppercase">
            <Compass size={15} />
            <span>Decision Logic</span>
          </div>

          <div className="text-[12.5px] text-[#1F2937] leading-relaxed space-y-2">
            {reasoning.points.map((pt, idx) => (
              <p key={idx}>{pt}</p>
            ))}
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#14532D] text-xs font-semibold">
            <CheckCircle2 size={16} className="text-[#15803D] flex-shrink-0" />
            <span>{reasoning.highlight}</span>
          </div>
        </div>

        {/* ── Candidate Analysis Collapsible ── */}
        <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-[#F8FAFC]">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-[#334155] hover:bg-[#F1F5F9] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-[#64748B]" />
              <span>Candidate Facilities Analysis</span>
            </div>
            {showAnalysis ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showAnalysis && (
            <div className="p-4 pt-0 border-t border-[#E2E8F0] space-y-4 text-xs">
              <div className="mt-3 space-y-2">
                {evaluations?.map((e, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border ${
                      e.status === 'SELECTED'
                        ? 'bg-white border-[#38D9A9] shadow-sm'
                        : e.status === 'DISQUALIFIED'
                        ? 'bg-[#FFF1F2]/60 border-[#FFE4E6]'
                        : 'bg-white border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#0F172A]">{e.hospital?.shortLabel}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          e.status === 'SELECTED'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : e.status === 'DISQUALIFIED'
                            ? 'bg-[#FFE4E6] text-[#E11D48]'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                      >
                        {e.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-[#64748B] mt-2">
                      <div>
                        <span>Specialist: </span>
                        <strong className={e.specialistAvailable ? 'text-[#15803D]' : 'text-[#E11D48]'}>
                          {e.specialistAvailable ? 'Yes' : 'No'}
                        </strong>
                      </div>
                      <div>
                        <span>Beds: </span>
                        <strong className="text-[#0F172A]">{e.hospital?.availableBeds}</strong>
                      </div>
                      <div>
                        <span>Travel: </span>
                        <strong className="text-[#0F172A]">{e.travelTime || e.totalTravelTime}m</strong>
                      </div>
                    </div>

                    {e.finalCost != null && (
                      <div className="mt-2 pt-1.5 border-t border-[#F1F5F9] flex justify-between font-mono text-[11px]">
                        <span className="text-[#64748B]">Multi-Factor Cost:</span>
                        <span className="font-bold text-[#0D5C46]">{e.finalCost.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selected?.costBreakdown && isConstraint && (
                <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] space-y-1.5 font-mono text-[11px] text-[#475569]">
                  <div className="font-bold text-[#0F172A] font-sans text-xs mb-1">Cost Formula</div>
                  <div className="flex justify-between">
                    <span>Travel (1.0 × {selected.costBreakdown.travelTime}m):</span>
                    <span>+{selected.costBreakdown.travelComponent.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Queue Wait (0.8 × {selected.costBreakdown.queueWait}m):</span>
                    <span>+{selected.costBreakdown.queueComponent.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medicine Penalty (2.0 × {selected.costBreakdown.medicinePenalty}):</span>
                    <span>+{selected.costBreakdown.medicineComponent.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-[#15803D]">
                    <span>Urgency Bonus (1.0 × {selected.costBreakdown.urgencyScore}):</span>
                    <span>-{selected.costBreakdown.urgencyComponent.toFixed(1)}</span>
                  </div>
                  <div className="pt-1 border-t border-[#E2E8F0] flex justify-between font-bold text-[#0F172A]">
                    <span>Total Score:</span>
                    <span>{selected.finalCost?.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Action Button matching Screenshot 2 ── */}
      <div className="p-4 border-t border-[#E2E8F0] bg-white">
        <button
          onClick={() => setShowPatientRecord(true)}
          className="w-full py-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-semibold text-xs shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
        >
          <FileText size={14} />
          <span>View Full Patient Record</span>
        </button>
      </div>

      {/* Patient Record Modal */}
      <PatientRecordModal
        log={log}
        isOpen={showPatientRecord}
        onClose={() => setShowPatientRecord(false)}
      />
    </div>
  );
}
