import React from 'react';
import { X, Scale } from 'lucide-react';

export const TermsOfService: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Scale className="w-6 h-6 text-indigo-600" />
            Terms of Service & Conduct
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar text-slate-600 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">1. Fiduciary Accountability</h3>
            <p className="leading-relaxed">
              By utilizing the Double-Entry Audited Treasury module, administrators and managers accept full fiduciary responsibility for accurate Chanda (donation) collection and legitimate expense logging. Sanatani Bandhan is not liable for auditing discrepancies caused by user error or malicious internal actors.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">2. Ethical Code of Conduct</h3>
            <p className="leading-relaxed">
              Our platform serves the Dharmic community. We strictly prohibit the use of our services for hate speech, fraudulent matrimonial (Vivah) profiles, unverified or fake priest certifications, or any activity that brings disrepute to Sanatan Dharma. Violations will result in immediate workspace termination.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">3. Service Availability & Offline Sync</h3>
            <p className="leading-relaxed">
              While we provide an offline-first caching protocol allowing operations without internet, you must periodically connect to the network to sync data to the cloud. We are not responsible for data loss occurring on local devices that are damaged or cleared before a successful cloud sync.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">4. Account Termination</h3>
            <p className="leading-relaxed">
              Organizations have the right to terminate their workspace at any time. Upon termination, administrators are responsible for exporting their data. Post-termination, data will be permanently purged from our active shards after a 30-day grace period.
            </p>
          </section>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors">
            Agree & Close
          </button>
        </div>
      </div>
    </div>
  );
};
