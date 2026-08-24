import React, { useState } from 'react';
import { Flame, Plus, Search, Calendar, User, Video, CheckCircle2, Clock, X } from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useData } from '../../context/DataContext';
import { PoojaBookingRecord } from '../../types';
import { useToast } from '../../context/ToastContext';

export const PoojaBookingDesk: React.FC = () => {
  const { activeWorkspace } = useAuthWorkspace();
  const { poojas, devotees, addPoojaBooking, updatePoojaStatus } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [poojaName, setPoojaName] = useState('Maha Rudrabhishek');
  const [devoteeId, setDevoteeId] = useState('');
  const [devoteeName, setDevoteeName] = useState('');
  const [gotra, setGotra] = useState('Kashyapa');
  const [nakshatra, setNakshatra] = useState('Rohini');
  const [sankalpText, setSankalpText] = useState('Family prosperity, peace, and spiritual growth');
  const [bookingDate, setBookingDate] = useState('2026-08-28');
  const [timeSlot, setTimeSlot] = useState('08:00 AM - 10:00 AM');
  const [priestAssigned, setPriestAssigned] = useState('Acharya Vidyadhar Shastri');
  const [dakshinaAmount, setDakshinaAmount] = useState<number>(3100);
  const [liveStreamUrl, setLiveStreamUrl] = useState('');

  const handleDevoteeSelect = (id: string) => {
    setDevoteeId(id);
    const d = devotees.find((item) => item.id === id);
    if (d) {
      setDevoteeName(d.fullName);
      setGotra(d.gotra);
    }
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName.trim() || !poojaName) {
      showToast('Please fill in devotee name and ritual details', 'warning');
      return;
    }

    addPoojaBooking({
      workspaceId: activeWorkspace.id,
      poojaName,
      devoteeId: devoteeId || undefined,
      devoteeName: devoteeName.trim(),
      gotra: gotra.trim(),
      nakshatra: nakshatra.trim() || undefined,
      sankalpText: sankalpText.trim(),
      bookingDate,
      timeSlot,
      priestAssigned: priestAssigned.trim(),
      dakshinaAmount: Number(dakshinaAmount),
      liveStreamUrl: liveStreamUrl.trim() || undefined,
    });

    setIsAddModalOpen(false);
  };

  const filteredPoojas = poojas.filter(
    (p) =>
      p.poojaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.devoteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gotra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.priestAssigned.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              Vedic Sankalp Registry
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {poojas.length} Scheduled Rituals
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            Pooja & Ritual Booking Desk
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Sankalp recording with Gotra, Nakshatra, Acharya allocation, and Live streaming link
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book Pooja / Sankalp</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search bookings by devotee, gotra, ritual..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Pooja Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPoojas.map((pooja) => (
          <div
            key={pooja.id}
            className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-100">{pooja.poojaName}</h3>
                    <p className="text-xs text-amber-400 font-semibold">{pooja.devoteeName}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    pooja.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : pooja.status === 'In-Progress'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {pooja.status}
                </span>
              </div>

              <div className="py-2 space-y-1.5 text-xs text-stone-300">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Gotra & Nakshatra:</span>
                  <span className="font-semibold text-stone-100">
                    {pooja.gotra} {pooja.nakshatra ? `(${pooja.nakshatra})` : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Scheduled Date:</span>
                  <span className="font-mono text-amber-300">{pooja.bookingDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Time Slot:</span>
                  <span className="text-stone-200">{pooja.timeSlot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Acharya:</span>
                  <span className="text-stone-200 font-medium">{pooja.priestAssigned}</span>
                </div>

                {pooja.sankalpText && (
                  <div className="pt-2 border-t border-stone-800/80">
                    <p className="text-[10px] text-stone-400 font-semibold uppercase">Sacred Sankalp:</p>
                    <p className="text-[11px] text-amber-200/90 italic">"{pooja.sankalpText}"</p>
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Dakshina</p>
                  <p className="font-black text-amber-400">₹{pooja.dakshinaAmount.toLocaleString()}</p>
                </div>
                {pooja.liveStreamUrl && (
                  <a
                    href={pooja.liveStreamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold flex items-center gap-1 hover:bg-rose-500/30"
                  >
                    <Video className="w-3 h-3" />
                    <span>Watch Live</span>
                  </a>
                )}
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-mono">ID: {pooja.id}</span>
              {pooja.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => updatePoojaStatus(pooja.id, 'Completed')}
                  className="px-3 py-1 rounded-xl bg-stone-800 hover:bg-emerald-600 hover:text-stone-950 text-stone-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-lg w-full p-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <h3 className="font-bold text-sm">Schedule Sacred Pooja / Sankalp</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBooking} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Ritual / Pooja Name *</label>
                <select
                  value={poojaName}
                  onChange={(e) => setPoojaName(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                >
                  <option>Maha Rudrabhishek</option>
                  <option>Satyanarayan Vrat Katha</option>
                  <option>Maha Ganapati Homa</option>
                  <option>Navagraha Shanti Homa</option>
                  <option>Durga Saptashati Chandi Path</option>
                  <option>Sundarkand Path</option>
                  <option>Gau Seva Maha Yajna</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Select Registered Devotee</label>
                  <select
                    value={devoteeId}
                    onChange={(e) => handleDevoteeSelect(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  >
                    <option value="">-- Or enter name manually --</option>
                    {devotees.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName} ({d.gotra})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Devotee Name *</label>
                  <input
                    type="text"
                    required
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Gotra *</label>
                  <input
                    type="text"
                    required
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Janma Nakshatra</label>
                  <input
                    type="text"
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Assigned Priest / Acharya</label>
                  <input
                    type="text"
                    value={priestAssigned}
                    onChange={(e) => setPriestAssigned(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Dakshina Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={dakshinaAmount}
                    onChange={(e) => setDakshinaAmount(Number(e.target.value))}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 font-bold text-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Sankalp Intent & Purpose</label>
                <textarea
                  value={sankalpText}
                  onChange={(e) => setSankalpText(e.target.value)}
                  rows={2}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
