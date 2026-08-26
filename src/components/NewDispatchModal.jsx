import React from 'react';
import { X, Heart, ShieldAlert, Bug, Zap, Activity, Clock } from 'lucide-react';
import { EMERGENCY_TYPES } from '../data/emergencies.js';

export default function NewDispatchModal({
  isOpen,
  onClose,
  onDispatch,
  onInfluxWave,
  engine,
  queuedRequests,
}) {
  if (!isOpen) return null;

  const handleTrigger = (type) => {
    onDispatch(type);
    onClose();
  };

  const handleTriggerInflux = () => {
    onInfluxWave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669]">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Emergency Dispatch Studio</h3>
              <p className="text-xs text-[#64748B]">Inject an emergency incident into the simulation</p>
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
        <div className="p-5 space-y-4">
          <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Select Emergency Scenario
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {EMERGENCY_TYPES.map((type) => {
              const isCardiac = type.id === 'CARDIAC';
              const isTrauma = type.id === 'TRAUMA';

              return (
                <button
                  key={type.id}
                  onClick={() => handleTrigger(type)}
                  className="w-full text-left p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#38D9A9] hover:bg-[#F0FDF4]/40 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-sm ${
                        isCardiac
                          ? 'bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6]'
                          : isTrauma
                          ? 'bg-[#FAF5FF] text-[#9333EA] border border-[#F3E8FF]'
                          : 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]'
                      }`}
                    >
                      {type.emoji}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0F172A] group-hover:text-[#0D5C46] transition-colors">
                        {type.label}
                      </div>
                      <div className="text-xs text-[#64748B] mt-0.5">
                        Origin: <strong>{type.originLabel}</strong> · Req: <strong>{type.specialty}</strong>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      type.urgency === 1
                        ? 'bg-[#FFE4E6] text-[#E11D48]'
                        : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}
                  >
                    {type.urgencyLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Random Influx Wave */}
          <div className="pt-2">
            <button
              onClick={handleTriggerInflux}
              className="w-full p-4 rounded-xl border border-dashed border-[#F59E0B] bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#92400E] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
            >
              <Zap size={16} className="text-[#F59E0B]" />
              <span>Trigger Random Influx Wave (3 Concurrent Dispatches)</span>
            </button>
          </div>

          {/* Priority Queue Status */}
          {queuedRequests?.length > 0 && (
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#475569]">
                <Clock size={14} className="text-[#F59E0B]" />
                <span>Priority Queue active:</span>
              </div>
              <span className="font-bold text-[#0F172A]">{queuedRequests.length} requests waiting</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
