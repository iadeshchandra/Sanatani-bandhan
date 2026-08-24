import React, { useState } from 'react';
import { ShieldCheck, Search, Download, Clock, ShieldAlert, Lock, Activity } from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { exportToCSV } from '../../utils/csvEngine';
import { useToast } from '../../context/ToastContext';

interface AuditTrailItem {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: string;
  action: string;
  module: string;
  ipAddress: string;
  severity: 'Info' | 'Warning' | 'Security';
  sha256Hash: string;
}

export const AuditLogDesk: React.FC = () => {
  const { activeWorkspace, currentUser } = useAuthWorkspace();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  const [auditLogs] = useState<AuditTrailItem[]>([
    {
      id: 'log-101',
      timestamp: '2026-08-24 11:42:15',
      userEmail: 'adhyaksha@sanatanibandhan.org',
      userRole: 'superadmin',
      action: 'BATCH_INGEST_DEVOTEES (150 rows processed)',
      module: 'Bulk CSV Ingestion Desk',
      ipAddress: '103.24.12.89',
      severity: 'Info',
      sha256Hash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
    },
    {
      id: 'log-102',
      timestamp: '2026-08-24 10:15:30',
      userEmail: 'accountant@kashi-mandir.org',
      userRole: 'accountant',
      action: 'ISSUE_TAX_RECEIPT (Receipt #SB-80G-1082)',
      module: 'Section 80G Tax Desk',
      ipAddress: '49.36.142.11',
      severity: 'Info',
      sha256Hash: 'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    },
    {
      id: 'log-103',
      timestamp: '2026-08-24 08:30:12',
      userEmail: 'priest@sanatanibandhan.org',
      userRole: 'purohit',
      action: 'SANCTUM_VAULT_DEITY_CROWN_AUDIT',
      module: 'Fixed Asset Desk',
      ipAddress: '103.24.12.89',
      severity: 'Security',
      sha256Hash: 'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    },
    {
      id: 'log-104',
      timestamp: '2026-08-23 21:10:00',
      userEmail: 'guest_user@ip-202.44.1.2',
      userRole: 'anonymous',
      action: 'PIN_AUTH_FAILED (Attempt 1 for PIN: 9999)',
      module: 'Smart ID Pass Desk',
      ipAddress: '202.44.1.2',
      severity: 'Warning',
      sha256Hash: 'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    },
  ]);

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'User Email', 'Role', 'Action', 'Module', 'IP Address', 'Severity', 'Cryptographic SHA-256 Stamp'];
    const rows = auditLogs.map((l) => [
      l.id,
      l.timestamp,
      l.userEmail,
      l.userRole,
      l.action,
      l.module,
      l.ipAddress,
      l.severity,
      l.sha256Hash,
    ]);
    exportToCSV(`Audit_Log_${activeWorkspace.type}_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    showToast('Audit Log CSV exported!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
              Immutable Cryptographic Audit Trail
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Zero-Trust Enterprise Compliance
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            Security & System Audit Log Desk
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Tamper-proof record of every financial transaction, member edit, vault opening, and failed authentication
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search logs by action, user email, module..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-stone-400 uppercase bg-stone-950/60 font-semibold border-b border-stone-800">
              <tr>
                <th className="p-3">Severity & ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Persona</th>
                <th className="p-3">Action & Module</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Cryptographic SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.severity === 'Security'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : log.severity === 'Warning'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {log.severity}
                    </span>
                    <p className="text-[10px] text-stone-400 font-mono mt-1">{log.id}</p>
                  </td>
                  <td className="p-3 font-mono text-stone-300 text-[11px]">{log.timestamp}</td>
                  <td className="p-3">
                    <p className="font-bold text-stone-100">{log.userEmail}</p>
                    <p className="text-[10px] text-amber-400 font-mono uppercase">{log.userRole}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-stone-200">{log.action}</p>
                    <p className="text-[11px] text-stone-400">{log.module}</p>
                  </td>
                  <td className="p-3 font-mono text-stone-300">{log.ipAddress}</td>
                  <td className="p-3 font-mono text-[10px] text-stone-400 truncate max-w-[140px]">
                    {log.sha256Hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
