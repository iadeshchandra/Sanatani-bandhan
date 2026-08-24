import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export const PrivacyPolicy: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Data Privacy & Ownership Pledge
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar text-slate-600 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">1. Zero-Sale Data Pledge</h3>
            <p className="leading-relaxed">
              We make a solemn commitment: your community records, devotee phone numbers, financial ledgers, and personal data will <strong>never</strong> be sold, rented, or monetized for third-party advertising. Sanatani Bandhan is built on trust, not ad revenue.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">2. Client-Side Data Ownership</h3>
            <p className="leading-relaxed">
              The Temple, Trust, or Organization that creates a Workspace retains 100% legal ownership of its database. We act merely as the custodian of the software infrastructure. You can export your data to CSV or PDF at any time without restrictions.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">3. Biometric & Financial Security</h3>
            <p className="leading-relaxed">
              All Auto-Login PINs and financial transaction logs are cryptographically hashed before they even reach our servers. Data is strictly isolated within organizational database shards. A user in Workspace A cannot query the records of Workspace B under any circumstances.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">4. Dharmic Data Handling</h3>
            <p className="leading-relaxed">
              We treat your sacred data (Gotra, Vivah profiles, Seva records) with the utmost respect, applying enterprise-grade encryption at rest and in transit to preserve the sanctity of your community's digital presence.
            </p>
          </section>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors">
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
