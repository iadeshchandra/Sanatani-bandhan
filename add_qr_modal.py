import re

with open('src/components/domain1/DevoteeGrid.tsx', 'r') as f:
    content = f.read()

# Add imports for qrUtils
if "import { generateStandardA_AutoLoginQR, generateStandardB_GatePassQR } from '../../utils/qrUtils';" not in content:
    content = content.replace("import { useToast } from '../../context/ToastContext';", "import { useToast } from '../../context/ToastContext';\nimport { generateStandardA_AutoLoginQR, generateStandardB_GatePassQR } from '../../utils/qrUtils';")

# Add state variables
if "const [qrModalDevotee, setQrModalDevotee] = useState" not in content:
    state_vars = """  const [qrModalDevotee, setQrModalDevotee] = useState<DevoteeMember | null>(null);
  const [standardA_QR, setStandardA_QR] = useState<string>('');
  const [standardB_QR, setStandardB_QR] = useState<string>('');
  const [qrTab, setQrTab] = useState<'security' | 'gate'>('security');
"""
    content = content.replace("  const [photoBase64, setPhotoBase64] = useState<string>('');", "  const [photoBase64, setPhotoBase64] = useState<string>('');\n" + state_vars)

# Add openQrModal function
if "const openQrModal = async" not in content:
    qr_func = """
  const openQrModal = async (devotee: DevoteeMember) => {
    setQrModalDevotee(devotee);
    setQrTab('security');
    const qrA = await generateStandardA_AutoLoginQR(devotee.id, devotee.pin, activeWorkspace.name);
    const qrB = await generateStandardB_GatePassQR(devotee.id);
    setStandardA_QR(qrA);
    setStandardB_QR(qrB);
  };
"""
    content = content.replace("  const openEditModal = (devotee: DevoteeMember) => {", qr_func + "\n  const openEditModal = (devotee: DevoteeMember) => {")

# Add button to grid rows
content = content.replace("""                      <button
                        onClick={() => handlePrintCard(devotee)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Print Smart Card"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>""", """                      <button
                        onClick={() => openQrModal(devotee)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#FF9933] hover:bg-orange-50 transition-colors"
                        title="View QR Codes"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrintCard(devotee)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Print Smart Card"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>""")

# Add QR Modal JSX
qr_modal_jsx = """
      {/* QR Codes Modal */}
      {qrModalDevotee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-indigo-500" />
                  Smart Ecosystem QRs
                </h3>
                <p className="text-xs text-slate-500">{qrModalDevotee.fullName} ({qrModalDevotee.gotra})</p>
              </div>
              <button
                onClick={() => setQrModalDevotee(null)}
                className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            
            <div className="flex border-b border-slate-200">
              <button
                className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-1 ${qrTab === 'security' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                onClick={() => setQrTab('security')}
              >
                <ShieldCheck className="w-4 h-4" />
                Security & Recovery (Standard A)
              </button>
              <button
                className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-1 ${qrTab === 'gate' ? 'bg-white text-[#FF9933] border-b-2 border-[#FF9933]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                onClick={() => setQrTab('gate')}
              >
                <MapPin className="w-4 h-4" />
                Gate Pass (Standard B)
              </button>
            </div>

            <div className="p-6 flex flex-col items-center text-center">
              {qrTab === 'security' ? (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl mb-6 text-left">
                    <p className="text-[11px] text-rose-800 font-medium leading-relaxed">
                      <strong className="block text-rose-900 mb-1">Highly Confidential</strong>
                      Contains Auto-Login tokens and Personal PIN. Used for account recovery. <strong>NEVER</strong> show this to gate volunteers or public scanners.
                    </p>
                  </div>
                  {standardA_QR ? (
                    <img src={standardA_QR} alt="Security QR" className="w-48 h-48 mx-auto rounded-xl border-4 border-slate-100 shadow-sm" />
                  ) : (
                    <div className="w-48 h-48 mx-auto bg-slate-100 rounded-xl animate-pulse" />
                  )}
                  <p className="mt-4 text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                    Payload: ?action=autologin
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4">
                   <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-6 text-left">
                    <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                      <strong className="block text-emerald-900 mb-1">100% Safe Public Pass</strong>
                      Contains zero credentials. Used strictly by GuestManager or event scanners for attendance at the door.
                    </p>
                  </div>
                  {standardB_QR ? (
                    <img src={standardB_QR} alt="Gate Pass QR" className="w-48 h-48 mx-auto rounded-xl border-4 border-slate-100 shadow-sm" />
                  ) : (
                    <div className="w-48 h-48 mx-auto bg-slate-100 rounded-xl animate-pulse" />
                  )}
                  <p className="mt-4 text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                    Payload: ?action=verify
                  </p>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
               <button
                onClick={() => setQrModalDevotee(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
"""
content = content.replace("    </div>\n  );\n};\n", qr_modal_jsx + "    </div>\n  );\n};\n")

with open('src/components/domain1/DevoteeGrid.tsx', 'w') as f:
    f.write(content)
