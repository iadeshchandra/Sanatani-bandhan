import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, UserCheck, Lock, Users, Sparkles } from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';

interface RolePermission {
  role: UserRole;
  title: string;
  description: string;
  canAccessTreasury: boolean;
  canEditDevotees: boolean;
  canApprovePooja: boolean;
  canBroadcastWhatsApp: boolean;
  canManageVault: boolean;
  badgeColor: string;
}

export const UserRolesDesk: React.FC = () => {
  const { currentUser, updateCurrentUserRole } = useAuthWorkspace();
  const { showToast } = useToast();

  const roleDefinitions: RolePermission[] = [
    {
      role: 'superadmin',
      title: 'Param Adhyaksha (Superadmin)',
      description: 'Supreme control over all 46 modules, workspace switching, vault access, and cryptographic audits.',
      canAccessTreasury: true,
      canEditDevotees: true,
      canApprovePooja: true,
      canBroadcastWhatsApp: true,
      canManageVault: true,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    {
      role: 'trustee',
      title: 'Trustee / Mandir Committee',
      description: 'Treasury approval authority, asset registry audit, budget allocation, and board resolutions.',
      canAccessTreasury: true,
      canEditDevotees: true,
      canApprovePooja: true,
      canBroadcastWhatsApp: true,
      canManageVault: true,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      role: 'accountant',
      title: 'Pradhan Koshadhyaksha (Accountant)',
      description: 'Double-entry ledger entry, 80G tax receipt generation, bhandara invoices, bank reconciliation.',
      canAccessTreasury: true,
      canEditDevotees: false,
      canApprovePooja: false,
      canBroadcastWhatsApp: false,
      canManageVault: false,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      role: 'purohit',
      title: 'Mukhya Purohit (Head Priest)',
      description: 'Pooja calendar scheduling, Sankalp verification, Aarti roster, Shradh alerts, Panjika muhurats.',
      canAccessTreasury: false,
      canEditDevotees: false,
      canApprovePooja: true,
      canBroadcastWhatsApp: false,
      canManageVault: false,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      role: 'volunteer',
      title: 'Mukhya Sevadar (Volunteer Coordinator)',
      description: 'Bhandara food distribution logging, crowd flow scanning, visitor welcome desk entry.',
      canAccessTreasury: false,
      canEditDevotees: true,
      canApprovePooja: false,
      canBroadcastWhatsApp: false,
      canManageVault: false,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      role: 'devotee',
      title: 'Bhakt / Sadhak (Registered Devotee)',
      description: 'Personal Smart Pass ID, donation history, pooja booking tracking, and livestream access.',
      canAccessTreasury: false,
      canEditDevotees: false,
      canApprovePooja: false,
      canBroadcastWhatsApp: false,
      canManageVault: false,
      badgeColor: 'bg-stone-800 text-stone-300 border-stone-700',
    },
  ];

  const handleSwitchMyRole = (newRole: UserRole) => {
    updateCurrentUserRole(newRole);
    showToast(`Role switched to ${newRole.toUpperCase()}! UI permissions immediately updated.`, 'info', 'RBAC Session Updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
              Role-Based Access Control (RBAC)
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Current Session: <span className="font-bold text-amber-400">{currentUser.role.toUpperCase()}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            User Roles & Permissions Matrix
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Granular permissions governing Treasury ledger, Member data, Pooja approvals, and Sanctum Vault
          </p>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roleDefinitions.map((def) => {
          const isCurrent = currentUser.role === def.role;

          return (
            <div
              key={def.role}
              className={`border rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all ${
                isCurrent
                  ? 'bg-purple-950/20 border-purple-500/70 shadow-purple-500/10'
                  : 'bg-stone-900/90 border-stone-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${def.badgeColor}`}>
                      {def.role}
                    </span>
                    <h3 className="font-extrabold text-base text-stone-100 mt-2">{def.title}</h3>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded bg-purple-500 text-stone-950 text-[10px] font-black uppercase">
                      Current
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-400 mt-2 mb-4 leading-relaxed">
                  {def.description}
                </p>

                {/* Permissions Checklist */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">Treasury & Chanda Ledger:</span>
                    {def.canAccessTreasury ? (
                      <span className="text-emerald-400 font-bold">Granted</span>
                    ) : (
                      <span className="text-stone-600 font-mono">Restricted</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">Edit Member / Gotra Records:</span>
                    {def.canEditDevotees ? (
                      <span className="text-emerald-400 font-bold">Granted</span>
                    ) : (
                      <span className="text-stone-600 font-mono">Restricted</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">Approve Sankalp & Poojas:</span>
                    {def.canApprovePooja ? (
                      <span className="text-emerald-400 font-bold">Granted</span>
                    ) : (
                      <span className="text-stone-600 font-mono">Restricted</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">Bulk WhatsApp Broadcaster:</span>
                    {def.canBroadcastWhatsApp ? (
                      <span className="text-emerald-400 font-bold">Granted</span>
                    ) : (
                      <span className="text-stone-600 font-mono">Restricted</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={isCurrent}
                onClick={() => handleSwitchMyRole(def.role)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 cursor-default'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer'
                }`}
              >
                {isCurrent ? 'Active Persona' : `Assume ${def.role.toUpperCase()} Persona`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
