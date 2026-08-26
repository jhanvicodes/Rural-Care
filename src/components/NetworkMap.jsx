import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  EDGE_META,
  INITIAL_VILLAGES,
  INITIAL_HOSPITALS
} from '../data/network.js';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Building2,
  MapPin,
  Flame,
  AlertTriangle,
  Compass,
  Radio
} from 'lucide-react';

const DEFAULT_VIEWBOX = { x: 50, y: 60, width: 840, height: 470 };

export default function NetworkMap({
  hospitals,
  ambulances,
  activeDispatches,
  speed,
  onSelectHospital,
  onSelectVillage,
  selectedNodeId,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showEdgeLabels, setShowEdgeLabels] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);

  const containerRef = useRef(null);

  // Position map lookup
  const positions = useMemo(() => {
    const pos = {};
    INITIAL_VILLAGES.forEach((v) => { pos[v.id] = { x: v.x, y: v.y, label: v.label, subTitle: v.subTitle }; });
    hospitals.forEach((h) => { pos[h.id] = { x: h.x, y: h.y, label: h.shortLabel }; });
    return pos;
  }, [hospitals]);

  // Set of active edges in active routes
  const activeEdgeSet = useMemo(() => {
    const s = new Set();
    activeDispatches.forEach((d) => {
      const all = [...(d.selected?.pickupPath || []), ...(d.selected?.transportPath || [])];
      for (let i = 0; i < all.length - 1; i++) {
        s.add(`${all[i]}-${all[i + 1]}`);
        s.add(`${all[i + 1]}-${all[i]}`);
      }
    });
    return s;
  }, [activeDispatches]);

  // Active emergency origins
  const activeEmergencyOrigins = useMemo(() => {
    const map = new Map();
    activeDispatches.forEach((d) => {
      if (d.request?.origin) {
        map.set(d.request.origin, d.request);
      }
    });
    return map;
  }, [activeDispatches]);

  // Drag & Pan handlers
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'button' || e.target.closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoomLevel((prev) => Math.min(Math.max(prev * zoomFactor, 0.75), 2.4));
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const currentViewBox = useMemo(() => {
    const w = DEFAULT_VIEWBOX.width / zoomLevel;
    const h = DEFAULT_VIEWBOX.height / zoomLevel;
    const x = DEFAULT_VIEWBOX.x + (DEFAULT_VIEWBOX.width - w) / 2 - panOffset.x / zoomLevel;
    const y = DEFAULT_VIEWBOX.y + (DEFAULT_VIEWBOX.height - h) / 2 - panOffset.y / zoomLevel;
    return `${x} ${y} ${w} ${h}`;
  }, [zoomLevel, panOffset]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="w-full h-full relative tactical-grid overflow-hidden cursor-grab active:cursor-grabbing select-none rounded-2xl border border-[#1E2E44] shadow-2xl"
    >
      {/* ── Top-Left Floating Legend Pill ── */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3.5 px-4 py-2.5 bg-[#091424]/90 backdrop-blur-md border border-[#1E334D] rounded-full shadow-xl text-xs font-medium text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]" />
          <span className="text-white font-semibold">Villages (Gram Panchayats)</span>
        </div>
        <div className="w-px h-3.5 bg-[#1E334D]" />
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-[#2563EB] flex items-center justify-center text-[10px] text-white font-bold shadow-[0_0_8px_#3B82F6]">
            +
          </span>
          <span className="text-white font-semibold">Hospitals (PHC / SDH / Apex)</span>
        </div>
        <div className="w-px h-3.5 bg-[#1E334D]" />
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] flex items-center justify-center text-[9px] text-[#0A101D] font-bold shadow-[0_0_8px_#F59E0B]">
            🚑
          </span>
          <span className="text-white font-semibold">108 EMS Units</span>
        </div>
      </div>

      {/* ── Top-Right Map Controls ── */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 bg-[#091424]/90 backdrop-blur-md border border-[#1E334D] rounded-xl shadow-xl">
        <button
          onClick={() => setShowEdgeLabels((v) => !v)}
          title="Toggle Distance & Road Labels"
          className={`p-2 rounded-lg text-xs font-medium transition-all ${
            showEdgeLabels ? 'bg-[#1E334D] text-[#38D9A9]' : 'text-[#64748B] hover:text-[#E2E8F0]'
          }`}
        >
          <Layers size={15} />
        </button>
        <div className="w-px h-4 bg-[#1E334D]" />
        <button
          onClick={() => setZoomLevel((prev) => Math.min(prev * 1.2, 2.4))}
          title="Zoom In"
          className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E334D] rounded-lg transition-all"
        >
          <ZoomIn size={15} />
        </button>
        <button
          onClick={() => setZoomLevel((prev) => Math.max(prev / 1.2, 0.75))}
          title="Zoom Out"
          className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E334D] rounded-lg transition-all"
        >
          <ZoomOut size={15} />
        </button>
        <button
          onClick={resetView}
          title="Reset View"
          className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E334D] rounded-lg transition-all"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* ── Main SVG Map Canvas ── */}
      <svg
        viewBox={currentViewBox}
        className="w-full h-full pointer-events-auto"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="glow-route-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-route-rose" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Realistic Highway / Road Corridors ── */}
        {EDGE_META.map((edge) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          const isActive = activeEdgeSet.has(`${edge.from}-${edge.to}`);

          return (
            <g key={`${edge.from}-${edge.to}`}>
              {/* Highway Bed Glow */}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? '#1E40AF' : '#0F1E33'}
                strokeWidth={isActive ? 8 : 5}
                strokeLinecap="round"
              />
              {/* Road Line */}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? '#38BDF8' : '#1E334D'}
                strokeWidth={isActive ? 2.5 : 1.6}
                strokeDasharray={isActive ? '8 4' : '6 4'}
                strokeLinecap="round"
                className={isActive ? 'route-dash-flow' : ''}
              />
            </g>
          );
        })}

        {/* ── Road Distance Pills ── */}
        {showEdgeLabels &&
          EDGE_META.map((edge) => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            if (!from || !to) return null;
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;
            const isActive = activeEdgeSet.has(`${edge.from}-${edge.to}`);

            return (
              <g key={`lbl-${edge.from}-${edge.to}`} className="pointer-events-none">
                <rect
                  x={mx - 24}
                  y={my - 10}
                  width={48}
                  height={20}
                  rx={10}
                  fill={isActive ? '#081220' : '#091526'}
                  stroke={isActive ? '#38BDF8' : '#1E334D'}
                  strokeWidth={isActive ? 1.2 : 0.8}
                />
                <text
                  x={mx}
                  y={my + 3.5}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="bold"
                  fill={isActive ? '#38BDF8' : '#94A3B8'}
                  fontFamily="monospace"
                >
                  {edge.distanceKm}km · {edge.timeMin}m
                </text>
              </g>
            );
          })}

        {/* ── Active Route Paths ── */}
        {Array.from(activeDispatches.values()).map((d) => {
          const urgency = d.request?.urgency || 1;
          const pickupColor = '#22D3EE';
          const transportColor = urgency === 1 ? '#FB7185' : urgency === 2 ? '#FBBF24' : '#34D399';

          return (
            <g key={d.request?.dispatchId}>
              {/* Pickup Route */}
              <ActiveRoutePath
                path={d.selected?.pickupPath}
                color={pickupColor}
                positions={positions}
                filterId="glow-route-cyan"
              />
              {/* Transport Route */}
              <ActiveRoutePath
                path={d.selected?.transportPath}
                color={transportColor}
                positions={positions}
                filterId={urgency === 1 ? 'glow-route-rose' : 'glow-route-cyan'}
              />
            </g>
          );
        })}

        {/* ── Village Nodes ── */}
        {INITIAL_VILLAGES.map((village) => {
          const emergency = activeEmergencyOrigins.get(village.id);
          const isSelected = selectedNodeId === village.id;

          return (
            <VillageMarker
              key={village.id}
              village={village}
              emergency={emergency}
              isSelected={isSelected}
              onSelect={() => onSelectVillage && onSelectVillage(village)}
              onHover={(isHov) => setHoveredNode(isHov ? { type: 'village', data: village } : null)}
            />
          );
        })}

        {/* ── Hospital Infrastructure Markers ── */}
        {hospitals.map((hospital) => {
          const isSelected = selectedNodeId === hospital.id;

          return (
            <HospitalMarker
              key={hospital.id}
              hospital={hospital}
              isSelected={isSelected}
              onSelect={() => onSelectHospital && onSelectHospital(hospital)}
              onHover={(isHov) => setHoveredNode(isHov ? { type: 'hospital', data: hospital } : null)}
            />
          );
        })}

        {/* ── Moving 108 Emergency Ambulances ── */}
        {Array.from(activeDispatches.values()).map((dispatch) => (
          <AmbulanceVehicleMarker
            key={dispatch.request?.dispatchId}
            dispatch={dispatch}
            positions={positions}
            speed={speed}
          />
        ))}
      </svg>

      {/* ── Floating Node Inspector Tooltip ── */}
      {hoveredNode && (
        <div className="absolute bottom-16 left-4 z-30 pointer-events-none bg-[#091526]/95 backdrop-blur-md border border-[#1E334D] rounded-2xl p-4 shadow-2xl text-xs text-[#E2E8F0] min-w-[240px]">
          {hoveredNode.type === 'village' ? (
            <div>
              <div className="flex items-center gap-2 font-bold text-sm text-[#10B981]">
                <MapPin size={16} />
                <span>{hoveredNode.data.label} Village</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-0.5">{hoveredNode.data.subTitle}</div>
              <div className="mt-2.5 pt-2 border-t border-[#1E334D] text-[#CBD5E1] space-y-1">
                <div>Health Post: <span className="font-semibold text-white">{hoveredNode.data.subCenter}</span></div>
                <div>Population: <span className="font-mono text-[#38D9A9] font-bold">{hoveredNode.data.population.toLocaleString()}</span></div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between font-bold text-sm text-[#38BDF8]">
                <div className="flex items-center gap-1.5">
                  <Building2 size={16} />
                  <span>{hoveredNode.data.label}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1E293B] text-[#94A3B8]">Tier {hoveredNode.data.tier}</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-0.5">{hoveredNode.data.facilityType}</div>
              <div className="mt-2.5 pt-2 border-t border-[#1E334D] space-y-1.5 text-[#CBD5E1]">
                <div className="flex justify-between">
                  <span>Available Beds:</span>
                  <span className="font-mono font-bold text-[#10B981]">{hoveredNode.data.availableBeds} / {hoveredNode.data.totalBeds}</span>
                </div>
                <div className="flex justify-between">
                  <span>Queue Wait:</span>
                  <span className="font-mono font-bold text-[#F59E0B]">{hoveredNode.data.queueWaitMin} min</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Specialties on Duty:</span>
                  <div className="text-white font-medium mt-0.5">{hoveredNode.data.specialties?.join(' · ')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Active Route Polyline ──
function ActiveRoutePath({ path, color, positions, filterId }) {
  if (!path || path.length < 2) return null;
  const pts = path
    .map((id) => positions[id])
    .filter(Boolean)
    .map((p) => `${p.x},${p.y}`)
    .join(' ');

  return (
    <g>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeOpacity={0.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${filterId})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={3.5}
        strokeOpacity={0.95}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="10 6"
        className="route-dash-flow"
      />
    </g>
  );
}

// ── Authentic Indian Village Marker ──
function VillageMarker({ village, emergency, isSelected, onSelect, onHover }) {
  const { x, y, label, subTitle } = village;

  return (
    <g
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="cursor-pointer"
    >
      {/* Emergency Active Pulse Wave */}
      {emergency && (
        <g>
          <circle
            cx={x}
            cy={y}
            r={36}
            fill="none"
            stroke="#EF4444"
            strokeWidth={2}
            className="pulse-ring-anim"
          />
          <circle
            cx={x}
            cy={y}
            r={24}
            fill="#EF4444"
            fillOpacity={0.18}
            className="pulse-emergency"
          />
        </g>
      )}

      {/* Ambient Aura Ring */}
      <circle
        cx={x}
        cy={y}
        r={18}
        fill="#064E3B"
        fillOpacity={0.4}
        stroke={emergency ? '#EF4444' : '#059669'}
        strokeWidth={1}
      />

      {/* Main Node Circle */}
      <circle
        cx={x}
        cy={y}
        r={13}
        fill="#042F2E"
        stroke={emergency ? '#F87171' : isSelected ? '#34D399' : '#10B981'}
        strokeWidth={isSelected ? 3 : 2}
        filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.7))"
      />

      {/* Inner Dot */}
      <circle cx={x} cy={y} r={4.5} fill={emergency ? '#FCA5A5' : '#34D399'} />

      {/* Village Label with Authentic Indian Name */}
      <text
        x={x}
        y={y + 24}
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill={emergency ? '#FCA5A5' : '#D1FAE5'}
        fontFamily="sans-serif"
        letterSpacing="0.2px"
      >
        {label}
      </text>

      <text
        x={x}
        y={y + 34}
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="600"
        fill="#94A3B8"
        fontFamily="sans-serif"
      >
        {subTitle?.split('·')[0]}
      </text>

      {/* Emergency Alert Tag */}
      {emergency && (
        <g>
          <rect
            x={x - 36}
            y={y - 34}
            width={72}
            height={18}
            rx={9}
            fill="#7F1D1D"
            stroke="#EF4444"
            strokeWidth={1}
          />
          <text
            x={x}
            y={y - 22}
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="bold"
            fill="#FEE2E2"
            fontFamily="sans-serif"
          >
            {emergency.emoji || '🚨'} {emergency.urgencyLabel}
          </text>
        </g>
      )}
    </g>
  );
}

// ── Hospital Node Infrastructure Marker ──
function HospitalMarker({ hospital, isSelected, onSelect, onHover }) {
  const { x, y, shortLabel, availableBeds, totalBeds } = hospital;
  const isFull = availableBeds === 0;
  const isHighLoad = !isFull && availableBeds / totalBeds <= 0.35;

  const accentColor = isFull ? '#EF4444' : isHighLoad ? '#F59E0B' : '#3B82F6';

  return (
    <g
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="cursor-pointer"
    >
      {/* Outer Glow Halo */}
      <circle
        cx={x}
        cy={y}
        r={30}
        fill="#0A1528"
        stroke={accentColor}
        strokeWidth={1}
        strokeOpacity={0.35}
      />

      {/* Hospital Infrastructure Rounded Badge */}
      <rect
        x={x - 17}
        y={y - 17}
        width={34}
        height={34}
        rx={9}
        fill="#07101E"
        stroke={isSelected ? '#38BDF8' : accentColor}
        strokeWidth={isSelected ? 2.5 : 1.8}
        filter="drop-shadow(0 0 10px rgba(59, 130, 246, 0.4))"
      />

      {/* Medical Cross */}
      <line x1={x - 7} y1={y} x2={x + 7} y2={y} stroke={accentColor} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={x} y1={y - 7} x2={x} y2={y + 7} stroke={accentColor} strokeWidth={2.5} strokeLinecap="round" />

      {/* Hospital Name */}
      <text
        x={x}
        y={y + 28}
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill="#BFDBFE"
        fontFamily="sans-serif"
      >
        {shortLabel}
      </text>

      {/* Bed Capacity Meter Pill */}
      <g>
        <rect
          x={x - 28}
          y={y + 34}
          width={56}
          height={15}
          rx={7.5}
          fill="#07101E"
          stroke={accentColor}
          strokeWidth={0.9}
        />
        <text
          x={x}
          y={y + 44.5}
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fill={accentColor}
          fontFamily="monospace"
        >
          {availableBeds}/{totalBeds} BEDS
        </text>
      </g>
    </g>
  );
}

// ── 108 Emergency Ambulance Vehicle Marker ──
function AmbulanceVehicleMarker({ dispatch, positions, speed }) {
  const { request, selected } = dispatch;
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('pickup');
  const animRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setProgress(0);
    setPhase('pickup');

    const pickupDur = ((selected?.pickupTime || 5) * 400) / speed;
    const transportDur = ((selected?.transportTime || 5) * 400) / speed;

    const animPhase = (dur) =>
      new Promise((res) => {
        let start = null;
        const frame = (ts) => {
          if (cancelled) return;
          if (!start) start = ts;
          const p = Math.min(1, (ts - start) / dur);
          setProgress(p);
          if (p < 1) animRef.current = requestAnimationFrame(frame);
          else res();
        };
        animRef.current = requestAnimationFrame(frame);
      });

    (async () => {
      await animPhase(pickupDur);
      if (cancelled) return;
      setPhase('transport');
      setProgress(0);
      await animPhase(transportDur);
      if (!cancelled) setPhase('done');
    })();

    return () => {
      cancelled = true;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [selected, speed]);

  const interp = (path, t) => {
    if (!path || path.length < 2) return null;
    const seg = path.length - 1;
    const idx = Math.min(Math.floor(t * seg), seg - 1);
    const prog = t * seg - idx;
    const A = positions[path[idx]];
    const B = positions[path[idx + 1]];
    if (!A || !B) return null;
    return { x: A.x + (B.x - A.x) * prog, y: A.y + (B.y - A.y) * prog };
  };

  const path = phase === 'pickup' ? selected?.pickupPath : selected?.transportPath;
  const pos = interp(path, progress);
  if (!pos || phase === 'done') return null;

  const ambulanceColor = phase === 'pickup' ? '#22D3EE' : '#F59E0B';
  const labelText = phase === 'pickup' ? 'PICKUP' : 'TRANSPORTING';

  return (
    <g>
      {/* Laser Headlight Aura */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={20}
        fill={ambulanceColor}
        fillOpacity={0.25}
        className="pulse-ring-anim"
      />

      {/* Main 108 Ambulance Body */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={14}
        fill="#091424"
        stroke={ambulanceColor}
        strokeWidth={2.5}
        filter="drop-shadow(0 0 10px rgba(245, 158, 11, 0.9))"
      />

      {/* Ambulance Cross */}
      <line x1={pos.x - 5.5} y1={pos.y} x2={pos.x + 5.5} y2={pos.y} stroke={ambulanceColor} strokeWidth={2.2} strokeLinecap="round" />
      <line x1={pos.x} y1={pos.y - 5.5} x2={pos.x} y2={pos.y + 5.5} stroke={ambulanceColor} strokeWidth={2.2} strokeLinecap="round" />

      {/* Floating Status Badge with CallSign */}
      <g>
        <rect
          x={pos.x - 34}
          y={pos.y + 17}
          width={68}
          height={22}
          rx={11}
          fill="#060E1A"
          stroke={ambulanceColor}
          strokeWidth={1}
          filter="drop-shadow(0 3px 8px rgba(0,0,0,0.9))"
        />
        <text
          x={pos.x}
          y={pos.y + 26}
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fill={ambulanceColor}
          fontFamily="monospace"
        >
          {selected?.ambulance?.id || 'AMB-01'}
        </text>
        <text
          x={pos.x}
          y={pos.y + 35}
          textAnchor="middle"
          fontSize="5.5"
          fontWeight="bold"
          fill="#E2E8F0"
          fontFamily="sans-serif"
        >
          {labelText}
        </text>
      </g>
    </g>
  );
}
