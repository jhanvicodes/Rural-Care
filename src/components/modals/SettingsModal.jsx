import React from 'react';
import { X, Settings, RotateCcw, Volume2, VolumeX, Eye, Cpu, Sliders } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  engine,
  onEngineChange,
  speed,
  onSpeedChange,
  onReset,
  autoOpenDrawer,
  onToggleAutoOpenDrawer,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Command Center Settings</h3>
              <p className="text-xs text-[#64748B]">Operational parameters &amp; simulation preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Active Engine */}
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={14} className="text-[#0D5C46]" />
              <span>Default Dispatch Routing Algorithm</span>
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onEngineChange('CONSTRAINT')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                  engine === 'CONSTRAINT'
                    ? 'bg-[#0D5C46] text-white border-[#0D5C46] shadow-sm'
                    : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                Multi-Factor Engine
              </button>
              <button
                onClick={() => onEngineChange('NAIVE')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                  engine === 'NAIVE'
                    ? 'bg-[#0D5C46] text-white border-[#0D5C46] shadow-sm'
                    : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                Naive Dijkstra
              </button>
            </div>
          </div>

          {/* Speed */}
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={14} className="text-[#2563EB]" />
              <span>Simulation Clock Multiplier</span>
            </span>
            <div className="grid grid-cols-4 gap-2 pt-1 font-mono">
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`py-2 rounded-xl border font-bold text-xs transition-all ${
                    speed === s
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                      : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Open Decision Drawer Toggle */}
          <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-[#0F172A]">Auto-Open Decision Inspector Drawer</span>
              <p className="text-[#64748B] text-[11px]">Automatically slide open the decision inspector on new emergency dispatch</p>
            </div>
            <button
              onClick={onToggleAutoOpenDrawer}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                autoOpenDrawer ? 'bg-[#0D5C46]' : 'bg-[#CBD5E1]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoOpenDrawer ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Network Reset */}
          <div className="p-4 bg-[#FFF1F2] rounded-xl border border-[#FFE4E6] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#E11D48]">Reset Entire Health Network</span>
              <p className="text-[#9F1239] text-[11px]">Restore initial hospital beds, medicine stock, and reset ambulances to base</p>
            </div>
            <button
              onClick={() => {
                onReset();
                onClose();
              }}
              className="px-3.5 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl font-bold shadow-sm transition-all"
            >
              Reset Network
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0D5C46] hover:bg-[#094736] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
