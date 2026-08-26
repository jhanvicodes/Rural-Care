import React from 'react';
import { X, Truck, BatteryCharging, Wrench, Radio, User, MapPin, ShieldCheck, Zap } from 'lucide-react';

export default function AmbulanceDetailsModal({
  ambulance,
  isOpen,
  onClose,
  onRecharge,
  onToggleStatus,
  onOpenNewDispatch,
}) {
  if (!isOpen || !ambulance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] border border-[#FEF3C7] flex items-center justify-center text-[#D97706] text-xl font-bold">
              🚑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">{ambulance.id}</h3>
                <span className="text-xs font-mono font-bold text-[#64748B]">{ambulance.callSign}</span>
              </div>
              <p className="text-xs text-[#64748B]">{ambulance.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[#64748B] text-[11px]">Current Location / Base</span>
              <div className="font-bold text-[#0F172A] text-sm mt-0.5">{ambulance.currentNode}</div>
              <span className="text-[10px] text-[#059669]">Home Base: {ambulance.stationedAt}</span>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-[#64748B] text-[11px]">Vehicle Battery / Fuel</span>
                <div className="font-bold text-[#0F172A] text-sm mt-0.5">{ambulance.battery}%</div>
              </div>
              <button
                onClick={() => onRecharge(ambulance.id)}
                className="px-2.5 py-1 bg-white hover:bg-[#F0FDF4] border border-[#CBD5E1] rounded-lg text-[11px] font-bold text-[#059669] transition-all"
              >
                Recharge 100%
              </button>
            </div>
          </div>

          {/* Crew Information */}
          <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-2">
            <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Assigned 108 EMS Crew</div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[#64748B] text-[11px]">Emergency Ambulance Driver:</span>
                <div className="font-bold text-[#0F172A] mt-0.5">{ambulance.driver}</div>
              </div>
              <div>
                <span className="text-[#64748B] text-[11px]">Certified Paramedic / Doctor:</span>
                <div className="font-bold text-[#0F172A] mt-0.5">{ambulance.paramedic}</div>
              </div>
            </div>
          </div>

          {/* Onboard Medical Equipment */}
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5">
            <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Onboard Critical Equipment</div>
            <p className="text-[#475569]">{ambulance.equipment || 'Defibrillator, Multi-Channel ECG, Portable Oxygen, Splints, Suction Unit'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenNewDispatch();
            }}
            className="px-4 py-2 bg-[#0D5C46] hover:bg-[#094736] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Dispatch this Unit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-xl text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
