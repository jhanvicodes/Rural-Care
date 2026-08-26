// ============================================================
// AUTHENTIC CLINICAL EMERGENCY REQUEST DEFINITIONS
// ============================================================

export const EMERGENCY_TYPES = [
  {
    id: 'CARDIAC',
    label: 'Acute STEMI / Cardiac Arrest',
    shortLabel: 'Cardiac Arrest',
    emoji: '🚨',
    origin: 'V_A',
    originLabel: 'Rampur Village (Khed)',
    patientName: 'Kashinath Jadhav (Age 58)',
    condition: 'Acute Anterior STEMI / Cardiac Shock',
    urgency: 1,
    urgencyLabel: 'CRITICAL',
    specialty: 'CARDIOLOGY',
    requiredMeds: { stents: 1, antivenom: 0, iv: 1 },
    triageVitals: { bp: '80/50', hr: '135 bpm', spo2: '86%' },
  },
  {
    id: 'TRAUMA',
    label: 'Highway Crash / Multi-Trauma',
    shortLabel: 'Severe Trauma',
    emoji: '🩸',
    origin: 'V_B',
    originLabel: 'Chandoli (Bhimashankar Ghat)',
    patientName: 'Sunil Gaikwad (Age 32)',
    condition: 'High-Impact Vehicle Collision / Polytrauma',
    urgency: 1,
    urgencyLabel: 'CRITICAL',
    specialty: 'TRAUMA',
    requiredMeds: { stents: 0, antivenom: 0, iv: 2 },
    triageVitals: { bp: '90/60', hr: '120 bpm', spo2: '92%' },
  },
  {
    id: 'SNAKEBITE',
    label: "Russell's Viper Envenomation",
    shortLabel: 'Snakebite',
    emoji: '🐍',
    origin: 'V_C',
    originLabel: 'Karanjvihire (Indrayani Basin)',
    patientName: 'Shantabai More (Age 45)',
    condition: "Viper Hemotoxic Snakebite with Coagulopathy",
    urgency: 2,
    urgencyLabel: 'HIGH',
    specialty: 'GENERAL',
    requiredMeds: { stents: 0, antivenom: 2, iv: 1 },
    triageVitals: { bp: '110/70', hr: '98 bpm', spo2: '97%' },
  },
];

export const URGENCY_COLORS = {
  1: { text: 'text-rose-400', bg: 'bg-rose-950', border: 'border-rose-700', badge: 'bg-rose-700', stroke: '#f43f5e' },
  2: { text: 'text-amber-400', bg: 'bg-amber-950', border: 'border-amber-700', badge: 'bg-amber-700', stroke: '#f59e0b' },
  3: { text: 'text-emerald-400', bg: 'bg-emerald-950', border: 'border-emerald-700', badge: 'bg-emerald-700', stroke: '#10b981' },
};

export const STATUS_COLORS = {
  IDLE: 'text-emerald-400',
  EN_ROUTE_PICKUP: 'text-cyan-400',
  EN_ROUTE_HOSPITAL: 'text-amber-400',
  COMPLETED: 'text-slate-400',
};

export const STATUS_LABELS = {
  IDLE: 'AVAILABLE',
  EN_ROUTE_PICKUP: 'EN ROUTE (PICKUP)',
  EN_ROUTE_HOSPITAL: 'TRANSPORTING',
  COMPLETED: 'COMPLETED',
};
