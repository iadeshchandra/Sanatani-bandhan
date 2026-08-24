import React, { createContext, useContext, useState, useEffect } from 'react';
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
    workspaceId: 'ws-mandir',
    fullName: 'Sri Subhash Chandra Banerjee',
    spiritualName: 'Subhasish Das',
    phone: '+91 93310 44556',
    email: 'subhash.banerjee@kolkata.in',
    pin: '5001',
    role: 'devotee',
    sevaIndex: 510,
    sevaTier: 'Kormi',
    gotra: 'Bharadwaja',
    pravara: 'Bharadwaja, Barhaspatya, Angirasa',
    varnaKul: 'Radhi Kulin',
    address: 'Chetganj, Varanasi',
    birthDate: '1990-09-22',
    activeStatus: 'Active',
    totalDonated: 28000,
    volunteerHours: 85,
    qrCodeRef: 'QR-SB-DEV104',
    joinedDate: '2023-04-18',
  },
  {
    id: 'dev-105',
    workspaceId: 'ws-goshala',
    fullName: 'Sri Mohan Lal Yadav',
    phone: '+91 98111 77665',
    email: 'mohan.gauseva@gmail.com',
    pin: '7766',
    role: 'manager',
    sevaIndex: 940,
    sevaTier: 'Ratna',
    gotra: 'Yadu',
    varnaKul: 'Gopala Vansh',
    address: 'Govardhan Marg, Vrindavan',
    activeStatus: 'Active',
    totalDonated: 45000,
    volunteerHours: 650,
    qrCodeRef: 'QR-SB-DEV105',
    joinedDate: '2021-08-01',
  },
];

export const INITIAL_FAMILIES: FamilyHousehold[] = [
  {
    id: 'fam-01',
    workspaceId: 'ws-mandir',
    familyName: 'Shastri Parivar (Kashi)',
    kartaDevoteeId: 'dev-101',
    gotra: 'Shandilya',
    kuladevata: 'Mata Annapurna Devi',
    residenceAddress: 'Near Dasaswamedh Ghat, Varanasi',
    contactPhone: '+91 98765 11223',
    memberIds: ['dev-101'],
    totalFamilyDonations: 150000,
    lastChandaDate: '2026-08-10',
    notes: 'Generations of Vedic scholars and Sanskrit teachers at the Mandir.',
  },
  {
    id: 'fam-02',
    workspaceId: 'ws-mandir',
    familyName: 'Rathore Kshatriya Parivar',
    kartaDevoteeId: 'dev-103',
    gotra: 'Vatsa',
    kuladevata: 'Kuldevi Sri Bithur Mata',
    residenceAddress: 'Durga Kund Road, Varanasi',
    contactPhone: '+91 94140 77889',
    memberIds: ['dev-103'],
    totalFamilyDonations: 500000,
    lastChandaDate: '2026-08-01',
    notes: 'Patron for Mandir Nirman and Annakshetra renovation.',
  },
];

export const INITIAL_VANSHAVALI: VanshavaliNode = {
  id: 'node-root',
  name: 'Pandit Mahadev Shastri (1890 - 1965)',
  generation: 1,
  gotra: 'Shandilya',
  birthYear: '1890',
  deathYear: '1965',
  relation: 'Prapitamaha (Great Grandfather)',
  spouse: 'Mata Parvati Devi',
  location: 'Varanasi',
  notes: 'Veda Murthy, scholar at Kashi Naresh Raj Sabha',
  children: [
    {
      id: 'node-2-1',
      name: 'Pandit Vishwanath Shastri (1922 - 1998)',
      generation: 2,
      gotra: 'Shandilya',
      birthYear: '1922',
      deathYear: '1998',
      relation: 'Pitamaha (Grandfather)',
      spouse: 'Mata Saraswati Devi',
      location: 'Varanasi',
      children: [
        {
          id: 'node-3-1',
          name: 'Sri Rameshwar Shastri (b. 1975)',
          generation: 3,
          gotra: 'Shandilya',
          birthYear: '1975',
          relation: 'Pita / Karta (Current Head)',
          spouse: 'Smt. Shobha Shastri',
          location: 'Varanasi',
          children: [
            {
              id: 'node-4-1',
              name: 'Ayushman Raghav Shastri (b. 2005)',
              generation: 4,
              gotra: 'Shandilya',
              birthYear: '2005',
              relation: 'Putra (Son)',
              location: 'Varanasi',
              notes: 'Studying Rigveda Samhita at Gurukul',
            },
            {
              id: 'node-4-2',
              name: 'Ayushmati Vaidehi Shastri (b. 2008)',
              generation: 4,
              gotra: 'Shandilya',
              birthYear: '2008',
              relation: 'Putri (Daughter)',
              location: 'Varanasi',
            },
          ],
        },
        {
          id: 'node-3-2',
          name: 'Sri Harishwar Shastri (b. 1980)',
          generation: 3,
          gotra: 'Shandilya',
          birthYear: '1980',
          relation: 'Paternal Uncle (Chacha)',
          spouse: 'Smt. Ananya Shastri',
          location: 'Prayagraj',
        },
      ],
    },
  ],
};

export const INITIAL_GUESTS: GuestRecord[] = [
  {
    id: 'gst-01',
    workspaceId: 'ws-mandir',
    name: 'Sri Rajesh Agrawal',
    phone: '+91 98390 12345',
    city: 'Kanpur',
    purpose: 'Pooja Inquiry',
    visitDate: '2026-08-20',
    status: 'Follow-Up',
    assignedSevadar: 'Sri Rameshwar Shastri',
    notes: 'Wants to sponsor full day Navaratri Chandi Havan.',
  },
  {
    id: 'gst-02',
    workspaceId: 'ws-mandir',
    name: 'Dr. Meenakshi Sundaram',
    phone: '+91 94440 98765',
    city: 'Chennai',
    purpose: 'Darshan',
    visitDate: '2026-08-22',
    status: 'Lead',
    assignedSevadar: 'Smt. Gayatri Devi',
    notes: 'Visiting with 6 family members. Inquired about guest kutir.',
  },
];

export const INITIAL_TREASURY: TreasuryTransaction[] = [
  {
    id: 'tx-1001',
    workspaceId: 'ws-mandir',
    date: '2026-08-23',
    type: 'Income',
    category: 'Pranami & Chanda',
    subcategory: 'Devotee Monthly Seva',
    amount: 25000,
    handledBy: 'Sri Rameshwar Shastri (Treasurer)',
    devoteeId: 'dev-103',
    devoteeName: 'Sri Vikramaditya Rathore',
    paymentMode: 'UPI / QR',
    referenceNo: 'UPI-HDFC-99881203',
    purpose: 'Monthly Mandir Deepam & Flowers Seva',
    is80GEligible: true,
    taxReceiptIssued: true,
    taxReceiptNumber: 'SB-80G-2026-001',
    auditVerified: true,
  },
  {
    id: 'tx-1002',
    workspaceId: 'ws-mandir',
    date: '2026-08-22',
    type: 'Income',
    category: 'Pooja Dakshina',
    subcategory: 'Rudrabhishekam Seva',
    amount: 5100,
    handledBy: 'Sri Subhash Banerjee',
    devoteeId: 'dev-102',
    devoteeName: 'Smt. Gayatri Devi Sharma',
    paymentMode: 'Cash',
    purpose: 'Maha Rudrabhishekam for Family Well-being',
    is80GEligible: true,
    taxReceiptIssued: false,
    auditVerified: true,
  },
  {
    id: 'tx-1003',
    workspaceId: 'ws-mandir',
    date: '2026-08-21',
    type: 'Expense',
    category: 'Pooja Samagri & Ghee',
    subcategory: 'Consumables Restock',
    amount: 14200,
    handledBy: 'Sri Subhash Banerjee',
    paymentMode: 'Bank Transfer',
    referenceNo: 'NEFT-AXIS-44331122',
    purpose: '50kg Pure Desi Cow Ghee for Havan & Akhand Jyot',
    auditVerified: true,
  },
  {
    id: 'tx-1004',
    workspaceId: 'ws-mandir',
    date: '2026-08-19',
    type: 'Expense',
    category: 'Electricity & Utilities',
    subcategory: 'Mandir Complex Power',
    amount: 8650,
    handledBy: 'Sri Rameshwar Shastri',
    paymentMode: 'UPI / QR',
    referenceNo: 'UPPCL-BILL-88771',
    purpose: 'Mandir Main Sanctum & Sabha Hall Electricity',
    auditVerified: true,
  },
  {
    id: 'tx-1005',
    workspaceId: 'ws-mandir',
    date: '2026-08-18',
    type: 'Income',
    category: 'Annadanam Sponsorship',
    subcategory: 'Mahaprasad Bhandara',
    amount: 31000,
    handledBy: 'Sri Vikramaditya Rathore',
    paymentMode: 'Bank Transfer',
    referenceNo: 'RTGS-SBI-100998877',
    purpose: 'Sponsorship of 1,000 Devotee Purnima Bhandara',
    is80GEligible: true,
    taxReceiptIssued: true,
    taxReceiptNumber: 'SB-80G-2026-002',
    auditVerified: true,
  },
];

export const INITIAL_ASSETS: AssetRecord[] = [
  {
    id: 'ast-01',
    workspaceId: 'ws-mandir',
    name: 'Sanctum Swarna Mukut (Gold Crown for Deity)',
    category: 'Deity Ornaments & Gold',
    valuation: 4500000,
    acquisitionDate: '2018-10-15',
    condition: 'Pristine',
    custodian: 'Head Priest / Mandir Vault',
    location: 'Mandir Central Vault',
    donorName: 'Rathore Dynasty Trust',
  },
  {
    id: 'ast-02',
    workspaceId: 'ws-mandir',
    name: 'Mandir Sabha Bhawan & Annakshetra Building',
    category: 'Land & Building',
    valuation: 35000000,
    acquisitionDate: '2005-04-10',
    condition: 'Good',
    custodian: 'Board of Trustees',
    location: 'Plot No 4, Mandir Marg, Varanasi',
  },
  {
    id: 'ast-03',
    workspaceId: 'ws-mandir',
    name: 'Bhandara Sound System & Acoustics (JBL Array)',
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
    nakshatra: 'Rohini',
    rashi: 'Vrishabha',
    sankalpDescription: 'For family peace, prosperity, health, and removal of obstacles.',
    purohitAssigned: 'Pt. Vidyadhar Shastri',
    dakshinaAmount: 5100,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    receiptRef: 'RCP-RUDRA-1008',
  },
  {
    id: 'pb-02',
    workspaceId: 'ws-mandir',
    devoteeName: 'Sri Anupam Mukhopadhyay',
    phone: '+91 98310 99881',
    poojaName: 'Satyanarayan Mahapooja & Katha',
    tithiDate: '2026-08-28 (Purnima)',
    timeSlot: '05:30 PM - 07:30 PM',
    gotra: 'Sandilya',
    nakshatra: 'Pushya',
    sankalpDescription: 'Griha Pravesh blessing and daughter wedding Mangalam.',
    purohitAssigned: 'Pt. Ramavatar Shukla',
    dakshinaAmount: 3100,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    receiptRef: 'RCP-SATYA-2009',
  },
];

export const INITIAL_RESIDENT_PUJAS: ResidentPujaSchedule[] = [
  {
    id: 'rp-01',
    workspaceId: 'ws-mandir',
    ritualName: 'Mangala Aarti & Suprabhatam',
    time: '05:00 AM - 05:45 AM',
    priestName: 'Chief Priest Pt. Achyutanand',
    deity: 'Lord Shiva & Sri Kashi Vishwanath',
    samagriList: ['Ghee Lamps (108 wicks)', 'Cow Milk', 'Gangajal', 'Bilva Leaves', 'Chandan'],
    isOpenForPublic: true,
  },
  {
    id: 'rp-02',
    workspaceId: 'ws-mandir',
    ritualName: 'Bhog Aarti & Rajopachara Seva',
    time: '12:00 PM - 12:30 PM',
    priestName: 'Pt. Vidyadhar Shastri',
    deity: 'All Mandir Vigrahas',
    samagriList: ['56 Bhog Mahaprasad', 'Panchamrit', 'Tulasi / Vilva', 'Karpur'],
    isOpenForPublic: true,
  },
  {
    id: 'rp-03',
    workspaceId: 'ws-mandir',
    ritualName: 'Sandhya Maha Aarti & Pushpanjali',
    time: '07:00 PM - 07:45 PM',
    priestName: 'Pt. Ramavatar Shukla',
    deity: 'Ganga Mata & Shivalaya',
    samagriList: ['Dhoop', 'Deepam', 'Flower Garlands', 'Conch (Shankh)', 'Mridanga'],
    isOpenForPublic: true,
  },
  {
    id: 'rp-04',
    workspaceId: 'ws-mandir',
    ritualName: 'Shayan Aarti & Lotus Darshan',
    time: '09:30 PM - 10:00 PM',
    priestName: 'Chief Priest Pt. Achyutanand',
    deity: 'Lord Shiva',
    samagriList: ['Sugandha Attar', 'Karpur Aarti', 'Chamara Seva'],
    isOpenForPublic: true,
  },
];

export const INITIAL_PUROHIT_MARKET: PurohitProfile[] = [
  {
    id: 'pur-01',
    fullName: 'Pt. Vidyadhar Shastri, Jyotishacharya',
    vidwatTitle: 'Veda Murthy & Gold Medalist (BHU)',
    specializations: ['Navagraha Shanti', 'Rudrabhishek', 'Vastu Shanti', 'Kundali Milan'],
    vedicBranch: 'Rigveda',
    city: 'Varanasi, UP',
    phone: '+91 94152 33441',
    email: 'vidyadhar.shastri@vedas.org',
    languages: ['Sanskrit', 'Hindi', 'Bengali', 'English'],
    experienceYears: 24,
    rating: 4.9,
    isKycVerified: true,
    availability: 'Available',
    dakshinaRange: '₹3,100 - ₹21,000',
  },
  {
    id: 'pur-02',
    fullName: 'Acharya Raghavendra Bhattar',
    vidwatTitle: 'Agama Praveena (Tirupati)',
    specializations: ['Sudarshana Havan', 'Sri Sukta Homa', 'Vivah Samskara', 'Pran Pratishtha'],
    vedicBranch: 'Yajurveda',
    city: 'Bengaluru / Varanasi',
    phone: '+91 98450 11992',
    email: 'raghav.bhattar@agama.org',
    languages: ['Sanskrit', 'Telugu', 'Tamil', 'Kannada', 'Hindi'],
    experienceYears: 18,
    rating: 4.8,
    isKycVerified: true,
    availability: 'Available',
    dakshinaRange: '₹5,100 - ₹35,000',
  },
  {
    id: 'pur-03',
    fullName: 'Pt. Debranjan Bhattacharya',
    vidwatTitle: 'Tantradhyapak & Smartha Scholar',
    specializations: ['Chandi Path', 'Kali Puja', 'Pitru Tarpan', 'Upanayanam'],
    vedicBranch: 'Samaveda',
    city: 'Kolkata / Varanasi',
    phone: '+91 98300 77112',
    email: 'debranjan.smartha@gmail.com',
    languages: ['Sanskrit', 'Bengali', 'Hindi'],
    experienceYears: 15,
    rating: 4.9,
    isKycVerified: true,
    availability: 'Available',
    dakshinaRange: '₹2,500 - ₹15,000',
  },
];

export const INITIAL_PITRU_RECORDS: PitruRecord[] = [
  {
    id: 'pit-01',
    workspaceId: 'ws-mandir',
    devoteeName: 'Sri Rameshwar Shastri',
    ancestorName: 'Late Pt. Vishwanath Shastri (Father)',
    relationship: 'Father (Pitru)',
    tithiLunar: 'Ashwin Krishna Ashtami',
    paksha: 'Krishna',
    deathGregorianDate: '1998-10-14',
    gotra: 'Shandilya',
    annualShradhAlert: true,
    pindaDaanBooked: true,
    contactPhone: '+91 98765 11223',
  },
  {
    id: 'pit-02',
    workspaceId: 'ws-mandir',
    devoteeName: 'Smt. Gayatri Devi Sharma',
    ancestorName: 'Late Smt. Kausalya Devi (Mother-in-law)',
    relationship: 'Mother-in-law (Sasu Mata)',
    tithiLunar: 'Bhadrapada Shukla Trayodashi',
    paksha: 'Shukla',
    deathGregorianDate: '2015-09-26',
    gotra: 'Kashyapa',
    annualShradhAlert: true,
    pindaDaanBooked: false,
    contactPhone: '+91 98220 33445',
  },
];

export const INITIAL_COWS: GoshalaCowRecord[] = [
  {
    id: 'cow-01',
    workspaceId: 'ws-goshala',
    cowTagId: 'GIR-108',
    name: 'Gomata Nandini (Pure Gir)',
    breed: 'Gir',
    gender: 'Gomata',
    dateOfBirth: '2019-03-12',
    healthStatus: 'Lactating',
    dailyMilkYieldLiters: 14,
    adoptedByDevotee: 'Sri Rameshwar Shastri',
    monthlyAdoptionFee: 3500,
    lastVetCheckup: '2026-08-15',
    notes: 'Very gentle nature. Used for Mandir Panchamrit abhishek.',
  },
  {
    id: 'cow-02',
    workspaceId: 'ws-goshala',
    cowTagId: 'SAH-204',
    name: 'Gomata Surabhi (Sahiwal)',
    breed: 'Sahiwal',
    gender: 'Gomata',
    dateOfBirth: '2020-07-20',
    healthStatus: 'Pregnant',
    dailyMilkYieldLiters: 12,
    adoptedByDevotee: 'Sri Vikramaditya Rathore',
    monthlyAdoptionFee: 3500,
    lastVetCheckup: '2026-08-18',
    notes: 'Expected delivery in Kartika month. Special fodder provided.',
  },
  {
    id: 'cow-03',
    workspaceId: 'ws-goshala',
    cowTagId: 'NAN-301',
    name: 'Nandi Bhagwan Dharma (Kankrej Bull)',
    breed: 'Kankrej',
    gender: 'Nandi',
    dateOfBirth: '2018-01-05',
    healthStatus: 'Excellent',
    lastVetCheckup: '2026-08-10',
    notes: 'Majestic bull leading the daily Vrindavan Parikrama seva.',
  },
];

export const INITIAL_ANNADANAM: AnnadanamSponsorship[] = [
  {
    id: 'ann-01',
    workspaceId: 'ws-mandir',
    sponsorName: 'Rathore Foundation',
    phone: '+91 94140 77889',
    occasion: 'Sri Krishna Janmashtami Mahabhandara',
    date: '2026-08-28',
    mealType: 'Mahaprasad Lunch',
    devoteeCountProjected: 2500,
    contributionAmount: 75000,
    specialSankalp: 'For the well-being of all Sanatan followers.',
  },
  {
    id: 'ann-02',
    workspaceId: 'ws-mandir',
    sponsorName: 'Banerjee Family (Kolkata)',
    phone: '+91 93310 44556',
    occasion: 'Grandfather 80th Birth Anniversary',
    date: '2026-09-02',
    mealType: 'Bhandara Dinner',
    devoteeCountProjected: 500,
    contributionAmount: 21000,
  },
];

export const INITIAL_ROOMS: AshramKutirRoom[] = [
  {
    id: 'room-101',
    workspaceId: 'ws-ashram',
    roomNumber: 'Kutir 101 (Ganga View)',
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
    title: 'Sri Kashi Shivalaya Grand Garbhagriha Renovation',
    category: 'Mandir Nirman',
    targetAmount: 5000000,
    collectedAmount: 3450000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    donorsCount: 420,
    status: 'Active',
    topDonors: [
      { name: 'Sri Vikramaditya Rathore', amount: 500000, city: 'Varanasi' },
      { name: 'Dr. Anand Mahadevan', amount: 250000, city: 'Bengaluru' },
      { name: 'Smt. Gayatri Devi', amount: 65000, city: 'Varanasi' },
    ],
  },
  {
    id: 'cmp-02',
    workspaceId: 'ws-goshala',
    title: 'Surabhi Goshala Solar Water Plant & Fodder Shed',
    category: 'Goshala Expansion',
    targetAmount: 1500000,
    collectedAmount: 1120000,
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    donorsCount: 185,
    status: 'Active',
    topDonors: [
      { name: 'Sri Mohan Lal Yadav', amount: 100000, city: 'Mathura' },
      { name: 'Shri Krishna Bhakt Sangha', amount: 75000, city: 'Delhi' },
    ],
  },
];

export const INITIAL_MATRIMONY: MatrimonyProfile[] = [
  {
    id: 'mat-01',
    fullName: 'Saurabh Shastri (B.Tech, MS Computer Science)',
    gender: 'Male',
    birthDate: '1996-05-18',
    birthTime: '06:45 AM',
    birthPlace: 'Varanasi',
    gotra: 'Shandilya',
    nakshatra: 'Rohini',
    rashi: 'Vrishabha',
    manglikStatus: 'Non-Manglik',
    education: 'MS from US University, Senior Software Engineer',
    profession: 'Software Architect',
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

interface DataContextType {
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
  addDevotee: (devotee: Omit<DevoteeMember, 'id' | 'qrCodeRef' | 'joinedDate'>) => void;
  updateDevotee: (id: string, updates: Partial<DevoteeMember>) => void;
  deleteDevotee: (id: string) => void;
  addFamily: (family: Omit<FamilyHousehold, 'id'>) => void;
  updateVanshavali: (tree: VanshavaliNode) => void;
  addGuest: (guest: Omit<GuestRecord, 'id' | 'visitDate'>) => void;
  promoteGuestToMember: (guestId: string) => void;
  addTreasuryTransaction: (tx: Omit<TreasuryTransaction, 'id' | 'auditVerified'>) => void;
  addAsset: (asset: Omit<AssetRecord, 'id'>) => void;
  updateInventoryStock: (id: string, newStock: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestockedDate'>) => void;
  addPoojaBooking: (booking: Omit<PoojaBooking, 'id' | 'receiptRef' | 'status' | 'paymentStatus'>) => void;
  updatePoojaStatus: (id: string, status: PoojaBooking['status']) => void;
  addCow: (cow: Omit<GoshalaCowRecord, 'id'>) => void;
  adoptCow: (cowId: string, sponsorName: string, sponsorGotra?: string, sponsorPhone?: string) => void;
  addAnnadanam: (ann: Omit<AnnadanamSponsorship, 'id'>) => void;
  addResolution: (res: Omit<TrusteeResolution, 'id'>) => void;
  addShift: (shift: Omit<SevadarDutyShift, 'id'>) => void;
  addCampaignDonation: (campaignId: string, donorName: string, amount: number, city: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeWorkspace, currentRole } = useAuthWorkspace();
  const { showToast } = useToast();

  const [devotees, setDevotees] = useState<DevoteeMember[]>(() => {
    const s = localStorage.getItem('sb_devotees');
    return s ? JSON.parse(s) : INITIAL_DEVOTEES;
  });

  const [families, setFamilies] = useState<FamilyHousehold[]>(() => {
    const s = localStorage.getItem('sb_families');
    return s ? JSON.parse(s) : INITIAL_FAMILIES;
  });

  const [vanshavali, setVanshavali] = useState<VanshavaliNode>(() => {
    const s = localStorage.getItem('sb_vanshavali');
    return s ? JSON.parse(s) : INITIAL_VANSHAVALI;
  });

  const [guests, setGuests] = useState<GuestRecord[]>(() => {
    const s = localStorage.getItem('sb_guests');
    return s ? JSON.parse(s) : INITIAL_GUESTS;
  });

  const [treasury, setTreasury] = useState<TreasuryTransaction[]>(() => {
    const s = localStorage.getItem('sb_treasury');
    return s ? JSON.parse(s) : INITIAL_TREASURY;
  });

  const [assets, setAssets] = useState<AssetRecord[]>(() => {
    const s = localStorage.getItem('sb_assets');
    return s ? JSON.parse(s) : INITIAL_ASSETS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const s = localStorage.getItem('sb_inventory');
    return s ? JSON.parse(s) : INITIAL_INVENTORY;
  });

  const [poojaBookings, setPoojaBookings] = useState<PoojaBooking[]>(() => {
    const s = localStorage.getItem('sb_pooja_bookings');
    return s ? JSON.parse(s) : INITIAL_POOJA_BOOKINGS;
  });

  const [residentPujas] = useState<ResidentPujaSchedule[]>(INITIAL_RESIDENT_PUJAS);
  const [purohits] = useState<PurohitProfile[]>(INITIAL_PUROHIT_MARKET);
  const [pitruRecords] = useState<PitruRecord[]>(INITIAL_PITRU_RECORDS);
  const [cows, setCows] = useState<GoshalaCowRecord[]>(INITIAL_COWS);
  const [annadanamList, setAnnadanamList] = useState<AnnadanamSponsorship[]>(INITIAL_ANNADANAM);
  const [rooms] = useState<AshramKutirRoom[]>(INITIAL_ROOMS);
  const [gurukulStudents] = useState<GurukulStudent[]>(INITIAL_GURUKUL_STUDENTS);
  const [campaigns, setCampaigns] = useState<CampaignCrowdfund[]>(INITIAL_CAMPAIGNS);
  const [matrimonyProfiles] = useState<MatrimonyProfile[]>(INITIAL_MATRIMONY);
  const [shlokas] = useState<ShlokaCardItem[]>(INITIAL_SHLOKAS);
  const [resolutions, setResolutions] = useState<TrusteeResolution[]>(INITIAL_RESOLUTIONS);
  const [shifts, setShifts] = useState<SevadarDutyShift[]>(INITIAL_SHIFTS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sb_devotees', JSON.stringify(devotees));
  }, [devotees]);

  useEffect(() => {
    localStorage.setItem('sb_families', JSON.stringify(families));
  }, [families]);

  useEffect(() => {
    localStorage.setItem('sb_treasury', JSON.stringify(treasury));
  }, [treasury]);

  useEffect(() => {
    localStorage.setItem('sb_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('sb_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('sb_pooja_bookings', JSON.stringify(poojaBookings));
  }, [poojaBookings]);

  // Methods
  const addDevotee = (data: Omit<DevoteeMember, 'id' | 'qrCodeRef' | 'joinedDate'>) => {
    const id = `dev-${Date.now()}`;
    const newMember: DevoteeMember = {
      ...data,
      id,
      qrCodeRef: `QR-SB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      joinedDate: new Date().toISOString().slice(0, 10),
    };
    setDevotees((prev) => [newMember, ...prev]);

    trackSignUp({
      memberId: id,
      gotra: newMember.gotra,
      sevaTier: newMember.sevaTier,
      workspaceType: activeWorkspace.type,
      workspaceId: activeWorkspace.id,
    });

    showToast(`New member ${newMember.fullName} enrolled successfully. PIN: ${newMember.pin}`, 'success', 'Member Registered');
  };

  const updateDevotee = (id: string, updates: Partial<DevoteeMember>) => {
    setDevotees((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Devotee profile updated', 'success');
  };

  const deleteDevotee = (id: string) => {
    setDevotees((prev) => prev.filter((d) => d.id !== id));
    showToast('Record removed from directory', 'info');
  };

  const addFamily = (family: Omit<FamilyHousehold, 'id'>) => {
    const id = `fam-${Date.now()}`;
    setFamilies((prev) => [{ ...family, id }, ...prev]);
    showToast(`Household "${family.familyName}" recorded`, 'success');
  };

  const updateVanshavali = (tree: VanshavaliNode) => {
    setVanshavali(tree);
    localStorage.setItem('sb_vanshavali', JSON.stringify(tree));
    showToast('Vanshavali lineage updated', 'success');
  };

  const addGuest = (guest: Omit<GuestRecord, 'id' | 'visitDate'>) => {
    const id = `gst-${Date.now()}`;
    const newGuest: GuestRecord = {
      ...guest,
      id,
      visitDate: new Date().toISOString().slice(0, 10),
    };
    setGuests((prev) => [newGuest, ...prev]);

    trackGenerateLead({
      leadName: guest.name,
      purpose: guest.purpose,
      city: guest.city,
      workspaceType: activeWorkspace.type,
      workspaceId: activeWorkspace.id,
    });

    showToast(`Visitor ${guest.name} added to pipeline`, 'success');
  };

  const promoteGuestToMember = (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId);
    if (!guest) return;

    addDevotee({
      workspaceId: activeWorkspace.id,
      fullName: guest.name,
      phone: guest.phone,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
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

    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, status: 'Promoted' as const } : g))
    );
    showToast(`Guest ${guest.name} promoted to enrolled Member!`, 'success');
  };

  const addTreasuryTransaction = (tx: Omit<TreasuryTransaction, 'id' | 'auditVerified'>) => {
    const id = `tx-${Date.now()}`;
    const newTx: TreasuryTransaction = {
      ...tx,
      id,
      auditVerified: true,
      taxReceiptNumber: tx.is80GEligible ? `SB-80G-${new Date().getFullYear()}-${id.slice(-4)}` : undefined,
    };
    setTreasury((prev) => [newTx, ...prev]);

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
        setDevotees((prev) =>
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
  };

  const addAsset = (asset: Omit<AssetRecord, 'id'>) => {
    const id = `ast-${Date.now()}`;
    setAssets((prev) => [{ ...asset, id }, ...prev]);
    showToast(`Asset "${asset.name}" added to ledger`, 'success');
  };

  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, currentStock: newStock, lastRestockedDate: new Date().toISOString().slice(0, 10) }
          : item
      )
    );
    showToast('Inventory stock balance updated', 'success');
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastRestockedDate'>) => {
    const id = `inv-${Date.now()}`;
    setInventory((prev) => [
      { ...item, id, lastRestockedDate: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    showToast(`Item "${item.itemName}" added to store`, 'success');
  };

  const addPoojaBooking = (
    booking: Omit<PoojaBooking, 'id' | 'receiptRef' | 'status' | 'paymentStatus'>
  ) => {
    const id = `pb-${Date.now()}`;
    const newBooking: PoojaBooking = {
      ...booking,
      id,
      receiptRef: `RCP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: 'Confirmed',
      paymentStatus: 'Paid',
    };
    setPoojaBookings((prev) => [newBooking, ...prev]);

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
  };

  const updatePoojaStatus = (id: string, status: PoojaBooking['status']) => {
    setPoojaBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    showToast(`Pooja status updated to ${status}`, 'success');
  };

  const addCow = (cow: Omit<GoshalaCowRecord, 'id'>) => {
    const id = `cow-${Date.now()}`;
    setCows((prev) => [{ ...cow, id }, ...prev]);
    showToast(`Gomata/Nandi record added: ${cow.name}`, 'success');
  };

  const adoptCow = (cowId: string, sponsorName: string, sponsorGotra?: string, sponsorPhone?: string) => {
    setCows((prev) =>
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

  const addAnnadanam = (ann: Omit<AnnadanamSponsorship, 'id'>) => {
    const id = `ann-${Date.now()}`;
    setAnnadanamList((prev) => [{ ...ann, id }, ...prev]);
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
  };

  const addResolution = (res: Omit<TrusteeResolution, 'id'>) => {
    const id = `res-${Date.now()}`;
    setResolutions((prev) => [{ ...res, id }, ...prev]);
    showToast(`Resolution ${res.resolutionNumber} saved to governance ledger`, 'success');
  };

  const addShift = (shift: Omit<SevadarDutyShift, 'id'>) => {
    const id = `shf-${Date.now()}`;
    setShifts((prev) => [{ ...shift, id }, ...prev]);
    showToast(`Sevadar shift assigned for ${shift.sevadarName}`, 'success');
  };

  const addCampaignDonation = (campaignId: string, donorName: string, amount: number, city: string) => {
    setCampaigns((prev) =>
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
