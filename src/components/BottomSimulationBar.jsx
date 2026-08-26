import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Cpu, Clock, Gauge } from 'lucide-react';

export default function BottomSimulationBar({
  engine,
  onEngineChange,
  speed,
  onSpeedChange,
  onReset,
  isPaused,
  onTogglePause,
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeString = now.toLocaleTimeString('en-GB', { hour12: false });

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-2xl px-5 py-3 shadow-lg flex items-center justify-between gap-4 flex-wrap select-none">
      {/* Left: Simulation Controls matching Screenshot 2 */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-[#334155] tracking-widest uppercase">
          Simulation
        </span>

        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
          <button
            onClick={onTogglePause}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              !isPaused
                ? 'bg-[#0D5C46] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title={!isPaused ? "Running" : "Resume"}
          >
            <Play size={13} fill={!isPaused ? "currentColor" : "none"} />
          </button>
          <button
            onClick={onTogglePause}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              isPaused
                ? 'bg-[#0D5C46] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title={isPaused ? "Paused" : "Pause"}
          >
            <Pause size={13} fill={isPaused ? "currentColor" : "none"} />
          </button>
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#E11D48] hover:bg-white transition-all"
            title="Reset Network"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Middle: Engine Selection Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium hidden sm:flex">
          <Cpu size={14} className="text-[#0D5C46]" />
          <span>Routing:</span>
        </div>

        <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] gap-1">
          <button
            onClick={() => onEngineChange('CONSTRAINT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              engine === 'CONSTRAINT'
                ? 'bg-[#0D5C46] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Multi-Factor Engine
          </button>
          <button
            onClick={() => onEngineChange('NAIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              engine === 'NAIVE'
                ? 'bg-[#0D5C46] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Naive Dijkstra
          </button>
        </div>
      </div>

      {/* Right: Speed Multiplier & Live Clock matching Screenshot 2 */}
      <div className="flex items-center gap-4">
        {/* Speed */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                speed === s
                  ? 'bg-white text-[#0D5C46] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-[#E2E8F0]" />

        {/* Live Clock matching Screenshot 2 */}
        <div className="flex items-center gap-1.5 text-xs text-[#334155] font-mono font-bold">
          <span className="text-[#94A3B8] font-sans font-medium">Time:</span>
          <span>{timeString}</span>
        </div>
      </div>
    </div>
  );
}
