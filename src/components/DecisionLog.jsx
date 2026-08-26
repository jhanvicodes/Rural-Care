import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, ChevronDown, ChevronRight, X } from 'lucide-react';

// ── De-duplicate evaluations by hospital ─────────────────
function deduplicateEvals(evaluations) {
  const byHospital = {};
  (evaluations || []).forEach(e => {
    const hid = e.hospital.id;
    if (!byHospital[hid]) { byHospital[hid] = e; return; }
    const prev = byHospital[hid];
    if (e.status === 'SELECTED') { byHospital[hid] = e; return; }
    if (prev.status !== 'SELECTED' && e.finalCost !== null &&
        (prev.finalCost === null || e.finalCost < prev.finalCost)) {
      byHospital[hid] = e;
    }
  });
  return Object.values(byHospital);
}

// ── Urgency badge ─────────────────────────────────────────
const URGENCY_BADGE = {
  1: 'bg-rose-50 text-rose-700 border border-rose-200',
  2: 'bg-amber-50 text-amber-700 border border-amber-100',
  3: 'bg-slate-100 text-slate-500 border border-slate-200',
};

// ── Candidate rows ────────────────────────────────────────
function CandidateRows({ evaluations, engine }) {
  const rows = deduplicateEvals(evaluations);

  return (
    <div className="space-y-1.5">
      {rows.map((e, i) => {
        const isSelected  = e.status === 'SELECTED' || e.status === 'FALLBACK';
        const isDisq      = e.status === 'DISQUALIFIED';

        return (
          <div key={i}
            className={`rounded-xl border px-3 py-2.5 transition-all duration-200
              ${isSelected  ? 'border-indigo-200 bg-indigo-50'
              : isDisq      ? 'border-slate-200 bg-slate-50 opacity-60'
              :               'border-slate-200 bg-white'}`}>
            <div className="flex items-center justify-between">
              {/* Left: hospital + reason */}
              <div className="flex items-center gap-2 min-w-0">
                {isSelected ? (
                  <CheckCircle size={14} className="text-indigo-500 flex-shrink-0"/>
                ) : isDisq ? (
                  <X size={14} className="text-slate-400 flex-shrink-0"/>
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0"/>
                )}
                <div className="min-w-0">
                  <span className={`text-xs font-semibold tracking-tight
                    ${isSelected ? 'text-indigo-800' : isDisq ? 'text-slate-400' : 'text-slate-700'}`}>
                    {e.hospital.shortLabel}
                  </span>
                  {isDisq && e.disqualifyReasons?.length > 0 && (
                    <span className="ml-1.5 text-xs text-slate-400 font-normal">
                      — {e.disqualifyReasons.join(', ')}
                    </span>
                  )}
                  {isSelected && !isDisq && (
                    <span className="ml-1.5 text-xs text-indigo-500 font-normal">
                      {e.status === 'FALLBACK' ? '· overflow fallback' : '· lowest cost'}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: metrics */}
              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  {e.totalDistance != null ? `${e.totalDistance} km` : '—'}
                </span>
                {e.specialistAvailable
                  ? <span className="text-emerald-600 text-xs">✓ Spec</span>
                  : <span className="text-slate-400 text-xs">✕ Spec</span>}
                <span className="text-xs text-slate-500">{e.hospital.availableBeds} beds</span>
                {e.finalCost != null && (
                  <span className={`font-mono text-xs font-semibold tabular-nums
                    ${isSelected ? 'text-indigo-700' : 'text-slate-600'}`}>
                    {engine === 'NAIVE' ? `${e.finalCost.toFixed(0)} min` : e.finalCost.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Cost breakdown ────────────────────────────────────────
function CostBreakdown({ breakdown, engine }) {
  const [open, setOpen] = useState(false);
  if (!breakdown || engine === 'NAIVE') return null;

  return (
    <div>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors mt-2">
        {open ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
        Cost breakdown
      </button>
      {open && (
        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs space-y-1.5">
          {[
            {
              label: `Travel  ·  ${breakdown.travelTime} min × ${breakdown.alpha}`,
              value: `${breakdown.travelComponent.toFixed(1)}`,
              color: 'text-slate-700',
            },
            {
              label: `Queue   ·  ${breakdown.queueWait} min × ${breakdown.beta}`,
              value: `${breakdown.queueComponent.toFixed(1)}`,
              color: 'text-slate-700',
            },
            {
              label: `Medicine penalty  × ${breakdown.gamma}`,
              value: `${breakdown.medicineComponent.toFixed(1)}`,
              color: breakdown.medicineComponent > 0 ? 'text-rose-600' : 'text-slate-700',
            },
            {
              label: `Urgency bonus  ·  score ${breakdown.urgencyScore} × ${breakdown.lambda}`,
              value: `−${breakdown.urgencyComponent.toFixed(1)}`,
              color: 'text-emerald-600',
            },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-slate-500 font-mono">{row.label}</span>
              <span className={`font-mono font-semibold tabular-nums ${row.color}`}>{row.value}</span>
            </div>
          ))}
          <div className="border-t border-slate-200 pt-1.5 flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Total cost</span>
            <span className="font-mono font-bold text-indigo-700 tabular-nums">
              {breakdown.finalCost.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Algorithm trace ───────────────────────────────────────
function AlgorithmTrace({ trace }) {
  const [open, setOpen] = useState(false);
  if (!trace?.length) return null;
  return (
    <div>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors mt-2">
        {open ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
        Algorithm trace
      </button>
      {open && (
        <ol className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 space-y-1">
          {trace.map((step, i) => (
            <li key={i} className="text-xs text-slate-500 font-mono leading-relaxed">{step}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ── Overflow warning ──────────────────────────────────────
function OverflowBanner() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
      <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0"/>
      <div>
        <p className="text-xs font-semibold text-amber-800">Overflow / Transfer Warning</p>
        <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
          No hospital satisfies specialty &amp; bed-capacity constraints.
          Highest-tier trauma facility selected as fallback.
        </p>
      </div>
    </div>
  );
}

// ── Decision card ─────────────────────────────────────────
function DecisionCard({ log }) {
  const { id, engine, request, selected, evaluations, overflow, verdict, trace } = log;
  const badgeCls = URGENCY_BADGE[request.urgency] || URGENCY_BADGE[1];
  const engineLabel = engine === 'NAIVE' ? 'Naive Dijkstra' : 'Multi-Factor';
  const engineDot   = engine === 'NAIVE' ? 'bg-amber-400' : 'bg-indigo-500';

  return (
    <div className="card-enter px-4 py-4 border-b border-slate-200/80 bg-white">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            {id.replace('DISPATCH-', '#')}
          </span>
          <span className={`pill border ${badgeCls}`}>{request.urgencyLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${engineDot}`}/>
          <span className="text-xs text-slate-500">{engineLabel}</span>
        </div>
      </div>

      {/* Condition */}
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-xl leading-none">{request.emoji || '🚨'}</span>
        <div>
          <p className="text-sm font-semibold text-slate-800 tracking-tight">{request.condition}</p>
          <p className="text-xs text-slate-500">{request.originLabel || request.origin} · {request.specialty}</p>
        </div>
      </div>

      {/* Selected result */}
      {selected && (
        <div className={`rounded-xl border px-3 py-2.5 mb-3
          ${overflow
            ? 'border-amber-200 bg-amber-50'
            : 'border-emerald-200 bg-emerald-50'}`}>
          <div className="flex items-center gap-2 mb-1">
            {overflow
              ? <AlertTriangle size={13} className="text-amber-500"/>
              : <CheckCircle size={13} className="text-emerald-600"/>}
            <span className={`text-xs font-semibold ${overflow ? 'text-amber-800' : 'text-emerald-800'}`}>
              {overflow ? 'Overflow Fallback' : 'Optimal Route'}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            <span className="font-semibold">{selected.hospital?.shortLabel}</span>
            {' '}via {selected.ambulance?.id}
          </p>
          <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
            {engine === 'NAIVE'
              ? `Travel: ${selected.totalTravelTime} min`
              : selected.finalCost != null
                ? `Cost score: ${selected.finalCost.toFixed(1)}`
                : `Travel: ${selected.totalTravelTime} min`}
          </p>
        </div>
      )}

      {/* Overflow banner */}
      {overflow && <div className="mb-3"><OverflowBanner/></div>}

      {/* Verdict */}
      <p className="text-xs text-slate-500 leading-relaxed mb-3">{verdict}</p>

      {/* Candidate breakdown */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        Evaluated Candidates
      </p>
      <CandidateRows evaluations={evaluations} engine={engine}/>

      {/* Cost breakdown */}
      {selected?.costBreakdown && (
        <CostBreakdown breakdown={selected.costBreakdown} engine={engine}/>
      )}

      {/* Algorithm trace */}
      <AlgorithmTrace trace={trace}/>
    </div>
  );
}

// ── Decision log ──────────────────────────────────────────
export default function DecisionLog({ decisionLog }) {
  return (
    <div className="bg-[#F8F9FA] min-h-full">
      <div className="sticky top-0 z-10 bg-[#F8F9FA] border-b border-slate-200/80 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 tracking-tight">Decision Log</h2>
          {decisionLog.length > 0 && (
            <span className="pill bg-slate-100 text-slate-500 border border-slate-200">
              {decisionLog.length} entries
            </span>
          )}
        </div>
      </div>

      {decisionLog.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3v6l3 3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="9" r="7" stroke="#CBD5E1" strokeWidth="1.5"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-400">No dispatch history</p>
          <p className="text-xs text-slate-400 mt-1">Trigger an emergency to begin simulation.</p>
        </div>
      ) : (
        decisionLog.map(log => <DecisionCard key={log.id} log={log}/>)
      )}
    </div>
  );
}
