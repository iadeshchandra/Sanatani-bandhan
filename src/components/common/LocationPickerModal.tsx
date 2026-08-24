import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Check,
  X,
  Navigation,
  Globe2,
  Building,
  Sparkles,
  Compass
} from 'lucide-react';

export interface SelectedLocation {
  city: string;
  state: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
  sampradayaHub?: string;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: SelectedLocation) => void;
  initialCity?: string;
}

interface PresetHolyPlace {
  city: string;
  state: string;
  country: string;
  district: string;
  latitude: number;
  longitude: number;
  tag: string;
  sampradayaHub: string;
  landmark: string;
}

const HOLY_CITIES: PresetHolyPlace[] = [
  {
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'Bharat (India)',
    district: 'Kashi Kshetra',
    latitude: 25.3176,
    longitude: 82.9739,
    tag: 'Avimukta Kshetra / Moksha Puri',
    sampradayaHub: 'Shaiva / Dashanami / Rigvedic',
    landmark: 'Vishwanath Gali, Dashashwamedh Ghat Road'
  },
  {
    city: 'Ayodhya',
    state: 'Uttar Pradesh',
    country: 'Bharat (India)',
    district: 'Awadh Puri',
    latitude: 26.7922,
    longitude: 82.1998,
    tag: 'Shri Ram Janmabhoomi',
    sampradayaHub: 'Ramanandi Sampradaya',
    landmark: 'Ram Janmabhoomi Path, Ramkot'
  },
  {
    city: 'Mathura - Vrindavan',
    state: 'Uttar Pradesh',
    country: 'Bharat (India)',
    district: 'Braj Kshetra',
    latitude: 27.5706,
    longitude: 77.6932,
    tag: 'Shri Krishna Leela Sthali',
    sampradayaHub: 'Gaudiya / Nimbarka / Vallabha',
    landmark: 'Parikrama Marg, Raman Reti'
  },
  {
    city: 'Puri',
    state: 'Odisha',
    country: 'Bharat (India)',
    district: 'Sri Kshetra Puri',
    latitude: 19.8135,
    longitude: 85.8312,
    tag: 'Jagannath Dham (Char Dham)',
    sampradayaHub: 'Govardhana Peetham / Jagannath Parampara',
    landmark: 'Grand Road, Badadanda, Near Singhadwara'
  },
  {
    city: 'Rameswaram',
    state: 'Tamil Nadu',
    country: 'Bharat (India)',
    district: 'Ramanathapuram',
    latitude: 9.2876,
    longitude: 79.3129,
    tag: 'Setu Tirtha (Char Dham)',
    sampradayaHub: 'Smartha / Ramanathaswamy Devasthanam',
    landmark: 'North Car Street, Rameswaram Main Sanctum'
  },
  {
    city: 'Dwarka',
    state: 'Gujarat',
    country: 'Bharat (India)',
    district: 'Devbhumi Dwarka',
    latitude: 22.2394,
    longitude: 68.9678,
    tag: 'Dwarkadhish Jagat Mandir (Char Dham)',
    sampradayaHub: 'Sharda Peetham / Pushtimarg',
    landmark: 'Siddheshwar Road, Gomti Ghat'
  },
  {
    city: 'Badrinath',
    state: 'Uttarakhand',
    country: 'Bharat (India)',
    district: 'Chamoli Garhwal',
    latitude: 30.7433,
    longitude: 79.4938,
    tag: 'Badrikashram (Char Dham)',
    sampradayaHub: 'Jyotirmath / Nambudiri Rawal Lineage',
    landmark: 'Near Alaknanda Sangam, Badrinath Town'
  },
  {
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    country: 'Bharat (India)',
    district: 'Avantika Puri',
    latitude: 23.1765,
    longitude: 75.7885,
    tag: 'Mahakaleshwar Jyotirlinga / Mahakal Lok',
    sampradayaHub: 'Shukla Yajurveda / Nath Parampara',
    landmark: 'Mahakal Marg, Jaisinghpura'
  },
  {
    city: 'Haridwar - Rishikesh',
    state: 'Uttarakhand',
    country: 'Bharat (India)',
    district: 'Garhwal Devbhoomi',
    latitude: 29.9457,
    longitude: 78.1642,
    tag: 'Ganga Dwar / Yoga & Tapobhoomi',
    sampradayaHub: 'Sanatan Sannyasa / Tapovan Vedanta',
    landmark: 'Tapovan, Muni Ki Reti / Har Ki Pauri'
  },
  {
    city: 'Kolkata - Nabadwip',
    state: 'West Bengal',
    country: 'Bharat (India)',
    district: 'Kolkata & Nadia',
    latitude: 22.5726,
    longitude: 88.3639,
    tag: 'Kalighat Shaktipeeth & Mayapur Dham',
    sampradayaHub: 'Shakta / Gaudiya Vaishnava',
    landmark: 'Kalighat Road / Mayapur Iskcon Axis'
  },
  {
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    country: 'Bharat (India)',
    district: 'Tirupati (Seven Hills)',
    latitude: 13.6288,
    longitude: 79.4192,
    tag: 'Sri Venkateswara Swamy Devasthanam',
    sampradayaHub: 'Sri Vaishnava (Ramanuja Parampara)',
    landmark: 'Tirumala Hills, East Mada Street'
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'Bharat (India)',
    district: 'Pink City Heritage',
    latitude: 26.9124,
    longitude: 75.7873,
    tag: 'Govind Dev Ji / Vaidika Samaj Hub',
    sampradayaHub: 'Gaudiya Govind Dev / Gaur Brahman Samaj',
    landmark: 'City Palace Complex, Jalebi Chowk'
  }
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  initialCity = 'Varanasi'
}) => {
  const [searchQuery, setSearchQuery] = useState(initialCity);
  const [selectedPlace, setSelectedPlace] = useState<PresetHolyPlace>(
    HOLY_CITIES.find(
      (c) => c.city.toLowerCase().includes(initialCity.toLowerCase())
    ) || HOLY_CITIES[0]
  );
  const [customAddress, setCustomAddress] = useState(selectedPlace.landmark);
  const [pinLat, setPinLat] = useState(selectedPlace.latitude);
  const [pinLng, setPinLng] = useState(selectedPlace.longitude);

  if (!isOpen) return null;

  const filteredPlaces = HOLY_CITIES.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.city.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    );
  });

  const handleChoosePlace = (place: PresetHolyPlace) => {
    setSelectedPlace(place);
    setCustomAddress(place.landmark);
    setPinLat(place.latitude);
    setPinLng(place.longitude);
  };

  const handleConfirm = () => {
    onSelectLocation({
      city: selectedPlace.city,
      state: selectedPlace.state,
      country: selectedPlace.country,
      address: customAddress.trim() || selectedPlace.landmark,
      latitude: pinLat,
      longitude: pinLng,
      formattedAddress: `${customAddress.trim() || selectedPlace.landmark}, ${selectedPlace.city}, ${selectedPlace.state}, ${selectedPlace.country}`,
      sampradayaHub: selectedPlace.sampradayaHub
    });
    onClose();
  };

  // Coordinates normalized to interactive vector map canvas
  // Bharat geographic bbox approx: Lat 8 to 36, Lng 68 to 96
  const mapX = Math.max(5, Math.min(95, ((pinLng - 68) / (96 - 68)) * 100));
  const mapY = Math.max(5, Math.min(95, (1 - (pinLat - 8) / (36 - 8)) * 100));

  return (
    <div
      id="location-map-picker-modal"
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-[#FF9933] flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Geographic Map & Tirth Kshetra Location Picker
              </h2>
              <p className="text-xs text-slate-400">
                Pinpoint institutional address, pilgrimage geography & coordinates
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 grow overflow-hidden">
          {/* Left Column: Search & Holy City Presets */}
          <div className="md:col-span-5 border-r border-slate-200 p-5 flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar">
            <div className="mb-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Search Holy City / State / Kshetra
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Varanasi, Ayodhya, Puri, Ujjain..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#FF9933] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5 grow">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                Pilgrimage Centers & Dharmic Hubs ({filteredPlaces.length})
              </span>
              {filteredPlaces.map((place) => {
                const isSelected = selectedPlace.city === place.city;
                return (
                  <button
                    key={place.city}
                    type="button"
                    onClick={() => handleChoosePlace(place)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/70'
                    }`}
                  >
                    <MapPin
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isSelected ? 'text-[#FF9933]' : 'text-slate-400'
                      }`}
                    />
                    <div className="grow min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{place.city}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {place.state}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {place.tag}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Map Preview Canvas & Address Customizer */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between bg-white overflow-y-auto custom-scrollbar">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-indigo-600" />
                    Bharat Kshetra Interactive Map View
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live GPS pin: {pinLat.toFixed(4)}° N, {pinLng.toFixed(4)}° E
                  </p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  GPS Pin Active
                </span>
              </div>

              {/* Map Canvas Simulated View */}
              <div className="relative w-full h-56 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700 overflow-hidden shadow-inner flex items-center justify-center">
                {/* Decorative Map Grid Lines */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* Simulated Geographic Regions */}
                <div className="absolute inset-4 rounded-xl border border-slate-600/40 bg-slate-800/40 p-3 text-slate-400 text-[10px] flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between">
                    <span className="font-serif text-amber-200/80">Himalayan Devbhoomi</span>
                    <span className="font-serif text-amber-200/80">Pragjyotishpur / Purvanchal</span>
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="font-serif text-slate-500/70 uppercase tracking-widest text-xs">
                      Bharatvarsha Sacred Geography
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-serif text-amber-200/80">Sindhu-Saraswati Kshetra</span>
                    <span className="font-serif text-amber-200/80">Dakshina Tirtha / Setu</span>
                  </div>
                </div>

                {/* Interactive Dynamic Pin Marker */}
                <div
                  className="absolute transition-all duration-300 -translate-x-1/2 -translate-y-full cursor-pointer group"
                  style={{ left: `${mapX}%`, top: `${mapY}%` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] shadow-lg whitespace-nowrap mb-1 flex items-center gap-1 border border-amber-300 animate-bounce">
                      <span>ॐ</span>
                      <span>{selectedPlace.city}</span>
                    </div>
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center animate-ping absolute inset-0" />
                      <div className="w-8 h-8 rounded-full bg-[#FF9933] border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-xs relative z-10">
                        <MapPin className="w-4 h-4 fill-current text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specific Street Address Form */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Street Address / Campus Landmark
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="e.g. Near Main Mandir Gate, Ghat Road..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span>Traditional Sampradaya Hub:</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    {selectedPlace.sampradayaHub} • {selectedPlace.tag}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Selected: <strong className="text-slate-800">{selectedPlace.city}, {selectedPlace.state}</strong>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF9933] hover:bg-orange-600 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Use Selected Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
