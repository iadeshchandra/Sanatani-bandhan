export type WorkspaceType =
  | 'Mandir'
  | 'Goshala'
  | 'Sangha'
  | 'Ashram'
  | 'Gurukul'
  | 'Satsang'
  | 'Yoga'
  | 'Trust'
  | 'Tirth'
  | 'Samaj'
  | 'AkshayaPatra'
  | 'KashiKshetra'
  | 'DharmadaTrust'
  | 'MahotsavSamiti'
  | 'PurohitSabha';

export type UserRole =
  | 'superadmin'
  | 'trustee'
  | 'accountant'
  | 'purohit'
  | 'volunteer'
  | 'devotee'
  | 'manager'
  | 'head_admin'
  | 'master_admin'
  | 'anonymous';

export type AppLanguage = 'en' | 'bn' | 'hi';

export type SevaTier = 'Ratna' | 'Vishesh' | 'Kormi' | 'Sadharan';

export interface IngestedDevoteeRow {
  fullName: string;
  phone: string;
  gotra: string;
  sevaTier?: SevaTier;
  address?: string;
  pin?: string;
  email?: string;
  activeStatus?: 'Active' | 'Inactive' | 'Patron';
}

export interface PanchangDetails {
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  vaara: string;
  rahuKaal: string;
  abhijitMuhurat: string;
  samvat: string;
  shaka: string;
  masa: string;
  ritu?: string;
}

export type CowRecord = GoshalaCowRecord;

export type PoojaBookingRecord = PoojaBooking;

export interface WorkspaceConfig {
  id: string;
  name: string;
  type: WorkspaceType;
  tagline: string;
  address: string;
  city: string;
  state: string;
  country: string;
  currency: string;
  currencySymbol: string;
  phone: string;
  email: string;
  sampradaya: string;
  kuladevata: string;
  logoBase64?: string;
  taxExemptionNumber?: string; // 80G / 12A
  trustRegNumber?: string;
  pinRequired: boolean;
  adminPin: string;
}

export interface DevoteeMember {
  id: string;
  workspaceId: string;
  fullName: string;
  spiritualName?: string;
  phone: string;
  email?: string;
  pin: string; // 4-digit PIN for self login
  role: UserRole;
  sevaIndex: number; // 0 - 1000
  sevaTier: SevaTier;
  gotra: string;
  pravara?: string;
  varnaKul?: string;
  familyId?: string;
  isHeadOfFamily?: boolean;
  avatarBase64?: string;
  photoBase64?: string;
  address: string;
  birthDate?: string;
  anniversaryDate?: string;
  dikshaGuru?: string;
  dikshaDate?: string;
  activeStatus: 'Active' | 'Inactive' | 'Patron';
  totalDonated: number;
  volunteerHours: number;
  qrCodeRef: string;
  joinedDate: string;
}

export interface FamilyHousehold {
  id: string;
  workspaceId: string;
  familyName: string;
  kartaDevoteeId: string;
  gotra: string;
  kuladevata: string;
  residenceAddress: string;
  contactPhone: string;
  memberIds: string[];
  totalFamilyDonations: number;
  lastChandaDate?: string;
  notes?: string;
}

export interface VanshavaliNode {
  id: string;
  name: string;
  generation: number;
  gotra: string;
  birthYear?: string;
  deathYear?: string;
  relation: string;
  spouse?: string;
  location?: string;
  notes?: string;
  children?: VanshavaliNode[];
}

export interface GuestRecord {
  id: string;
  workspaceId: string;
  name: string;
  phone: string;
  city: string;
  purpose: 'Darshan' | 'Pooja Inquiry' | 'Volunteer' | 'Guest' | 'Sponsorship' | string;
  visitDate: string;
  referredBy?: string;
  status: 'Lead' | 'Follow-Up' | 'Promoted' | 'Visited' | string;
  assignedSevadar?: string;
  notes?: string;
}

export interface TreasuryTransaction {
  id: string;
  workspaceId: string;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  subcategory?: string;
  amount: number;
  handledBy: string; // Custody tracking
  devoteeId?: string;
  devoteeName?: string;
  paymentMode: 'UPI / QR' | 'Cash' | 'Bank Transfer' | 'Cheque' | 'Card' | string;
  referenceNo?: string;
  memoImageBase64?: string; // Zero-cost compressed image
  purpose: string;
  is80GEligible?: boolean;
  taxReceiptIssued?: boolean;
  taxReceiptNumber?: string;
  auditVerified: boolean;
}

export interface AssetRecord {
  id: string;
  workspaceId: string;
  name: string;
  category: 'Land & Building' | 'Deity Ornaments & Gold' | 'Vahan / Vehicle' | 'Electronics' | 'Utensils & Furniture' | 'Sacred Relics' | 'Utensils & Bhandara' | 'Other' | string;
  valuation: number;
  acquisitionDate: string;
  condition: 'Pristine' | 'Good' | 'Needs Restoration' | 'Under Maintenance' | 'Retired' | 'Needs Repair' | string;
  custodian: string;
  location: string;
  donorName?: string;
  imageCompressed?: string;
}

export interface InventoryItem {
  id: string;
  workspaceId: string;
  itemName: string;
  category: 'Ghee & Oils' | 'Camphor & Dhoop' | 'Rice & Grains' | 'Prasad Supplies' | 'Books & Stationery' | 'Medical / Fodder' | 'Spices & Dry Fruits' | 'General Stores' | string;
  currentStock: number;
  unit: 'kg' | 'liters' | 'packets' | 'boxes' | 'pieces' | 'quintals' | string;
  minReorderLevel: number;
  costPerUnit: number;
  lastRestockedDate: string;
  supplierName: string;
}

export interface PoojaBooking {
  id: string;
  workspaceId: string;
  devoteeId?: string;
  devoteeName: string;
  phone?: string;
  poojaName: string;
  tithiDate?: string;
  bookingDate?: string;
  timeSlot: string;
  gotra: string;
  nakshatra?: string;
  rashi?: string;
  sankalpDescription?: string;
  sankalpText?: string;
  purohitAssigned?: string;
  priestAssigned?: string;
  liveStreamUrl?: string;
  dakshinaAmount: number;
  status: 'Confirmed' | 'Completed' | 'Standby' | 'Cancelled' | string;
  paymentStatus: 'Paid' | 'Pending' | string;
  receiptRef: string;
}

export interface ResidentPujaSchedule {
  id: string;
  workspaceId: string;
  ritualName: string;
  time: string;
  priestName: string;
  deity: string;
  samagriList: string[];
  isOpenForPublic: boolean;
}

export interface PurohitProfile {
  id: string;
  fullName: string;
  vidwatTitle: string; // e.g. Veda Murthy, Jyotishacharya, Shastri
  specializations: string[];
  vedicBranch: 'Rigveda' | 'Yajurveda' | 'Samaveda' | 'Atharvaveda' | 'Smartha' | 'Tantrik';
  city: string;
  phone: string;
  email: string;
  languages: string[];
  experienceYears: number;
  rating: number;
  isKycVerified: boolean;
  availability: 'Available' | 'On Call' | 'Traveling';
  dakshinaRange: string;
}

export interface PitruRecord {
  id: string;
  workspaceId: string;
  devoteeId?: string;
  devoteeName: string;
  ancestorName: string;
  relationship: string;
  tithiLunar: string; // e.g. Bhadrapada Krishna Ashtami
  paksha: 'Shukla' | 'Krishna';
  deathGregorianDate?: string;
  gotra: string;
  annualShradhAlert: boolean;
  pindaDaanBooked: boolean;
  contactPhone: string;
}

export interface GoshalaCowRecord {
  id: string;
  workspaceId: string;
  cowTagId?: string;
  tagNumber?: string;
  name: string;
  breed: 'Gir' | 'Sahiwal' | 'Tharparkar' | 'Rathi' | 'Kankrej' | 'Red Sindhi' | 'Desi Indigenous' | string;
  gender: 'Gomata' | 'Nandi' | 'Calf (Female)' | 'Calf (Male)' | 'Gau Mata (Cow)' | 'Nandi (Bull)' | 'Vatsa (Calf)' | string;
  dateOfBirth?: string;
  ageYears?: number;
  healthStatus: 'Excellent' | 'Under Treatment' | 'Pregnant' | 'Lactating' | 'Retired' | 'Healthy' | 'Under Veterinary Care' | 'Critical' | string;
  lactationStage?: 'Lactating' | 'Dry' | 'Pregnant' | 'Calf' | string;
  dailyMilkYieldLiters?: number;
  dailyMilkLiters?: number;
  adoptedByDevotee?: string;
  adoptionSponsor?: string;
  sponsorGotra?: string;
  sponsorPhone?: string;
  monthlyAdoptionFee?: number;
  monthlyCareCost?: number;
  adoptionStartDate?: string;
  lastVetCheckup?: string;
  notes?: string;
}

export interface AnnadanamSponsorship {
  id: string;
  workspaceId: string;
  sponsorName: string;
  phone: string;
  occasion: string;
  date: string;
  mealType: 'Mahaprasad Lunch' | 'Bhandara Dinner' | 'Morning Bal Bhog';
  devoteeCountProjected: number;
  contributionAmount: number;
  specialSankalp?: string;
}

export interface AshramKutirRoom {
  id: string;
  workspaceId: string;
  roomNumber: string;
  roomType: 'Sadhana Kutir' | 'Dharamshala Deluxe' | 'Family Suite' | 'Dormitory Bed';
  capacity: number;
  isOccupied: boolean;
  currentGuestName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  suggestedDonationPerDay: number;
  cleaningStatus: 'Ready' | 'Needs Cleaning' | 'Maintenance';
}

export interface GurukulStudent {
  id: string;
  workspaceId: string;
  studentName: string;
  rollNo: string;
  courseLevel: 'Prathama (Grammar)' | 'Madhyama (Shastras)' | 'Shastri (Philosophy)' | 'Acharya (Vedanta)';
  sandhyaVandanaRegularity: number; // percentage
  shlokaRecitationScore: number;
  guardianName: string;
  guardianPhone: string;
  dateOfUpanayanam?: string;
  attendancePct: number;
}

export interface CampaignCrowdfund {
  id: string;
  workspaceId: string;
  title: string;
  category: 'Mandir Nirman' | 'Murti Pran Pratishtha' | 'Goshala Expansion' | 'Annakshetra Fund' | 'Festival Mahotsav';
  targetAmount: number;
  collectedAmount: number;
  startDate: string;
  endDate: string;
  donorsCount: number;
  status: 'Active' | 'Completed' | 'Upcoming';
  topDonors: { name: string; amount: number; city: string }[];
}

export interface MatrimonyProfile {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female';
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  gotra: string;
  nakshatra: string;
  rashi: string;
  manglikStatus: 'Manglik' | 'Non-Manglik' | 'Anshik Manglik';
  education: string;
  profession: string;
  location: string;
  familyBackground: string;
  contactFamilyPerson: string;
  contactPhone: string;
  verified: boolean;
  photoMasked: boolean;
}

export interface PanjikaFestival {
  id: string;
  festivalName: string;
  festivalNameHi: string;
  festivalNameBn: string;
  dateGregorian: string;
  tithi: string;
  nakshatra: string;
  rituals: string;
  significance: string;
  fastingRecommended: boolean;
  auspiciousMuhurat: string;
}

export interface ShlokaCardItem {
  id: string;
  sanskrit: string;
  transliteration: string;
  source: string;
  englishMeaning: string;
  hindiMeaning: string;
  bengaliMeaning: string;
  audioUrl?: string;
  category: 'Karma Yoga' | 'Bhakti' | 'Jnana' | 'Dharma' | 'Peace & Harmony';
}

export interface TrusteeResolution {
  id: string;
  workspaceId: string;
  resolutionNumber: string;
  date: string;
  title: string;
  proposedBy: string;
  secondedBy: string;
  votesInFavor: number;
  votesAgainst: number;
  status: 'Passed' | 'Pending Review' | 'Deferred' | 'Rejected';
  quorumMet: boolean;
  details: string;
}

export interface SevadarDutyShift {
  id: string;
  workspaceId: string;
  sevadarName: string;
  phone: string;
  role: 'Crowd Control' | 'Prasad Distribution' | 'Shoe Counter' | 'VIP Escort' | 'Sanitation' | 'Kitchen Seva';
  date: string;
  shiftTiming: 'Morning (05:00 - 11:00)' | 'Afternoon (11:00 - 17:00)' | 'Evening (17:00 - 22:00)' | 'Night Vigil';
  attended: boolean;
}

export interface TelemetryEventLog {
  id: string;
  timestamp: string;
  event: string;
  payload: Record<string, any>;
}
