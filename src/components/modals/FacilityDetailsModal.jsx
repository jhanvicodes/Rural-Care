import React from 'react';
import { X, Building2, BedDouble, Stethoscope, Package, Clock, Phone, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';

export default function FacilityDetailsModal({
  hospital,
  isOpen,
  onClose,
  onRestock,
  onAdjustBeds,
}) {
  if (!isOpen || !hospital) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB]">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">{hospital.label}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[#475569]">
                  Tier {hospital.tier}
                </span>
              </div>
              <p className="text-xs text-[#64748B]">{hospital.facilityType}</p>
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Bed Capacity Controls */}
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <BedDouble size={15} className="text-[#2563EB]" />
                <span>Emergency Bed Management</span>
              </span>
              <span className="font-mono text-xs font-bold text-[#059669]">
                {hospital.availableBeds} of {hospital.totalBeds} Beds Ready
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => onAdjustBeds(hospital.id, 1)}
                className="py-2.5 px-3 bg-white border border-[#CBD5E1] hover:border-[#059669] hover:bg-[#F0FDF4] rounded-xl font-bold text-[#0F172A] flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus size={14} className="text-[#059669]" />
                <span>Add 1 Available Bed</span>
              </button>
              <button
                onClick={() => onAdjustBeds(hospital.id, -1)}
                disabled={hospital.availableBeds <= 0}
                className="py-2.5 px-3 bg-white border border-[#CBD5E1] hover:border-[#E11D48] hover:bg-[#FFF1F2] rounded-xl font-bold text-[#0F172A] flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
              >
                <span>Reserve / Occupy 1 Bed</span>
              </button>
            </div>
          </div>

          {/* Pharmaceutical Restock Controls */}
          <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Package size={15} className="text-[#059669]" />
                <span>Pharmaceutical Restock &amp; Supply Orders</span>
              </span>
              <span className="text-[11px] text-[#64748B]">Click to restock live inventory</span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <button
                onClick={() => onRestock(hospital.id, 'stents', 5)}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#38D9A9] hover:bg-[#F0FDF4] text-left transition-all group"
              >
                <div className="text-[#64748B] text-[11px]">Cardiac Stents</div>
                <div className="text-lg font-bold text-[#0F172A] font-mono mt-0.5">{hospital.inventory?.stents}</div>
                <div className="mt-2 text-[10px] font-bold text-[#0D5C46] group-hover:underline">+ Order 5 Stents</div>
              </button>

              <button
                onClick={() => onRestock(hospital.id, 'antivenom', 10)}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#38D9A9] hover:bg-[#F0FDF4] text-left transition-all group"
              >
                <div className="text-[#64748B] text-[11px]">Antivenom Vials</div>
                <div className="text-lg font-bold text-[#0F172A] font-mono mt-0.5">{hospital.inventory?.antivenom}</div>
                <div className="mt-2 text-[10px] font-bold text-[#0D5C46] group-hover:underline">+ Order 10 Vials</div>
              </button>

              <button
                onClick={() => onRestock(hospital.id, 'iv', 25)}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#38D9A9] hover:bg-[#F0FDF4] text-left transition-all group"
              >
                <div className="text-[#64748B] text-[11px]">IV Fluid Bags</div>
                <div className="text-lg font-bold text-[#0F172A] font-mono mt-0.5">{hospital.inventory?.iv}</div>
                <div className="mt-2 text-[10px] font-bold text-[#0D5C46] group-hover:underline">+ Order 25 Bags</div>
              </button>
            </div>
          </div>

          {/* On-Duty Specialists */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">On-Duty Medical Officers</span>
            <div className="space-y-2">
              {hospital.doctorsOnDuty?.map((doc, idx) => (
                <div key={idx} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold text-xs">
                      DR
                    </div>
                    <div>
                      <div className="font-bold text-[#0F172A]">{doc.name}</div>
                      <div className="text-[11px] text-[#64748B]">{doc.role}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0D5C46] hover:bg-[#094736] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
