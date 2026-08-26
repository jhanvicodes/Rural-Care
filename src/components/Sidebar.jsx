import React from 'react';
import {
  LayoutGrid,
  Zap,
  Truck,
  Building2,
  Package,
  Network,
  BarChart3,
  FileText,
  Settings,
  Plus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onSelectTab,
  onOpenNewDispatch,
  stats,
  isCollapsed,
  onToggleCollapse
}) {
  const navItems = [
    { id: 'command', label: 'Command Center', icon: LayoutGrid },
    { id: 'requests', label: 'Live Requests', icon: Zap, badge: stats?.active + stats?.queued > 0 ? `${stats.active + stats.queued}` : null },
    { id: 'ambulances', label: 'Ambulances', icon: Truck },
    { id: 'hospitals', label: 'Hospitals & Doctors', icon: Building2 },
    { id: 'inventory', label: 'Medicine Inventory', icon: Package },
    { id: 'network', label: 'Routes & Network', icon: Network },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Decision Logs', icon: FileText, badge: stats?.total > 0 ? `${stats.total}` : null },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-[#EDF3F7] border-r border-[#D9E3EA] transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Top Section: Logo & Nav */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Brand Header */}
        <div className="p-4 border-b border-[#DDE7EE] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D5C46] to-[#14795C] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <ShieldCheck size={22} className="text-[#38D9A9]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-bold text-[#0F2231] text-[17px] tracking-tight truncate font-sans">
                  RuralCare
                </span>
                <span className="text-[11px] font-medium text-[#657E92] truncate">
                  Clinical Command
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-[#768F9F] hover:text-[#0F2231] p-1 rounded-md hover:bg-white/60 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all duration-150 ${
                  isActive
                    ? 'bg-[#38D9A9] text-[#052E24] font-semibold shadow-sm'
                    : 'text-[#476175] hover:bg-white/60 hover:text-[#0F2231]'
                }`}
              >
                <Icon
                  size={19}
                  className={`flex-shrink-0 ${isActive ? 'text-[#052E24]' : 'text-[#647F93]'}`}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#052E24]/15 text-[#052E24]'
                        : 'bg-[#D6E2EB] text-[#294254]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom CTA Section */}
      <div className="p-3 border-t border-[#DDE7EE] bg-[#E5EEF4]/60">
        <button
          onClick={onOpenNewDispatch}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0D5C46] hover:bg-[#094736] active:scale-[0.98] text-white font-medium text-[13.5px] shadow-sm transition-all duration-150"
        >
          <Plus size={18} className="text-[#38D9A9]" />
          {!isCollapsed && <span>New Dispatch</span>}
        </button>
      </div>
    </aside>
  );
}
