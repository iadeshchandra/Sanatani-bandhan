import React, { useState } from 'react';
import { Heart, Plus, Search, ShieldCheck, Sparkles, User, Calendar, Award, X } from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useData } from '../../context/DataContext';
import { CowRecord } from '../../types';
import { useToast } from '../../context/ToastContext';

export const GauSevaDesk: React.FC = () => {
  const { activeWorkspace } = useAuthWorkspace();
  const { cows, addCow, adoptCow } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adoptingCow, setAdoptingCow] = useState<CowRecord | null>(null);

  // Add Cow Form
  const [tagNumber, setTagNumber] = useState('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState<CowRecord['breed']>('Gir (Gujarat)');
  const [gender, setGender] = useState<'Gau Mata (Cow)' | 'Nandi (Bull)' | 'Vatsa (Calf)'>('Gau Mata (Cow)');
  const [ageYears, setAgeYears] = useState<number>(4);
  const [healthStatus, setHealthStatus] = useState<CowRecord['healthStatus']>('Healthy');
  const [lactationStage, setLactationStage] = useState<CowRecord['lactationStage']>('Lactating');
  const [dailyMilkLiters, setDailyMilkLiters] = useState<number>(12);
  const [monthlyCareCost, setMonthlyCareCost] = useState<number>(3500);

  // Adopt Form
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorGotra, setSponsorGotra] = useState('Kashyapa');
  const [sponsorPhone, setSponsorPhone] = useState('');

  const breeds = ['Gir (Gujarat)', 'Sahiwal (Punjab)', 'Tharparkar (Rajasthan)', 'Rathi', 'Kankrej', 'Red Sindhi'];

  const filteredCows = cows.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.breed.toLowerCase().includes(searchTerm.toLowerCase());

    const matchBreed = selectedBreed === 'all' || c.breed === selectedBreed;
    return matchSearch && matchBreed;
  });

  const totalAdopted = cows.filter((c) => c.adoptionSponsor).length;
  const totalMilk = cows.reduce((a, b) => a + (b.dailyMilkLiters || 0), 0);

  const handleSaveCow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagNumber.trim() || !name.trim()) return;

    addCow({
      workspaceId: activeWorkspace.id,
      tagNumber: tagNumber.trim(),
      name: name.trim(),
      breed,
      gender,
      ageYears: Number(ageYears),
      healthStatus,
      lactationStage,
      dailyMilkLiters: Number(dailyMilkLiters),
      monthlyCareCost: Number(monthlyCareCost),
    });

    setIsAddModalOpen(false);
    setTagNumber('');
    setName('');
  };

  const handleSaveAdoption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adoptingCow || !sponsorName.trim()) return;

    adoptCow(adoptingCow.id, sponsorName.trim(), sponsorGotra.trim(), sponsorPhone.trim());
    setAdoptingCow(null);
    setSponsorName('');
    setSponsorPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              Kamadhenu Gau Samrakshan
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {cows.length} Indigenous Desi Gomata Registered
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            Goshala Herd & Gau Adoption Desk
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Track indigenous Desi breeds, lactation cycles, veterinary checkups, and monthly devotee sponsorships
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTagNumber(`GAU-${Math.floor(100 + Math.random() * 900)}`);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Gomata</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Total Goshala Herd</p>
          <p className="text-2xl font-black text-amber-400 mt-2">{cows.length} Gomata</p>
          <p className="text-[11px] text-stone-400 mt-1">100% Indigenous Vedic Breeds</p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Adopted & Sponsored</p>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            {totalAdopted} / {cows.length}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Devotee Monthly Seva Guardians</p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Daily A2 Amrit Milk</p>
          <p className="text-2xl font-black text-stone-100 mt-2">{totalMilk} Liters / Day</p>
          <p className="text-[11px] text-amber-400/90 mt-1">Used for Sanctum Abhishekam & Prasad</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Gomata by name, tag number, breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-medium">Breed:</span>
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-stone-200"
          >
            <option value="all">All Indigenous Breeds</option>
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCows.map((cow) => (
          <div
            key={cow.id}
            className="bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400">
                    Tag #{cow.tagNumber}
                  </span>
                  <h3 className="font-extrabold text-sm text-stone-100 mt-0.5">{cow.name}</h3>
                  <p className="text-[11px] text-stone-400">{cow.breed}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    cow.healthStatus === 'Healthy'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {cow.healthStatus}
                </span>
              </div>

              <div className="py-2 space-y-1 text-xs text-stone-300">
                <p>
                  <span className="text-stone-400">Gender & Age:</span>{' '}
                  <span className="text-stone-100 font-medium">
                    {cow.gender} ({cow.ageYears} Years)
                  </span>
                </p>
                <p>
                  <span className="text-stone-400">Lactation Stage:</span>{' '}
                  <span className="font-semibold text-amber-300">{cow.lactationStage}</span>
                </p>
                {cow.dailyMilkLiters ? (
                  <p>
                    <span className="text-stone-400">A2 Milk Yield:</span>{' '}
                    <span className="font-mono text-emerald-400 font-bold">{cow.dailyMilkLiters} L/day</span>
                  </p>
                ) : null}
                <p>
                  <span className="text-stone-400">Monthly Grass & Care:</span>{' '}
                  <span className="font-mono text-stone-200">₹{cow.monthlyCareCost}/mo</span>
                </p>
              </div>

              {/* Adoption Box */}
              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1 my-1 text-xs">
                {cow.adoptionSponsor ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-emerald-400" />
                        <span>Guardian Sponsor</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Since {cow.adoptionStartDate}</span>
                    </div>
                    <p className="font-bold text-stone-100 mt-1">{cow.adoptionSponsor}</p>
                    <p className="text-[11px] text-amber-400 font-medium">
                      Gotra: {cow.sponsorGotra} • {cow.sponsorPhone}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-1">
                    <p className="text-stone-400 text-xs">Awaiting Seva Adoption Guardian</p>
                    <p className="text-[10px] text-amber-400 font-semibold">Earn immense Vedic merit</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            {!cow.adoptionSponsor && (
              <button
                type="button"
                onClick={() => setAdoptingCow(cow)}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Adopt Gomata (₹{cow.monthlyCareCost}/mo)</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Adopt Modal */}
      {adoptingCow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <h3 className="font-bold text-sm">Adopt Gomata: {adoptingCow.name} ({adoptingCow.tagNumber})</h3>
              <button
                type="button"
                onClick={() => setAdoptingCow(null)}
                className="text-stone-400 hover:text-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdoption} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Guardian Full Name *</label>
                <input
                  type="text"
                  required
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="e.g. Sri Rameshwar Das"
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Gotra *</label>
                  <input
                    type="text"
                    required
                    value={sponsorGotra}
                    onChange={(e) => setSponsorGotra(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={sponsorPhone}
                    onChange={(e) => setSponsorPhone(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                <p className="font-bold">Monthly Seva Commitment: ₹{adoptingCow.monthlyCareCost}</p>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  Covers pure green fodder, Ayurvedic supplements, clean water, and goshala shed maintenance.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setAdoptingCow(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold"
                >
                  Confirm Gau Adoption
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Cow Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <h3 className="font-bold text-sm">Register Indigenous Gomata</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCow} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Tag Number *</label>
                  <input
                    type="text"
                    required
                    value={tagNumber}
                    onChange={(e) => setTagNumber(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Holy Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ganga / Nandini"
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Indigenous Breed</label>
                  <select
                    value={breed}
                    onChange={(e) => setBreed(e.target.value as any)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                  >
                    {breeds.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Gender / Type</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                  >
                    <option>Gau Mata (Cow)</option>
                    <option>Nandi (Bull)</option>
                    <option>Vatsa (Calf)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Age (Yrs)</label>
                  <input
                    type="number"
                    value={ageYears}
                    onChange={(e) => setAgeYears(Number(e.target.value))}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">A2 Milk (L/d)</label>
                  <input
                    type="number"
                    value={dailyMilkLiters}
                    onChange={(e) => setDailyMilkLiters(Number(e.target.value))}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Care Cost (₹)</label>
                  <input
                    type="number"
                    value={monthlyCareCost}
                    onChange={(e) => setMonthlyCareCost(Number(e.target.value))}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
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
                  Save Gomata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
