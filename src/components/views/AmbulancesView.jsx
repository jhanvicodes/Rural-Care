import React, { useState } from 'react';
import { Search, Truck, BatteryCharging, MapPin, AlertCircle, CheckCircle2, Wrench, Navigation, Eye } from 'lucide-react';
import AmbulanceDetailsModal from '../modals/AmbulanceDetailsModal.jsx';

export default function AmbulancesView({
  ambulances,
  activeDispatches,
  onOpenNewDispatch,
  onSwitchToMap,
  onRechargeAmbulance,
}) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);

  const activeByAmb = {};
  activeDispatches.forEach((d) => {
    if (d.selected?.ambulance?.id) {
      activeByAmb[d.selected.ambulance.id] = d;
    }
  });

  const filteredAmbulances = (ambulances || []).filter((amb) => {
    const matchesSearch =
      amb.id.toLowerCase().includes(search.toLowerCase()) ||
      amb.callSign?.toLowerCase().includes(search.toLowerCase()) ||
      amb.driver?.toLowerCase().includes(search.toLowerCase()) ||
      amb.type?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'AVAILABLE') return amb.status === 'IDLE';
    if (filter === 'BUSY') return amb.status !== 'IDLE';
    if (filter === 'CRITICAL') return amb.status === 'EN_ROUTE_PICKUP' || amb.status === 'EN_ROUTE_HOSPITAL';
    return true;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] space-y-6 select-none relative">
      {/* Header & Filter Controls matching Screenshot 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'ALL', label: 'All Units' },
            { id: 'AVAILABLE', label: 'Available' },
            { id: 'BUSY', label: 'Busy' },
            { id: 'CRITICAL', label: '⚠️ Critical Dispatch' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-[#38D9A9] text-[#052E24] shadow-sm'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Unit ID, Driver, Type..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38D9A9]"
          />
        </div>
      </div>

      {/* Ambulance Cards Grid matching Screenshot 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAmbulances.map((amb) => {
          const dispatch = activeByAmb[amb.id];
          const isBusy = amb.status !== 'IDLE';
          const isCritical = dispatch?.request?.urgency === 1;

          return (
            <div
              key={amb.id}
              onClick={() => setSelectedAmbulance(amb)}
              className={`bg-white rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group ${
                isCritical
                  ? 'border-[#E11D48] ring-1 ring-[#E11D48]/30'
                  : isBusy
                  ? 'border-[#38BDF8]'
                  : 'border-[#E2E8F0] hover:border-[#38D9A9]'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[17px] font-bold text-[#0F172A] tracking-tight font-mono">
                      {amb.id}
                    </div>
                    <span className="text-[11px] font-medium text-[#64748B]">{amb.callSign} · {amb.type}</span>
                  </div>

                  <div className="text-right">
                    {isBusy ? (
                      <span className="text-xs font-mono font-bold text-[#E11D48]">
                        ETA: {dispatch?.selected?.pickupTime || 4}m
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#64748B]">
                        Station: {amb.stationedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-2.5">
                  {isCritical ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFE4E6] text-[#E11D48] text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-ping" />
                      EN ROUTE (CRITICAL)
                    </span>
                  ) : isBusy ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] text-[11px] font-bold">
                      ● {amb.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold">
                      ✓ AVAILABLE
                    </span>
                  )}
                </div>

                {/* Patient or Driver Information Box */}
                <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs">
                  {isBusy && dispatch ? (
                    <>
                      <div className="font-bold text-[#0F172A] flex items-center gap-1.5 truncate">
                        <span>👤</span>
                        <span className="truncate">{dispatch.request?.patientName || dispatch.request?.condition}</span>
                      </div>
                      <div className="text-[#64748B] flex items-center gap-1.5 text-[11px]">
                        <MapPin size={13} className="text-[#E11D48] flex-shrink-0" />
                        <span className="truncate">{dispatch.request?.originLabel}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[#64748B] flex items-center gap-1.5">
                        <span>👤</span>
                        <span>Pilot: <strong>{amb.driver}</strong></span>
                      </div>
                      <div className="text-[#64748B] flex items-center gap-1.5 text-[11px]">
                        <MapPin size={13} className="text-[#059669] flex-shrink-0" />
                        <span>Station Base: {amb.stationedAt}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[#64748B] font-mono">
                  <BatteryCharging size={14} className="text-[#059669]" />
                  <span>{amb.battery}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAmbulance(amb);
                    }}
                    className="text-[#64748B] hover:text-[#0F172A] text-xs font-semibold"
                  >
                    Details
                  </button>

                  {isBusy ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSwitchToMap();
                      }}
                      className="text-[#0D5C46] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>View Map</span>
                      <Navigation size={12} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenNewDispatch();
                      }}
                      className="px-2.5 py-1 bg-[#0D5C46] hover:bg-[#094736] text-white rounded-lg font-semibold text-[11px] shadow-sm transition-all"
                    >
                      Dispatch
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ambulance Details Modal */}
      <AmbulanceDetailsModal
        ambulance={selectedAmbulance}
        isOpen={Boolean(selectedAmbulance)}
        onClose={() => setSelectedAmbulance(null)}
        onRecharge={(id) => {
          onRechargeAmbulance(id);
          setSelectedAmbulance(null);
        }}
        onOpenNewDispatch={onOpenNewDispatch}
      />
    </div>
  );
}
