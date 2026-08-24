import React, { useState } from 'react';
import { Utensils, Plus, Heart, Users, Sparkles, CheckCircle2, Clock, X } from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useToast } from '../../context/ToastContext';

interface MealSponsorship {
  id: string;
  donorName: string;
  gotra: string;
  occasion: string;
  date: string;
  mealsCount: number;
  costRupees: number;
  status: 'Distributed' | 'Scheduled';
}

export const AnnadanamKitchenDesk: React.FC = () => {
  const { activeWorkspace } = useAuthWorkspace();
  const { showToast } = useToast();

  const [totalMealsServedToday, setTotalMealsServedToday] = useState(1450);
  const [sponsorships, setSponsorships] = useState<MealSponsorship[]>([
    {
      id: 'anna-1',
      donorName: 'Sri Raghavendra Rao & Family',
      gotra: 'Bharadwaja',
      occasion: 'Janmadin (Birthday) of Grandson',
      date: new Date().toISOString().slice(0, 10),
      mealsCount: 501,
      costRupees: 15000,
      status: 'Distributed',
    },
    {
      id: 'anna-2',
      donorName: 'Smt. Gayatri Devi',
      gotra: 'Kashyapa',
      occasion: 'Punya Tithi of Father',
      date: '2026-08-26',
      mealsCount: 251,
      costRupees: 7500,
      status: 'Scheduled',
    },
    {
      id: 'anna-3',
      donorName: 'Sri Aloknath Mukherjee',
      gotra: 'Shandilya',
      occasion: 'Marriage Anniversary',
      date: '2026-08-28',
      mealsCount: 1001,
      costRupees: 31000,
      status: 'Scheduled',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [gotra, setGotra] = useState('Kashyapa');
  const [occasion, setOccasion] = useState('Janmadin (Birthday) Seva');
  const [date, setDate] = useState('2026-08-29');
  const [mealsCount, setMealsCount] = useState<number>(501);

  const handleSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) return;

    const cost = Math.round(mealsCount * 30);
    const newSponsorship: MealSponsorship = {
      id: `anna-${Date.now()}`,
      donorName: donorName.trim(),
      gotra: gotra.trim(),
      occasion: occasion.trim(),
      date,
      mealsCount: Number(mealsCount),
      costRupees: cost,
      status: 'Scheduled',
    };

    setSponsorships([newSponsorship, ...sponsorships]);
    setIsAddModalOpen(false);
    showToast(`Annadanam Sponsorship confirmed for ${mealsCount} meals (₹${cost.toLocaleString()})`, 'success', 'Maha Prasadam Sponsored');
  };

  const handleIncrementMeals = (count: number) => {
    setTotalMealsServedToday((prev) => prev + count);
    showToast(`+${count} Maha Prasadam meals logged!`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              Maha Prasadam Kitchen Engine
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Annam Parabrahma Swaroopam
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            Annadanam Mega Kitchen Desk
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Real-time meal distribution logging, donor Annadanam sponsorships, and raw ingredient batch calculations
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Sponsor Annadanam Feast</span>
        </button>
      </div>

      {/* Live Serving Counter */}
      <div className="bg-stone-950/80 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            Today's Maha Prasadam Meals Distributed
          </span>
          <p className="text-4xl sm:text-5xl font-black text-amber-400">
            {totalMealsServedToday.toLocaleString()} <span className="text-base text-stone-300 font-normal">Meals</span>
          </p>
          <p className="text-xs text-stone-400">
            Prepared with pure Desi Ghee, Sona Masoori Akshat, and seasonal sattvic vegetables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleIncrementMeals(50)}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-bold border border-stone-700 cursor-pointer"
          >
            +50 Plates
          </button>
          <button
            type="button"
            onClick={() => handleIncrementMeals(100)}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-bold border border-stone-700 cursor-pointer"
          >
            +100 Plates
          </button>
          <button
            type="button"
            onClick={() => handleIncrementMeals(500)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-black shadow-md shadow-amber-600/20 cursor-pointer"
          >
            +500 Mega Batch
          </button>
        </div>
      </div>

      {/* Sponsorship Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsorships.map((s) => (
          <div
            key={s.id}
            className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
                <div>
                  <h3 className="font-extrabold text-sm text-stone-100">{s.donorName}</h3>
                  <p className="text-xs text-amber-400 font-medium">Gotra: {s.gotra}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    s.status === 'Distributed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="py-2 space-y-1 text-xs text-stone-300">
                <p>
                  <span className="text-stone-400">Occasion:</span>{' '}
                  <span className="font-semibold text-stone-100">{s.occasion}</span>
                </p>
                <p>
                  <span className="text-stone-400">Scheduled Date:</span>{' '}
                  <span className="font-mono text-stone-200">{s.date}</span>
                </p>
                <p>
                  <span className="text-stone-400">Meal Capacity:</span>{' '}
                  <span className="font-bold text-amber-300">{s.mealsCount} Devotees</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Seva Contribution</p>
                  <p className="font-black text-amber-400 text-sm">₹{s.costRupees.toLocaleString()}</p>
                </div>
                <Utensils className="w-5 h-5 text-amber-500 opacity-80" />
              </div>
            </div>

            <div className="pt-2 text-right">
              <span className="text-[10px] text-stone-400 font-mono">ID: {s.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sponsor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <h3 className="font-bold text-sm">Sponsor Maha Prasadam Annadanam</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSponsor} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Donor Name *</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Sri Rajesh Sharma & Parivar"
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Gotra *</label>
                  <input
                    type="text"
                    required
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Occasion / Sankalp</label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g. Janmadin, Punyatithi, Grihapravesh"
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Number of Devotee Meals</label>
                <select
                  value={mealsCount}
                  onChange={(e) => setMealsCount(Number(e.target.value))}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                >
                  <option value={101}>101 Meals (₹3,030)</option>
                  <option value={251}>251 Meals (₹7,530)</option>
                  <option value={501}>501 Meals (₹15,030)</option>
                  <option value={1001}>1,001 Meals (₹30,030)</option>
                  <option value={2100}>2,100 Meals (Mega Bhandara - ₹63,000)</option>
                </select>
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
                  Confirm Seva Pledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
