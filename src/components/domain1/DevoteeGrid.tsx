import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  QrCode,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Award,
  CreditCard,
  FileSpreadsheet,
  X,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { useWorkspaceTaxonomy } from '../../hooks/useWorkspaceTaxonomy';
import { useData } from '../../context/DataContext';
import { DevoteeMember, SevaTier } from '../../types';
import { exportToCSV } from '../../utils/csvEngine';
import { generateDevoteeCardPDF } from '../../utils/pdfGenerator';
import { compressAvatarImage } from '../../utils/imageCompression';
import { useToast } from '../../context/ToastContext';
import { generateStandardA_AutoLoginQR, generateStandardB_GatePassQR } from '../../utils/qrUtils';

export const DevoteeGrid: React.FC = () => {
  const { activeWorkspace } = useAuthWorkspace();
  
  const { devotees, addDevotee, updateDevotee, deleteDevotee } = useData();
  const { showToast, confirm } = useToast();

  const taxonomy = useWorkspaceTaxonomy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGotra, setSelectedGotra] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDevotee, setEditingDevotee] = useState<DevoteeMember | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [spiritualName, setSpiritualName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gotra, setGotra] = useState('Kashyapa');
  const [pravara, setPravara] = useState('');
  const [varnaKul, setVarnaKul] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sevaTier, setSevaTier] = useState<SevaTier>('Vishesh');
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [qrModalDevotee, setQrModalDevotee] = useState<DevoteeMember | null>(null);
  const [standardA_QR, setStandardA_QR] = useState<string>('');
  const [standardB_QR, setStandardB_QR] = useState<string>('');
  const [qrTab, setQrTab] = useState<'security' | 'gate'>('security');


  // Extract unique gotras
  const uniqueGotras = useMemo(() => {
    const set = new Set(devotees.map((d) => d.gotra).filter(Boolean));
    return Array.from(set);
  }, [devotees]);

  const filteredDevotees = useMemo(() => {
    return devotees.filter((d) => {
      const matchSearch =
        d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.spiritualName && d.spiritualName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        d.phone.includes(searchTerm) ||
        d.gotra.toLowerCase().includes(searchTerm.toLowerCase());

      const matchGotra = selectedGotra === 'all' || d.gotra === selectedGotra;
      const matchTier = selectedTier === 'all' || d.sevaTier === selectedTier;

      return matchSearch && matchGotra && matchTier;
    });
  }, [devotees, searchTerm, selectedGotra, selectedTier]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressAvatarImage(file);
      setPhotoBase64(compressed);
      showToast('Profile photo compressed (<300px)', 'info');
    } catch (err: any) {
      showToast('Failed to compress avatar photo', 'error');
    }
  };

  const handleSaveDevotee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast('Full name and phone number are required', 'warning');
      return;
    }

    if (editingDevotee) {
      updateDevotee(editingDevotee.id, {
        fullName,
        spiritualName: spiritualName.trim() || undefined,
        phone,
        email: email.trim() || undefined,
        gotra,
        pravara: pravara.trim() || undefined,
        varnaKul: varnaKul.trim() || undefined,
        address: address.trim() || undefined,
        birthDate: birthDate || undefined,
        sevaTier,
        photoBase64: photoBase64 || editingDevotee.photoBase64,
      });
      setEditingDevotee(null);
    } else {
      addDevotee({
        workspaceId: activeWorkspace.id,
        fullName,
        spiritualName: spiritualName.trim() || undefined,
        phone,
        email: email.trim() || undefined,
        pin: Math.floor(1000 + Math.random() * 9000).toString(),
        role: 'devotee',
        sevaIndex: 350,
        sevaTier,
        gotra,
        pravara: pravara.trim() || undefined,
        varnaKul: varnaKul.trim() || undefined,
        address: address.trim() || undefined,
        birthDate: birthDate || undefined,
        activeStatus: 'Active',
        totalDonated: 0,
        volunteerHours: 0,
        photoBase64: photoBase64 || undefined,
      });
    }

    resetForm();
    setIsAddModalOpen(false);
  };

  const resetForm = () => {
    setFullName('');
    setSpiritualName('');
    setPhone('');
    setEmail('');
    setGotra('Kashyapa');
    setPravara('');
    setVarnaKul('');
    setAddress('');
    setBirthDate('');
    setSevaTier('Vishesh');
    setPhotoBase64('');
    setEditingDevotee(null);
  };


  const openQrModal = async (devotee: DevoteeMember) => {
    setQrModalDevotee(devotee);
    setQrTab('security');
    const qrA = await generateStandardA_AutoLoginQR(devotee.id, devotee.pin, activeWorkspace.name);
    const qrB = await generateStandardB_GatePassQR(devotee.id);
    setStandardA_QR(qrA);
    setStandardB_QR(qrB);
  };

  const openEditModal = (devotee: DevoteeMember) => {
    setEditingDevotee(devotee);
    setFullName(devotee.fullName);
    setSpiritualName(devotee.spiritualName || '');
    setPhone(devotee.phone);
    setEmail(devotee.email || '');
    setGotra(devotee.gotra);
    setPravara(devotee.pravara || '');
    setVarnaKul(devotee.varnaKul || '');
    setAddress(devotee.address || '');
    setBirthDate(devotee.birthDate || '');
    setSevaTier(devotee.sevaTier);
    setPhotoBase64(devotee.avatarBase64 || '');
    setIsAddModalOpen(true);
  };

  const handleDelete = (devotee: DevoteeMember) => {
    confirm({
      title: 'Remove Devotee Record?',
      message: `Are you sure you want to remove ${devotee.fullName} (${devotee.gotra}) from the active directory? This action cannot be undone.`,
      confirmText: 'Yes, Remove Record',
      variant: 'danger',
      onConfirm: () => deleteDevotee(devotee.id),
    });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'Spiritual Name', 'Phone', 'Email', 'Gotra', 'Seva Tier', 'Total Donated', 'PIN'];
    const rows = devotees.map((d) => [
      d.id,
      d.fullName,
      d.spiritualName || '',
      d.phone,
      d.email || '',
      d.gotra,
      d.sevaTier,
      d.totalDonated.toString(),
      d.pin,
    ]);
    exportToCSV(`Devotee_Directory_${activeWorkspace.type}_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    showToast('Directory CSV exported successfully', 'success');
  };

  const handlePrintCard = async (devotee: DevoteeMember) => {
    try {
      await generateDevoteeCardPDF(devotee, activeWorkspace);
      showToast(`Smart Pass downloaded for ${devotee.fullName}`, 'success');
    } catch (e: any) {
      showToast('Error generating PDF pass', 'error');
    }
  };

  const getTierColor = (tier: SevaTier) => {
    switch (tier) {
      case 'Ratna':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Vishesh':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Kormi':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-stone-700/50 text-stone-300 border-stone-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              {taxonomy.workspaceLabel} Domain
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Total {taxonomy.memberNoun}: {devotees.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            {taxonomy.directoryName}
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Comprehensive directory with Gotra, Pravara, Seva Tiers, and QR Gate Passes
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            id="add-devotee-btn"
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register {taxonomy.memberNoun}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={`Search ${taxonomy.memberNoun} by name, gotra, phone...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-stone-400 font-medium">Gotra:</span>
            <select
              value={selectedGotra}
              onChange={(e) => setSelectedGotra(e.target.value)}
              className="bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none"
            >
              <option value="all">All Gotras</option>
              {uniqueGotras.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-stone-400 font-medium">Tier:</span>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="Ratna">Ratna (Diamond)</option>
              <option value="Vishesh">Vishesh (Special)</option>
              <option value="Kormi">Kormi (Active)</option>
              <option value="Sadharan">Sadharan (General)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Devotees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevotees.map((devotee) => (
          <div
            key={devotee.id}
            className="bg-stone-900/90 border border-stone-800 hover:border-stone-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  {devotee.photoBase64 ? (
                    <img
                      src={devotee.photoBase64}
                      alt={devotee.fullName}
                      className="w-11 h-11 rounded-xl object-cover border border-amber-500/40 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-amber-400 text-sm shrink-0">
                      {devotee.fullName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-100 leading-tight">
                      {devotee.fullName}
                    </h3>
                    {devotee.spiritualName && (
                      <p className="text-[11px] text-amber-400/90 italic">
                        {devotee.spiritualName}
                      </p>
                    )}
                    <span className="text-[10px] text-stone-400 font-mono">
                      PIN: {devotee.pin} • ID: {devotee.id}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getTierColor(
                    devotee.sevaTier
                  )}`}
                >
                  {devotee.sevaTier}
                </span>
              </div>

              {/* Dharmic Lineage & Vitals */}
              <div className="py-3 space-y-1.5 text-xs text-stone-300">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Gotra & Kul:</span>
                  <span className="font-semibold text-stone-100">
                    {devotee.gotra} {devotee.varnaKul ? `(${devotee.varnaKul})` : ''}
                  </span>
                </div>
                {devotee.pravara && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400">Pravara:</span>
                    <span className="text-stone-300 truncate max-w-[180px]">{devotee.pravara}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Phone:</span>
                  <span className="font-mono text-amber-400">{devotee.phone}</span>
                </div>
                {devotee.address && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400">Address:</span>
                    <span className="text-stone-300 truncate max-w-[180px]">{devotee.address}</span>
                  </div>
                )}
              </div>

              {/* Seva Metrics */}
              <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 grid grid-cols-2 gap-2 text-center text-xs my-2">
                <div>
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Total Chanda</p>
                  <p className="font-bold text-amber-400">₹{devotee.totalDonated.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Seva Index</p>
                  <p className="font-bold text-purple-400">{devotee.sevaIndex} pts</p>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handlePrintCard(devotee)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-400 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Download Smart Pass PDF"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Pass</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(devotee)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Edit Record"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(devotee)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Devotee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/50">
              <h3 className="font-bold text-sm text-stone-100">
                {editingDevotee ? `Edit ${taxonomy.memberNoun} Record` : `Register New ${taxonomy.memberNoun}`}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDevotee} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Spiritual / Diksha Name</label>
                  <input
                    type="text"
                    value={spiritualName}
                    onChange={(e) => setSpiritualName(e.target.value)}
                    placeholder="e.g. Radheshyam Das"
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Primary Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Gotra *</label>
                  <input
                    type="text"
                    required
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Pravara (Rishis)</label>
                  <input
                    type="text"
                    value={pravara}
                    onChange={(e) => setPravara(e.target.value)}
                    placeholder="e.g. Kashyapa, Avatsara"
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Seva Tier</label>
                  <select
                    value={sevaTier}
                    onChange={(e) => setSevaTier(e.target.value as any)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
                  >
                    <option value="Ratna">Ratna</option>
                    <option value="Vishesh">Vishesh</option>
                    <option value="Kormi">Kormi</option>
                    <option value="Sadharan">Sadharan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Residence Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Profile Avatar Photo (Compressed automatically &lt;300px)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-stone-300 hover:file:bg-stone-700 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
                >
                  {editingDevotee ? 'Update Record' : 'Save & Provision PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
};
