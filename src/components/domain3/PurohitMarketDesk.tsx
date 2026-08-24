import React, { useState } from 'react';
import { Award, Search, Phone, Star, ShieldCheck, MapPin, Sparkles, BookOpen, Calendar } from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useToast } from '../../context/ToastContext';

interface PurohitProfile {
  id: string;
  name: string;
  vedaShakha: string;
  specialization: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  phone: string;
  location: string;
  isKycVerified: boolean;
  baseDakshina: number;
}

export const PurohitMarketDesk: React.FC = () => {
  const { activeWorkspace } = useAuthWorkspace();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  const purohits: PurohitProfile[] = [
    {
      id: 'pur-1',
      name: 'Acharya Vidyadhar Shastri',
      vedaShakha: 'Shukla Yajurveda (Madhyandina Shakha)',
      specialization: ['Maha Rudrabhishek', 'Vastu Shanti', 'Vivaha Samskara', 'Navagraha Homa'],
      experienceYears: 24,
      rating: 4.9,
      reviewCount: 312,
      phone: '+91 98390 12345',
      location: 'Kashi / Varanasi, UP',
      isKycVerified: true,
      baseDakshina: 5100,
    },
    {
      id: 'pur-2',
      name: 'Pandit Somnath Dwivedi',
      vedaShakha: 'Rigveda (Shakala Shakha)',
      specialization: ['Chandi Path', 'Gayatri Anushthan', 'Antyeshti & Shradh', 'Griha Pravesh'],
      experienceYears: 18,
      rating: 4.8,
      reviewCount: 189,
      phone: '+91 94150 98765',
      location: 'Prayagraj, UP',
      isKycVerified: true,
      baseDakshina: 3500,
    },
    {
      id: 'pur-3',
      name: 'Dr. Raghavan Namboodiri',
      vedaShakha: 'Samaveda (Kauthuma Shakha)',
      specialization: ['Soma Yaga', 'Sudarshana Homa', 'Maha Ganapati Homa', 'Temple Prana Pratishtha'],
      experienceYears: 30,
      rating: 5.0,
      reviewCount: 450,
      phone: '+91 98470 54321',
      location: 'Udupi / Haridwar',
      isKycVerified: true,
      baseDakshina: 11000,
    },
  ];

  const filteredPurohits = purohits.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vedaShakha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specialization.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBook = (purohit: PurohitProfile) => {
    showToast(`Booking request sent directly to ${purohit.name}`, 'success', 'Purohit Connected');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              Vedic Scholars Marketplace
            </span>
            <span className="text-xs text-stone-400 font-mono">
              KYC & Gurukul Lineage Verified
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            Purohit & Vedic Scholar Marketplace
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Connect directly with verified Vedic Acharyas for Yajna, Samskaras, Griha Pravesh, and Anushthan
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Veda, ritual name, Acharya..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Purohit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPurohits.map((p) => (
          <div
            key={p.id}
            className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-stone-100">{p.name}</h3>
                    {p.isKycVerified && (
                      <span title="Veda Shakha KYC Verified">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-400 font-medium mt-0.5">{p.vedaShakha}</p>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-amber-300 text-xs font-bold shrink-0">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{p.rating}</span>
                </div>
              </div>

              <div className="py-2 space-y-2 text-xs text-stone-300">
                <p>
                  <span className="text-stone-400">Experience:</span>{' '}
                  <span className="font-bold text-stone-100">{p.experienceYears} Years</span>
                </p>
                <p>
                  <span className="text-stone-400">Location:</span>{' '}
                  <span className="text-stone-200">{p.location}</span>
                </p>

                <div>
                  <span className="text-stone-400 text-[11px] block mb-1">Ritual Specializations:</span>
                  <div className="flex flex-wrap gap-1">
                    {p.specialization.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-stone-800 text-[10px] text-stone-300 font-mono border border-stone-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Base Dakshina</p>
                  <p className="font-black text-amber-400 text-sm">₹{p.baseDakshina.toLocaleString()}</p>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">({p.reviewCount} Ceremonies)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleBook(p)}
              className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Acharya for Samskara</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
