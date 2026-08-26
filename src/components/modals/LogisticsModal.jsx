import React from 'react';
import { X, Package, Truck, Plane, Clock, CheckCircle2, Download, Plus } from 'lucide-react';

export default function LogisticsModal({
  isOpen,
  onClose,
  onAddBatch,
}) {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Batch ID,Item,Quantity,Status,ETA,Origin\n" +
      "MH-842-A,Snake Antivenom,50 Vials,In Transit,2h 15m,Pune Central Depot\n" +
      "EMS-91,Cardiac Stents,25 Kits,Scheduled,Tomorrow,State Apex Reserve Mumbai\n" +
      "RESTOCK-112,IV Ringer Lactate,100 Bags,Approved,4h 30m,Manchar SDH Depot\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ruralcare_medical_logistics_manifest_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669]">
              <Package size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Medical Supply Chain &amp; Logistics Manifest</h3>
              <p className="text-xs text-[#64748B]">State Medical Supplies Corporation (MSMC) · Active Restock Shipments</p>
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
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#0F172A] uppercase tracking-wider">Active Logistics Shipments</span>
            <button
              onClick={() => onAddBatch && onAddBatch()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D5C46] hover:bg-[#094736] text-white rounded-xl font-semibold shadow-sm transition-all"
            >
              <Plus size={13} />
              <span>Request Fast-Track Shipment</span>
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#059669]">
                  <Truck size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0F172A]">BATCH #MH-842-A · Cold Chain Antivenom</div>
                  <div className="text-[11px] text-[#64748B]">50 Vials · Temperature Regulated at 4°C · Origin: Pune Central Medical Depot</div>
                </div>
              </div>
              <span className="font-mono font-bold px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D]">
                ETA: 2h 15m
              </span>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                  <Plane size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0F172A]">FLIGHT #EMS-91 · Drug-Eluting Stents</div>
                  <div className="text-[11px] text-[#64748B]">25 Cardiac Stents &amp; Catheter Kits · Origin: State Apex Reserve, Mumbai</div>
                </div>
              </div>
              <span className="font-mono font-bold px-3 py-1 rounded-full bg-[#DBEAFE] text-[#1E40AF]">
                ETA: Tomorrow 08:00
              </span>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#D97706]">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0F172A]">RESTOCK #112 · IV Infusion Supplies</div>
                  <div className="text-[11px] text-[#64748B]">100 Bags Ringer Lactate &amp; Saline · Requesting from Manchar SDH</div>
                </div>
              </div>
              <span className="font-mono font-bold px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E]">
                Pending Approval
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Download size={14} />
            <span>Download CSV Logistics Manifest</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0D5C46] hover:bg-[#094736] text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
