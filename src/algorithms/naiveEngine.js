// ============================================================
// NAIVE ENGINE — Distance-Only Dijkstra Selection
// NEVER uses specialty, beds, queue, medicine, or urgency
// ============================================================

import { dijkstra } from './dijkstra.js';

/**
 * @param {Object} request - emergency request
 * @param {Object} state   - { ambulances, hospitals, graph }
 * @returns {{ engine, selected, evaluations }}
 */
export function runNaiveEngine(request, state) {
  const { ambulances, hospitals, graph } = state;
  const idleAmbs = ambulances.filter(a => a.status === 'IDLE');

  const evaluations = [];

  for (const hospital of hospitals) {
    for (const amb of idleAmbs) {
      const pickup = dijkstra(graph, amb.currentNode, request.origin);
      const transport = dijkstra(graph, request.origin, hospital.id);

      if (!pickup || !transport) continue;

      const pickupTime = pickup.time;
      const pickupDistance = pickup.distance;
      const transportTime = transport.time;
      const transportDistance = transport.distance;
      const totalTravelTime = pickupTime + transportTime;
      const totalDistance = pickupDistance + transportDistance;

      evaluations.push({
        hospital: { ...hospital },
        ambulance: { ...amb },
        pickupPath: pickup.path,
        transportPath: transport.path,
        pickupDistance,
        pickupTime,
        transportDistance,
        transportTime,
        totalDistance,
        totalTravelTime,
        // Resource info shown for transparency — but NOT used for selection
        specialistAvailable: hospital.specialties.includes(request.specialty),
        bedsAvailable: hospital.availableBeds > 0,
        queueWait: hospital.queueWaitMin,
        medicinePenalty: null,
      });
    }
  }

  if (evaluations.length === 0) {
    return { engine: 'NAIVE', selected: null, evaluations };
  }

  // Sort by total travel time ONLY — completely ignore everything else
  evaluations.sort((a, b) => a.totalTravelTime - b.totalTravelTime);
  const best = evaluations[0];

  const selected = {
    ambulance: best.ambulance,
    hospital: best.hospital,
    pickupPath: best.pickupPath,
    transportPath: best.transportPath,
    pickupTime: best.pickupTime,
    transportTime: best.transportTime,
    totalTravelTime: best.totalTravelTime,
    travelTime: best.totalTravelTime,
    naiveTravelTime: best.totalTravelTime,
  };

  const markedEvals = evaluations.map(e => ({
    ...e,
    status: (e.hospital.id === best.hospital.id && e.ambulance.id === best.ambulance.id)
      ? 'SELECTED'
      : 'REJECTED',
    finalCost: e.totalTravelTime,
  }));

  return { engine: 'NAIVE', selected, evaluations: markedEvals };
}
