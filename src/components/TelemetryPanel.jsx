import React from 'react';

// ── Shared pill component ─────────────────────────────────
const STATUS_META = {
  IDLE:              { label: 'Idle',         cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  EN_ROUTE_PICKUP:   { label: 'Pickup',       cls: 'bg-indigo-50 text-indigo-700 border-indigo-200'   },
  EN_ROUTE_HOSPITAL: { label: 'Transporting', cls: 'bg-amber-50 text-amber-700 border-amber-100'       },
  COMPLETED:         { label: 'Completed',    cls: 'bg-slate-100 text-slate-500 border-slate-200'      },
};

function StatusPill({ status }) {
  const { label, cls } = STATUS_META[status] || STATUS_META.IDLE;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  );
}

// ── Progress strip ────────────────────────────────────────
function ProgressStrip({ label, value, max, colorClass, note }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="font-mono text-xs text-slate-700 tabular-nums">{note}</span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${colorClass}`} style={{ width: `${pct}%` }}/>
      </div>
    </div>
  );
}

// ── Fleet readiness ───────────────────────────────────────
function FleetPanel({ ambulances }) {
  const idleCount = ambulances.filter(a => a.status === 'IDLE').length;
  return (
    <div className="panel-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Fleet</h3>
        <span className={`font-mono text-xs font-semibold tabular-nums
          ${idleCount === ambulances.length ? 'text-emerald-600' : idleCount === 0 ? 'text-rose-600' : 'text-amber-600'}`}>
          {idleCount}/{ambulances.length} ready
        </span>
      </div>
      <div className="space-y-2">
        {ambulances.map(amb => (
          <div key={amb.id}
            className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2">
              {/* Dot indicator */}
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                amb.status === 'IDLE'              ? 'bg-emerald-500' :
                amb.status === 'EN_ROUTE_PICKUP'   ? 'bg-indigo-500'  :
                amb.status === 'EN_ROUTE_HOSPITAL' ? 'bg-amber-500'   : 'bg-slate-300'
              }`}/>
              <span className="font-mono text-xs font-semibold text-slate-700">{amb.id}</span>
              <span className="text-xs text-slate-400">{amb.currentNode}</span>
            </div>
            <StatusPill status={amb.status}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Hospital resource panel ───────────────────────────────
function HospitalPanel({ hospital }) {
  const { shortLabel, availableBeds, totalBeds, queueWaitMin, inventory } = hospital;
  const occupied  = totalBeds - availableBeds;
  const occupancy = totalBeds > 0 ? occupied / totalBeds : 0;

  const bedColor = availableBeds === 0 ? 'bg-rose-400'
    : occupancy >= 0.8               ? 'bg-amber-400'
    :                                  'bg-emerald-400';

  const maxInv = Math.max(inventory.stents + 1, inventory.antivenom + 1, inventory.iv + 1);

  return (
    <div className="panel-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-700 tracking-tight">{shortLabel}</h3>
        <span className={`font-mono text-xs tabular-nums ${
          queueWaitMin >= 30 ? 'text-rose-600' : queueWaitMin >= 15 ? 'text-amber-600' : 'text-slate-500'
        }`}>{queueWaitMin} min wait</span>
      </div>

      <div className="space-y-2">
        <ProgressStrip
          label="Bed occupancy"
          value={occupied} max={totalBeds}
          colorClass={bedColor}
          note={`${availableBeds}/${totalBeds} open`}
        />
        <ProgressStrip
          label="Stents"
          value={inventory.stents} max={Math.max(inventory.stents, 15)}
          colorClass="bg-indigo-400"
          note={String(inventory.stents)}
        />
        <ProgressStrip
          label="Antivenom"
          value={inventory.antivenom} max={Math.max(inventory.antivenom, 25)}
          colorClass="bg-violet-400"
          note={String(inventory.antivenom)}
        />
        <ProgressStrip
          label="IV Bags"
          value={inventory.iv} max={Math.max(inventory.iv, 80)}
          colorClass="bg-sky-400"
          note={String(inventory.iv)}
        />
      </div>
    </div>
  );
}

// ── System stats row ──────────────────────────────────────
function StatsRow({ stats }) {
  const items = [
    { label: 'Total',    value: stats.total,     color: 'text-slate-800' },
    { label: 'Active',   value: stats.active,    color: 'text-indigo-600' },
    { label: 'Queued',   value: stats.queued,    color: 'text-amber-600'  },
    { label: 'Done',     value: stats.completed, color: 'text-emerald-600'},
    { label: 'Overflow', value: stats.overflow,  color: 'text-rose-600'   },
  ];
  return (
    <div className="grid grid-cols-5 gap-1">
      {items.map(s => (
        <div key={s.label}
          className="flex flex-col items-center py-2 px-1 rounded-lg bg-white border border-slate-200/80">
          <span className={`font-mono text-sm font-bold tabular-nums ${s.color}`}>{s.value}</span>
          <span className="text-xs text-slate-400 mt-0.5">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Queue wait summary ────────────────────────────────────
function QueueWaitRow({ hospitals }) {
  return (
    <div className="panel-card px-4 py-3">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Queue Wait</h3>
      <div className="space-y-1.5">
        {hospitals.map(h => {
          const color = h.queueWaitMin >= 30 ? 'text-rose-600'
            : h.queueWaitMin >= 15            ? 'text-amber-600' : 'text-emerald-600';
          return (
            <div key={h.id} className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{h.shortLabel}</span>
              <span className={`font-mono text-xs font-semibold tabular-nums ${color}`}>
                {h.queueWaitMin} min
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main TelemetryPanel ───────────────────────────────────
export default function TelemetryPanel({ ambulances, hospitals, stats, queuedRequests }) {
  return (
    <div className="flex-shrink-0 overflow-y-auto bg-[#F8F9FA] border-b border-slate-200/80"
      style={{ maxHeight: '52%' }}>
      <div className="px-4 pt-4 pb-3 border-b border-slate-200/80">
        <h2 className="text-sm font-semibold text-slate-800 tracking-tight">Telemetry</h2>
      </div>

      <div className="px-4 py-4 space-y-3">
        <StatsRow stats={stats}/>
        <FleetPanel ambulances={ambulances}/>
        <QueueWaitRow hospitals={hospitals}/>
        {hospitals.map(h => <HospitalPanel key={h.id} hospital={h}/>)}
      </div>
    </div>
  );
}
