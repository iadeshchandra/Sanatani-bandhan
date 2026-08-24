import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, X, Download, Award, ShieldCheck, Sparkles, Heart, Clock, Phone, MapPin } from 'lucide-react';
import QRCode from 'qrcode';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useData } from '../../context/DataContext';
import { generateDevoteeCardPDF } from '../../utils/pdfGenerator';
import { useToast } from '../../context/ToastContext';

interface MySpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MySpaceModal: React.FC<MySpaceModalProps> = ({ isOpen, onClose }) => {
  const { activeWorkspace, currentDevotee } = useAuthWorkspace();
  const { devotees } = useData();
  const { showToast } = useToast();

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Fallback to first devotee if personal mode is not logged into a specific one
  const activeMember = currentDevotee || devotees[0];

  useEffect(() => {
    if (!activeMember) return;
    const qrPayload = JSON.stringify({
      ref: activeMember.qrCodeRef,
      id: activeMember.id,
      name: activeMember.fullName,
      pin: activeMember.pin,
      workspace: activeWorkspace.name,
      tier: activeMember.sevaTier,
    });

    QRCode.toDataURL(qrPayload, {
      margin: 1,
      width: 250,
      color: { dark: '#78350F', light: '#FEF3C7' },
    }).then((url) => setQrDataUrl(url));
  }, [activeMember, activeWorkspace]);

  const handleDownloadPDF = async () => {
    if (!activeMember) return;
    try {
      setIsGeneratingPdf(true);
      await generateDevoteeCardPDF(activeMember, activeWorkspace);
      showToast('Smart Devotee Card PDF generated and downloaded!', 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed to generate Smart Card', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isOpen || !activeMember) return null;

  return (
    <AnimatePresence>
      <div
        id="my-space-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="bg-stone-900 border border-stone-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-stone-100 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-100">My Space & Gate Pass</h3>
                <p className="text-[11px] text-stone-400">Personal Identity & Offline Seva Pass</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
            {/* Smart ID Physical Card Simulator */}
            <div className="relative rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-6 text-stone-950 shadow-2xl overflow-hidden border border-amber-500/40">
              {/* Card Watermark */}
              <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-10 select-none pointer-events-none font-serif text-amber-100">
                ॐ
              </div>

              {/* Card Top Banner */}
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-amber-500/30">
                <div>
                  <h4 className="font-extrabold text-amber-100 text-sm tracking-tight">
                    {activeWorkspace.name.toUpperCase()}
                  </h4>
                  <p className="text-[10px] text-amber-200 font-medium">
                    {activeWorkspace.sampradaya || 'Sanatan Dharma Trust'}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold uppercase shadow-sm">
                  {activeMember.sevaTier} Pass
                </span>
              </div>

              {/* Member Core Info & QR */}
              <div className="mt-4 flex items-center gap-4">
                {/* QR Container */}
                <div className="p-1.5 rounded-xl bg-amber-100/90 shadow-md shrink-0">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Gate QR Code"
                      className="w-24 h-24 rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-amber-200 animate-pulse rounded-lg" />
                  )}
                </div>

                {/* Profile Text */}
                <div className="min-w-0 flex-1 text-amber-100">
                  <p className="text-xs text-amber-300 font-mono">ID: {activeMember.id}</p>
                  <h3 className="font-extrabold text-base text-amber-50 leading-snug truncate">
                    {activeMember.fullName}
                  </h3>
                  {activeMember.spiritualName && (
                    <p className="text-xs italic text-amber-200 truncate">
                      ({activeMember.spiritualName})
                    </p>
                  )}
                  <div className="mt-2 space-y-0.5 text-[11px] text-amber-200">
                    <p>Gotra: <span className="font-bold text-amber-100">{activeMember.gotra}</span></p>
                    <p>Kul: <span className="font-bold text-amber-100">{activeMember.varnaKul || 'Sanatan'}</span></p>
                    <p>PIN: <span className="font-mono font-bold text-amber-300">••••</span></p>
                  </div>
                </div>
              </div>

              {/* Card Footer Micro Ref */}
              <div className="mt-4 pt-3 border-t border-amber-500/30 flex items-center justify-between text-[9px] text-amber-200/90">
                <span>Ref: {activeMember.qrCodeRef}</span>
                <span>TrackIQ Universal Community</span>
              </div>
            </div>

            {/* Seva Index Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                <Sparkles className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-lg font-black text-amber-400">{activeMember.sevaIndex}</p>
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Seva Index Pts</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <p className="text-lg font-black text-rose-400">
                  ₹{activeMember.totalDonated.toLocaleString()}
                </p>
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Total Chanda</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                <Clock className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <p className="text-lg font-black text-sky-400">{activeMember.volunteerHours}h</p>
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Seva Hours</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                id="download-smart-card-pdf-btn"
                disabled={isGeneratingPdf}
                onClick={handleDownloadPDF}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/20 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Smart Card PDF'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
