import React from 'react';
import { RotateCcw, Zap } from 'lucide-react';
import { EMERGENCY_TYPES } from '../data/emergencies.js';

// ── Urgency chip ──────────────────────────────────────────
const URGENCY_CHIP = {
  1: 'bg-rose-50 text-rose-700 border border-rose-200',
  2: 'bg-amber-50 text-amber-700 border border-amber-100',
  3: 'bg-slate-100 text-slate-600 border border-slate-200',
};

// ── Emergency type icons (inline SVG, no external dep) ───
function ScenarioIcon({ type }) {
  if (type === 'CARDIAC')
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
        <path d="M10 17s-7-5-7-9a4 4 0 018 0 4 4 0 018 0c0 4-7 9-7 9z"
          fill="#fee2e2" stroke="#f43f5e" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    );
  if (type === 'TRAUMA')
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
        <path d="M10 2L3 6v5c0 3.9 2.9 7.6 7 8.9C14.1 18.6 17 14.9 17 11V6L10 2z"
          fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M10 7v6M7 10h6" stroke="#7c3aed" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    );
  // SNAKEBITE
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
      <circle cx="10" cy="10" r="7.5" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.4"/>
      <path d="M7 10c0-2.5 6-2.5 6 0s-6 2.5-6 0z" stroke="#16a34a" strokeWidth="1.3"
        strokeLinejoin="round" fill="none"/>
      <circle cx="8.5" cy="9" r="0.8" fill="#16a34a"/>
      <circle cx="11.5" cy="9" r="0.8" fill="#16a34a"/>
    </svg>
  );
}

// ── Algorithm selector ────────────────────────────────────
function AlgorithmSelector({ engine, onEngineChange }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 mb-2 tracking-wide uppercase">Algorithm</p>
      <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-slate-50 p-0.5 gap-0.5">
        {[
          { id: 'CONSTRAINT', label: 'Multi-Factor' },
          { id: 'NAIVE',      label: 'Naive Dist.' },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => onEngineChange(opt.id)}
            aria-label={`Select ${opt.label}`}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
              ${engine === opt.id
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
        {engine === 'CONSTRAINT'
          ? 'Evaluates specialty, bed capacity, queue wait & medicine stock.'
          : 'Selects by shortest travel time only — ignores all clinical resources.'}
      </p>
    </div>
  );
}

// ── Emergency scenario card ───────────────────────────────
function ScenarioCard({ type, onDispatch }) {
  const chipCls = URGENCY_CHIP[type.urgency];
  return (
    <button
      onClick={() => onDispatch(type)}
      aria-label={`Dispatch ${type.label} from ${type.originLabel}`}
      className="w-full text-left rounded-xl border border-slate-200 bg-white p-3.5
        hover:border-indigo-300 hover:shadow-sm
        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
        active:scale-[.98]"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <ScenarioIcon type={type.id} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-800 truncate">{type.label}</span>
            <span className={`pill flex-shrink-0 ${chipCls}`}>{type.urgencyLabel}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate">{type.originLabel} · {type.specialty}</div>
          <div className="text-xs text-slate-400 mt-0.5 font-mono">
            {Object.entries(type.requiredMeds)
              .filter(([, v]) => v > 0)
              .map(([k, v]) => `${v}× ${k}`)
              .join(', ') || 'No special meds'}
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Influx wave ───────────────────────────────────────────
function InfluxWave({ onInfluxWave }) {
  return (
    <button
      onClick={onInfluxWave}
      aria-label="Trigger random influx wave of 3 concurrent emergencies"
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed
        border-amber-300 bg-amber-50 text-amber-700 text-sm font-medium py-3
        hover:bg-amber-100 hover:border-amber-400
        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
        active:scale-[.98]"
    >
      <Zap size={14} className="flex-shrink-0" />
      Random Influx Wave
      <span className="text-xs text-amber-500 font-normal">3 concurrent</span>
    </button>
  );
}

// ── Speed control ─────────────────────────────────────────
function SpeedControl({ speed, onSpeedChange }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 mb-2 tracking-wide uppercase">Simulation Speed</p>
      <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-slate-50 p-0.5 gap-0.5">
        {[0.5, 1, 2, 4].map(s => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            aria-label={`Set speed ${s}x`}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
              ${speed === s
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Dispatch queue ────────────────────────────────────────
function QueueList({ queuedRequests }) {
  if (queuedRequests.length === 0)
    return <p className="text-xs text-slate-400 text-center py-2">Queue empty</p>;

  const CHIP = { 1: 'bg-rose-50 text-rose-600 border-rose-200', 2: 'bg-amber-50 text-amber-600 border-amber-100', 3: 'bg-slate-100 text-slate-500 border-slate-200' };
  return (
    <div className="space-y-1.5">
      {queuedRequests.map((req, i) => (
        <div key={req.dispatchId || i}
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">
              {req.dispatchId?.replace('DISPATCH-', '#') || `#${i + 1}`}
            </span>
            <span className="text-xs text-slate-700 font-medium truncate max-w-[110px]">{req.condition}</span>
          </div>
          <span className={`pill border ${CHIP[req.urgency]}`}>{req.urgencyLabel}</span>
        </div>
      ))}
    </div>
  );
}

// ── Reset button ──────────────────────────────────────────
function ResetButton({ onReset }) {
  return (
    <button
      onClick={onReset}
      aria-label="Reset network to initial state"
      className="w-full flex items-center justify-center gap-2 rounded-xl
        border border-slate-200 bg-white text-slate-500 text-sm font-medium py-2.5
        hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50
        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400
        active:scale-[.98]"
    >
      <RotateCcw size={13} />
      Reset Network
    </button>
  );
}

// ── Section label ──────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-2">
      {children}
    </p>
  );
}

// ── Main control deck ──────────────────────────────────────
export default function ControlDeck({
  engine, speed, onEngineChange, onDispatch,
  onInfluxWave, onSpeedChange, onReset, queuedRequests,
}) {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] overflow-y-auto">
      {/* Panel heading */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-200/80">
        <h2 className="text-sm font-semibold text-slate-800 tracking-tight">Dispatch Studio</h2>
        <p className="text-xs text-slate-400 mt-0.5">Configure & trigger emergency scenarios</p>
      </div>

      <div className="flex-1 px-5 py-4 space-y-5">
        {/* Algorithm */}
        <AlgorithmSelector engine={engine} onEngineChange={onEngineChange} />

        <div className="h-px bg-slate-200" />

        {/* Scenarios */}
        <div>
          <SectionLabel>Emergency Scenarios</SectionLabel>
          <div className="space-y-2">
            {EMERGENCY_TYPES.map(type => (
              <ScenarioCard key={type.id} type={type} onDispatch={onDispatch} />
            ))}
          </div>
        </div>

        <InfluxWave onInfluxWave={onInfluxWave} />

        <div className="h-px bg-slate-200" />

        {/* Speed */}
        <SpeedControl speed={speed} onSpeedChange={onSpeedChange} />

        <div className="h-px bg-slate-200" />

        {/* Queue */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <SectionLabel>Dispatch Queue</SectionLabel>
            {queuedRequests.length > 0 && (
              <span className="pill bg-amber-50 text-amber-700 border border-amber-100">
                {queuedRequests.length} waiting
              </span>
            )}
          </div>
          <QueueList queuedRequests={queuedRequests} />
        </div>

        <div className="h-px bg-slate-200" />

        <ResetButton onReset={onReset} />
      </div>
    </div>
  );
}
