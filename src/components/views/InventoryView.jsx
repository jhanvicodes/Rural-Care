import React, { useState } from 'react';
import { Package, TrendingUp, AlertTriangle, CheckCircle2, Truck, Plane, Clock, ShieldCheck, Download, Filter, Plus } from 'lucide-react';
import LogisticsModal from '../modals/LogisticsModal.jsx';

export default function InventoryView({ hospitals, onRestockAll }) {
  const [showLogisticsModal, setShowLogisticsModal] = useState(false);
  const [filterSupply, setFilterSupply] = useState('ALL');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const totals = (hospitals || []).reduce(
    (acc, h) => {
      acc.stents += h.inventory?.stents || 0;
      acc.antivenom += h.inventory?.antivenom || 0;
      acc.iv += h.inventory?.iv || 0;
      return acc;
    },
    { stents: 0, antivenom: 0, iv: 0 }
  );

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] space-y-6 select-none relative">
      {/* Header matching Screenshots 4 & 5 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Medicine Inventory</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time critical medical supplies, cold-chain antivenom vials, and cardiac stent stock levels across Pune Rural district.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#475569] shadow-sm hover:bg-[#F1F5F9] transition-all"
            >
              <Filter size={13} />
              <span>Filter: {filterSupply === 'ALL' ? 'All Supplies' : filterSupply}</span>
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-10 z-30 w-44 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-1 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                {[
                  { id: 'ALL', label: 'All Supplies' },
                  { id: 'CRITICAL', label: 'Critical Only' },
                  { id: 'LOW_STOCK', label: 'Low Stock Items' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFilterSupply(f.id);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${
                      filterSupply === f.id ? 'bg-[#0D5C46] text-white font-bold' : 'text-[#475569] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Report Button */}
          <button
            onClick={() => setShowLogisticsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D5C46] text-white text-xs font-semibold shadow-sm hover:bg-[#094736] transition-all"
          >
            <Download size={13} />
            <span>Export &amp; Logistics</span>
          </button>
        </div>
      </div>

      {/* Top Summary Widgets matching Screenshots 4 & 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Widget 1: Network Availability */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Network Availability
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#0F172A] font-sans">78.4%</span>
                <span className="text-xs font-semibold text-[#059669] flex items-center">
                  ↑ 2.1% this week
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669]">
              <ShieldCheck size={24} />
            </div>
          </div>

          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs text-[#64748B]">
              <span>Critical Items Status</span>
              <span className="font-semibold text-[#0F172A]">30 / 45 Secure</span>
            </div>
            <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div className="h-full bg-[#059669] rounded-full" style={{ width: '68%' }} />
            </div>
          </div>
        </div>

        {/* Widget 2: High-Demand Watchlist */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm space-y-3.5">
          <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            High-Demand Watchlist
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-[#475569] mb-1 font-medium">
                <span>Polyvalent Snake Antivenom Vials</span>
                <span className="font-mono font-bold text-[#0F172A]">89% ({totals.antivenom} Vials)</span>
              </div>
              <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div className="h-full bg-[#059669] rounded-full" style={{ width: '89%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#475569] mb-1 font-medium">
                <span>IV Normal Saline &amp; Ringer Lactate</span>
                <span className="font-mono font-bold text-[#0F172A]">42% ({totals.iv} Bags)</span>
              </div>
              <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#475569] mb-1 font-medium">
                <span>Drug-Eluting Cardiac Stents</span>
                <span className="font-mono font-bold text-[#E11D48]">12% ({totals.stents} Stents)</span>
              </div>
              <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div className="h-full bg-[#E11D48] rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Critical Supply Status & Incoming Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Critical Supply Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Critical Supply Status
            </span>
            <button
              onClick={onRestockAll}
              className="text-[11px] font-bold text-[#0D5C46] hover:underline flex items-center gap-1"
            >
              <Plus size={13} />
              <span>Restock All Network Supplies (+20%)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Card 1: Aspirin */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                    💊
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">General</span>
                </div>
                <div className="mt-3">
                  <div className="font-bold text-sm text-[#0F172A]">Aspirin &amp; Clopidogrel</div>
                  <p className="text-[11px] text-[#64748B]">Antiplatelet / STEMI First Response</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase">Stock Level</span>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-lg font-bold text-[#0F172A] font-mono">82%</span>
                  <span className="text-[11px] font-semibold text-[#059669] flex items-center gap-1">
                    <CheckCircle2 size={12} /> Healthy
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Cardiac Kit */}
            <div className="bg-white rounded-2xl p-4 border border-[#FDE68A] shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#F59E0B]" />
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                    ❤️
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E]">Emergency</span>
                </div>
                <div className="mt-3">
                  <div className="font-bold text-sm text-[#0F172A]">Cardiac Cath Stents</div>
                  <p className="text-[11px] text-[#64748B]">Total: {totals.stents} units available</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase">Stock Level</span>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-lg font-bold text-[#0F172A] font-mono">18%</span>
                  <span className="text-[11px] font-semibold text-[#D97706] flex items-center gap-1">
                    <AlertTriangle size={12} /> Low Stock
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Snake Antivenom */}
            <div className="bg-white rounded-2xl p-4 border border-[#FFE4E6] shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#E11D48]" />
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D48]">
                    🐍
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE4E6] text-[#9F1239]">Dispatching</span>
                </div>
                <div className="mt-3">
                  <div className="font-bold text-sm text-[#0F172A]">Snake Antivenom (ASV)</div>
                  <p className="text-[11px] text-[#E11D48] font-semibold">Cold Chain Temp: 4.2°C (Alert)</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase">Stock Level</span>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-lg font-bold text-[#0F172A] font-mono">{totals.antivenom} Vials</span>
                  <span className="text-[11px] font-semibold text-[#E11D48]">Critical Reserve</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demand Forecast Chart Area */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                7-Day Emergency Supply Demand Forecast
              </div>
              <span className="text-xs text-[#64748B] font-mono">Next 7 Days ▾</span>
            </div>

            <div className="h-32 w-full relative flex items-end">
              <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
                <line x1="0" y1="25" x2="500" y2="25" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" />

                <path
                  d="M 0,70 Q 125,10 250,60 T 500,20"
                  fill="none"
                  stroke="#0D5C46"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M 0,85 Q 125,65 250,80 T 500,65"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Incoming Logistics Batches matching Screenshots 4 & 5 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4">
              Incoming Logistics Batches
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-[#059669]" />
                    <span className="font-bold text-[#0F172A]">BATCH #MH-842-A</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                    ETA: 2h 15m
                  </span>
                </div>
                <div className="text-[#64748B] text-[11px]">
                  50x Antivenom Vials (Cold Chain)
                </div>
                <div className="text-[10px] text-[#94A3B8]">Origin: Pune Central Medical Depot</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane size={14} className="text-[#2563EB]" />
                    <span className="font-bold text-[#0F172A]">FLIGHT #EMS-91</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E40AF]">
                    ETA: Tomorrow
                  </span>
                </div>
                <div className="text-[#64748B] text-[11px]">
                  25x Drug-Eluting Stents &amp; Cath Kits
                </div>
                <div className="text-[10px] text-[#94A3B8]">Origin: State Apex Reserve, Mumbai</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#D97706]" />
                    <span className="font-bold text-[#0F172A]">RESTOCK #112</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
                    Pending
                  </span>
                </div>
                <div className="text-[#64748B] text-[11px]">
                  100x IV Ringer Lactate Infusion Bags
                </div>
                <div className="text-[10px] text-[#94A3B8]">Requesting from Manchar SDH</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowLogisticsModal(true)}
            className="w-full py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold shadow-sm transition-all"
          >
            View All Logistics Records
          </button>
        </div>
      </div>

      {/* Logistics Modal */}
      <LogisticsModal
        isOpen={showLogisticsModal}
        onClose={() => setShowLogisticsModal(false)}
      />
    </div>
  );
}
