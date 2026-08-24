import React, { createContext, useContext, useState, useEffect } from 'react';
import { useInitialData } from './AppInitializer';
import { set } from 'idb-keyval';
import { DevoteeMember, UserRole, WorkspaceConfig, WorkspaceType } from '../types';

export const INITIAL_WORKSPACES: WorkspaceConfig[] = [
  {
    id: 'ws-mandir',
    name: 'Sri Sanatan Dharma Mandir',
    type: 'Mandir',
    tagline: 'Preserving Sanatan Samskriti & Sacred Darshan',
    address: 'Mandir Marg, Sector 4',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'Bharat (India)',
    currency: 'INR',
    currencySymbol: '₹',
    phone: '+91 98765 43210',
    email: 'seva@sanatanmandir.org',
    sampradaya: 'Smartha / Advaita Vedanta',
    kuladevata: 'Sri Kashi Vishwanath & Mata Annapurna',
    taxExemptionNumber: 'CIT(E)/80G/VAR-2024-991',
    trustRegNumber: 'TR/VNS/7762/2012',
    pinRequired: true,
    adminPin: '1008',
  },
  {
    id: 'ws-goshala',
    name: 'Surabhi Gau Seva Dham',
    type: 'Goshala',
    tagline: 'Sanctuary for 500+ Indigenous Desi Gir & Sahiwal Gomata',
    address: 'Govardhan Parikrama Marg',
    city: 'Vrindavan',
    state: 'Uttar Pradesh',
    country: 'Bharat (India)',
    currency: 'INR',
    currencySymbol: '₹',
    phone: '+91 98111 22334',
    email: 'gauseva@surabhidham.org',
    sampradaya: 'Gaudiya Vaishnava',
    kuladevata: 'Sri Radha Damodar & Kamadhenu',
    taxExemptionNumber: 'CIT(E)/80G/VRN-8821',
    trustRegNumber: 'TR/VRN/1109/2015',
    pinRequired: true,
    adminPin: '1008',
  },
  {
    id: 'ws-sangha',
    name: 'Bharat Dharma Raksha Sangha',
    type: 'Sangha',
    tagline: 'Youth Character Building, Shakha Discipline & Dharma Seva',
    address: 'Shivaji Marg, Keshav Kunj',
    city: 'Nagpur',
    state: 'Maharashtra',
    country: 'Bharat (India)',
    currency: 'INR',
    currencySymbol: '₹',
    phone: '+91 94220 55667',
    email: 'karyalaya@dharmasangha.in',
    sampradaya: 'Sanatan Rashtra Dharma',
    kuladevata: 'Bhagwan Sri Ramachandra',
    taxExemptionNumber: 'CIT(E)/80G/NGP-4402',
    trustRegNumber: 'TR/NGP/5501/2008',
    pinRequired: true,
    adminPin: '1008',
  },
  {
    id: 'ws-ashram',
    name: 'Ananda Kutir Spiritual Ashram',
    type: 'Ashram',
    tagline: 'Silent Meditation, Sadhana Retreats & Vedanta Study',
    address: 'Tapovan, Muni Ki Reti',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'Bharat (India)',
    currency: 'INR',
    currencySymbol: '₹',
    phone: '+91 97566 88990',
    email: 'sadhana@anandakutir.org',
    sampradaya: 'Dashanami Sannyasa',
    kuladevata: 'Mata Ganga & Lord Shiva',
    taxExemptionNumber: 'CIT(E)/80G/RSH-3312',
    trustRegNumber: 'TR/UK/9921/2001',
    pinRequired: true,
    adminPin: '1008',
  },
  {
    id: 'ws-gurukul',
    name: 'Sandipani Veda Vidyapeeth',
    type: 'Gurukul',
    tagline: 'Reviving Vedic Recitation, Grammar, Nyaya & Shastras',
    address: 'Narmada Ghat Road',
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    country: 'Bharat (India)',
    currency: 'INR',
    currencySymbol: '₹',
    phone: '+91 94066 33221',
    email: 'acharyas@sandipanigurukul.edu.in',
    sampradaya: 'Shukla Yajurveda Madhyandina',
    kuladevata: 'Bhagwan Mahakaleshwar & Saraswati Devi',
    taxExemptionNumber: 'CIT(E)/80G/UJN-6611',
    trustRegNumber: 'TR/MP/8834/2010',
    pinRequired: true,
    adminPin: '1008',
  },
  {
    id: 'ws-satsang',
    name: 'Sri Krishna Chaitanya Satsang Kendra',
    type: 'Satsang',
    tagline: 'Harinam Sankirtan & Shrimad Bhagavatam Kathas',
    address: 'Mayapur Road',
    city: 'Nabadwip',
    state: 'West Bengal',
    country: 'Bharat (India)',
    currency: 'INR',
    currencySymbol: '₹',
    phone: '+91 93322 11445',
    email: 'satsang@mayapurkendra.org',
    sampradaya: 'Gaudiya Sampradaya',
    kuladevata: 'Sri Chaitanya Mahaprabhu',
    taxExemptionNumber: 'CIT(E)/80G/WB-4509',
    trustRegNumber: 'TR/WB/3321/2016',
    pinRequired: true,
    adminPin: '1008',
  },
  {
    id: 'ws-yoga',
    name: 'Patanjali Yogashala & Wellness Kendra',
    type: 'Yoga',
    tagline: 'Authentic Ashtanga Yoga, Pranayama & Holistic Healing',
    address: 'Chamundi Hill Road',
    city: 'Mysuru',
    state: 'Karnataka',
    country: 'Bharat (India)',
    currency: 'INR',
    currencySymbol: '₹',
    phone: '+91 98450 77112',
    email: 'info@patanjaliyogashala.org',
    sampradaya: 'Patanjali Yoga Darshana',
    kuladevata: 'Bhagwan Adiyogi Shiva & Patanjali Muni',
    taxExemptionNumber: 'CIT(E)/80G/MYS-1002',
    trustRegNumber: 'TR/KA/7711/2014',
    pinRequired: true,
    adminPin: '1008',
  },
  {
    id: 'ws-trust',
    name: 'Dharma Jagriti Seva Trust',
    type: 'Trust',
    tagline: 'Disaster Relief, Free Medical Camps & Education Grants',
    address: 'Ring Road, Lajpat Nagar',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'Bharat (India)',
    currency: 'INR',
    currencySymbol: '₹',
    phone: '+91 98100 44556',
    email: 'trust@dharmajagriti.org',
    sampradaya: 'Universal Sanatan Seva',
    kuladevata: 'Bhagwan Sri Hanuman',
    taxExemptionNumber: 'CIT(E)/80G/DEL-9901',
    trustRegNumber: 'TR/DEL/1221/1998',
    pinRequired: true,
    adminPin: '1008',
  },
  {
    id: 'ws-tirth',
    name: 'Sri Somnath Yatri & Tirth Seva Kshetra',
    type: 'Tirth',
    tagline: 'Pilgrim Dharamshala, Pavitra Darshan & Pinda Daan Support',
    address: 'Prabhas Patan',
    city: 'Veraval',
    state: 'Gujarat',
    country: 'Bharat (India)',
    currency: 'INR',
    currencySymbol: '₹',
    phone: '+91 99090 12345',
    email: 'yatri@somnathtirth.org',
    sampradaya: 'Shaiva / Jyotirlinga',
    kuladevata: 'Sri Somnath Mahadev',
    taxExemptionNumber: 'CIT(E)/80G/GUJ-5512',
    trustRegNumber: 'TR/GJ/6612/1951',
    pinRequired: true,
    adminPin: '1008',
  },
  {
    id: 'ws-samaj',
    name: 'Akhil Bharatiya Gaur Brahman Mahasabha',
    type: 'Samaj',
    tagline: 'Community Welfare, Gotra Vivah Bandhan & Samaj Bhawan',
    address: 'Civil Lines, Station Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'Bharat (India)',
    currency: 'INR',
    currencySymbol: '₹',
    phone: '+91 94140 88991',
    email: 'samaj@gaurbrahman.org',
    sampradaya: 'Vaidika Sanatan',
    kuladevata: 'Bhagwan Parashuram',
    taxExemptionNumber: 'CIT(E)/80G/RAJ-2291',
    trustRegNumber: 'TR/RJ/4412/1985',
    pinRequired: true,
    adminPin: '1008',
  },
];

interface AuthWorkspaceContextType {
  workspaces: WorkspaceConfig[];
  activeWorkspace: WorkspaceConfig;
  currentRole: UserRole;
  currentDevotee: DevoteeMember | null;
  currentUser?: { id: string; name: string; role: UserRole };
  isAuthenticated: boolean;
  switchWorkspace: (workspaceId: string) => void;
  updateWorkspaceType: (newType: WorkspaceType) => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUserRole?: (role: UserRole) => void;
  loginWithPin: (pin: string, devoteeList: DevoteeMember[]) => boolean;
  loginAsRole: (role: UserRole, customName?: string) => void;
  logout: () => void;
  saveCustomLogo: (base64: string) => void;
  updateWorkspaceDetails: (updates: Partial<WorkspaceConfig>) => void;
  addWorkspace: (workspace: WorkspaceConfig) => void;
}

const AuthWorkspaceContext = createContext<AuthWorkspaceContextType | undefined>(undefined);

export const AuthWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialData = useInitialData();
  const [workspaces, setWorkspaces] = useState<WorkspaceConfig[]>(() => {
    return initialData.sanatani_workspaces || INITIAL_WORKSPACES;
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    return initialData.sanatani_active_workspace_id || 'ws-mandir';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return initialData.sanatani_user_role || 'head_admin';
  });

  const [currentDevotee, setCurrentDevotee] = useState<DevoteeMember | null>(() => {
    return initialData.sanatani_current_devotee || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Determine if authenticated based on whether we loaded a saved role or devotee
    // If the data was freshly loaded and role exists (which we default to head_admin for demo)
    // Actually, to enforce the 3-tier structure, we should default to false unless explicitly logged in,
    // OR we can check if they have a valid web session saved.
    const sessionStr = localStorage.getItem('sanatani_web_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.role) return true;
      } catch (e) {
        // ignore
      }
    }
    return false;
  });

  // Sync to localStorage
  useEffect(() => {
    set('sanatani_workspaces', workspaces);
  }, [workspaces]);

  useEffect(() => {
    set('sanatani_active_workspace_id', activeWorkspaceId);
    
    if (isAuthenticated) {
      // Keep session object in sync
      localStorage.setItem(
        'sanatani_web_session',
        JSON.stringify({
          communityId: activeWorkspaceId,
          role: currentRole,
          devoteeId: currentDevotee?.id || null,
        })
      );
    } else {
      localStorage.removeItem('sanatani_web_session');
    }
  }, [activeWorkspaceId, currentRole, currentDevotee, isAuthenticated]);

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0] || INITIAL_WORKSPACES[0];

  const switchWorkspace = (workspaceId: string) => {
    const target = workspaces.find((w) => w.id === workspaceId);
    if (target) {
      setActiveWorkspaceId(workspaceId);
    }
  };

  const updateWorkspaceType = (newType: WorkspaceType) => {
    setWorkspaces((prev) =>
      prev.map((w) => {
        if (w.id === activeWorkspaceId) {
          return { ...w, type: newType };
        }
        return w;
      })
    );
  };

  const updateWorkspaceDetails = (updates: Partial<WorkspaceConfig>) => {
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === activeWorkspaceId ? { ...w, ...updates } : w))
    );
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    set('sanatani_user_role', role);
  };

  const loginWithPin = (pin: string, devoteeList: DevoteeMember[]): boolean => {
    // Admin Master Override PIN
    if (pin === '1008' || pin === activeWorkspace.adminPin) {
      setCurrentRole('head_admin');
      setIsAuthenticated(true);
      return true;
    }

    // Match devotee by PIN
    const match = devoteeList.find((d) => d.pin === pin || d.phone.endsWith(pin));
    if (match) {
      setCurrentDevotee(match);
      setCurrentRole(match.role || 'devotee');
      setIsAuthenticated(true);
      set('sanatani_current_devotee', match);
      return true;
    }

    return false;
  };

  const loginAsRole = (role: UserRole, customName?: string) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    if (role === 'devotee') {
      setCurrentDevotee({
        id: 'dev-demo-self',
        workspaceId: activeWorkspaceId,
        fullName: customName || 'Sri Anand Acharya',
        spiritualName: 'Ananda Das',
        phone: '+91 98765 00108',
        email: 'anand@sanatan.org',
        pin: '1008',
        role: 'devotee',
        sevaIndex: 780,
        sevaTier: 'Vishesh',
        gotra: 'Kashyapa',
        pravara: 'Kashyapa, Avatsara, Naidhruva',
        varnaKul: 'Suryavanshi',
        address: 'Bhadra Ghat, Varanasi',
        activeStatus: 'Active',
        totalDonated: 45000,
        volunteerHours: 120,
        qrCodeRef: 'QR-SB-DEV108',
        joinedDate: '2023-01-15',
      });
    } else {
      setCurrentDevotee(null);
    }
  };

  const logout = () => {
    setCurrentRole('devotee');
    setCurrentDevotee(null);
    setIsAuthenticated(false);
    set('sanatani_current_devotee', null);
    localStorage.removeItem('sanatani_web_session');
  };

  const saveCustomLogo = (base64: string) => {
    set(`sb_logo_${activeWorkspaceId}`, base64);
    updateWorkspaceDetails({ logoBase64: base64 });
  };

  const addWorkspace = (newWorkspace: WorkspaceConfig) => {
    setWorkspaces((prev) => {
      const existing = prev.find((w) => w.id === newWorkspace.id);
      if (existing) {
        return prev.map((w) => (w.id === newWorkspace.id ? newWorkspace : w));
      }
      const updated = [...prev, newWorkspace];
      set('sanatani_workspaces', updated);
      return updated;
    });
    setActiveWorkspaceId(newWorkspace.id);
  };

  const currentUser = {
    id: currentDevotee?.id || 'admin-root',
    name: currentDevotee?.fullName || 'Acharya / Trustee Administrator',
    role: currentRole,
  };

  return (
    <AuthWorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        currentRole,
        currentDevotee,
        currentUser,
        isAuthenticated,
        switchWorkspace,
        updateWorkspaceType,
        switchRole,
        updateCurrentUserRole: switchRole,
        loginWithPin,
        loginAsRole,
        logout,
        saveCustomLogo,
        updateWorkspaceDetails,
        addWorkspace,
      }}
    >
      {children}
    </AuthWorkspaceContext.Provider>
  );
};

export const useAuthWorkspace = () => {
  const context = useContext(AuthWorkspaceContext);
  if (!context) {
    throw new Error('useAuthWorkspace must be used within an AuthWorkspaceProvider');
  }
  return context;
};
