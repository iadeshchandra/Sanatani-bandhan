import { useInitialData } from './AppInitializer';
import { set } from 'idb-keyval';
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  DevoteeMember,
  FamilyHousehold,
  VanshavaliNode,
  GuestRecord,
  TreasuryTransaction,
  AssetRecord,
  InventoryItem,
  PoojaBooking,
  ResidentPujaSchedule,
  PurohitProfile,
  PitruRecord,
  GoshalaCowRecord,
  AnnadanamSponsorship,
  AshramKutirRoom,
  GurukulStudent,
  CampaignCrowdfund,
  MatrimonyProfile,
  PanjikaFestival,
  ShlokaCardItem,
  TrusteeResolution,
  SevadarDutyShift,
} from '../types';
import { trackTreasuryPurchase, trackSignUp, trackGenerateLead } from '../utils/gtm';
import { useAuthWorkspace } from './AuthWorkspaceContext';
import { useToast } from './ToastContext';

// Master Initial Datasets
export const INITIAL_DEVOTEES: DevoteeMember[] = [
  {
    id: 'dev-101',
    workspaceId: 'ws-mandir',
    fullName: 'Sri Rameshwar Shastri',
    spiritualName: 'Ramesh Das',
    phone: '+91 98765 11223',
    email: 'rameshwar.shastri@gmail.com',
    pin: '1081',
    role: 'manager',
    sevaIndex: 920,
    sevaTier: 'Ratna',
    gotra: 'Shandilya',
    pravara: 'Shandilya, Asita, Devala',
    varnaKul: 'Rigvedic Brahmin',
    address: 'Near Dasaswamedh Ghat, Varanasi',
    birthDate: '1975-08-15',
    activeStatus: 'Active',
    totalDonated: 150000,
    volunteerHours: 340,
    qrCodeRef: 'QR-SB-DEV101',
    joinedDate: '2021-03-10',
  },
  {
    id: 'dev-102',
    workspaceId: 'ws-mandir',
    fullName: 'Smt. Gayatri Devi Sharma',
    spiritualName: 'Gayatri Seva Dasi',
    phone: '+91 98220 33445',
    email: 'gayatrisharma@yahoo.com',
    pin: '2108',
    role: 'devotee',
    sevaIndex: 780,
    sevaTier: 'Vishesh',
    gotra: 'Kashyapa',
    pravara: 'Kashyapa, Avatsara, Naidhruva',
    varnaKul: 'Saraswat',
    address: 'Chowk, Varanasi',
    birthDate: '1982-11-04',
    activeStatus: 'Active',
    totalDonated: 65000,
    volunteerHours: 190,
    qrCodeRef: 'QR-SB-DEV102',
    joinedDate: '2022-01-20',
  },
  {
    id: 'dev-103',
    workspaceId: 'ws-mandir',
    fullName: 'Sri Vikramaditya Rathore',
    phone: '+91 94140 77889',
    email: 'rathore.vikram@gmail.com',
    pin: '3344',
    role: 'head_admin',
    sevaIndex: 850,
    sevaTier: 'Ratna',
    gotra: 'Vatsa',
    pravara: 'Bhargava, Chyavana, Apnavana, Aurva, Jamadagnya',
    varnaKul: 'Kshatriya Solar',
    address: 'Durga Kund Road, Varanasi',
    birthDate: '1968-04-12',
    activeStatus: 'Active',
    totalDonated: 500000,
    volunteerHours: 420,
    qrCodeRef: 'QR-SB-DEV103',
    joinedDate: '2020-05-15',
  },
  {
    id: 'dev-104',
    workspaceId: 'ws-goshala',
    fullName: 'Pt. Hariprasad Dwivedi',
    phone: '+91 98110 55667',
    email: 'hari.dwivedi@vrindavan.org',
    pin: '1008',
    role: 'head_admin',
    sevaIndex: 940,
    sevaTier: 'Ratna',
    gotra: 'Bharadwaja',
    varnaKul: 'Kanyakubja Brahmin',
    address: 'Parikrama Marg, Raman Reti, Vrindavan',
    activeStatus: 'Active',
    totalDonated: 240000,
    volunteerHours: 500,
    qrCodeRef: 'QR-SB-DEV104',
    joinedDate: '2021-08-10',
  },
  {
    id: 'dev-105',
    workspaceId: 'ws-gurukul',
    fullName: 'Acharya Vidyadhar Shukla',
    phone: '+91 94066 33221',
    email: 'acharyas@sandipanigurukul.edu.in',
    pin: '1008',
    role: 'head_admin',
    sevaIndex: 990,
    sevaTier: 'Ratna',
    gotra: 'Gautama',
    varnaKul: 'Madhyandina Shukla Yajurveda',
    address: 'Narmada Ghat Road, Ujjain',
    activeStatus: 'Active',
    totalDonated: 180000,
    volunteerHours: 600,
    qrCodeRef: 'QR-SB-DEV105',
    joinedDate: '2020-01-01',
  }
];

export const INITIAL_FAMILIES: FamilyHousehold[] = [
  {
    id: 'fam-01',
    workspaceId: 'ws-mandir',
    familyName: 'Shastri Parivar (Kashi)',
    kartaDevoteeId: 'dev-101',
    gotra: 'Shandilya',
    kuladevata: 'Kashi Vishwanath & Annapurna Devi',
    residenceAddress: 'B-14/88 Dasaswamedh, Varanasi',
    contactPhone: '+91 98765 11223',
    memberIds: ['dev-101', 'dev-102'],
    totalFamilyDonations: 215000,
    lastChandaDate: '2026-08-15',
    notes: 'Long-standing patron family supporting Nitya Annadanam and Veda Pathashala.',
  },
  {
    id: 'fam-02',
    workspaceId: 'ws-mandir',
    familyName: 'Rathore Royal Trust Family',
    kartaDevoteeId: 'dev-103',
    gotra: 'Vatsa',
    kuladevata: 'Maa Chamunda & Surya Bhagwan',
    residenceAddress: 'Durga Kund Manor, Varanasi',
    contactPhone: '+91 94140 77889',
    memberIds: ['dev-103'],
    totalFamilyDonations: 500000,
    lastChandaDate: '2026-08-01',
    notes: 'Sanatan heritage patron. Sponsored gold Kalash for temple shikhar.',
  },
];

export const INITIAL_VANSHAVALI: VanshavaliNode = {
  id: 'node-root-01',
  name: 'Maharshi Shandilya Gotra Parivar (Adi Purusha: Pt. Bholanath Shastri)',
  generation: 1,
  gotra: 'Shandilya',
  birthYear: '1880',
  deathYear: '1952',
  relation: 'Progenitor / Mula Purusha',
  spouse: 'Mata Saraswati Devi (1888-1960)',
  location: 'Varanasi Kshetra',
  notes: 'Revered Pandit of Kashi Sanskrit Mahavidyalaya and Rigvedic Scholar.',
  children: [
    {
      id: 'node-gen2-01',
      name: 'Pt. Dinabandhu Shastri',
      generation: 2,
      gotra: 'Shandilya',
      birthYear: '1912',
      deathYear: '1984',
      relation: 'Eldest Son',
      spouse: 'Mata Janaki Devi',
      location: 'Varanasi',
      notes: 'Astrologer to Kashi Naresh & Trustee of Annapurna Mandir.',
      children: [
        {
          id: 'node-gen3-01',
          name: 'Pt. Loknath Shastri',
          generation: 3,
          gotra: 'Shandilya',
          birthYear: '1945',
          relation: 'Son',
          spouse: 'Smt. Shanti Devi',
          location: 'Varanasi',
          children: [
            {
              id: 'node-gen4-01',
              name: 'Sri Rameshwar Shastri (Karta)',
              generation: 4,
              gotra: 'Shandilya',
              birthYear: '1975',
              relation: 'Current Karta (Registered Devotee #101)',
              spouse: 'Smt. Gayatri Devi',
              location: 'Varanasi',
              children: [
                {
                  id: 'node-gen5-01',
                  name: 'Batuk Raghav Shastri',
                  generation: 5,
                  gotra: 'Shandilya',
                  birthYear: '2008',
                  relation: 'Son (Gurukul Veda Vidyarthi)',
                  location: 'Sandipani Gurukul, Ujjain',
                },
                {
                  id: 'node-gen5-02',
                  name: 'Kumari Ananya Shastri',
                  generation: 5,
                  gotra: 'Shandilya',
                  birthYear: '2012',
                  relation: 'Daughter',
                  location: 'Varanasi',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'node-gen2-02',
      name: 'Pt. Kedarnath Shastri',
      generation: 2,
      gotra: 'Shandilya',
      birthYear: '1918',
      deathYear: '1995',
      relation: 'Second Son',
      spouse: 'Mata Parvati Devi',
      location: 'Prayagraj',
      notes: 'Sanskrit Grammar Scholar at Allahabad University.',
      children: [
        {
          id: 'node-gen3-02',
          name: 'Dr. Anand Shastri',
          generation: 3,
          gotra: 'Shandilya',
          birthYear: '1952',
          relation: 'Son',
          location: 'Prayagraj / Delhi',
        },
      ],
    },
  ],
};

export const INITIAL_GUESTS: GuestRecord[] = [
  {
    id: 'gst-01',
    workspaceId: 'ws-mandir',
    name: 'Smt. Sunita Singhania',
    phone: '+91 98110 44321',
    city: 'Kanpur',
    purpose: 'Pooja Inquiry',
    visitDate: '2026-08-24',
    referredBy: 'Pt. Loknath Shastri',
    status: 'Lead',
    assignedSevadar: 'Sri Subhash Banerjee',
    notes: 'Inquired about Mahamrityunjaya Anushthan for family welfare.',
  },
  {
    id: 'gst-02',
    workspaceId: 'ws-mandir',
    name: 'Sri Alok Mukherjee',
    phone: '+91 94330 99887',
    city: 'Kolkata',
    purpose: 'Darshan',
    visitDate: '2026-08-23',
    status: 'Visited',
    notes: 'Interested in sponsoring Nitya Annadanam on Ekadashi.',
  },
];

export const INITIAL_TREASURY: TreasuryTransaction[] = [
  {
    id: 'tx-01',
    workspaceId: 'ws-mandir',
    date: '2026-08-24',
    type: 'Income',
    category: 'Pooja Dakshina',
    amount: 5100,
    handledBy: 'Acharya Devendra Shastri',
    devoteeName: 'Smt. Gayatri Devi Sharma',
    devoteeId: 'dev-102',
    paymentMode: 'UPI / QR',
    purpose: 'Maha Rudrabhishek with Bilva Patra Archana',
    is80GEligible: true,
    taxReceiptIssued: true,
    taxReceiptNumber: 'SB-80G-2026-0042',
    auditVerified: true,
  },
  {
    id: 'tx-02',
    workspaceId: 'ws-mandir',
    date: '2026-08-23',
    type: 'Income',
    category: 'Gau Seva Donation',
    amount: 11000,
    handledBy: 'Sri Vikramaditya Rathore',
    devoteeName: 'Sri Rajesh Agrawal',
    paymentMode: 'Bank Transfer (NEFT)',
    purpose: 'Monthly Goshala Green Fodder & Vet Care Sponsorship',
    is80GEligible: true,
    taxReceiptIssued: true,
    taxReceiptNumber: 'SB-80G-2026-0043',
    auditVerified: true,
  },
  {
    id: 'tx-03',
    workspaceId: 'ws-mandir',
    date: '2026-08-22',
    type: 'Expense',
    category: 'Annadanam Provisions',
    amount: 28500,
    handledBy: 'Kitchen Supervisor (Sri Ram Das)',
    vendorName: 'Kashi Desi Ghee & Grain Bhandar',
    paymentMode: 'Bank Transfer (NEFT)',
    purpose: 'Pure Desi Bilona Ghee, Basmati Rice & Moong Dal for Bhandara',
    auditVerified: true,
  },
  {
    id: 'tx-04',
    workspaceId: 'ws-mandir',
    date: '2026-08-20',
    type: 'Income',
    category: 'Mandir Nirman / Crowdfund',
    amount: 100000,
    handledBy: 'Trustee Board Desk',
    devoteeName: 'Sri Vikramaditya Rathore',
    devoteeId: 'dev-103',
    paymentMode: 'Cheque (Clear)',
    purpose: 'Vedic Yajnashala Roof Renovation and Copper Chhatra',
    is80GEligible: true,
    taxReceiptIssued: true,
    taxReceiptNumber: 'SB-80G-2026-0044',
    auditVerified: true,
  },
  {
    id: 'tx-05',
    workspaceId: 'ws-mandir',
    date: '2026-08-18',
    type: 'Expense',
    category: 'Purohit Sambhavana',
    amount: 15000,
    handledBy: 'Mandir Secretary',
    vendorName: 'Rigveda Parayana Acharyas (5 Pandits)',
    paymentMode: 'Cash / Voucher',
    purpose: 'Shravana Somwar Vedic Chant and Archana Sambhavana',
    auditVerified: true,
  },
  {
    id: 'tx-06',
    workspaceId: 'ws-goshala',
    date: '2026-08-23',
    type: 'Income',
    category: 'Gau Seva Donation',
    amount: 25000,
    handledBy: 'Pt. Hariprasad Dwivedi',
    devoteeName: 'Brajbhumi Seva Mandal',
    paymentMode: 'UPI / QR',
    purpose: 'Green Grass and Mineral Feed for 50 Gir Cows',
    is80GEligible: true,
    taxReceiptIssued: true,
    taxReceiptNumber: 'SB-80G-2026-0045',
    auditVerified: true,
  }
];

export const INITIAL_ASSETS: AssetRecord[] = [
  {
    id: 'ast-01',
    workspaceId: 'ws-mandir',
    name: 'Ashtadhatu Sri Radha Krishna Vigrahas',
    category: 'Sacred Vigrahas & Deities',
    valuation: 2500000,
    acquisitionDate: '1998-05-10',
    condition: 'Pristine / Daily Seva',
    custodian: 'Head Priest (Mukhya Pujari)',
    location: 'Garbhagriha (Sanctum Sanctorum)',
    notes: 'Ancient Ashtadhatu Murtis sanctified with Prana Pratishtha rituals.',
  },
  {
    id: 'ast-02',
    workspaceId: 'ws-mandir',
    name: 'Solid Silver Yajnashala Havan Kunda (25 kg)',
    category: 'Pooja Implements (Silver/Gold)',
    valuation: 2100000,
    acquisitionDate: '2015-11-12',
    condition: 'Excellent',
    custodian: 'Trustee Board Secretary',
    location: 'Sacred Vault Room #1',
  },
  {
    id: 'ast-03',
    workspaceId: 'ws-mandir',
    name: 'JBL Commercial Mandir Sound System & Microphones',
    category: 'Electronics',
    valuation: 350000,
    acquisitionDate: '2023-01-10',
    condition: 'Good',
    custodian: 'Audio-Visual Sevadar',
    location: 'Main Prayer Hall',
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-01',
    workspaceId: 'ws-mandir',
    itemName: 'Pure Desi Vedic Cow Ghee (Bilona)',
    category: 'Ghee & Oils',
    currentStock: 85,
    unit: 'liters',
    minReorderLevel: 25,
    costPerUnit: 1200,
    lastRestockedDate: '2026-08-15',
    supplierName: 'Surabhi Goshala Gaudiya Trust',
  },
  {
    id: 'inv-02',
    workspaceId: 'ws-mandir',
    itemName: 'Bhimseni Pure Camphor (Karpuram)',
    category: 'Camphor & Dhoop',
    currentStock: 18,
    unit: 'kg',
    minReorderLevel: 10,
    costPerUnit: 950,
    lastRestockedDate: '2026-08-10',
    supplierName: 'Kashi Sugandhi Store',
  },
  {
    id: 'inv-03',
    workspaceId: 'ws-mandir',
    itemName: 'Basmati Rice for Mahaprasad',
    category: 'Rice & Grains',
    currentStock: 350,
    unit: 'kg',
    minReorderLevel: 100,
    costPerUnit: 85,
    lastRestockedDate: '2026-08-18',
    supplierName: 'Shri Ram Food Grain Mandi',
  },
  {
    id: 'inv-04',
    workspaceId: 'ws-mandir',
    itemName: 'Kesar (Pure Kashmir Saffron)',
    category: 'Prasad Supplies',
    currentStock: 450,
    unit: 'pieces',
    minReorderLevel: 100,
    costPerUnit: 250,
    lastRestockedDate: '2026-07-25',
    supplierName: 'Pampore Heritage Traders',
  },
];

export const INITIAL_POOJA_BOOKINGS: PoojaBooking[] = [
  {
    id: 'pb-01',
    workspaceId: 'ws-mandir',
    devoteeId: 'dev-102',
    devoteeName: 'Smt. Gayatri Devi Sharma',
    phone: '+91 98220 33445',
    poojaName: 'Maha Rudrabhishek & Bilva Patra Archanam',
    tithiDate: '2026-08-25',
    timeSlot: '07:30 AM - 09:00 AM',
    gotra: 'Kashyapa',
    nakshatra: 'Pushya',
    rashi: 'Karka',
    sankalpaIntention: 'Family Health, Spiritual Protection & Moksha Marg',
    assignedPurohit: 'Pt. Loknath Shastri',
    dakshinaAmount: 5100,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    receiptRef: 'RCP-MR-2026-881',
    liveStreamRequested: true,
  },
  {
    id: 'pb-02',
    workspaceId: 'ws-mandir',
    devoteeId: 'dev-103',
    devoteeName: 'Sri Vikramaditya Rathore',
    phone: '+91 94140 77889',
    poojaName: 'Sahasra Chandi Yajna & Navagraha Shanti',
    tithiDate: '2026-08-28',
    timeSlot: '08:00 AM - 01:00 PM',
    gotra: 'Vatsa',
    nakshatra: 'Rohini',
    rashi: 'Vrishabha',
    sankalpaIntention: 'Global Sanatan Dharma Sanrakshan & Shatru Samhara',
    assignedPurohit: 'Acharya Vidyadhar Shukla',
    dakshinaAmount: 21000,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    receiptRef: 'RCP-SC-2026-904',
    liveStreamRequested: true,
  },
];

export const INITIAL_RESIDENT_PUJAS: ResidentPujaSchedule[] = [
  {
    id: 'rp-01',
    pujaName: 'Mangala Aarti & Suprabhatam',
    timings: '05:00 AM - 05:45 AM',
    leadPurohit: 'Mukhya Pujari Sri Ramanuj Das',
    darshanStatus: 'Open for Devotees',
    dressCode: 'Traditional Dhoti / Sari',
    dailyAttendanceAvg: 120,
  },
  {
    id: 'rp-02',
    pujaName: 'Madhyahna Bhoga Aarti',
    timings: '12:00 PM - 12:30 PM',
    leadPurohit: 'Pt. Keshav Shastri',
    darshanStatus: 'Live Sanctum Bhog',
    dressCode: 'Modest Indian Attire',
    dailyAttendanceAvg: 250,
  },
  {
    id: 'rp-03',
    pujaName: 'Sandhya Maha Aarti with Shankhanaad & Dhoop',
    timings: '07:00 PM - 07:45 PM',
    leadPurohit: 'Acharya Devendra Shastri',
    darshanStatus: 'High Energy Darshan',
    dressCode: 'Traditional',
    dailyAttendanceAvg: 600,
  },
  {
    id: 'rp-04',
    pujaName: 'Shayana Aarti & Ekanta Seva',
    timings: '09:30 PM - 10:00 PM',
    leadPurohit: 'Mukhya Pujari Sri Ramanuj Das',
    darshanStatus: 'Closing Sanctum',
    dressCode: 'Devotee Silence Requested',
    dailyAttendanceAvg: 80,
  },
];

export const INITIAL_PUROHIT_MARKET: PurohitProfile[] = [
  {
    id: 'pur-01',
    name: 'Pt. Radheshyam Dwivedi',
    vedicQualification: 'Veda Vibhushan (Shukla Yajurveda), Sampurnanand Sanskrit Univ.',
    sampradaya: 'Shaiva / Smartha',
    gotra: 'Bharadwaja',
    languages: ['Sanskrit', 'Hindi', 'Bhojpuri', 'English'],
    city: 'Varanasi',
    experienceYears: 24,
    rating: 4.95,
    reviewCount: 310,
    suggestedDakshina: 5100,
    specializations: ['Maharudrabhishek', 'Vastu Shanti', 'Navagraha Havan', 'Vivah Samskara'],
    verifiedByMandirTrust: true,
  },
  {
    id: 'pur-02',
    name: 'Acharya Mukund Mohan Goswami',
    vedicQualification: 'Acharya in Jyotish & Karmakanda (Kashi Vidyapeeth)',
    sampradaya: 'Gaudiya Vaishnava',
    gotra: 'Kashyapa',
    languages: ['Bengali', 'Hindi', 'Sanskrit', 'English'],
    city: 'Kolkata / Nabadwip',
    experienceYears: 18,
    rating: 4.9,
    reviewCount: 240,
    suggestedDakshina: 4500,
    specializations: ['Bhagavatam Katha', 'Satyanarayan Vrat Katha', 'Nama Samskar', 'Sudharshana Homam'],
    verifiedByMandirTrust: true,
  },
];

export const INITIAL_PITRU_RECORDS: PitruRecord[] = [
  {
    id: 'pit-01',
    workspaceId: 'ws-mandir',
    devoteeName: 'Sri Rameshwar Shastri',
    devoteePhone: '+91 98765 11223',
    ancestorName: 'Late Pt. Dinabandhu Shastri (Father)',
    relation: 'Father',
    gotra: 'Shandilya',
    tithiOfDemise: 'Ashwin Krishna Amavasya (Sarva Pitru)',
    nakshatra: 'Hasta',
    lastShradhPerformed: '2025-10-02',
    shradhLocation: 'Gaya Kshetra (Vishnupada)',
    nextScheduledReminder: '2026-09-21',
  },
];

export const INITIAL_COWS: GoshalaCowRecord[] = [
  {
    id: 'cow-01',
    workspaceId: 'ws-goshala',
    name: 'Gauri (Maa Kamadhenu)',
    tagNumber: 'SB-COW-001',
    breed: 'Gir (Desi Indigenous)',
    ageYears: 5,
    gender: 'Female',
    healthStatus: 'Healthy',
    dailyMilkLiters: 14,
    adoptedByDevotee: 'Sri Vikramaditya Rathore',
    monthlyFodderCost: 3500,
    photoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=600',
    notes: 'Very gentle and motherly temperament. High butterfat Vedic A2 milk used for sanctum Abhishek.',
  },
  {
    id: 'cow-02',
    workspaceId: 'ws-goshala',
    name: 'Nandi Surabhi',
    tagNumber: 'SB-COW-002',
    breed: 'Sahiwal',
    ageYears: 4,
    gender: 'Female',
    healthStatus: 'Healthy',
    dailyMilkLiters: 12,
    adoptedByDevotee: 'Smt. Gayatri Devi Sharma',
    monthlyFodderCost: 3200,
    photoUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'cow-03',
    workspaceId: 'ws-goshala',
    name: 'Surya (Veer Nandi)',
    tagNumber: 'SB-BULL-003',
    breed: 'Tharparkar',
    ageYears: 6,
    gender: 'Male',
    healthStatus: 'Healthy',
    dailyMilkLiters: 0,
    monthlyFodderCost: 4000,
    photoUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=600',
    notes: 'Magnificent pedigree breeding bull preserving pure indigenous Tharparkar lineage.',
  },
];

export const INITIAL_ANNADANAM: AnnadanamSponsorship[] = [
  {
    id: 'ann-01',
    workspaceId: 'ws-mandir',
    sponsorName: 'Sri Vikramaditya Rathore',
    sponsorPhone: '+91 94140 77889',
    gotra: 'Vatsa',
    date: '2026-08-25',
    mealType: 'Mahaprasad Lunch Bhandara',
    devoteeCountProjected: 500,
    contributionAmount: 25000,
    status: 'Booked',
    occasion: 'Birth Anniversary of Late Father Pt. Brijmohan Rathore',
  },
  {
    id: 'ann-02',
    workspaceId: 'ws-mandir',
    sponsorName: 'Smt. Gayatri Devi Sharma',
    sponsorPhone: '+91 98220 33445',
    gotra: 'Kashyapa',
    date: '2026-08-28',
    mealType: 'Morning Kheer & Puri Prasad',
    devoteeCountProjected: 250,
    contributionAmount: 11000,
    status: 'Booked',
    occasion: 'Ekadashi Seva & Family Prosperity',
  },
];

export const INITIAL_ROOMS: AshramKutirRoom[] = [
  {
    id: 'room-101',
    workspaceId: 'ws-ashram',
    roomNumber: 'Kutir 101 (Ganga Kutir)',
    roomType: 'Sadhana Kutir',
    capacity: 2,
    isOccupied: false,
    suggestedDonationPerDay: 800,
    cleaningStatus: 'Ready',
  },
  {
    id: 'room-102',
    workspaceId: 'ws-ashram',
    roomNumber: 'Kutir 102 (Shiva Kutir)',
    roomType: 'Sadhana Kutir',
    capacity: 2,
    isOccupied: true,
    currentGuestName: 'Swami Niranjananda',
    checkInDate: '2026-08-20',
    checkOutDate: '2026-08-30',
    suggestedDonationPerDay: 800,
    cleaningStatus: 'Ready',
  },
  {
    id: 'room-201',
    workspaceId: 'ws-tirth',
    roomNumber: 'Bhavan Suite 201',
    roomType: 'Family Suite',
    capacity: 5,
    isOccupied: false,
    suggestedDonationPerDay: 1200,
    cleaningStatus: 'Ready',
  },
];

export const INITIAL_GURUKUL_STUDENTS: GurukulStudent[] = [
  {
    id: 'gur-01',
    workspaceId: 'ws-gurukul',
    studentName: 'Batuk Raghav Shastri',
    rollNo: 'VED-2024-001',
    courseLevel: 'Prathama (Grammar)',
    sandhyaVandanaRegularity: 98,
    shlokaRecitationScore: 95,
    guardianName: 'Sri Rameshwar Shastri',
    guardianPhone: '+91 98765 11223',
    dateOfUpanayanam: '2016-04-14',
    attendancePct: 99,
  },
  {
    id: 'gur-02',
    workspaceId: 'ws-gurukul',
    studentName: 'Batuk Chinmay Acharya',
    rollNo: 'VED-2023-014',
    courseLevel: 'Madhyama (Shastras)',
    sandhyaVandanaRegularity: 92,
    shlokaRecitationScore: 88,
    guardianName: 'Sri Keshav Acharya',
    guardianPhone: '+91 94220 99881',
    dateOfUpanayanam: '2015-05-10',
    attendancePct: 96,
  },
];

export const INITIAL_CAMPAIGNS: CampaignCrowdfund[] = [
  {
    id: 'cmp-01',
    workspaceId: 'ws-mandir',
    title: '50kW Solar Rooftop Installation for Zero-Carbon Mandir Sabha Mandap',
    description: 'Transforming our sacred temple campus into 100% green solar powered sanctum with Net Metering.',
    targetAmount: 2500000,
    collectedAmount: 1850000,
    donorsCount: 420,
    bannerUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    status: 'Active',
    category: 'Eco Mandir / Solar',
    topDonors: [
      { name: 'Sri Vikramaditya Rathore', amount: 500000, city: 'Varanasi' },
      { name: 'Smt. Shanti Devi Trust', amount: 250000, city: 'Kanpur' },
      { name: 'Shri Ram Seva Samiti', amount: 100000, city: 'Lucknow' },
    ],
  },
  {
    id: 'cmp-02',
    workspaceId: 'ws-goshala',
    title: 'Modern Ayurvedic Veterinary Hospital for Desi Cows (Gau Chikitsalaya)',
    description: 'Building a specialized inpatient emergency trauma and herbal care unit for 200 indigenous abandoned cows.',
    targetAmount: 1500000,
    collectedAmount: 920000,
    donorsCount: 290,
    bannerUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=800',
    status: 'Active',
    category: 'Gau Seva / Healthcare',
    topDonors: [
      { name: 'Pt. Hariprasad Dwivedi', amount: 200000, city: 'Vrindavan' },
      { name: 'Brajbhumi Seva Mandal', amount: 150000, city: 'Mathura' },
    ],
  },
];

export const INITIAL_MATRIMONY: MatrimonyProfile[] = [
  {
    id: 'mat-01',
    fullName: 'Sri Aditya Shastri (B.Tech IIT, MS USA)',
    gender: 'Male',
    birthDate: '1995-04-20',
    birthTime: '06:45 AM',
    birthPlace: 'Varanasi',
    gotra: 'Shandilya',
    nakshatra: 'Rohini',
    rashi: 'Vrishabha',
    manglikStatus: 'Non-Manglik',
    education: 'B.Tech IIT Kanpur, MS Computer Science (USA)',
    profession: 'Senior AI Engineer at Tech Company',
    location: 'Bengaluru / US H1B',
    familyBackground: 'Father Veda scholar in Kashi, mother homemaker. High cultural values.',
    contactFamilyPerson: 'Sri Rameshwar Shastri (Father)',
    contactPhone: '+91 98765 11223',
    verified: true,
    photoMasked: false,
  },
  {
    id: 'mat-02',
    fullName: 'Dr. Priyadarshini Sharma (MBBS, MD Pediatrics)',
    gender: 'Female',
    birthDate: '1998-09-12',
    birthTime: '11:20 AM',
    birthPlace: 'Jaipur',
    gotra: 'Vatsa',
    nakshatra: 'Pushya',
    rashi: 'Karka',
    manglikStatus: 'Anshik Manglik',
    education: 'MD Pediatrics, Resident Doctor at AIIMS',
    profession: 'Doctor / Pediatrician',
    location: 'New Delhi / Jaipur',
    familyBackground: 'Reputed Gaur Brahman family with Sanatani traditions.',
    contactFamilyPerson: 'Pt. Omprakash Sharma (Uncle)',
    contactPhone: '+91 94140 11223',
    verified: true,
    photoMasked: false,
  },
];

export const INITIAL_SHLOKAS: ShlokaCardItem[] = [
  {
    id: 'shl-01',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    transliteration: 'karmaṇy-evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi ||',
    source: 'Bhagavad Gita - Chapter 2, Verse 47',
    category: 'Karma Yoga',
    englishMeaning: 'You have a divine right to perform your duty, but never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
    hindiMeaning: 'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। कर्मफल के हेतु मत बनो और न ही तुम्हारी अकर्मण्यता में आसक्ति हो।',
    bengaliMeaning: 'কর্মেতেই তোমার অধিকার, তার ফলে কখনো নয়। কর্মফলের হেতু হয়ো না এবং নিষ্কর্মতায় যেন তোমার আসক্তি না ঘটে।',
  },
  {
    id: 'shl-02',
    sanskrit: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।\nसर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥',
    transliteration: 'sarve bhavantu sukhinaḥ sarve santu nirāmayāḥ | sarve bhadrāṇi paśyantu mā kaścid-duḥkha-bhāg-bhavet ||',
    source: 'Brihadaranyaka Upanishad - Shanti Mantra',
    category: 'Peace & Harmony',
    englishMeaning: 'May all sentient beings be happy, may all be free from illness. May all perceive auspiciousness everywhere, may no one suffer grief.',
    hindiMeaning: 'सब सुखी हों, सब रोगमुक्त रहें, सब मंगलमय घटनाओं के साक्षी बनें और किसी को भी दुःख का भागी न बनना पड़े।',
    bengaliMeaning: 'সকলে সুখী হোক, সকলে রোগমুক্ত থাকুক, সকলে মঙ্গল দর্শন করুক এবং কেউ যেন দুঃখভোগ না করে।',
  },
  {
    id: 'shl-03',
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
    transliteration: 'yadā yadā hi dharmasya glānir bhavati bhārata | abhyutthānam adharmasya tadātmānaṁ sṛjāmy aham ||',
    source: 'Bhagavad Gita - Chapter 4, Verse 7',
    category: 'Dharma',
    englishMeaning: 'Whenever and wherever there is a decline in Dharma, O descendant of Bharata, and a predominant rise of Adharma—at that time I manifest Myself.',
    hindiMeaning: 'हे भारत! जब-जब धर्म की हानि और अधर्म का उत्थान होता है, तब-तब मैं स्वयं को प्रकट करता हूँ।',
    bengaliMeaning: 'হে ভারত! যখনই ধর্মের গ্লানি এবং অধর্মের অভ্যুত্থান হয়, তখনই আমি নিজেকে সৃষ্টি বা প্রকট করি।',
  },
];

export const INITIAL_RESOLUTIONS: TrusteeResolution[] = [
  {
    id: 'res-01',
    workspaceId: 'ws-mandir',
    resolutionNumber: 'RES-2026/04',
    date: '2026-08-01',
    title: 'Sanction for 50kW Solar Rooftop Installation over Sabha Mandap',
    proposedBy: 'Sri Vikramaditya Rathore (Trustee)',
    secondedBy: 'Sri Rameshwar Shastri (Secretary)',
    votesInFavor: 7,
    votesAgainst: 0,
    status: 'Passed',
    quorumMet: true,
    details: 'Unanimously resolved to accept solar vendor tender to achieve 100% green energy for Mandir sanctum and kitchen.',
  },
  {
    id: 'res-02',
    workspaceId: 'ws-mandir',
    resolutionNumber: 'RES-2026/05',
    date: '2026-08-15',
    title: 'Establishment of Free Ayurvedic Dispensary for Pilgrims',
    proposedBy: 'Dr. Anand Mahadevan (Trustee)',
    secondedBy: 'Smt. Gayatri Devi (Trustee)',
    votesInFavor: 6,
    votesAgainst: 1,
    status: 'Passed',
    quorumMet: true,
    details: 'Allocating Ground Floor Room 4 for daily Ayurvedic Vaidya consultation and free herbal medicine distribution.',
  },
];

export const INITIAL_SHIFTS: SevadarDutyShift[] = [
  {
    id: 'shf-01',
    workspaceId: 'ws-mandir',
    sevadarName: 'Sri Subhash Banerjee',
    phone: '+91 93310 44556',
    role: 'Prasad Distribution',
    date: '2026-08-25',
    shiftTiming: 'Morning (05:00 - 11:00)',
    attended: true,
  },
  {
    id: 'shf-02',
    workspaceId: 'ws-mandir',
    sevadarName: 'Sri Rahul Tiwari',
    phone: '+91 98100 22334',
    role: 'Crowd Control',
    date: '2026-08-25',
    shiftTiming: 'Evening (17:00 - 22:00)',
    attended: false,
  },
];

// Helper to track sandbox/demo creation counts per workspace and module
const DEMO_QUOTA_KEY_PREFIX = 'sb_demo_count_';
const AUTO_PURGE_TTL_MS = 60 * 60 * 1000; // 60 minutes auto-delete retention window

interface DataContextType {
  // Filtered Isolated Datasets for Active Workspace (Superadmin sees all)
  devotees: DevoteeMember[];
  families: FamilyHousehold[];
  vanshavali: VanshavaliNode;
  guests: GuestRecord[];
  treasury: TreasuryTransaction[];
  assets: AssetRecord[];
  inventory: InventoryItem[];
  poojaBookings: PoojaBooking[];
  poojas: PoojaBooking[];
  residentPujas: ResidentPujaSchedule[];
  purohits: PurohitProfile[];
  pitruRecords: PitruRecord[];
  cows: GoshalaCowRecord[];
  annadanamList: AnnadanamSponsorship[];
  rooms: AshramKutirRoom[];
  gurukulStudents: GurukulStudent[];
  campaigns: CampaignCrowdfund[];
  matrimonyProfiles: MatrimonyProfile[];
  shlokas: ShlokaCardItem[];
  resolutions: TrusteeResolution[];
  shifts: SevadarDutyShift[];

  // Mutators
  addDevotee: (devotee: Omit<DevoteeMember, 'id' | 'qrCodeRef' | 'joinedDate'>) => boolean;
  updateDevotee: (id: string, updates: Partial<DevoteeMember>) => void;
  deleteDevotee: (id: string) => void;
  addFamily: (family: Omit<FamilyHousehold, 'id'>) => boolean;
  updateVanshavali: (tree: VanshavaliNode) => void;
  addGuest: (guest: Omit<GuestRecord, 'id' | 'visitDate'>) => boolean;
  promoteGuestToMember: (guestId: string) => void;
  addTreasuryTransaction: (tx: Omit<TreasuryTransaction, 'id' | 'auditVerified'>) => boolean;
  addAsset: (asset: Omit<AssetRecord, 'id'>) => boolean;
  updateInventoryStock: (id: string, newStock: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestockedDate'>) => boolean;
  addPoojaBooking: (booking: Omit<PoojaBooking, 'id' | 'receiptRef' | 'status' | 'paymentStatus'>) => boolean;
  updatePoojaStatus: (id: string, status: PoojaBooking['status']) => void;
  addCow: (cow: Omit<GoshalaCowRecord, 'id'>) => boolean;
  adoptCow: (cowId: string, sponsorName: string, sponsorGotra?: string, sponsorPhone?: string) => void;
  addAnnadanam: (ann: Omit<AnnadanamSponsorship, 'id'>) => boolean;
  addResolution: (res: Omit<TrusteeResolution, 'id'>) => boolean;
  addShift: (shift: Omit<SevadarDutyShift, 'id'>) => boolean;
  addCampaignDonation: (campaignId: string, donorName: string, amount: number, city: string) => void;
  purgeAutoDeleteRecords: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeWorkspace, currentRole } = useAuthWorkspace();
  const { showToast } = useToast();
  const initialData = useInitialData();

  const [allDevotees, setAllDevotees] = useState<DevoteeMember[]>(() => {
    const s = initialData.sb_devotees;
    return s ? s : INITIAL_DEVOTEES;
  });

  const [allFamilies, setAllFamilies] = useState<FamilyHousehold[]>(() => {
    const s = initialData.sb_families;
    return s ? s : INITIAL_FAMILIES;
  });

  const [vanshavali, setVanshavali] = useState<VanshavaliNode>(() => {
    const s = initialData.sb_vanshavali;
    return s ? s : INITIAL_VANSHAVALI;
  });

  const [allGuests, setAllGuests] = useState<GuestRecord[]>(() => {
    const s = initialData.sb_guests;
    return s ? s : INITIAL_GUESTS;
  });

  const [allTreasury, setAllTreasury] = useState<TreasuryTransaction[]>(() => {
    const s = initialData.sb_treasury;
    return s ? s : INITIAL_TREASURY;
  });

  const [allAssets, setAllAssets] = useState<AssetRecord[]>(() => {
    const s = initialData.sb_assets;
    return s ? s : INITIAL_ASSETS;
  });

  const [allInventory, setAllInventory] = useState<InventoryItem[]>(() => {
    const s = initialData.sb_inventory;
    return s ? s : INITIAL_INVENTORY;
  });

  const [allPoojaBookings, setAllPoojaBookings] = useState<PoojaBooking[]>(() => {
    const s = initialData.sb_pooja_bookings;
    return s ? s : INITIAL_POOJA_BOOKINGS;
  });

  const [residentPujas] = useState<ResidentPujaSchedule[]>(INITIAL_RESIDENT_PUJAS);
  const [purohits] = useState<PurohitProfile[]>(INITIAL_PUROHIT_MARKET);
  const [allPitruRecords] = useState<PitruRecord[]>(INITIAL_PITRU_RECORDS);
  const [allCows, setAllCows] = useState<GoshalaCowRecord[]>(INITIAL_COWS);
  const [allAnnadanamList, setAllAnnadanamList] = useState<AnnadanamSponsorship[]>(INITIAL_ANNADANAM);
  const [allRooms] = useState<AshramKutirRoom[]>(INITIAL_ROOMS);
  const [allGurukulStudents] = useState<GurukulStudent[]>(INITIAL_GURUKUL_STUDENTS);
  const [allCampaigns, setAllCampaigns] = useState<CampaignCrowdfund[]>(INITIAL_CAMPAIGNS);
  const [matrimonyProfiles] = useState<MatrimonyProfile[]>(INITIAL_MATRIMONY);
  const [shlokas] = useState<ShlokaCardItem[]>(INITIAL_SHLOKAS);
  const [allResolutions, setAllResolutions] = useState<TrusteeResolution[]>(INITIAL_RESOLUTIONS);
  const [allShifts, setAllShifts] = useState<SevadarDutyShift[]>(INITIAL_SHIFTS);

  // ----------------------------------------------------
  // AUTOMATIC DATA DELETION / SANDBOX PURGE CYCLE
  // Temporary added records are marked with _createdAt / _expiresAt timestamps
  // and cleaned on expiration (default 60 mins).
  // ----------------------------------------------------
  const purgeAutoDeleteRecords = useCallback(() => {
    const now = Date.now();

    setAllDevotees((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
    setAllTreasury((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
    setAllPoojaBookings((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
    setAllInventory((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
    setAllAssets((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
    setAllCows((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
    setAllAnnadanamList((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
    setAllGuests((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
    setAllFamilies((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
    setAllResolutions((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
    setAllShifts((prev) =>
      prev.filter((item: any) => !item._expiresAt || item._expiresAt > now)
    );
  }, []);

  // Run auto-purge timer every 60 seconds
  useEffect(() => {
    purgeAutoDeleteRecords();
    const interval = setInterval(purgeAutoDeleteRecords, 60000);
    return () => clearInterval(interval);
  }, [purgeAutoDeleteRecords]);

  // Quota enforcement: Check max 5 inputs per module per organisation
  const checkAndIncrementModuleQuota = (moduleName: string): boolean => {
    const key = `${DEMO_QUOTA_KEY_PREFIX}${activeWorkspace.id}_${moduleName}`;
    const currentCount = parseInt(localStorage.getItem(key) || '0', 10);

    if (currentCount >= 5 && currentRole !== 'superadmin' && currentRole !== 'master_admin') {
      showToast(
        `Demo Quota Limit (5 inputs) reached for ${moduleName} in ${activeWorkspace.name}. Records auto-purge on schedule.`,
        'warning',
        'Demo Sandbox Quota'
      );
      return false;
    }

    localStorage.setItem(key, (currentCount + 1).toString());
    return true;
  };

  // Sync to local storage
  useEffect(() => {
    set('sb_devotees', allDevotees);
  }, [allDevotees]);

  useEffect(() => {
    set('sb_families', allFamilies);
  }, [allFamilies]);

  useEffect(() => {
    set('sb_treasury', allTreasury);
  }, [allTreasury]);

  useEffect(() => {
    set('sb_assets', allAssets);
  }, [allAssets]);

  useEffect(() => {
    set('sb_inventory', allInventory);
  }, [allInventory]);

  useEffect(() => {
    set('sb_pooja_bookings', allPoojaBookings);
  }, [allPoojaBookings]);

  // ----------------------------------------------------
  // STRICT WORKSPACE TENANT DATA ISOLATION
  // Each organization can ONLY see its own data.
  // Superadmin / God Mode is exempted to allow sovereign control.
  // ----------------------------------------------------
  const isGodMode = currentRole === 'superadmin' || currentRole === 'master_admin';

  const devotees = useMemo(() => {
    return isGodMode
      ? allDevotees
      : allDevotees.filter((d) => !d.workspaceId || d.workspaceId === activeWorkspace.id);
  }, [allDevotees, activeWorkspace.id, isGodMode]);

  const families = useMemo(() => {
    return isGodMode
      ? allFamilies
      : allFamilies.filter((f) => !f.workspaceId || f.workspaceId === activeWorkspace.id);
  }, [allFamilies, activeWorkspace.id, isGodMode]);

  const guests = useMemo(() => {
    return isGodMode
      ? allGuests
      : allGuests.filter((g) => !g.workspaceId || g.workspaceId === activeWorkspace.id);
  }, [allGuests, activeWorkspace.id, isGodMode]);

  const treasury = useMemo(() => {
    return isGodMode
      ? allTreasury
      : allTreasury.filter((t) => !t.workspaceId || t.workspaceId === activeWorkspace.id);
  }, [allTreasury, activeWorkspace.id, isGodMode]);

  const assets = useMemo(() => {
    return isGodMode
      ? allAssets
      : allAssets.filter((a) => !a.workspaceId || a.workspaceId === activeWorkspace.id);
  }, [allAssets, activeWorkspace.id, isGodMode]);

  const inventory = useMemo(() => {
    return isGodMode
      ? allInventory
      : allInventory.filter((i) => !i.workspaceId || i.workspaceId === activeWorkspace.id);
  }, [allInventory, activeWorkspace.id, isGodMode]);

  const poojaBookings = useMemo(() => {
    return isGodMode
      ? allPoojaBookings
      : allPoojaBookings.filter((p) => !p.workspaceId || p.workspaceId === activeWorkspace.id);
  }, [allPoojaBookings, activeWorkspace.id, isGodMode]);

  const pitruRecords = useMemo(() => {
    return isGodMode
      ? allPitruRecords
      : allPitruRecords.filter((p) => !p.workspaceId || p.workspaceId === activeWorkspace.id);
  }, [allPitruRecords, activeWorkspace.id, isGodMode]);

  const cows = useMemo(() => {
    return isGodMode
      ? allCows
      : allCows.filter((c) => !c.workspaceId || c.workspaceId === activeWorkspace.id);
  }, [allCows, activeWorkspace.id, isGodMode]);

  const annadanamList = useMemo(() => {
    return isGodMode
      ? allAnnadanamList
      : allAnnadanamList.filter((a) => !a.workspaceId || a.workspaceId === activeWorkspace.id);
  }, [allAnnadanamList, activeWorkspace.id, isGodMode]);

  const rooms = useMemo(() => {
    return isGodMode
      ? allRooms
      : allRooms.filter((r) => !r.workspaceId || r.workspaceId === activeWorkspace.id);
  }, [allRooms, activeWorkspace.id, isGodMode]);

  const gurukulStudents = useMemo(() => {
    return isGodMode
      ? allGurukulStudents
      : allGurukulStudents.filter((g) => !g.workspaceId || g.workspaceId === activeWorkspace.id);
  }, [allGurukulStudents, activeWorkspace.id, isGodMode]);

  const campaigns = useMemo(() => {
    return isGodMode
      ? allCampaigns
      : allCampaigns.filter((c) => !c.workspaceId || c.workspaceId === activeWorkspace.id);
  }, [allCampaigns, activeWorkspace.id, isGodMode]);

  const resolutions = useMemo(() => {
    return isGodMode
      ? allResolutions
      : allResolutions.filter((r) => !r.workspaceId || r.workspaceId === activeWorkspace.id);
  }, [allResolutions, activeWorkspace.id, isGodMode]);

  const shifts = useMemo(() => {
    return isGodMode
      ? allShifts
      : allShifts.filter((s) => !s.workspaceId || s.workspaceId === activeWorkspace.id);
  }, [allShifts, activeWorkspace.id, isGodMode]);

  // ----------------------------------------------------
  // MUTATOR IMPLEMENTATIONS (With Tenant Tagging & Auto-Delete Expiration)
  // ----------------------------------------------------
  const addDevotee = (data: Omit<DevoteeMember, 'id' | 'qrCodeRef' | 'joinedDate'>): boolean => {
    if (!checkAndIncrementModuleQuota('devotees')) return false;

    const id = `dev-${Date.now()}`;
    const now = Date.now();
    const newMember: any = {
      ...data,
      id,
      workspaceId: data.workspaceId || activeWorkspace.id,
      qrCodeRef: `QR-SB-${id.slice(-6).toUpperCase()}`,
      joinedDate: new Date().toISOString().slice(0, 10),
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS, // Auto delete after TTL
    };

    setAllDevotees((prev) => [newMember, ...prev]);
    trackSignUp('Devotee Pass');
    showToast(
      `${data.fullName} enrolled into ${activeWorkspace.name}. (Auto-purge scheduled in 60m)`,
      'success'
    );
    return true;
  };

  const updateDevotee = (id: string, updates: Partial<DevoteeMember>) => {
    setAllDevotees((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    showToast('Devotee record updated', 'success');
  };

  const deleteDevotee = (id: string) => {
    setAllDevotees((prev) => prev.filter((d) => d.id !== id));
    showToast('Member removed from directory', 'info');
  };

  const addFamily = (family: Omit<FamilyHousehold, 'id'>): boolean => {
    if (!checkAndIncrementModuleQuota('families')) return false;

    const id = `fam-${Date.now()}`;
    const now = Date.now();
    const newFam: any = {
      ...family,
      id,
      workspaceId: family.workspaceId || activeWorkspace.id,
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS,
    };
    setAllFamilies((prev) => [newFam, ...prev]);
    showToast(`Household "${family.familyName}" recorded`, 'success');
    return true;
  };

  const updateVanshavali = (tree: VanshavaliNode) => {
    setVanshavali(tree);
    set('sb_vanshavali', tree);
    showToast('Lineage genealogical tree saved', 'success');
  };

  const addGuest = (guest: Omit<GuestRecord, 'id' | 'visitDate'>): boolean => {
    if (!checkAndIncrementModuleQuota('guests')) return false;

    const id = `gst-${Date.now()}`;
    const now = Date.now();
    const newGuest: any = {
      ...guest,
      id,
      workspaceId: guest.workspaceId || activeWorkspace.id,
      visitDate: new Date().toISOString().slice(0, 10),
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS,
    };
    setAllGuests((prev) => [newGuest, ...prev]);
    trackGenerateLead('Guest Darshan Lead');
    showToast(`Guest entry created for ${guest.name}`, 'success');
    return true;
  };

  const promoteGuestToMember = (guestId: string) => {
    const guest = allGuests.find((g) => g.id === guestId);
    if (!guest) return;

    addDevotee({
      workspaceId: activeWorkspace.id,
      fullName: guest.name,
      phone: guest.phone,
      pin: '1008',
      role: 'devotee',
      sevaIndex: 150,
      sevaTier: 'Sadharan',
      gotra: 'Kashyapa',
      varnaKul: 'Sanatan',
      address: guest.city,
      activeStatus: 'Active',
      totalDonated: 0,
      volunteerHours: 0,
    });

    setAllGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, status: 'Promoted' as const } : g))
    );
    showToast(`Guest ${guest.name} promoted to enrolled Member!`, 'success');
  };

  const addTreasuryTransaction = (tx: Omit<TreasuryTransaction, 'id' | 'auditVerified'>): boolean => {
    if (!checkAndIncrementModuleQuota('treasury')) return false;

    const id = `tx-${Date.now()}`;
    const now = Date.now();
    const newTx: any = {
      ...tx,
      id,
      workspaceId: tx.workspaceId || activeWorkspace.id,
      auditVerified: true,
      taxReceiptNumber: tx.is80GEligible ? `SB-80G-${new Date().getFullYear()}-${id.slice(-4)}` : undefined,
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS,
    };
    setAllTreasury((prev) => [newTx, ...prev]);

    if (tx.type === 'Income') {
      trackTreasuryPurchase({
        transactionId: id,
        value: tx.amount,
        currency: activeWorkspace.currency,
        category: tx.category,
        handledBy: tx.handledBy,
        paymentMode: tx.paymentMode,
        workspaceType: activeWorkspace.type,
        workspaceId: activeWorkspace.id,
        userRole: currentRole,
      });

      // Update devotee total if linked
      if (tx.devoteeId) {
        setAllDevotees((prev) =>
          prev.map((d) =>
            d.id === tx.devoteeId
              ? {
                  ...d,
                  totalDonated: d.totalDonated + tx.amount,
                  sevaIndex: Math.min(1000, d.sevaIndex + Math.floor(tx.amount / 100)),
                }
              : d
          )
        );
      }
    }

    showToast(
      `${tx.type === 'Income' ? 'Chanda / Income' : 'Expense'} of ${activeWorkspace.currencySymbol} ${tx.amount.toLocaleString()} logged.`,
      'success',
      'Double-Entry Ledger Updated'
    );
    return true;
  };

  const addAsset = (asset: Omit<AssetRecord, 'id'>): boolean => {
    if (!checkAndIncrementModuleQuota('assets')) return false;

    const id = `ast-${Date.now()}`;
    const now = Date.now();
    const newAst: any = {
      ...asset,
      id,
      workspaceId: asset.workspaceId || activeWorkspace.id,
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS,
    };
    setAllAssets((prev) => [{ ...newAst }, ...prev]);
    showToast(`Asset "${asset.name}" added to ledger`, 'success');
    return true;
  };

  const updateInventoryStock = (id: string, newStock: number) => {
    setAllInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, currentStock: newStock, lastRestockedDate: new Date().toISOString().slice(0, 10) }
          : item
      )
    );
    showToast('Inventory stock balance updated', 'success');
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastRestockedDate'>): boolean => {
    if (!checkAndIncrementModuleQuota('inventory')) return false;

    const id = `inv-${Date.now()}`;
    const now = Date.now();
    const newInv: any = {
      ...item,
      id,
      workspaceId: item.workspaceId || activeWorkspace.id,
      lastRestockedDate: new Date().toISOString().slice(0, 10),
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS,
    };
    setAllInventory((prev) => [newInv, ...prev]);
    showToast(`Item "${item.itemName}" added to store`, 'success');
    return true;
  };

  const addPoojaBooking = (
    booking: Omit<PoojaBooking, 'id' | 'receiptRef' | 'status' | 'paymentStatus'>
  ): boolean => {
    if (!checkAndIncrementModuleQuota('pooja')) return false;

    const id = `pb-${Date.now()}`;
    const now = Date.now();
    const newBooking: any = {
      ...booking,
      id,
      workspaceId: booking.workspaceId || activeWorkspace.id,
      receiptRef: `RCP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS,
    };
    setAllPoojaBookings((prev) => [newBooking, ...prev]);

    // Automatically log to treasury ledger
    addTreasuryTransaction({
      workspaceId: activeWorkspace.id,
      date: new Date().toISOString().slice(0, 10),
      type: 'Income',
      category: 'Pooja Dakshina',
      amount: booking.dakshinaAmount,
      handledBy: 'Pooja Sankalp Desk',
      devoteeName: booking.devoteeName,
      paymentMode: 'UPI / QR',
      purpose: `${booking.poojaName} - Gotra: ${booking.gotra}`,
      is80GEligible: true,
      taxReceiptIssued: false,
    });

    showToast(`Sankalp reserved for ${booking.devoteeName}. Slip generated.`, 'success', 'Pooja Confirmed');
    return true;
  };

  const updatePoojaStatus = (id: string, status: PoojaBooking['status']) => {
    setAllPoojaBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    showToast(`Pooja status updated to ${status}`, 'success');
  };

  const addCow = (cow: Omit<GoshalaCowRecord, 'id'>): boolean => {
    if (!checkAndIncrementModuleQuota('goshala')) return false;

    const id = `cow-${Date.now()}`;
    const now = Date.now();
    const newCow: any = {
      ...cow,
      id,
      workspaceId: cow.workspaceId || activeWorkspace.id,
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS,
    };
    setAllCows((prev) => [newCow, ...prev]);
    showToast(`Gomata/Nandi record added: ${cow.name}`, 'success');
    return true;
  };

  const adoptCow = (cowId: string, sponsorName: string, sponsorGotra?: string, sponsorPhone?: string) => {
    setAllCows((prev) =>
      prev.map((c) =>
        c.id === cowId
          ? {
              ...c,
              adoptedByDevotee: sponsorName,
              adoptionSponsor: sponsorName,
              sponsorGotra,
              sponsorPhone,
              adoptionStartDate: new Date().toISOString().slice(0, 10),
            }
          : c
      )
    );
    showToast(`Gomata successfully adopted by ${sponsorName}!`, 'success', 'Gau Seva Adoption');
  };

  const addAnnadanam = (ann: Omit<AnnadanamSponsorship, 'id'>): boolean => {
    if (!checkAndIncrementModuleQuota('annadanam')) return false;

    const id = `ann-${Date.now()}`;
    const now = Date.now();
    const newAnn: any = {
      ...ann,
      id,
      workspaceId: ann.workspaceId || activeWorkspace.id,
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS,
    };
    setAllAnnadanamList((prev) => [newAnn, ...prev]);
    addTreasuryTransaction({
      workspaceId: activeWorkspace.id,
      date: ann.date,
      type: 'Income',
      category: 'Annadanam Sponsorship',
      amount: ann.contributionAmount,
      handledBy: 'Annakshetra Desk',
      devoteeName: ann.sponsorName,
      paymentMode: 'UPI / QR',
      purpose: `Bhandara for ${ann.devoteeCountProjected} devotees`,
      is80GEligible: true,
      taxReceiptIssued: false,
    });
    showToast(`Annadanam sponsored for ${ann.devoteeCountProjected} devotees!`, 'success');
    return true;
  };

  const addResolution = (res: Omit<TrusteeResolution, 'id'>): boolean => {
    if (!checkAndIncrementModuleQuota('resolutions')) return false;

    const id = `res-${Date.now()}`;
    const now = Date.now();
    const newRes: any = {
      ...res,
      id,
      workspaceId: res.workspaceId || activeWorkspace.id,
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS,
    };
    setAllResolutions((prev) => [newRes, ...prev]);
    showToast(`Resolution ${res.resolutionNumber} saved to governance ledger`, 'success');
    return true;
  };

  const addShift = (shift: Omit<SevadarDutyShift, 'id'>): boolean => {
    if (!checkAndIncrementModuleQuota('shifts')) return false;

    const id = `shf-${Date.now()}`;
    const now = Date.now();
    const newShift: any = {
      ...shift,
      id,
      workspaceId: shift.workspaceId || activeWorkspace.id,
      _createdAt: now,
      _expiresAt: now + AUTO_PURGE_TTL_MS,
    };
    setAllShifts((prev) => [newShift, ...prev]);
    showToast(`Sevadar shift assigned for ${shift.sevadarName}`, 'success');
    return true;
  };

  const addCampaignDonation = (campaignId: string, donorName: string, amount: number, city: string) => {
    setAllCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              collectedAmount: c.collectedAmount + amount,
              donorsCount: c.donorsCount + 1,
              topDonors: [{ name: donorName, amount, city }, ...c.topDonors].slice(0, 5),
            }
          : c
      )
    );

    addTreasuryTransaction({
      workspaceId: activeWorkspace.id,
      date: new Date().toISOString().slice(0, 10),
      type: 'Income',
      category: 'Mandir Campaigns',
      amount,
      handledBy: 'Crowdfund Seva Desk',
      devoteeName: donorName,
      paymentMode: 'UPI / QR',
      purpose: `Campaign Seva Contribution`,
      is80GEligible: true,
      taxReceiptIssued: true,
    });

    showToast(`Sacred contribution of ₹${amount.toLocaleString()} received from ${donorName}!`, 'success', 'Mandir Nirman Donation');
  };

  return (
    <DataContext.Provider
      value={{
        devotees,
        families,
        vanshavali,
        guests,
        treasury,
        assets,
        inventory,
        poojaBookings,
        poojas: poojaBookings,
        residentPujas,
        purohits,
        pitruRecords,
        cows,
        annadanamList,
        rooms,
        gurukulStudents,
        campaigns,
        matrimonyProfiles,
        shlokas,
        resolutions,
        shifts,
        addDevotee,
        updateDevotee,
        deleteDevotee,
        addFamily,
        updateVanshavali,
        addGuest,
        promoteGuestToMember,
        addTreasuryTransaction,
        addAsset,
        updateInventoryStock,
        addInventoryItem,
        addPoojaBooking,
        updatePoojaStatus,
        addCow,
        adoptCow,
        addAnnadanam,
        addResolution,
        addShift,
        addCampaignDonation,
        purgeAutoDeleteRecords,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
