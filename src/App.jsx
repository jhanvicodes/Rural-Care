import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimulationController } from './simulation/simulationController.js';
import { INITIAL_HOSPITALS, INITIAL_AMBULANCES } from './data/network.js';
import { EMERGENCY_TYPES } from './data/emergencies.js';

import Sidebar from './components/Sidebar.jsx';
import TopOperationsBar from './components/TopOperationsBar.jsx';
import NetworkMap from './components/NetworkMap.jsx';
import BottomSimulationBar from './components/BottomSimulationBar.jsx';
import RoutingDecisionDrawer from './components/RoutingDecisionDrawer.jsx';
import NewDispatchModal from './components/NewDispatchModal.jsx';
import SettingsModal from './components/modals/SettingsModal.jsx';

// Dedicated Views
import AmbulancesView from './components/views/AmbulancesView.jsx';
import HospitalsView from './components/views/HospitalsView.jsx';
import InventoryView from './components/views/InventoryView.jsx';
import DecisionLogsView from './components/views/DecisionLogsView.jsx';
import LiveRequestsView from './components/views/LiveRequestsView.jsx';
import RoutesNetworkView from './components/views/RoutesNetworkView.jsx';
import AnalyticsView from './components/views/AnalyticsView.jsx';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function App() {
  const [engineMode, setEngineMode] = useState('CONSTRAINT');
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [autoOpenDrawer, setAutoOpenDrawer] = useState(true);
  const [hospitals, setHospitals] = useState(() => deepClone(INITIAL_HOSPITALS));
  const [ambulances, setAmbulances] = useState(() => deepClone(INITIAL_AMBULANCES));
  const [decisionLog, setDecisionLog] = useState([]);
  const [activeDispatches, setActiveDispatches] = useState(new Map());
  const [queuedRequests, setQueuedRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, queued: 0, completed: 0, overflow: 0 });
  const [toasts, setToasts] = useState([]);

  // Navigation and UI state
  const [selectedDecisionLog, setSelectedDecisionLog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('command');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const simRef = useRef(null);
  const toastTimers = useRef({});

  const addToast = useCallback((message, type = 'cyan') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
    toastTimers.current[id] = timer;
  }, []);

  const applyRef = useRef(null);
  applyRef.current = (partial) => {
    if (!partial) return;
    if (partial.hospitals) setHospitals(partial.hospitals);
    if (partial.ambulances) setAmbulances(partial.ambulances);
    if (partial.decisionLog !== undefined) {
      setDecisionLog(partial.decisionLog);
      if (partial.decisionLog.length > 0 && autoOpenDrawer) {
        setSelectedDecisionLog(partial.decisionLog[0]);
        setIsDrawerOpen(true);
      }
    }
    if (partial.activeDispatches !== undefined) setActiveDispatches(new Map(partial.activeDispatches));
    if (partial.queuedRequests !== undefined) setQueuedRequests([...partial.queuedRequests]);
    if (partial.stats) setStats({ ...partial.stats });
    if (partial.speed !== undefined) setSpeed(partial.speed);
    if (partial.toasts !== undefined) setToasts(partial.toasts);
  };

  useEffect(() => {
    const sim = new SimulationController(
      (updater) => {
        if (typeof updater === 'function') {
          const result = updater({});
          if (result) applyRef.current(result);
        } else {
          applyRef.current(updater);
        }
      },
      addToast,
      () => {}
    );
    simRef.current = sim;

    return () => {
      if (simRef.current) simRef.current.generation++;
    };
  }, []);

  useEffect(() => {
    if (!simRef.current) return;
    simRef.current.addToast = addToast;
  }, [addToast]);

  useEffect(() => {
    if (simRef.current) simRef.current.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    if (simRef.current) simRef.current.setEngine(engineMode);
  }, [engineMode]);

  // Trigger single emergency dispatch
  const handleDispatch = useCallback((emergencyType) => {
    if (!simRef.current) return;
    simRef.current.submit({ ...emergencyType });
    const logs = simRef.current.getDecisionLog();
    setDecisionLog([...logs]);
    if (logs.length > 0) {
      setSelectedDecisionLog(logs[0]);
      if (autoOpenDrawer) setIsDrawerOpen(true);
    }
    setActiveSidebarTab('command');
  }, [autoOpenDrawer]);

  // Trigger random influx wave (3 concurrent requests)
  const handleInfluxWave = useCallback(() => {
    if (!simRef.current) return;
    const types = EMERGENCY_TYPES;
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * types.length);
      const pick = types[idx];
      setTimeout(() => {
        if (simRef.current) {
          simRef.current.submit({ ...pick });
          const logs = simRef.current.getDecisionLog();
          setDecisionLog([...logs]);
          if (logs.length > 0) {
            setSelectedDecisionLog(logs[0]);
            if (autoOpenDrawer) setIsDrawerOpen(true);
          }
        }
      }, i * 90);
    }
    setActiveSidebarTab('command');
  }, [autoOpenDrawer]);

  // Reset entire health network
  const handleReset = useCallback(() => {
    if (!simRef.current) return;
    Object.values(toastTimers.current).forEach(clearTimeout);
    toastTimers.current = {};
    simRef.current.reset();

    setHospitals(deepClone(INITIAL_HOSPITALS));
    setAmbulances(deepClone(INITIAL_AMBULANCES));
    setDecisionLog([]);
    setActiveDispatches(new Map());
    setQueuedRequests([]);
    setStats({ total: 0, active: 0, queued: 0, completed: 0, overflow: 0 });
    setToasts([]);
    setSpeed(1);
    setSelectedDecisionLog(null);
    setIsDrawerOpen(false);
    addToast('Health network reset to baseline operational parameters', 'cyan');
  }, [addToast]);

  // Live State Mutators for Buttons
  const handleRestockHospital = useCallback((hospitalId, item, amount) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id !== hospitalId) return h;
        const currentQty = h.inventory?.[item] || 0;
        return {
          ...h,
          inventory: {
            ...h.inventory,
            [item]: currentQty + amount,
          },
        };
      })
    );
    if (simRef.current) {
      const hosp = simRef.current.hospitals.find((h) => h.id === hospitalId);
      if (hosp) hosp.inventory[item] = (hosp.inventory[item] || 0) + amount;
    }
    addToast(`Restocked +${amount} ${item} at ${hospitalId}`, 'emerald');
  }, [addToast]);

  const handleAdjustBeds = useCallback((hospitalId, delta) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id !== hospitalId) return h;
        const newAvailable = Math.max(0, Math.min(h.totalBeds, h.availableBeds + delta));
        return { ...h, availableBeds: newAvailable };
      })
    );
    if (simRef.current) {
      const hosp = simRef.current.hospitals.find((h) => h.id === hospitalId);
      if (hosp) hosp.availableBeds = Math.max(0, Math.min(hosp.totalBeds, hosp.availableBeds + delta));
    }
    addToast(`Bed capacity updated at ${hospitalId}`, 'cyan');
  }, [addToast]);

  const handleRestockAll = useCallback(() => {
    setHospitals((prev) =>
      prev.map((h) => ({
        ...h,
        inventory: {
          stents: h.inventory.stents + 5,
          antivenom: h.inventory.antivenom + 10,
          iv: h.inventory.iv + 25,
        },
      }))
    );
    if (simRef.current) {
      simRef.current.hospitals.forEach((h) => {
        h.inventory.stents += 5;
        h.inventory.antivenom += 10;
        h.inventory.iv += 25;
      });
    }
    addToast('Network-wide emergency medical supplies restocked (+20%)', 'emerald');
  }, [addToast]);

  const handleRechargeAmbulance = useCallback((ambulanceId) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === ambulanceId ? { ...a, battery: 100 } : a))
    );
    addToast(`Ambulance ${ambulanceId} battery fully recharged (100%)`, 'emerald');
  }, [addToast]);

  const handleNotifyDoctor = useCallback((doctor) => {
    addToast(`🚨 Priority Radio Alert dispatched to ${doctor.name} (${doctor.specialty})`, 'amber');
  }, [addToast]);

  const handleSelectHospital = (hosp) => {
    setSelectedNodeId(hosp.id);
    setActiveSidebarTab('hospitals');
  };

  const handleSelectVillage = (village) => {
    setSelectedNodeId(village.id);
  };

  return (
    <div className="flex h-screen w-screen bg-[#F0F5FA] overflow-hidden select-none font-sans text-slate-900">
      {/* ── Left Sidebar ── */}
      <Sidebar
        activeTab={activeSidebarTab}
        onSelectTab={(tabId) => {
          if (tabId === 'settings') {
            setIsSettingsOpen(true);
          } else {
            setActiveSidebarTab(tabId);
          }
        }}
        onOpenNewDispatch={() => setIsNewDispatchOpen(true)}
        stats={stats}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
      />

      {/* ── Main Operations Workspace ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Operations Header */}
        <TopOperationsBar
          stats={stats}
          ambulances={ambulances}
          hospitals={hospitals}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewDispatch={() => setIsNewDispatchOpen(true)}
          activeDispatches={activeDispatches}
        />

        {/* Dynamic Views */}
        {activeSidebarTab === 'command' && (
          <div className="flex-1 p-5 pt-3 pb-4 flex flex-col min-h-0 relative">
            <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm">
              <NetworkMap
                hospitals={hospitals}
                ambulances={ambulances}
                activeDispatches={activeDispatches}
                speed={speed}
                onSelectHospital={handleSelectHospital}
                onSelectVillage={handleSelectVillage}
                selectedNodeId={selectedNodeId}
              />

              {/* Floating Decision Drawer Pill */}
              {!isDrawerOpen && decisionLog.length > 0 && (
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="absolute top-4 right-44 z-20 px-4 py-2 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-full shadow-lg text-xs font-bold text-[#0D5C46] hover:bg-[#F0FDF4] transition-all flex items-center gap-2 active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-[#38D9A9]" />
                  <span>Inspect Decision ({decisionLog.length})</span>
                </button>
              )}
            </div>

            {/* Bottom Simulation Bar */}
            <div className="mt-3.5 flex-shrink-0">
              <BottomSimulationBar
                engine={engineMode}
                onEngineChange={setEngineMode}
                speed={speed}
                onSpeedChange={setSpeed}
                onReset={handleReset}
                isPaused={isPaused}
                onTogglePause={() => setIsPaused((p) => !p)}
              />
            </div>
          </div>
        )}

        {activeSidebarTab === 'ambulances' && (
          <AmbulancesView
            ambulances={ambulances}
            activeDispatches={activeDispatches}
            onOpenNewDispatch={() => setIsNewDispatchOpen(true)}
            onSwitchToMap={() => setActiveSidebarTab('command')}
            onRechargeAmbulance={handleRechargeAmbulance}
          />
        )}

        {activeSidebarTab === 'hospitals' && (
          <HospitalsView
            hospitals={hospitals}
            onRestock={handleRestockHospital}
            onAdjustBeds={handleAdjustBeds}
            onNotifyDoctor={handleNotifyDoctor}
          />
        )}

        {activeSidebarTab === 'inventory' && (
          <InventoryView hospitals={hospitals} onRestockAll={handleRestockAll} />
        )}

        {activeSidebarTab === 'logs' && (
          <DecisionLogsView
            decisionLog={decisionLog}
            onSelectLog={(log) => {
              setSelectedDecisionLog(log);
              setIsDrawerOpen(true);
            }}
          />
        )}

        {activeSidebarTab === 'requests' && (
          <LiveRequestsView
            activeDispatches={activeDispatches}
            queuedRequests={queuedRequests}
            onOpenNewDispatch={() => setIsNewDispatchOpen(true)}
            onSwitchToMap={() => setActiveSidebarTab('command')}
          />
        )}

        {activeSidebarTab === 'network' && (
          <RoutesNetworkView onSwitchToMap={() => setActiveSidebarTab('command')} />
        )}

        {activeSidebarTab === 'analytics' && (
          <AnalyticsView stats={stats} decisionLog={decisionLog} engine={engineMode} />
        )}
      </div>

      {/* ── Slide-Out Routing Decision Drawer ── */}
      <RoutingDecisionDrawer
        log={selectedDecisionLog}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectAnotherLog={(log) => setSelectedDecisionLog(log)}
        allLogs={decisionLog}
      />

      {/* ── Emergency Dispatch Studio Modal ── */}
      <NewDispatchModal
        isOpen={isNewDispatchOpen}
        onClose={() => setIsNewDispatchOpen(false)}
        onDispatch={handleDispatch}
        onInfluxWave={handleInfluxWave}
        engine={engineMode}
        queuedRequests={queuedRequests}
      />

      {/* ── Command Settings Modal ── */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        engine={engineMode}
        onEngineChange={setEngineMode}
        speed={speed}
        onSpeedChange={setSpeed}
        onReset={handleReset}
        autoOpenDrawer={autoOpenDrawer}
        onToggleAutoOpenDrawer={() => setAutoOpenDrawer((v) => !v)}
      />

      {/* ── Toast Notifications Layer ── */}
      <div className="fixed top-5 right-5 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2.5 rounded-xl border shadow-xl text-xs font-medium max-w-sm pointer-events-auto transition-all ${
              toast.type === 'rose'
                ? 'bg-[#FFF1F2] border-[#FFE4E6] text-[#E11D48]'
                : toast.type === 'amber'
                ? 'bg-[#FFFBEB] border-[#FEF3C7] text-[#D97706]'
                : toast.type === 'emerald'
                ? 'bg-[#F0FDF4] border-[#DCFCE7] text-[#15803D]'
                : 'bg-white border-[#E2E8F0] text-[#0D5C46]'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
