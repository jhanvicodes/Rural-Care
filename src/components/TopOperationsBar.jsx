import React, { useState } from 'react';
import { Search, Sparkles, Truck, Stethoscope, BedDouble, AlertCircle, Bell, AlertTriangle, User, CheckCircle2, X } from 'lucide-react';

export default function TopOperationsBar({
  stats,
  ambulances,
  hospitals,
  searchQuery,
  onSearchChange,
  onOpenNewDispatch,
  activeDispatches,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOperatorProfile, setShowOperatorProfile] = useState(false);

  const idleAmbulanceCount = (ambulances || []).filter((a) => a.status === 'IDLE').length;
  const totalBedsAvailable = (hospitals || []).reduce((acc, h) => acc + (h.availableBeds || 0), 0);
  const totalSpecialtiesCount = (hospitals || []).reduce((acc, h) => acc + (h.specialties?.length || 0), 0);
  const activeEmergenciesCount = (stats?.active || 0) + (stats?.queued || 0);

  const activeList = Array.from(activeDispatches?.values() || []);

  return (
    <header className="px-6 py-4 bg-white border-b border-[#E2E8F0] flex flex-col gap-4 flex-shrink-0 select-none relative">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#0F172A] tracking-tight">
            RuralCare Operations
          </h1>
          <p className="text-xs text-[#64748B] font-medium mt-0.5">
            Decentralized Autonomous Emergency Medical Dispatch &amp; Hospital Routing Engine · Pune Rural District
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-64 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search resources, units, villages..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38D9A9] focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Emergency Trigger CTA Button */}
          <button
            onClick={onOpenNewDispatch}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0D5C46] hover:bg-[#094736] text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <Sparkles size={14} className="text-[#38D9A9]" />
            <span>Emergency Trigger</span>
          </button>

          {/* Action Icons matching Screenshots 1 to 5 */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#E2E8F0] relative">
            {/* Bell Notifications */}
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowOperatorProfile(false);
              }}
              title="System Alerts & Notifications"
              className="relative p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all"
            >
              <Bell size={17} />
              {activeEmergenciesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-white" />
              )}
            </button>

            {/* Warning Alert Bell */}
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowOperatorProfile(false);
              }}
              title="Critical Warnings"
              className="p-2 rounded-xl text-[#D97706] hover:bg-[#FFFBEB] transition-all"
            >
              <AlertTriangle size={17} />
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => {
                setShowOperatorProfile(!showOperatorProfile);
                setShowNotifications(false);
              }}
              title="EMS Dispatch Officer Profile"
              className="w-8 h-8 rounded-xl bg-[#0D5C46] text-[#38D9A9] flex items-center justify-center font-bold text-xs shadow-sm hover:ring-2 hover:ring-[#38D9A9] transition-all ml-1"
            >
              OP
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Popover */}
      {showNotifications && (
        <div className="absolute right-6 top-16 z-50 w-80 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">Live Broadcast Alerts</span>
            <button onClick={() => setShowNotifications(false)} className="text-[#64748B] hover:text-[#0F172A]">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2 text-xs max-h-60 overflow-y-auto">
            {activeList.length === 0 ? (
              <div className="text-center py-4 text-[#64748B]">All regional emergency corridors clear.</div>
            ) : (
              activeList.map((d) => (
                <div key={d.request?.dispatchId} className="p-2.5 bg-[#FFF1F2] rounded-xl border border-[#FFE4E6] space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#E11D48]">
                    <span>{d.request?.condition}</span>
                    <span className="font-mono text-[10px]">{d.selected?.ambulance?.id}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">{d.request?.originLabel} → {d.selected?.hospital?.shortLabel}</p>
                </div>
              ))
            )}
            <div className="p-2.5 bg-[#F0FDF4] rounded-xl border border-[#DCFCE7] text-[#15803D] flex items-center gap-2">
              <CheckCircle2 size={14} />
              <span>Multi-Factor Engine online and routing.</span>
            </div>
          </div>
        </div>
      )}

      {/* Operator Profile Popover */}
      {showOperatorProfile && (
        <div className="absolute right-6 top-16 z-50 w-72 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">EMS Dispatcher</span>
            <button onClick={() => setShowOperatorProfile(false)} className="text-[#64748B] hover:text-[#0F172A]">
              <X size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D5C46] text-[#38D9A9] flex items-center justify-center font-bold text-sm">
              OP
            </div>
            <div>
              <div className="font-bold text-sm text-[#0F172A]">Chief Dispatch Officer</div>
              <p className="text-[11px] text-[#64748B]">108 Arogya Seva Control Desk</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] text-xs text-[#64748B] space-y-1">
            <div>Jurisdiction: <strong className="text-[#0F172A]">Pune Rural District</strong></div>
            <div>Active Station: <strong className="text-[#0D5C46]">HQ Clinical Command</strong></div>
          </div>
        </div>
      )}

      {/* KPI Cards Row matching Screenshot 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Card 1: Active Emergencies */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#475569] tracking-tight">Active Emergencies</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[26px] font-bold text-[#0F172A] font-sans leading-none">
                {activeEmergenciesCount > 0 ? activeEmergenciesCount : '0'}
              </span>
              <span className="text-[11px] font-semibold text-[#E11D48] flex items-center">
                {stats?.queued > 0 ? `+${stats.queued} queued` : stats?.active > 0 ? 'in progress' : 'clear'}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D48]">
            <AlertCircle size={20} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E11D48]" />
        </div>

        {/* Card 2: Available Ambulances */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#475569] tracking-tight">Available Ambulances</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[26px] font-bold text-[#0F172A] font-sans leading-none">
                {idleAmbulanceCount}
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">/ {ambulances?.length || 4} units</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669]">
            <Truck size={20} />
          </div>
        </div>

        {/* Card 3: Available Doctors / Specialists */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#475569] tracking-tight">Active Specialists</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[26px] font-bold text-[#0F172A] font-sans leading-none">
                {totalSpecialtiesCount}
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">on-duty</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
            <Stethoscope size={20} />
          </div>
        </div>

        {/* Card 4: Hospital Beds Available */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#475569] tracking-tight">Hospital Beds Open</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[26px] font-bold text-[#0F172A] font-sans leading-none">
                {totalBedsAvailable}
              </span>
              <span className="text-[11px] font-medium text-[#059669]">beds ready</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB]">
            <BedDouble size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
