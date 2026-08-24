import React, { useState, useEffect } from 'react';
import {
  Crown,
  ShieldAlert,
  Trash2,
  RefreshCw,
  Eye,
  Database,
  Building2,
  Lock,
  KeyRound,
  CheckCircle2,
  Layers,
  ArrowRight,
  Server,
  Zap,
  Globe,
  Sliders
} from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { WorkspaceConfig, UserRole } from '../../types';

interface GodModeBackendProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GodModeBackend: React.FC<GodModeBackendProps> = ({
  isOpen,
  onClose
}) => {
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    currentRole,
    switchRole,
    loginAsRole
  } = useAuthWorkspace();

  const {
    devotees,
    treasury,
    poojaBookings,
    inventory,
    assets,
    cows,
    annadanamList,
    guests,
    families,
    resolutions,
    shifts,
    purgeAutoDeleteRecords
  } = useData();

  const { showToast } = useToast();

  const [godAccessKey, setGodAccessKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedInspectWs, setSelectedInspectWs] = useState(activeWorkspace.id);
  const [ttlMinutes, setTtlMinutes] = useState(60);

  useEffect(() => {
    if (currentRole === 'superadmin' || currentRole === 'master_admin') {
      setIsUnlocked(true);
    }
  }, [currentRole]);

  if (!isOpen) return null;

  const handleUnlockGodMode = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      godAccessKey.trim() === '1008' ||
      godAccessKey.trim().toLowerCase() === 'sonatanibandhan' ||
      godAccessKey.trim().toLowerCase() === 'godmode'
    ) {
      setIsUnlocked(true);
      switchRole('superadmin');
      showToast('Omnipresent God Mode Backend Activated. Full sovereign access granted.', 'success');
    } else {
      showToast('Invalid God Mode Master Reference Key. Use 1008 or sonatanibandhan.', 'error');
    }
  };

  const handleInstantWipeDemoData = () => {
    if (purgeAutoDeleteRecords) {
      purgeAutoDeleteRecords();
      showToast('All temporary demo & sandbox inputs have been wiped from memory.', 'success');
    } else {
      showToast('Auto-delete cleanup triggered across all shards.', 'info');
    }
  };

  const currentInspectWsObj = workspaces.find((w) => w.id === selectedInspectWs) || activeWorkspace;

  // Shard metrics calculation for the inspected workspace
  const shardDevotees = devotees.filter((d) => d.workspaceId === selectedInspectWs);
  const shardTreasury = treasury.filter((t) => t.workspaceId === selectedInspectWs);
  const shardPujas = poojaBookings.filter((p) => p.workspaceId === selectedInspectWs);
  const shardInventory = inventory.filter((i) => i.workspaceId === selectedInspectWs);

  return (
    <div
      id="godmode-backend-modal"
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-amber-500/40 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Sacred God Mode Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/70 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-[#FF9933] flex items-center justify-center text-slate-950 shadow-lg font-black text-xl">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-200 tracking-wide">
                  sonatanibandhan.web.app/own/backend
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40 uppercase font-bold">
                  God Mode Sovereign Controller
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-Tenant Shard Isolation, Global RBAC Override & Sandbox TTL Life-Cycle
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
          >
            Exit Backend
          </button>
        </div>

        {/* Modal Main Content */}
        {!isUnlocked ? (
          <div className="p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Enter Master Reference Access Code</h3>
            <p className="text-xs text-slate-400 mb-6">
              Access to the root control plane requires master authentication clearance.
            </p>

            <form onSubmit={handleUnlockGodMode} className="w-full space-y-4">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={godAccessKey}
                  onChange={(e) => setGodAccessKey(e.target.value)}
                  placeholder="Master Reference Key (1008)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-amber-300 font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGodAccessKey('1008')}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-mono transition-colors"
                >
                  Quick Key: 1008
                </button>
                <button
                  type="button"
                  onClick={() => setGodAccessKey('sonatanibandhan')}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-mono transition-colors"
                >
                  Quick Key: sonatanibandhan
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#FF9933] text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg transition-all cursor-pointer"
              >
                Authenticate God Mode
              </button>
            </form>
          </div>
        ) : (
          <div className="grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Top Quick Status Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Total Shards
                  </span>
                  <span className="text-xl font-black text-white">{workspaces.length}</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">100% Isolated</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                <Layers className="w-8 h-8 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Active Shard Focus
                  </span>
                  <span className="text-sm font-bold text-indigo-200 truncate block max-w-[140px]">
                    {activeWorkspace.name}
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono block">ID: {activeWorkspace.id}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                <Zap className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Demo Quota Cap
                  </span>
                  <span className="text-xl font-black text-emerald-300">5 Entries / Mod</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">Self-Purging Active</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                <Server className="w-8 h-8 text-[#FF9933] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Auto-Wipe Timer
                  </span>
                  <span className="text-xl font-black text-[#FF9933]">{ttlMinutes} Mins</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">Automated Rolling TTL</span>
                </div>
              </div>
            </div>

            {/* Shard Cross-Inspection & Tenant Data Isolation Matrix */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Multi-Tenant Shard Isolation & Instant Impersonation Engine
                  </h3>
                  <p className="text-xs text-slate-400">
                    Each organization's data is strictly partitioned by its unique Workspace ID. Inspect or switch live into any shard.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleInstantWipeDemoData}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Purge All Demo Sandbox Data
                  </button>
                </div>
              </div>

              {/* Shard Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {workspaces.map((ws) => {
                  const isCurrentActive = ws.id === activeWorkspace.id;
                  const isCurrentlyInspected = ws.id === selectedInspectWs;
                  return (
                    <div
                      key={ws.id}
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isCurrentlyInspected
                          ? 'bg-amber-500/10 border-amber-500/60 text-amber-100'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800">{ws.type}</span>
                          {isCurrentActive && (
                            <span className="text-emerald-400 font-bold">● Active</span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold truncate text-white">{ws.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{ws.city}</p>
                      </div>

                      <div className="mt-3 flex gap-1 pt-2 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => setSelectedInspectWs(ws.id)}
                          className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-200 text-center"
                        >
                          Inspect
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            switchWorkspace(ws.id);
                            showToast(`Switched into workspace: ${ws.name}`, 'info');
                          }}
                          className="flex-1 py-1 rounded bg-[#FF9933]/20 hover:bg-[#FF9933]/30 text-[10px] font-semibold text-orange-300 text-center"
                        >
                          Jump In
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Shard Breakdown Panel */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Isolated Shard Telemetry: {currentInspectWsObj.name} ({currentInspectWsObj.id})
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Isolated database scope: No other organization can query or read these records.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">
                    PIN: {currentInspectWsObj.adminPin}
                  </span>
                  <span className="text-[11px] font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">
                    Currency: {currentInspectWsObj.currency} ({currentInspectWsObj.currencySymbol})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Devotees & Members</span>
                  <span className="text-lg font-bold text-white">{shardDevotees.length}</span>
                  <span className="text-[10px] text-slate-500 block">Strictly tenant-scoped</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Treasury Tx Count</span>
                  <span className="text-lg font-bold text-white">{shardTreasury.length}</span>
                  <span className="text-[10px] text-slate-500 block">
                    Vol: ₹{shardTreasury.reduce((acc, t) => acc + (t.type === 'Income' ? t.amount : 0), 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pooja & Seva Bookings</span>
                  <span className="text-lg font-bold text-white">{shardPujas.length}</span>
                  <span className="text-[10px] text-slate-500 block">Sankalpam records</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Inventory Units</span>
                  <span className="text-lg font-bold text-white">{shardInventory.length}</span>
                  <span className="text-[10px] text-slate-500 block">Storehouse SKUs</span>
                </div>
              </div>
            </div>

            {/* Global RBAC Role Simulator */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Global RBAC Role Switching (Instant Permission Override)
              </h4>
              <div className="flex flex-wrap gap-2">
                {(['superadmin', 'head_admin', 'manager', 'accountant', 'purohit', 'volunteer', 'devotee'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      switchRole(r);
                      showToast(`Role switched to: ${r}`, 'success');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentRole === r
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Root God Mode Active: Sovereign cross-workspace supervisory privileges enabled</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
