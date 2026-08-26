// ============================================================
// AUTHENTIC INDIAN HEALTHCARE NETWORK DATA
// Real Maharashtra / Western Ghats rural health ecosystem
// ============================================================

export const INITIAL_VILLAGES = [
  {
    id: 'V_A',
    label: 'Rampur',
    subTitle: 'Khed Taluka · Pop 4,820',
    district: 'Pune Rural',
    x: 150,
    y: 190,
    population: 4820,
    primaryOccupation: 'Agriculture & Dairy',
    subCenter: 'Rampur Health Sub-Centre (Ayushman Bharat HWC)',
  },
  {
    id: 'V_B',
    label: 'Chandoli',
    subTitle: 'Ambegaon Belt · Pop 3,450',
    district: 'Pune Rural',
    x: 270,
    y: 470,
    population: 3450,
    primaryOccupation: 'Forestry & Sugarcane',
    subCenter: 'Chandoli Gram Arogya Kendra',
  },
  {
    id: 'V_C',
    label: 'Karanjvihire',
    subTitle: 'Indrayani Valley · Pop 5,600',
    district: 'Pune Rural',
    x: 650,
    y: 150,
    population: 5600,
    primaryOccupation: 'Floriculture & Agrarian',
    subCenter: 'Karanjvihire Primary Health Post',
  },
];

export const INITIAL_HOSPITALS = [
  {
    id: 'H_B',
    label: 'Khed Primary Health Centre (PHC)',
    shortLabel: 'Khed PHC',
    facilityType: 'Government Primary Health Centre',
    tier: 1,
    specialties: ['GENERAL'],
    totalBeds: 8,
    availableBeds: 4,
    queueWaitMin: 0,
    inventory: { stents: 0, antivenom: 4, iv: 30 },
    doctorsOnDuty: [
      { id: 'DOC-1', name: 'Dr. Ramesh Patil', role: 'Medical Officer (MBBS)', specialty: 'General Medicine', load: 35, status: 'Available' },
      { id: 'DOC-2', name: 'Dr. Sneha Shinde', role: 'Staff Nurse In-Charge', specialty: 'Triage & Nursing', load: 60, status: 'Available' },
    ],
    x: 270,
    y: 200,
  },
  {
    id: 'H_C',
    label: 'Manchar Sub-District Hospital (SDH)',
    shortLabel: 'Manchar SDH',
    facilityType: '100-Bed Sub-District Community Hospital',
    tier: 2,
    specialties: ['CARDIOLOGY', 'GENERAL', 'PEDIATRICS'],
    totalBeds: 20,
    availableBeds: 8,
    queueWaitMin: 5,
    inventory: { stents: 8, antivenom: 15, iv: 65 },
    doctorsOnDuty: [
      { id: 'DOC-3', name: 'Dr. Elena Cruz (MD Cardio)', role: 'Senior Interventional Cardiologist', specialty: 'Cardiology', load: 45, status: 'Available' },
      { id: 'DOC-4', name: 'Dr. Amit Deshmukh', role: 'Consultant General Surgeon', specialty: 'General Surgery', load: 70, status: 'In Surgery' },
      { id: 'DOC-5', name: 'Dr. Priya Kulkarni', role: 'Pediatric Specialist', specialty: 'Pediatrics', load: 30, status: 'Available' },
    ],
    x: 500,
    y: 380,
  },
  {
    id: 'H_D',
    label: 'Sassoon Apex Trauma & Medical College',
    shortLabel: 'Sassoon Apex',
    facilityType: 'Tertiary Apex Multi-Trauma Center & Research Hospital',
    tier: 3,
    specialties: ['TRAUMA', 'CARDIOLOGY', 'PEDIATRICS', 'GENERAL', 'NEUROLOGY'],
    totalBeds: 50,
    availableBeds: 22,
    queueWaitMin: 25,
    inventory: { stents: 30, antivenom: 45, iv: 160 },
    doctorsOnDuty: [
      { id: 'DOC-6', name: 'Dr. Rajesh Sharma', role: 'Chief Trauma Surgeon', specialty: 'Trauma Surgery', load: 55, status: 'Available' },
      { id: 'DOC-7', name: 'Dr. Vikram Rao', role: 'Toxicology & Antivenom Specialist', specialty: 'Toxicology', load: 40, status: 'Available' },
      { id: 'DOC-8', name: 'Dr. Sunita Gaikwad', role: 'Senior Neurosurgeon', specialty: 'Neurology', load: 65, status: 'Available' },
      { id: 'DOC-9', name: 'Dr. Marcus Vance', role: 'Cardiac Critical Care Lead', specialty: 'Cardiology', load: 85, status: 'In Cath Lab' },
    ],
    x: 790,
    y: 410,
  },
];

export const INITIAL_AMBULANCES = [
  {
    id: 'AMB-01',
    callSign: 'MH-12-1081',
    type: 'Basic Life Support (BLS)',
    stationedAt: 'H_B',
    currentNode: 'H_B',
    status: 'IDLE',
    battery: 94,
    driver: 'Suresh More',
    paramedic: 'Kavita Gaikwad',
    equipment: 'Oxygen Cylinder, AED, Basic Splints',
  },
  {
    id: 'AMB-02',
    callSign: 'MH-12-1082',
    type: 'Advanced Life Support (ALS - Cardiac)',
    stationedAt: 'H_C',
    currentNode: 'H_C',
    status: 'IDLE',
    battery: 88,
    driver: 'Prakash Shinde',
    paramedic: 'Dr. Anjali Verma (EMS)',
    equipment: '12-Lead ECG, Ventilator, Defibrillator, Syringe Pump',
  },
  {
    id: 'AMB-03',
    callSign: 'MH-12-1083',
    type: 'Critical Care Mobile ICU (CCU)',
    stationedAt: 'H_D',
    currentNode: 'H_D',
    status: 'IDLE',
    battery: 98,
    driver: 'Santosh Jadhav',
    paramedic: 'Dr. Rahul Kadam (Emergency Med)',
    equipment: 'Portable Blood Gas, Syringe Infusion, Advanced Airway, Tele-ECG',
  },
  {
    id: 'AMB-04',
    callSign: 'MH-12-1084',
    type: 'Highway Quick Response Unit',
    stationedAt: 'H_C',
    currentNode: 'H_C',
    status: 'IDLE',
    battery: 82,
    driver: 'Vinod Bhosale',
    paramedic: 'Sachin Thorat',
    equipment: 'Hydraulic Extrication, Spine Boards, Hemostatic Kits',
  },
];

// Edges — bidirectional real distances in KM & minutes
export const EDGES_DEF = [
  ['V_A', 'H_B', 10, 12], // Rampur -> Khed PHC
  ['H_B', 'V_B', 18, 22], // Khed PHC -> Chandoli
  ['V_A', 'H_C', 25, 28], // Rampur -> Manchar SDH
  ['V_B', 'H_C', 15, 18], // Chandoli -> Manchar SDH
  ['H_C', 'V_C', 20, 24], // Manchar SDH -> Karanjvihire
  ['H_C', 'H_D', 22, 25], // Manchar SDH -> Sassoon Apex
  ['V_C', 'H_D', 16, 19], // Karanjvihire -> Sassoon Apex
  ['V_A', 'V_B', 28, 34], // Rampur -> Chandoli Link
];

// Build adjacency list for Dijkstra
export function buildGraph(edges) {
  const graph = {};

  const allNodes = new Set();
  edges.forEach(([a, b]) => { allNodes.add(a); allNodes.add(b); });
  allNodes.forEach(n => { graph[n] = []; });

  edges.forEach(([a, b, dist, time]) => {
    graph[a].push({ neighbor: b, distanceKm: dist, timeMin: time });
    graph[b].push({ neighbor: a, distanceKm: dist, timeMin: time });
  });

  return graph;
}

export const INITIAL_GRAPH = buildGraph(EDGES_DEF);

export const EDGE_META = EDGES_DEF.map(([a, b, distanceKm, timeMin]) => ({
  from: a,
  to: b,
  distanceKm,
  timeMin,
  roadName: `${a}–${b} Corridor`,
}));

export function buildNodePositions(villages, hospitals) {
  const positions = {};
  villages.forEach(v => { positions[v.id] = { x: v.x, y: v.y, label: v.label, subTitle: v.subTitle }; });
  hospitals.forEach(h => { positions[h.id] = { x: h.x, y: h.y, label: h.shortLabel }; });
  return positions;
}

export const NODE_POSITIONS = buildNodePositions(INITIAL_VILLAGES, INITIAL_HOSPITALS);
