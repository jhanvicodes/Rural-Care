// ============================================================
// CONSTRAINT-AWARE MULTI-FACTOR ENGINE
// ============================================================
// Cost = α*TravelTime + β*WaitTime + γ*MedicinePenalty - λ*(4-urgency)
// α=1.0  β=0.8  γ=2.0  λ=1.0
// Hard filters: specialty available AND availableBeds > 0
// Medicine shortage ONLY adds penalty — does NOT disqualify
// ============================================================

import { dijkstra } from './dijkstra.js';

const ALPHA = 1.0;
const BETA  = 0.8;
const GAMMA = 2.0;
const LAMBDA = 1.0;

function calcMedicinePenalty(hospital, requiredMeds) {
  const inv = hospital.inventory;
  const meds = ['stents', 'antivenom', 'iv'];
  let penalty = 0;
  for (const med of meds) {
    const required = requiredMeds[med] || 0;
    const available = inv[med] || 0;
    const shortage = Math.max(0, required - available);
    penalty += shortage * 15;
  }
  return penalty;
}

/**
 * @param {Object} request - emergency request
 * @param {Object} state   - { ambulances, hospitals, graph }
 * @returns {{ engine, selected, evaluations, overflow, warning }}
 */
export function runConstraintAwareEngine(request, state) {
  const { ambulances, hospitals, graph } = state;
  const idleAmbs = ambulances.filter(a => a.status === 'IDLE');

  const evaluations = [];
  const feasiblePairs = [];

  for (const hospital of hospitals) {
    const specialistAvailable = hospital.specialties.includes(request.specialty);
    const bedsAvailable = hospital.availableBeds > 0;

    for (const amb of idleAmbs) {
      const pickup = dijkstra(graph, amb.currentNode, request.origin);
      const transport = dijkstra(graph, request.origin, hospital.id);

      if (!pickup || !transport) continue;

      const pickupTime = pickup.time;
      const pickupDistance = pickup.distance;
      const transportTime = transport.time;
      const transportDistance = transport.distance;
      const travelTime = pickupTime + transportTime;
      const queueWait = hospital.queueWaitMin;
      const medicinePenalty = calcMedicinePenalty(hospital, request.requiredMeds);
      const urgencyAdjustment = LAMBDA * (4 - request.urgency);

      // Hard filter
      if (!specialistAvailable || !bedsAvailable) {
        const reasons = [];
        if (!specialistAvailable) reasons.push(`${request.specialty} specialist unavailable`);
        if (!bedsAvailable) reasons.push('no beds available');

        evaluations.push({
          hospital: { ...hospital },
          ambulance: { ...amb },
          pickupPath: pickup.path,
          transportPath: transport.path,
          pickupDistance,
          pickupTime,
          transportDistance,
          transportTime,
          travelTime,
          totalDistance: pickupDistance + transportDistance,
          specialistAvailable,
          bedsAvailable,
          queueWait,
          medicinePenalty,
          urgencyAdjustment,
          finalCost: null,
          status: 'DISQUALIFIED',
          disqualifyReasons: reasons,
        });
        continue;
      }

      const finalCost =
        ALPHA * travelTime +
        BETA * queueWait +
        GAMMA * medicinePenalty -
        urgencyAdjustment;

      const evalEntry = {
        hospital: { ...hospital },
        ambulance: { ...amb },
        pickupPath: pickup.path,
        transportPath: transport.path,
        pickupDistance,
        pickupTime,
        transportDistance,
        transportTime,
        travelTime,
        totalDistance: pickupDistance + transportDistance,
        specialistAvailable,
        bedsAvailable,
        queueWait,
        medicinePenalty,
        urgencyAdjustment,
        finalCost,
        status: 'REJECTED',
        disqualifyReasons: [],
        costBreakdown: {
          travelTime,
          alpha: ALPHA,
          travelComponent: ALPHA * travelTime,
          queueWait,
          beta: BETA,
          queueComponent: BETA * queueWait,
          medicinePenalty,
          gamma: GAMMA,
          medicineComponent: GAMMA * medicinePenalty,
          urgency: request.urgency,
          urgencyScore: 4 - request.urgency,
          lambda: LAMBDA,
          urgencyComponent: urgencyAdjustment,
          finalCost,
        },
      };

      evaluations.push(evalEntry);
      feasiblePairs.push(evalEntry);
    }
  }

  // No feasible pairs — overflow to highest tier trauma
  if (feasiblePairs.length === 0) {
    const fallbackHosp = [...hospitals].sort((a, b) => b.tier - a.tier)[0];
    const fallbackAmb = idleAmbs[0] || null;

    if (!fallbackAmb || !fallbackHosp) {
      return { engine: 'CONSTRAINT', selected: null, evaluations, overflow: true, warning: 'OVERFLOW / TRANSFER WARNING' };
    }

    const pickup = dijkstra(graph, fallbackAmb.currentNode, request.origin);
    const transport = dijkstra(graph, request.origin, fallbackHosp.id);

    const pickupTime = pickup ? pickup.time : 999;
    const transportTime = transport ? transport.time : 999;
    const travelTime = pickupTime + transportTime;

    const selected = {
      ambulance: { ...fallbackAmb },
      hospital: { ...fallbackHosp },
      pickupPath: pickup ? pickup.path : [fallbackAmb.currentNode, request.origin],
      transportPath: transport ? transport.path : [request.origin, fallbackHosp.id],
      pickupTime,
      transportTime,
      travelTime,
      totalTravelTime: travelTime,
      finalCost: null,
      overflow: true,
    };

    const markedEvals = evaluations.map(e => ({
      ...e,
      status: (e.hospital.id === fallbackHosp.id && e.ambulance.id === fallbackAmb.id)
        ? 'FALLBACK'
        : e.status,
    }));

    return {
      engine: 'CONSTRAINT',
      selected,
      evaluations: markedEvals,
      overflow: true,
      warning: 'OVERFLOW / TRANSFER WARNING',
    };
  }

  // Sort feasible pairs by finalCost (lowest first)
  feasiblePairs.sort((a, b) => a.finalCost - b.finalCost);
  const best = feasiblePairs[0];
  best.status = 'SELECTED';

  const selected = {
    ambulance: { ...best.ambulance },
    hospital: { ...best.hospital },
    pickupPath: best.pickupPath,
    transportPath: best.transportPath,
    pickupTime: best.pickupTime,
    transportTime: best.transportTime,
    travelTime: best.travelTime,
    totalTravelTime: best.travelTime,
    finalCost: best.finalCost,
    costBreakdown: best.costBreakdown,
    overflow: false,
  };

  return { engine: 'CONSTRAINT', selected, evaluations, overflow: false, warning: null };
}
