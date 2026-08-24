import React, { useState } from 'react';
import { Sun, Moon, Clock, Flame, Users, Sparkles, Video, BellRing, Music } from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useToast } from '../../context/ToastContext';

interface AartiSchedule {
  id: string;
  name: string;
  time: string;
  priestInCharge: string;
  mantra: string;
  bhogDescription: string;
  isLive: boolean;
}

export const MandirPujaDesk: React.FC = () => {
  const { activeWorkspace } = useAuthWorkspace();
  const { showToast } = useToast();

  const [schedules, setSchedules] = useState<AartiSchedule[]>([
    {
      id: 'aarti-1',
      name: 'Mangala Aarti',
      time: '05:00 AM',
      priestInCharge: 'Pandit Somnath Dwivedi',
      mantra: 'Om Jaya Jagadisha Hare / Suprabhatam',
      bhogDescription: 'Makhan Mishri, Fresh Cow Milk, Tulsi Patra',
      isLive: false,
    },
    {
      id: 'aarti-2',
      name: 'Bhog & Shringar Aarti',
      time: '12:00 PM',
      priestInCharge: 'Acharya Vidyadhar Shastri',
      mantra: 'Purusha Suktam & Sri Suktam Parayanam',
      bhogDescription: 'Chappan Bhog, Annadanam Mahaprasad',
      isLive: true,
    },
    {
      id: 'aarti-3',
      name: 'Sandhya Maha Aarti',
      time: '07:00 PM',
      priestInCharge: 'Pandit Somnath Dwivedi',
      mantra: '108 Ghee Deepa Aaradhana with Conch & Damru resonance',
      bhogDescription: 'Panchamrit, Kheer, seasonal fruits',
      isLive: true,
    },
    {
      id: 'aarti-4',
      name: 'Shayan Aarti',
      time: '09:30 PM',
      priestInCharge: 'Acharya Vidyadhar Shastri',
      mantra: 'Karpura Gauram Karunavataram',
      bhogDescription: 'Saffron Badam Milk',
      isLive: false,
    },
  ]);

  const handleNotifyMe = (aartiName: string) => {
    showToast(`Temple bell notification set for ${aartiName}`, 'info', 'Aarti Reminder Activated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              Nitya Seva & Garbhagriha
            </span>
            <span className="text-xs text-stone-400 font-mono">
              4 Nitya Daily Aartis Scheduled
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            Daily Temple Aarti & Priest Roster Desk
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Real-time daily worship schedule, Chappan Bhog allocations, and live darshan telemetry
          </p>
        </div>
      </div>

      {/* Live Sanctum Stream Hero */}
      <div className="bg-stone-950/80 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Live Sanctum Telecast Active
          </span>
          <h3 className="text-lg font-black text-stone-100">
            Garbhagriha Live Darshan Stream
          </h3>
          <p className="text-xs text-stone-400">
            Connected to 4K Ultra-Low Latency streaming hub for overseas Sanatani devotees.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all"
          >
            <Video className="w-4 h-4" />
            <span>Open HD Sanctum Player</span>
          </a>
        </div>
      </div>

      {/* Aarti Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((aarti) => (
          <div
            key={aarti.id}
            className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-100">{aarti.name}</h3>
                    <p className="text-xs font-mono font-bold text-amber-400">{aarti.time}</p>
                  </div>
                </div>

                {aarti.isLive && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                    Broadcasts Live
                  </span>
                )}
              </div>

              <div className="py-2 space-y-2 text-xs text-stone-300">
                <div>
                  <span className="text-stone-400">Acharya on Duty:</span>
                  <p className="font-semibold text-stone-100">{aarti.priestInCharge}</p>
                </div>

                <div>
                  <span className="text-stone-400">Chanting & Stotram:</span>
                  <p className="text-amber-200/90 italic text-[11px]">{aarti.mantra}</p>
                </div>

                <div>
                  <span className="text-stone-400">Sacred Naivedyam (Bhog):</span>
                  <p className="text-stone-300 text-[11px]">{aarti.bhogDescription}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleNotifyMe(aarti.name)}
              className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span>Subscribe to Aarti Alert</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
