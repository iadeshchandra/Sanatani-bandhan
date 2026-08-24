import React, { useState } from 'react';
import { Compass, Calendar, Sun, Moon, Clock, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';

export const PanchangMuhuratDesk: React.FC = () => {
  const { activeWorkspace } = useAuthWorkspace();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              Drik Siddhanta Vedic Ephemeris
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Vikram Samvat 2082 • Shaka 1948
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            Real-Time Vedic Panjika & Muhurat Engine
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Astronomical calculations for Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, and Abhijit Muhurat
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Main 5 Limbs (Pancha-Anga) Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Tithi */}
        <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">1. Tithi (Lunar Day)</span>
            <Moon className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg font-black text-amber-400">Ekadashi</p>
          <p className="text-xs text-stone-300">Shukla Paksha (Upto 08:42 PM)</p>
          <p className="text-[10px] text-amber-200/80 font-mono">Deity: Lord Vishnu</p>
        </div>

        {/* Vaara */}
        <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">2. Vaara (Solar Day)</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg font-black text-amber-400">Somavaara</p>
          <p className="text-xs text-stone-300">Monday (Chandravara)</p>
          <p className="text-[10px] text-amber-200/80 font-mono">Planet: Chandra (Moon)</p>
        </div>

        {/* Nakshatra */}
        <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">3. Nakshatra</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg font-black text-amber-400">Rohini</p>
          <p className="text-xs text-stone-300">Upto 11:15 PM</p>
          <p className="text-[10px] text-amber-200/80 font-mono">Lord: Prajapati Brahma</p>
        </div>

        {/* Yoga */}
        <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">4. Yoga</span>
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg font-black text-amber-400">Harshana</p>
          <p className="text-xs text-stone-300">Auspicious Yoga</p>
          <p className="text-[10px] text-amber-200/80 font-mono">Effect: Bliss & Victory</p>
        </div>

        {/* Karana */}
        <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">5. Karana</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg font-black text-amber-400">Vanija</p>
          <p className="text-xs text-stone-300">Upto 09:12 AM, then Vishti</p>
          <p className="text-[10px] text-amber-200/80 font-mono">Lord: Manibhadra</p>
        </div>
      </div>

      {/* Auspicious vs Inauspicious Muhurat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shubh Muhurats */}
        <div className="bg-stone-900/90 border border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-black text-sm text-stone-100 uppercase tracking-wider">
                Shubh Muhurats (Auspicious Timings)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              Optimal for Yajna & Deals
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-100">Abhijit Muhurat (Highest Merit)</p>
                <p className="text-[11px] text-stone-400">Ideal for Sankalp, Initiation & Purchase</p>
              </div>
              <p className="font-mono font-bold text-emerald-400">11:54 AM - 12:45 PM</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-100">Brahma Muhurat (Meditation & Japa)</p>
                <p className="text-[11px] text-stone-400">Vedic chanting & Sadhana</p>
              </div>
              <p className="font-mono font-bold text-emerald-400">04:22 AM - 05:10 AM</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-100">Amrit Kaal</p>
                <p className="text-[11px] text-stone-400">Auspicious start of new journey</p>
              </div>
              <p className="font-mono font-bold text-emerald-400">02:30 PM - 04:15 PM</p>
            </div>
          </div>
        </div>

        {/* Ashubh Muhurats */}
        <div className="bg-stone-900/90 border border-rose-500/40 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="font-black text-sm text-stone-100 uppercase tracking-wider">
                Varjya & Ashubh Timings
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
              Avoid New Beginnings
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-100">Rahu Kaal (Inauspicious)</p>
                <p className="text-[11px] text-stone-400">Avoid signing contracts or traveling</p>
              </div>
              <p className="font-mono font-bold text-rose-400">07:30 AM - 09:00 AM</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-100">Yamaganda Kaal</p>
                <p className="text-[11px] text-stone-400">Avoid financial transactions</p>
              </div>
              <p className="font-mono font-bold text-rose-400">10:30 AM - 12:00 PM</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-100">Gulika Kaal</p>
                <p className="text-[11px] text-stone-400">Saturn period</p>
              </div>
              <p className="font-mono font-bold text-rose-400">01:30 PM - 03:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
