import React from 'react';
import { X, FileText, Heart, Activity, User, MapPin, Stethoscope, Clock, ShieldCheck, Printer, CheckCircle2 } from 'lucide-react';

export default function PatientRecordModal({ log, isOpen, onClose }) {
  if (!isOpen || !log) return null;

  const { id, request, selected, overflow, verdict, engine } = log;
  const dispatchCode = id ? id.replace('DISPATCH-', 'ER-') : 'ER-1001';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D48]">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">Emergency Patient Medical Record</h3>
                <span className="font-mono text-xs font-bold text-[#64748B]">{dispatchCode}</span>
              </div>
              <p className="text-xs text-[#64748B]">National Health Mission (NHM) · 108 Arogya Seva Triage Manifest</p>
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
          {/* Patient Identification Card */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <span className="text-[#64748B] text-[11px]">Patient Name:</span>
              <div className="font-bold text-[#0F172A] text-sm mt-0.5">{request.patientName || 'Kashinath Jadhav (Age 58)'}</div>
            </div>
            <div>
              <span className="text-[#64748B] text-[11px]">Origin Village:</span>
              <div className="font-bold text-[#0F172A] mt-0.5">{request.originLabel}</div>
            </div>
            <div>
              <span className="text-[#64748B] text-[11px]">Clinical Urgency:</span>
              <div className="mt-0.5">
                <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  request.urgency === 1 ? 'bg-[#FFE4E6] text-[#E11D48]' : 'bg-[#FEF3C7] text-[#D97706]'
                }`}>
                  {request.urgencyLabel} (Level {request.urgency})
                </span>
              </div>
            </div>
            <div>
              <span className="text-[#64748B] text-[11px]">Triage Condition:</span>
              <div className="font-semibold text-[#0F172A] mt-0.5">{request.condition}</div>
            </div>
          </div>

          {/* Clinical Vitals & Diagnostics */}
          <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-2">
            <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={14} className="text-[#E11D48]" />
              <span>Field Paramedic Triage &amp; Vitals Assessment</span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
              <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] font-sans">Blood Pressure:</span>
                <div className="text-sm font-bold text-[#E11D48] mt-0.5">{request.triageVitals?.bp || '80/50 mmHg (Hypotensive)'}</div>
              </div>
              <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] font-sans">Heart Rate:</span>
                <div className="text-sm font-bold text-[#0F172A] mt-0.5">{request.triageVitals?.hr || '135 bpm (Tachycardia)'}</div>
              </div>
              <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] font-sans">Oxygen Saturation:</span>
                <div className="text-sm font-bold text-[#D97706] mt-0.5">{request.triageVitals?.spo2 || '86% on Room Air'}</div>
              </div>
            </div>
          </div>

          {/* Dispatch Unit & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl space-y-1.5">
              <div className="font-bold text-[#92400E] flex items-center gap-1.5">
                <span>🚑</span>
                <span>Assigned 108 Ambulance Unit</span>
              </div>
              <div className="text-sm font-bold text-[#78350F]">{selected?.ambulance?.id} ({selected?.ambulance?.type || 'ALS Unit'})</div>
              <div className="text-[#B45309]">Field ETA to Village: <strong>{selected?.pickupTime} mins</strong> · Total Transit: <strong>{selected?.totalTravelTime} mins</strong></div>
            </div>

            <div className="p-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl space-y-1.5">
              <div className="font-bold text-[#166534] flex items-center gap-1.5">
                <span>🏥</span>
                <span>Destination Hospital Facility</span>
              </div>
              <div className="text-sm font-bold text-[#14532D]">{selected?.hospital?.label}</div>
              <div className="text-[#15803D]">Specialties: <strong>{selected?.hospital?.specialties?.join(', ')}</strong> · Queue Wait: <strong>{selected?.hospital?.queueWaitMin}m</strong></div>
            </div>
          </div>

          {/* Clinical Algorithm Verdict */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1.5">
            <div className="font-bold text-[#0F172A]">Algorithmic Routing Determination ({engine === 'CONSTRAINT' ? 'Multi-Factor Engine' : 'Naive Dijkstra'})</div>
            <p className="text-[#475569] leading-relaxed">{verdict}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Printer size={14} />
            <span>Print Patient Manifest</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0D5C46] hover:bg-[#094736] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}
