export interface PanchangDetails {
  gregorianDate: string;
  vikramSamvat: number;
  sakaSamvat: number;
  bengaliSan: number;
  monthLunar: string;
  paksha: 'Shukla' | 'Krishna';
  tithi: string;
  tithiDescription: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  brahmaMuhurat: string;
  abhijitMuhurat: string;
  rahuKalam: string;
  yamaganda: string;
  gulikaKalam: string;
  auspiciousEvents: string[];
}

export const calculatePanchang = (date: Date = new Date()): PanchangDetails => {
  const year = date.getFullYear();
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Vedic Eras
  const vikramSamvat = year + 57;
  const sakaSamvat = year - 78;
  const bengaliSan = year - 593;

  const tithis = [
    'Pratipada',
    'Dwitiya',
    'Tritiya',
    'Chaturthi',
    'Panchami',
    'Shashthi',
    'Saptami',
    'Ashtami',
    'Navami',
    'Dashami',
    'Ekadashi',
    'Dwadashi',
    'Trayodashi',
    'Chaturdashi',
    'Purnima / Amavasya',
  ];

  const nakshatras = [
    'Ashwini',
    'Bharani',
    'Krittika',
    'Rohini',
    'Mrigashirsha',
    'Ardra',
    'Punarvasu',
    'Pushya',
    'Ashlesha',
    'Magha',
    'Purva Phalguni',
    'Uttara Phalguni',
    'Hasta',
    'Chitra',
    'Swati',
    'Vishakha',
    'Anuradha',
    'Jyeshtha',
    'Mula',
    'Purva Ashadha',
    'Uttara Ashadha',
    'Shravana',
    'Dhanishta',
    'Shatabhisha',
    'Purva Bhadrapada',
    'Uttara Bhadrapada',
    'Revati',
  ];

  const yogas = [
    'Vishkambha',
    'Priti',
    'Ayushman',
    'Saubhagya',
    'Shobhana',
    'Atiganda',
    'Sukarma',
    'Dhriti',
    'Shula',
    'Ganda',
    'Vriddhi',
    'Dhruva',
    'Vyaghata',
    'Harshana',
    'Vajra',
    'Siddhi',
    'Vyatipata',
    'Variyan',
    'Parigha',
    'Shiva',
    'Siddha',
    'Sadhya',
    'Shubha',
    'Shukla',
    'Brahma',
    'Indra',
    'Vaidhriti',
  ];

  const lunarMonths = [
    'Chaitra',
    'Vaishakha',
    'Jyeshtha',
    'Ashadha',
    'Shravana',
    'Bhadrapada',
    'Ashwin',
    'Kartika',
    'Margashirsha',
    'Pausha',
    'Magha',
    'Phalguna',
  ];

  const tithiIndex = (dayOfYear + 4) % 15;
  const isShukla = (Math.floor(dayOfYear / 15) % 2 === 0);
  const nakshatraIndex = (dayOfYear + 9) % 27;
  const yogaIndex = (dayOfYear + 2) % 27;
  const monthIndex = (date.getMonth() + 1) % 12;

  const tithiName = tithis[tithiIndex];
  const pakshaName = isShukla ? 'Shukla' : 'Krishna';

  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon ...
  const rahuKalamTimes = [
    '16:30 - 18:00', // Sun
    '07:30 - 09:00', // Mon
    '15:00 - 16:30', // Tue
    '12:00 - 13:30', // Wed
    '13:30 - 15:00', // Thu
    '10:30 - 12:00', // Fri
    '09:00 - 10:30', // Sat
  ];

  const yamagandaTimes = [
    '12:00 - 13:30',
    '10:30 - 12:00',
    '09:00 - 10:30',
    '07:30 - 09:00',
    '06:00 - 07:30',
    '15:00 - 16:30',
    '13:30 - 15:00',
  ];

  const specialFestivals = [
    'Ekadashi Vrata & Vishnu Sahasranama Stotra',
    'Pradosham Shiva Abhishekam',
    'Sankashti Chaturthi Ganesha Aradhana',
    'Purnima Satyanarayan Mahapuja',
    'Amavasya Pitru Tarpanam',
    'Somavara Somnath Rudrabhishek',
    'Guruvara Guru Datta Seva',
  ];

  return {
    gregorianDate: date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    vikramSamvat,
    sakaSamvat,
    bengaliSan,
    monthLunar: lunarMonths[monthIndex],
    paksha: pakshaName,
    tithi: `${pakshaName} ${tithiName}`,
    tithiDescription: `${pakshaName} Paksha ${tithiName} (Valid till Sunset)`,
    nakshatra: nakshatras[nakshatraIndex],
    yoga: yogas[yogaIndex],
    karana: tithiIndex % 2 === 0 ? 'Bava' : 'Balava',
    sunrise: '05:48 AM',
    sunset: '06:34 PM',
    moonrise: isShukla ? '08:14 PM' : '03:45 AM',
    brahmaMuhurat: '04:12 AM - 05:00 AM',
    abhijitMuhurat: '11:46 AM - 12:38 PM',
    rahuKalam: rahuKalamTimes[dayOfWeek],
    yamaganda: yamagandaTimes[dayOfWeek],
    gulikaKalam: '07:30 AM - 09:00 AM',
    auspiciousEvents: [
      specialFestivals[dayOfYear % specialFestivals.length],
      'Gau Seva & Chanda Donation Auspicious Timing',
    ],
  };
};
