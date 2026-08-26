import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function BenchmarkPanel({ lastLog }) {
  if (!lastLog) {
    return (
      <div className="px-5 py-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Engine Comparison</span>
        <span className="text-xs text-slate-300">— trigger a dispatch to compare engines</span>
      </div>
    );
  }

  const { engine, selected, evaluations } = lastLog;
  const isConstraint = engine === 'CONSTRAINT';

  // What would naive pick? (lowest travel time among evaluated)
  let naiveTravelTime = null;
  let naiveHospitalId = null;
  const viable = (evaluations || []).filter(e => e.travelTime != null);
  if (viable.length > 0) {
    const best = [...viable].sort((a, b) => a.travelTime - b.travelTime)[0];
    naiveTravelTime = best.travelTime;
    naiveHospitalId = best.hospital.id;
  }

  const constraintCost   = selected?.finalCost;
  const selectedHospital = selected?.hospital?.shortLabel || '—';
  const divergence = isConstraint && naiveHospitalId && naiveHospitalId !== selected?.hospital?.id;

  const metrics = [
    {
      label: 'Naive travel',
      value: naiveTravelTime != null ? `${naiveTravelTime} min` : '—',
      color: 'text-amber-600',
    },
    {
      label: 'Constraint cost',
      value: isConstraint && constraintCost != null ? constraintCost.toFixed(1) : '—',
      color: 'text-indigo-600',
    },
    {
      label: 'Selected',
      value: selectedHospital,
      color: 'text-emerald-600',
    },
    {
      label: 'Resource-aware',
      value: selected?.overflow ? 'Overflow' : isConstraint ? 'Active' : 'Off',
      color: selected?.overflow ? 'text-amber-600' : isConstraint ? 'text-emerald-600' : 'text-slate-400',
    },
  ];

  return (
    <div className="px-5 py-3 bg-white border-t border-slate-200/80 flex items-center gap-6 flex-wrap">
      <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase whitespace-nowrap">
        Engine Comparison
      </span>

      <div className="flex gap-5 flex-wrap">
        {metrics.map(m => (
          <div key={m.label} className="flex flex-col">
            <span className="text-xs text-slate-400">{m.label}</span>
            <span className={`font-mono text-sm font-semibold tabular-nums ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>

      {divergence && (
        <div className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-full
          bg-rose-50 border border-rose-200">
          <AlertTriangle size={12} className="text-rose-500"/>
          <span className="text-xs font-semibold text-rose-700">Routing Divergence</span>
        </div>
      )}
    </div>
  );
}
