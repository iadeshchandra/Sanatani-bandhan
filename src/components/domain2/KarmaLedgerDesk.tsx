import React from 'react';
import { Sparkles, Award, TrendingUp, Heart, Clock, ShieldCheck } from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useData } from '../../context/DataContext';

export const KarmaLedgerDesk: React.FC = () => {
  const { activeWorkspace } = useAuthWorkspace();
  const { devotees } = useData();

  const sortedDevotees = [...devotees].sort((a, b) => b.sevaIndex - a.sevaIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
              Nishkama Karma Recognition
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Formula: (Chanda ÷ 100) + (Volunteer Hours × 2.5)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            Karma Merit & Volunteer Seva Ledger
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Transparent Dharmic recognition ranking devotees across Ratna, Vishesh, Kormi, and Sadharan tiers
          </p>
        </div>
      </div>

      {/* Tier Explanation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-stone-900/90 border border-purple-500/40 rounded-2xl p-4 space-y-1">
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] uppercase">
            Ratna Tier (850+ pts)
          </span>
          <h4 className="font-bold text-stone-100 text-sm">Diamond Patron</h4>
          <p className="text-stone-400 text-[11px]">
            VIP Sanctum Darshan, Annual Trustee Sabha invite, Special Garbhagriha Archanam
          </p>
        </div>

        <div className="bg-stone-900/90 border border-amber-500/40 rounded-2xl p-4 space-y-1">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase">
            Vishesh Tier (600 - 849 pts)
          </span>
          <h4 className="font-bold text-stone-100 text-sm">Special Sevadar</h4>
          <p className="text-stone-400 text-[11px]">
            Priority festival seating, monthly Prasad courier, personalized Panjika alerts
          </p>
        </div>

        <div className="bg-stone-900/90 border border-blue-500/40 rounded-2xl p-4 space-y-1">
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase">
            Kormi Tier (300 - 599 pts)
          </span>
          <h4 className="font-bold text-stone-100 text-sm">Active Volunteer</h4>
          <p className="text-stone-400 text-[11px]">
            Seva shift coordinator, Bhandara management pass, Vedic library borrowing
          </p>
        </div>

        <div className="bg-stone-900/90 border border-stone-700 rounded-2xl p-4 space-y-1">
          <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-bold text-[10px] uppercase">
            Sadharan Tier (0 - 299 pts)
          </span>
          <h4 className="font-bold text-stone-100 text-sm">General Devotee</h4>
          <p className="text-stone-400 text-[11px]">
            Smart Pass ID, standard Darshan access, community Sandesh broadcasts
          </p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-stone-400 uppercase bg-stone-950/60 font-semibold border-b border-stone-800">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Devotee / Member</th>
                <th className="p-3">Gotra</th>
                <th className="p-3">Seva Tier</th>
                <th className="p-3">Volunteer Hours</th>
                <th className="p-3">Total Chanda</th>
                <th className="p-3 text-right">Karma Index Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {sortedDevotees.map((d, idx) => (
                <tr key={d.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-3">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                          : idx === 1
                          ? 'bg-stone-300 text-stone-950'
                          : idx === 2
                          ? 'bg-amber-800 text-amber-100'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-extrabold text-stone-100">{d.fullName}</p>
                    {d.spiritualName && (
                      <p className="text-[11px] text-amber-400/90 italic">{d.spiritualName}</p>
                    )}
                  </td>
                  <td className="p-3 text-stone-300">{d.gotra}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        d.sevaTier === 'Ratna'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : d.sevaTier === 'Vishesh'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {d.sevaTier}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-sky-400">{d.volunteerHours}h</td>
                  <td className="p-3 font-mono text-amber-400">₹{d.totalDonated.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <span className="font-black text-sm text-purple-400 font-mono">
                      {d.sevaIndex} pts
                    </span>
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
