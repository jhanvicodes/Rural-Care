import React, { useState } from 'react';
import { Building2, Stethoscope, Filter, BedDouble, AlertTriangle, CheckCircle2, Clock, UserCheck, Plus } from 'lucide-react';
import FacilityDetailsModal from '../modals/FacilityDetailsModal.jsx';

export default function HospitalsView({
  hospitals,
  onRestock,
  onAdjustBeds,
  onNotifyDoctor,
}) {
  const [activeTab, setActiveTab] = useState('FACILITIES');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Flatten all doctors
  const allDoctors = [];
  (hospitals || []).forEach((h) => {
    (h.doctorsOnDuty || []).forEach((doc) => {
      allDoctors.push({
        ...doc,
        hospitalId: h.id,
        hospitalName: h.shortLabel,
        hospitalFullName: h.label,
      });
    });
  });

  const filteredHospitals = (hospitals || []).filter((h) => {
    if (specialtyFilter === 'CARDIOLOGY') return h.specialties.includes('CARDIOLOGY');
    if (specialtyFilter === 'TRAUMA') return h.specialties.includes('TRAUMA');
    if (specialtyFilter === 'HIGH_CAPACITY') return h.availableBeds >= 10;
    return true;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] space-y-6 select-none relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Network Facilities</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Monitor hospital capacity, bed occupancy, and specialist availability across Maharashtra rural health network.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#475569] shadow-sm hover:bg-[#F1F5F9] transition-all"
          >
            <Filter size={13} />
            <span>Filter: {specialtyFilter === 'ALL' ? 'All Facilities' : specialtyFilter}</span>
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 top-11 z-30 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-1 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
              {[
                { id: 'ALL', label: 'All Facilities' },
                { id: 'CARDIOLOGY', label: 'Cardiology Equipped' },
                { id: 'TRAUMA', label: 'Level-1 Trauma Hubs' },
                { id: 'HIGH_CAPACITY', label: 'High Bed Capacity (10+)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSpecialtyFilter(f.id);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all ${
                    specialtyFilter === f.id ? 'bg-[#0D5C46] text-white font-bold' : 'text-[#475569] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E2E8F0] flex gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('FACILITIES')}
          className={`pb-2.5 transition-all border-b-2 ${
            activeTab === 'FACILITIES'
              ? 'border-[#0D5C46] text-[#0D5C46]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Facilities Overview
        </button>
        <button
          onClick={() => setActiveTab('SPECIALISTS')}
          className={`pb-2.5 transition-all border-b-2 ${
            activeTab === 'SPECIALISTS'
              ? 'border-[#0D5C46] text-[#0D5C46]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Specialists Load Tracking ({allDoctors.length})
        </button>
      </div>

      {/* Tab Content 1: Facilities Cards */}
      {activeTab === 'FACILITIES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredHospitals.map((hosp) => {
            const occupied = hosp.totalBeds - hosp.availableBeds;
            const occupancyPct = Math.round((occupied / hosp.totalBeds) * 100);
            const isHighLoad = occupancyPct >= 70;
            const isFull = hosp.availableBeds === 0;
            const hasCardio = hosp.specialties?.includes('CARDIOLOGY');

            return (
              <div
                key={hosp.id}
                onClick={() => setSelectedHospital(hosp)}
                className={`bg-white rounded-2xl p-5 border flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative overflow-hidden cursor-pointer group ${
                  isHighLoad ? 'border-[#E11D48] ring-1 ring-[#E11D48]/20' : 'border-[#E2E8F0] hover:border-[#38D9A9]'
                }`}
              >
                {isHighLoad && <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#E11D48]" />}

                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] group-hover:bg-[#ECFDF5] group-hover:text-[#059669] transition-colors">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0F172A] tracking-tight">{hosp.label}</div>
                        <span className="text-[11px] text-[#64748B]">{hosp.facilityType}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-medium text-[#64748B]">Tier {hosp.tier}</span>
                      <div className="text-[11px] font-mono text-[#059669]">● Queue {hosp.queueWaitMin}m</div>
                    </div>
                  </div>

                  {/* Bed Capacity Progress */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Available Beds</span>
                        <div className="text-2xl font-bold text-[#0F172A] font-sans">
                          {hosp.availableBeds} <span className="text-xs font-normal text-[#64748B]">/ {hosp.totalBeds}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Capacity Load</span>
                        <div className="text-sm font-bold text-[#0F172A] font-mono">{occupancyPct}%</div>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull ? 'bg-[#E11D48]' : isHighLoad ? 'bg-[#F59E0B]' : 'bg-[#059669]'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Specialists Tags */}
                  <div className="mt-5 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Specialists on Duty</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hosp.specialties.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[#15803D] text-[11px] font-medium flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                          <span>{s}</span>
                        </span>
                      ))}
                      {!hasCardio && hosp.tier === 1 && (
                        <span className="px-2.5 py-1 rounded-full bg-[#FFF1F2] border border-[#FFE4E6] text-[#E11D48] text-[11px] font-semibold flex items-center gap-1">
                          <AlertTriangle size={11} />
                          <span>Cardiology - Unavailable</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="mt-6 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#475569]">
                    <span>💊 Critical Meds:</span>
                    <strong className={hosp.inventory.stents > 0 ? 'text-[#059669]' : 'text-[#D97706]'}>
                      {hosp.inventory.stents > 0 ? 'Sufficient' : 'Low Stock (Stents 0)'}
                    </strong>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHospital(hosp);
                    }}
                    className="text-[11px] text-[#0D5C46] font-bold hover:underline"
                  >
                    Manage Facility →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content 2: Specialists Load Tracking Table */}
      {activeTab === 'SPECIALISTS' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              On-Duty Medical Officers &amp; Emergency Specialists
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC]">
                <tr>
                  <th className="px-6 py-3">Doctor</th>
                  <th className="px-6 py-3">Specialty / Location</th>
                  <th className="px-6 py-3">Current Load</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {allDoctors.map((doc, idx) => {
                  const initials = doc.name
                    .split(' ')
                    .filter((_, i) => i === 1 || i === 2)
                    .map((n) => n[0])
                    .join('');

                  const isAvailable = doc.status === 'Available';
                  const isSurgery = doc.status === 'In Surgery' || doc.status === 'In Cath Lab';

                  return (
                    <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] flex items-center justify-center font-bold text-xs">
                          {initials || 'DR'}
                        </div>
                        <div>
                          <div className="font-bold text-[#0F172A]">{doc.name}</div>
                          <div className="text-[11px] text-[#64748B]">{doc.role}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#0F172A]">{doc.specialty}</div>
                        <div className="text-[11px] text-[#64748B]">{doc.hospitalFullName}</div>
                      </td>

                      <td className="px-6 py-4 w-64">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#059669]" style={{ width: `${doc.load}%` }} />
                          </div>
                          <span className="font-mono font-bold text-xs text-[#475569]">{doc.load}%</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isAvailable
                              ? 'bg-[#DCFCE7] text-[#15803D]'
                              : isSurgery
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-[#FFE4E6] text-[#E11D48]'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-[#15803D]' : 'bg-[#D97706]'}`} />
                          <span>{doc.status}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onNotifyDoctor && onNotifyDoctor(doc)}
                          className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F0FDF4] hover:border-[#0D5C46] text-[#0D5C46] font-bold text-xs shadow-sm transition-all"
                        >
                          Page Specialist
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Facility Details Modal */}
      <FacilityDetailsModal
        hospital={selectedHospital}
        isOpen={Boolean(selectedHospital)}
        onClose={() => setSelectedHospital(null)}
        onRestock={onRestock}
        onAdjustBeds={onAdjustBeds}
      />
    </div>
  );
}
