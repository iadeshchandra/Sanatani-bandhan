import React from 'react';
import { X, Lock } from 'lucide-react';

export const SecurityWhitepaper: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Lock className="w-6 h-6 text-slate-900" />
            Security & Trust Architecture
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar text-slate-600 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Role-Based Access Control (RBAC)</h3>
            <p className="leading-relaxed">
              Every action within Sanatani Bandhan is governed by strict RBAC. Root Admins have full structural control, Managers can handle daily operations without accessing sensitive core settings, and standard Devotees are restricted to interacting only with their own profiles, donations, and assigned Sevas.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Localized Database Sharding</h3>
            <p className="leading-relaxed">
              We employ horizontal scaling with distinct logical shards for every organization (e.g., <code>communities/$commId</code>). This structural isolation guarantees that a query executed in one Mandir's workspace cannot accidentally or maliciously retrieve records from another Goshala's workspace.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Zero-Trust Door Gate Passes</h3>
            <p className="leading-relaxed">
              Our QR ecosystem is split into two protocols. The Standard B Gate Pass payload (<code>?action=verify</code>) contains absolutely zero credentials or personal tokens. It relies entirely on server-side or localized database validation to confirm attendance, ensuring that intercepted QR codes yield no usable access vectors to bad actors.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Client-Side Edge Computing</h3>
            <p className="leading-relaxed">
              We offload heavy processing—such as image compression for profile avatars or document scans—directly to the user's browser using native HTML5 Canvas APIs. This ensures zero payload bloat over the network, prevents server-side overflow attacks, and guarantees stability even on low-end mobile WebViews.
            </p>
          </section>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors">
            Close Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
};
