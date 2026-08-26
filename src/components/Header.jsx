import React, { useState, useEffect } from 'react';

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString('en-GB', { hour12: false });
  const date = now.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).toUpperCase();

  return (
    <div className="text-right leading-tight">
      <div className="font-mono text-sm text-slate-800 tabular-nums tracking-wide">{time}</div>
      <div className="text-xs text-slate-400 tracking-wide">{date}</div>
    </div>
  );
}

export default function Header({ engine, stats }) {
  const engineLabel = engine === 'CONSTRAINT' ? 'Multi-Factor Engine' : 'Naive Dijkstra';
  const engineDot   = engine === 'CONSTRAINT' ? 'bg-indigo-500' : 'bg-amber-400';

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200/80 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="7" cy="7" r="2" fill="white"/>
          </svg>
        </div>
        <div>
          <span className="font-semibold text-slate-900 tracking-tight text-sm">RuralCare OS</span>
          <span className="ml-2 text-xs text-slate-400 tracking-tight hidden sm:inline">
            Emergency Dispatch Simulation
          </span>
        </div>
      </div>

      {/* Center: engine badge + stats */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
          <span className={`w-1.5 h-1.5 rounded-full ${engineDot}`} />
          <span className="text-xs text-slate-600 font-medium">{engineLabel}</span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {[
            { label: 'Total',     value: stats.total,     color: 'text-slate-700' },
            { label: 'Active',    value: stats.active,    color: 'text-indigo-600' },
            { label: 'Queued',    value: stats.queued,    color: 'text-amber-600'  },
            { label: 'Done',      value: stats.completed, color: 'text-emerald-600' },
            { label: 'Overflow',  value: stats.overflow,  color: 'text-rose-600'  },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`font-mono text-sm font-semibold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: status + clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-breathe" />
          <span className="text-xs text-slate-500 font-medium">Online</span>
        </div>
        <div className="w-px h-5 bg-slate-200" />
        <LiveClock />
      </div>
    </header>
  );
}
