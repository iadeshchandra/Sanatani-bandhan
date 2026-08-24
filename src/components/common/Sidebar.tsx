import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Home,
  GitFork,
  UserPlus,
  FileSpreadsheet,
  Landmark,
  Receipt,
  Target,
  Sparkles,
  Layers,
  Package,
  Flame,
  Clock,
  BookOpen,
  Globe,
  HeartHandshake,
  Calendar,
  Utensils,
  Moon,
  GraduationCap,
  Award,
  BookMarked,
  Radio,
  Swords,
  Cross,
  Library,
  Heart,
  CalendarCheck2,
  Vote,
  MessageSquare,
  Image as ImageIcon,
  Scroll,
  Bot,
  Scale,
  Lock,
  UserCheck,
  Settings,
  Compass,
  Megaphone,
  Search,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useLanguage } from '../../context/LanguageContext';

export interface NavItem {
  id: string;
  name: string;
  domain: number;
  domainTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const MODULE_CATALOG: NavItem[] = [
  // Domain 1
  { id: 'dashboard', name: 'Command Center', domain: 1, domainTitle: 'Core Command & CRM', icon: LayoutDashboard },
  { id: 'devotees', name: 'Devotee & Member Directory', domain: 1, domainTitle: 'Core Command & CRM', icon: Users, badge: 'Dynamic' },
  { id: 'family', name: 'Household & Kul Parivar', domain: 1, domainTitle: 'Core Command & CRM', icon: Home },
  { id: 'vanshavali', name: 'Ancestral Lineage (Vanshavali)', domain: 1, domainTitle: 'Core Command & CRM', icon: GitFork },
  { id: 'guests', name: 'Guest & Visitor CRM', domain: 1, domainTitle: 'Core Command & CRM', icon: UserPlus },
  { id: 'bulkImport', name: 'Bulk CSV Ingestion', domain: 1, domainTitle: 'Core Command & CRM', icon: FileSpreadsheet },

  // Domain 2
  { id: 'treasury', name: 'Double-Entry Treasury', domain: 2, domainTitle: 'Financials & Assets', icon: Landmark, badge: 'Auto-Audit' },
  { id: 'taxReceipts', name: 'Tax Certificates (80G/12A)', domain: 2, domainTitle: 'Financials & Assets', icon: Receipt },
  { id: 'campaigns', name: 'Crowdfunding & Mandir Nirman', domain: 2, domainTitle: 'Financials & Assets', icon: Target },
  { id: 'karmaLedger', name: 'Karma Merit & Volunteer Ledger', domain: 2, domainTitle: 'Financials & Assets', icon: Sparkles },
  { id: 'assets', name: 'Fixed Assets & Deity Ornaments', domain: 2, domainTitle: 'Financials & Assets', icon: Layers },
  { id: 'inventory', name: 'Store & Consumables (Bhandara)', domain: 2, domainTitle: 'Financials & Assets', icon: Package },

  // Domain 3
  { id: 'poojaBooking', name: 'Rituals & Sankalp Hub', domain: 3, domainTitle: 'Vedic Rituals & Ephemeris', icon: Flame, badge: 'Purohit Sync' },
  { id: 'mandirPuja', name: 'Daily Aarti & Pujas', domain: 3, domainTitle: 'Vedic Rituals & Ephemeris', icon: Clock },
  { id: 'purohitDesk', name: 'Purohit Diary & Dakshina', domain: 3, domainTitle: 'Vedic Rituals & Ephemeris', icon: BookOpen },
  { id: 'purohitMarket', name: 'Global Scholar Marketplace', domain: 3, domainTitle: 'Vedic Rituals & Ephemeris', icon: Globe, badge: 'KYC Verified' },
  { id: 'pitruShradh', name: 'Pitru Paksha & Shradh Alerts', domain: 3, domainTitle: 'Vedic Rituals & Ephemeris', icon: HeartHandshake },
  { id: 'panchang', name: 'Vedic Panjika & Muhurat', domain: 3, domainTitle: 'Vedic Rituals & Ephemeris', icon: Calendar },

  // Domain 4
  { id: 'goshala', name: 'Goshala Sanctuary & Gomata Records', domain: 4, domainTitle: 'Specialized Desks', icon: Heart, badge: 'Gau Seva' },
  { id: 'annadanam', name: 'Annadanam & Prasad Seva', domain: 4, domainTitle: 'Specialized Desks', icon: Utensils },
  { id: 'ashramKutir', name: 'Ashram Kutir & Sadhana Stays', domain: 4, domainTitle: 'Specialized Desks', icon: Moon },
  { id: 'dharamshala', name: 'Dharamshala Yatri Bhavan', domain: 4, domainTitle: 'Specialized Desks', icon: BuildingIcon },
  { id: 'gurukul', name: 'Gurukul Residential Monitoring', domain: 4, domainTitle: 'Specialized Desks', icon: GraduationCap },
  { id: 'gurukulAcademy', name: 'Shastric Academy & Grading', domain: 4, domainTitle: 'Specialized Desks', icon: Award },
  { id: 'vidyalaya', name: 'Weekend Heritage School', domain: 4, domainTitle: 'Specialized Desks', icon: BookMarked },
  { id: 'satsang', name: 'Satsang, Kirtan & Discourse', domain: 4, domainTitle: 'Specialized Desks', icon: Radio },
  { id: 'sanghaDrills', name: 'Sangha & Shakha Mobilization', domain: 4, domainTitle: 'Specialized Desks', icon: Swords },
  { id: 'sevaTrust', name: 'Humanitarian Seva Trust', domain: 4, domainTitle: 'Specialized Desks', icon: Cross },
  { id: 'granthLibrary', name: 'Sacred Granth & Manuscript Library', domain: 4, domainTitle: 'Specialized Desks', icon: Library },

  // Domain 5
  { id: 'matrimony', name: 'Vivah Bandhan (Dharmic Match)', domain: 5, domainTitle: 'Matrimony & Outreach', icon: Heart, badge: 'Gotra Match' },
  { id: 'utsavPanjika', name: 'Festival Calendar & Gate Passes', domain: 5, domainTitle: 'Matrimony & Outreach', icon: CalendarCheck2 },
  { id: 'panchayatPolls', name: 'Panchayat Voting & Quorum', domain: 5, domainTitle: 'Matrimony & Outreach', icon: Vote },
  { id: 'sandeshBroadcast', name: 'Sandesh WhatsApp/SMS Broadcast', domain: 5, domainTitle: 'Matrimony & Outreach', icon: MessageSquare },
  { id: 'socialWall', name: 'Temple Darshan Wall & Notices', domain: 5, domainTitle: 'Matrimony & Outreach', icon: ImageIcon },
  { id: 'shlokaFeed', name: 'Shloka Wisdom Stream', domain: 5, domainTitle: 'Matrimony & Outreach', icon: Scroll },
  { id: 'dharmaMarketing', name: 'Dharma Marketing AI', domain: 5, domainTitle: 'Matrimony & Outreach', icon: Bot, badge: 'Gemini AI' },

  // Domain 6
  { id: 'trusteeGovernance', name: 'Trustee Board & Governance', domain: 6, domainTitle: 'Governance & Security', icon: Scale },
  { id: 'legalVault', name: 'Encrypted Legal Vault (80G/Deeds)', domain: 6, domainTitle: 'Governance & Security', icon: Lock },
  { id: 'sevadarRoster', name: 'Sevadar Shift Roster', domain: 6, domainTitle: 'Governance & Security', icon: UserCheck },
  { id: 'masterSettings', name: 'Organization Settings & Logos', domain: 6, domainTitle: 'Governance & Security', icon: Settings },
  { id: 'spiritualSettings', name: 'Sampradaya & Kuladevata Config', domain: 6, domainTitle: 'Governance & Security', icon: Compass },
  { id: 'platformBroadcast', name: 'Super Admin Broadcast Notice', domain: 6, domainTitle: 'Governance & Security', icon: Megaphone, badge: 'God Mode' },
];

function BuildingIcon({ className }: { className?: string }) {
  return <Home className={className} />;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: string;
  onSelectModule: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSelectModule,
}) => {
  const { activeWorkspace, currentRole } = useAuthWorkspace();
  const { getTaxonomy } = useLanguage();
  const taxonomy = getTaxonomy(activeWorkspace.type);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModules = useMemo(() => {
    if (!searchTerm.trim()) return MODULE_CATALOG;
    const term = searchTerm.toLowerCase();
    return MODULE_CATALOG.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.domainTitle.toLowerCase().includes(term) ||
        m.id.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const domainGroups = useMemo(() => {
    const groups: { domain: number; title: string; items: NavItem[] }[] = [];
    for (let d = 1; d <= 6; d++) {
      const items = filteredModules.filter((m) => m.domain === d);
      if (items.length > 0) {
        groups.push({
          domain: d,
          title: items[0].domainTitle,
          items,
        });
      }
    }
    return groups;
  }, [filteredModules]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        id="main-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Banner (Mobile Only) */}
        <div className="lg:hidden h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF9933]">Sanatani Bandhan</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Filter for 46 Desks */}
        <div className="px-4 py-4 border-b border-white/5 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              id="sidebar-module-search"
              placeholder="Search 46 desks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/50 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Desks List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 custom-scrollbar">
          {domainGroups.map((group) => (
            <div key={group.domain} className="px-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 block mb-2">
                Domain {group.domain}: {group.title}
              </span>

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  let displayLabel = item.name;

                  // Dynamic Taxonomy morphing for Devotees directory based on workspace
                  if (item.id === 'devotees') {
                    displayLabel = taxonomy.directoryName;
                  }

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        id={`nav-desk-${item.id}`}
                        onClick={() => {
                          onSelectModule(item.id);
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#FF9933]/10 text-[#FF9933] border-l-2 border-[#FF9933] font-semibold'
                            : 'hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-[#FF9933]' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{displayLabel}</span>
                        </div>
                        {item.badge && (
                          <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Daily Shloka Widget */}
        <div className="mt-auto px-6 py-4 border-t border-white/10 shrink-0">
          <div className="p-3 bg-slate-800 rounded-lg text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Daily Shloka</p>
            <p className="text-[11px] font-serif leading-relaxed text-slate-300 italic">
              "Karmanye vadhikaraste ma phaleshu kadachana..."
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
