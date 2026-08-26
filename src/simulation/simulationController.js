// ============================================================
// SIMULATION CONTROLLER
// Manages dispatch lifecycle, animation, state mutation,
// priority queue processing, and race-condition safety.
// ============================================================

import { runNaiveEngine } from '../algorithms/naiveEngine.js';
import { runConstraintAwareEngine } from '../algorithms/constraintEngine.js';
import { PriorityQueue } from '../algorithms/priorityQueue.js';
import { INITIAL_VILLAGES, INITIAL_HOSPITALS, INITIAL_AMBULANCES, INITIAL_GRAPH } from '../data/network.js';

// Deep-clone helper
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Generate human-readable verdict
function generateVerdict(engine, selected, evaluations, request) {
  if (!selected) {
    return 'No ambulances or hospitals available for dispatch.';
  }

  if (selected.overflow) {
    return `No hospital satisfies the requested specialty (${request.specialty}) and bed-capacity constraints. ` +
      `${selected.hospital.shortLabel} selected as overflow fallback (highest-tier trauma facility).`;
  }

  if (engine === 'NAIVE') {
    const disqCount = evaluations.filter(e => e.status === 'DISQUALIFIED').length;
    return `${selected.hospital.shortLabel} selected based solely on minimum travel time (${selected.totalTravelTime} min). ` +
      `Naive engine ignores specialty, bed capacity, queue wait, and medicine inventory.`;
  }

  // Constraint-aware verdict
  const disqualified = evaluations.filter(e => e.status === 'DISQUALIFIED');
  const disqLines = disqualified.length > 0
    ? disqualified.map(e => {
      const h = e.hospital.shortLabel;
      const reasons = e.disqualifyReasons || [];
      return `${h} disqualified: ${reasons.join(', ')}.`;
    }).join(' ')
    : '';

  const breakdown = selected.costBreakdown;
  const costLine = breakdown
    ? `Total cost: ${breakdown.finalCost.toFixed(1)} (travel: ${breakdown.travelComponent.toFixed(1)}, queue: ${breakdown.queueComponent.toFixed(1)}, medicine penalty: ${breakdown.medicineComponent.toFixed(1)}, urgency: -${breakdown.urgencyComponent.toFixed(1)}).`
    : '';

  return `${selected.hospital.shortLabel} selected — ${request.specialty} specialist available, bed available, lowest constraint-aware cost. ` +
    disqLines + ' ' + costLine;
}

// Generate algorithm trace steps
function generateTrace(engine, request, evaluations, selected) {
  if (engine === 'NAIVE') {
    return [
      '1. Emergency request received',
      '2. Idle ambulances identified',
      '3. Shortest travel routes calculated via Dijkstra (time-weighted)',
      '4. Lowest total travel time selected — specialty/beds/medicine IGNORED',
      `5. Resource mutation applied to ${selected?.hospital?.shortLabel || 'N/A'}`,
      '6. Ambulance dispatched',
    ];
  }
  const disqCount = (evaluations || []).filter(e => e.status === 'DISQUALIFIED').length;
  const feasCount = (evaluations || []).filter(e => e.status !== 'DISQUALIFIED').length;
  return [
    '1. Emergency request received',
    `2. Idle ambulances identified`,
    `3. ${(evaluations || []).length} hospital×ambulance pairs evaluated`,
    `4. Hard constraints applied: specialty=${request.specialty}, beds>0 required`,
    `5. ${disqCount} candidate(s) DISQUALIFIED, ${feasCount} feasible pair(s) remain`,
    '6. Multi-factor cost calculated: α·travel + β·queue + γ·medicine - λ·urgency',
    `7. Optimal candidate selected: ${selected?.overflow ? 'OVERFLOW FALLBACK' : selected?.hospital?.shortLabel || 'N/A'}`,
    '8. Resource mutation applied (beds, inventory, queue)',
    '9. Ambulance dispatched',
  ];
}

// ============================================================
// SimulationController class
// ============================================================
export class SimulationController {
  constructor(setState, addToast, addLog) {
    this.setState = setState;
    this.addToast = addToast;
    this.addLog = addLog;

    // Mutable runtime state
    this.hospitals = deepClone(INITIAL_HOSPITALS);
    this.ambulances = deepClone(INITIAL_AMBULANCES);
    this.graph = deepClone(INITIAL_GRAPH);

    this.dispatchCounter = 0;
    this.activeDispatches = new Map(); // dispatchId -> { cancel, ... }
    this.priorityQueue = new PriorityQueue();

    // Stats
    this.stats = {
      total: 0,
      active: 0,
      queued: 0,
      completed: 0,
      overflow: 0,
    };

    // Generation ID for reset invalidation
    this.generation = 0;

    // Speed multiplier
    this.speed = 1;

    // Decision log entries
    this.decisionLog = [];

    // Engine selection
    this.engine = 'CONSTRAINT'; // 'NAIVE' | 'CONSTRAINT'
  }

  setEngine(engine) {
    this.engine = engine;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  _getState() {
    return {
      ambulances: this.ambulances,
      hospitals: this.hospitals,
      graph: this.graph,
    };
  }

  _findAmbulance(id) {
    return this.ambulances.find(a => a.id === id);
  }

  _findHospital(id) {
    return this.hospitals.find(h => h.id === id);
  }

  // Mutate state after dispatch selection
  _applyDispatchMutation(selected, request) {
    const hosp = this._findHospital(selected.hospital.id);
    const amb = this._findAmbulance(selected.ambulance.id);
    if (!hosp || !amb) return;

    // Decrement beds
    hosp.availableBeds = Math.max(0, hosp.availableBeds - 1);

    // Consume medicines (clamp to zero, do not restore)
    const meds = ['stents', 'antivenom', 'iv'];
    for (const med of meds) {
      const required = request.requiredMeds[med] || 0;
      hosp.inventory[med] = Math.max(0, (hosp.inventory[med] || 0) - required);
    }

    // Increase queue wait
    hosp.queueWaitMin += 5;

    // Set ambulance status
    amb.status = 'EN_ROUTE_PICKUP';
    amb.currentNode = request.origin; // will update after pickup done

    this._pushNetworkState();
  }

  // Restore state after dispatch completes
  _applyDispatchComplete(selected) {
    const hosp = this._findHospital(selected.hospital.id);
    const amb = this._findAmbulance(selected.ambulance.id);
    if (!hosp || !amb) return;

    // Restore bed
    hosp.availableBeds = Math.min(hosp.totalBeds, hosp.availableBeds + 1);

    // Set ambulance back to IDLE at destination hospital
    amb.status = 'IDLE';
    amb.currentNode = selected.hospital.id;

    this._pushNetworkState();
  }

  _pushNetworkState() {
    this.setState(prev => ({
      ...prev,
      hospitals: deepClone(this.hospitals),
      ambulances: deepClone(this.ambulances),
      stats: { ...this.stats, queued: this.priorityQueue.size },
      queuedRequests: this.priorityQueue.getAll(),
    }));
  }

  // Duration helper (affected by speed)
  _dur(ms) {
    return ms / this.speed;
  }

  // Schedule a timeout that can be cancelled
  _timeout(ms, fn, generation) {
    let cancelled = false;
    const id = setTimeout(() => {
      if (!cancelled && this.generation === generation) {
        fn();
      }
    }, this._dur(ms));

    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }

  // Submit a new emergency request
  submit(request) {
    const id = ++this.dispatchCounter;
    const dispatchId = `DISPATCH-${String(id).padStart(3, '0')}`;
    const fullRequest = { ...request, dispatchId, id, submittedAt: Date.now() };

    this.stats.total++;
    this._tryDispatch(fullRequest);
  }

  // Try to dispatch immediately, or queue if no ambulance available
  _tryDispatch(request) {
    const idleAmbs = this.ambulances.filter(a => a.status === 'IDLE');
    if (idleAmbs.length === 0) {
      // Queue it
      this.priorityQueue.enqueue(request);
      this.stats.queued++;
      this.setState(prev => ({
        ...prev,
        stats: { ...this.stats, queued: this.priorityQueue.size },
        queuedRequests: this.priorityQueue.getAll(),
      }));
      this.addToast(`QUEUED: ${request.condition} — No ambulance available`, 'amber');
      return;
    }

    this._executeDispatch(request);
  }

  // Run the selected engine and begin ambulance lifecycle
  _executeDispatch(request) {
    const gen = this.generation;

    // Run selected engine
    let result;
    try {
      if (this.engine === 'NAIVE') {
        result = runNaiveEngine(request, this._getState());
      } else {
        result = runConstraintAwareEngine(request, this._getState());
      }
    } catch (err) {
      console.error('Engine error:', err);
      return;
    }

    if (!result.selected) {
      this.addToast(`No route found for ${request.condition}`, 'rose');
      return;
    }

    const { selected, evaluations, overflow, warning } = result;

    // Generate verdict and trace
    const verdict = generateVerdict(this.engine, selected, evaluations, request);
    const trace = generateTrace(this.engine, request, evaluations, selected);

    // Build log entry
    const logEntry = {
      id: request.dispatchId,
      seq: request.id,
      timestamp: new Date().toISOString(),
      engine: this.engine,
      request: { ...request },
      selected: deepClone(selected),
      evaluations: deepClone(evaluations),
      overflow: overflow || false,
      warning: warning || null,
      verdict,
      trace,
    };

    this.decisionLog.unshift(logEntry);

    // Apply resource mutation immediately
    this._applyDispatchMutation(selected, request);

    this.stats.active++;
    if (overflow) this.stats.overflow++;

    // Toast
    if (overflow) {
      this.addToast(`OVERFLOW ROUTE — ${selected.hospital.shortLabel}`, 'rose');
    } else {
      this.addToast(`DISPATCH — ${selected.ambulance.id} → ${selected.hospital.shortLabel}`, 'cyan');
    }

    // Publish log + state
    this.setState(prev => ({
      ...prev,
      decisionLog: [...this.decisionLog],
      hospitals: deepClone(this.hospitals),
      ambulances: deepClone(this.ambulances),
      stats: { ...this.stats, queued: this.priorityQueue.size },
      queuedRequests: this.priorityQueue.getAll(),
    }));

    // Animate ambulance lifecycle
    this._animateDispatch(request, selected, gen);
  }

  _animateDispatch(request, selected, gen) {
    const dispatchId = request.dispatchId;
    const cancels = [];

    const cancel1 = this._timeout(200, () => {
      // Update ambulance to EN_ROUTE_PICKUP in UI
      const amb = this._findAmbulance(selected.ambulance.id);
      if (amb) {
        amb.status = 'EN_ROUTE_PICKUP';
        this._pushNetworkState();
      }
      // Animate pickup: duration proportional to pickupTime (scale: 1 min = 400ms real time)
      const pickupDur = (selected.pickupTime || 5) * 400;
      const cancel2 = this._timeout(pickupDur, () => {
        // Ambulance reached origin
        const amb2 = this._findAmbulance(selected.ambulance.id);
        if (amb2) {
          amb2.status = 'EN_ROUTE_HOSPITAL';
          amb2.currentNode = request.origin;
          this._pushNetworkState();
        }
        const transportDur = (selected.transportTime || 5) * 400;
        const cancel3 = this._timeout(transportDur, () => {
          // Ambulance arrived at hospital
          const amb3 = this._findAmbulance(selected.ambulance.id);
          if (amb3) {
            amb3.status = 'COMPLETED';
            this._pushNetworkState();
          }
          this.stats.completed++;

          const cancel4 = this._timeout(1500, () => {
            this._applyDispatchComplete(selected);
            this.stats.active = Math.max(0, this.stats.active - 1);

            // Remove from active dispatches
            this.activeDispatches.delete(dispatchId);

            this.setState(prev => ({
              ...prev,
              activeDispatches: new Map(this.activeDispatches),
              stats: { ...this.stats, queued: this.priorityQueue.size },
            }));

            // Process next queued request
            this._processQueue();
          }, gen);
          cancels.push(cancel4);
        }, gen);
        cancels.push(cancel3);
      }, gen);
      cancels.push(cancel2);
    }, gen);
    cancels.push(cancel1);

    // Store cancellation
    const dispatchInfo = {
      request,
      selected,
      cancelAll: () => { cancels.forEach(c => c()); },
    };
    this.activeDispatches.set(dispatchId, dispatchInfo);

    this.setState(prev => ({
      ...prev,
      activeDispatches: new Map(this.activeDispatches),
    }));
  }

  _processQueue() {
    if (this.priorityQueue.isEmpty()) return;
    const idleAmbs = this.ambulances.filter(a => a.status === 'IDLE');
    if (idleAmbs.length === 0) return;

    const next = this.priorityQueue.dequeue();
    if (!next) return;
    this.stats.queued = Math.max(0, this.stats.queued - 1);
    this._executeDispatch(next);
  }

  // Reset everything to initial state
  reset() {
    // Invalidate all pending timers
    this.generation++;

    // Cancel all active dispatch animators
    for (const dispatch of this.activeDispatches.values()) {
      dispatch.cancelAll();
    }
    this.activeDispatches.clear();

    // Clear queue
    this.priorityQueue.clear();

    // Restore from initial state
    this.hospitals = deepClone(INITIAL_HOSPITALS);
    this.ambulances = deepClone(INITIAL_AMBULANCES);
    this.graph = deepClone(INITIAL_GRAPH);

    this.dispatchCounter = 0;
    this.speed = 1;
    this.decisionLog = [];
    this.stats = { total: 0, active: 0, queued: 0, completed: 0, overflow: 0 };

    this.setState(prev => ({
      ...prev,
      hospitals: deepClone(INITIAL_HOSPITALS),
      ambulances: deepClone(INITIAL_AMBULANCES),
      decisionLog: [],
      activeDispatches: new Map(),
      stats: { total: 0, active: 0, queued: 0, completed: 0, overflow: 0 },
      queuedRequests: [],
      speed: 1,
      toasts: [],
    }));
  }

  getDecisionLog() {
    return this.decisionLog;
  }
}
