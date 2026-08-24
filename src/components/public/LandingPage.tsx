import React, { useState } from 'react';
import { 
  ArrowRight, ShieldCheck, Building2, Globe2, HeartHandshake, Sparkles, 
  Menu, X, CheckCircle, Smartphone, Lock, BookOpen, Users, Receipt, Send, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfService } from './TermsOfService';
import { SecurityWhitepaper } from './SecurityWhitepaper';

// Matrix Data
const PAIN_SOLVER_MATRIX = [
  {
    pain: "Tattered & Lost Physical Khatas",
    painDesc: "Paper record books tear, get water-damaged, or take hours to search during festival crowds.",
    solution: "Encrypted Cloud Devotee CRM",
    solutionDesc: "Search thousands of profiles by Name, Phone, Blood Group, or Gotra in milliseconds with offline-first local cache backup."
  },
  {
    pain: "Financial Suspicion & Cash Disputes",
    painDesc: "Missing cash receipts, handwritten calculation errors, and lack of transparency cause committee infighting.",
    solution: "Double-Entry Audited Treasury",
    solutionDesc: "Mandatory 'Handled By' custodian tracking, zero-cost physical memo photo archiving, and instant branded PDF receipts."
  },
  {
    pain: "Exhausting Event Invitation Calls",
    painDesc: "Calling 500+ devotees individually before every Puja, Utsav, or monthly meeting is exhausting.",
    solution: "1-Click Sandesh Broadcasts",
    solutionDesc: "Dispatch automated WhatsApp and SMS alerts for festivals, Tithis, and urgent community announcements with dynamic tags."
  },
  {
    pain: "Sagotra & Fraudulent Matchmaking",
    painDesc: "Commercial dating apps are anonymous, commoditized, and disregard sacred Shastric Gotra rules.",
    solution: "Verified Vivah Bandhan Desk",
    solutionDesc: "Community-backed matrimonial profiles linked directly to real temple registries with automated Gotra exogamy checks."
  },
  {
    pain: "Priest Shortages During Utsavs",
    painDesc: "Temples face severe operational crises when resident Purohits fall ill or when festival crowds surge.",
    solution: "Universal Purohit Marketplace",
    solutionDesc: "B2B standby network allowing temples to discover, verify, and hire certified standby Vedic scholars on-demand."
  },
  {
    pain: "Lost Deity Jewels & Land Encroachment",
    painDesc: "Valuable temple ornaments, silver items, and property deeds lack structured digital documentation.",
    solution: "Asset & Legal Vault",
    solutionDesc: "Encrypted repository for property deeds, 80G/12A certificates, and physical condition tracking for deity vastra."
  },
  {
    pain: "Committee Stalemate & Bias",
    painDesc: "Executive decisions lead to shouting matches and accusations of favoritism.",
    solution: "Panchayat Digital Polls",
    solutionDesc: "Verifiable, decentralized community voting with automated quorum calculations and downloadable consensus certificates."
  }
];

const WORKSPACES = [
  'Mandir', 'Goshala', 'Sangha', 'Ashram', 'Gurukul', 'Satsang', 'Yoga', 'Trust', 'Tirth', 'Samaj'
];

export const LandingPage: React.FC<{ onLoginClick: () => void; onSignupClick: () => void }> = ({
  onLoginClick, onSignupClick
}) => {
  const { language, setLanguage, safeTranslate } = useLanguage();
  const { showToast } = useToast();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Modals
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [tosOpen, setTosOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  // Lead Form State
  const [leadForm, setLeadForm] = useState({
    name: '', phone: '', email: '', orgType: 'Mandir', orgName: '', message: ''
  });

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone || !leadForm.orgName) {
      showToast('Please fill in Name, Phone, and Organization Name.', 'error');
      return;
    }
    // Mock telemetry & submit
    console.log('pushToDataLayer: generate_lead', { org_type: leadForm.orgType, lead_source: 'web_form' });
    showToast('Your inquiry has been received. Our team will contact you shortly.', 'success');
    setLeadForm({ name: '', phone: '', email: '', orgType: 'Mandir', orgName: '', message: '' });
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Pranam! I am interested in onboarding my organization to Sanatani Bandhan ERP.");
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden selection:bg-[#FF9933] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FF9933] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-500/20">
              ॐ
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 hidden sm:block">
              Sanatani<span className="text-[#FF9933]">Bandhan</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm font-semibold text-slate-600 hover:text-[#FF9933]">Features</button>
            <button onClick={() => scrollTo('why-us')} className="text-sm font-semibold text-slate-600 hover:text-[#FF9933]">Why Us</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm font-semibold text-slate-600 hover:text-[#FF9933]">Pricing</button>
            <button onClick={() => scrollTo('faq')} className="text-sm font-semibold text-slate-600 hover:text-[#FF9933]">FAQ</button>
            
            <div className="flex bg-slate-100 rounded-lg p-1">
              {(['en', 'hi', 'bn'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-colors ${language === lang ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button onClick={onLoginClick} className="text-sm font-bold text-slate-700 hover:text-slate-900">
              {safeTranslate('Login', 'Login', 'লগ ইন', 'लॉग इन')}
            </button>
            <button onClick={onSignupClick} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-md">
              Create Free Account
            </button>
          </div>

          <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl flex flex-col p-4 gap-4">
            <button onClick={() => scrollTo('features')} className="text-left font-semibold text-slate-700 py-2">Features</button>
            <button onClick={() => scrollTo('why-us')} className="text-left font-semibold text-slate-700 py-2">Why Us</button>
            <button onClick={() => scrollTo('pricing')} className="text-left font-semibold text-slate-700 py-2">Pricing</button>
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button onClick={onLoginClick} className="flex-1 py-3 text-center border-2 border-slate-200 rounded-xl font-bold text-slate-700">Login</button>
              <button onClick={onSignupClick} className="flex-1 py-3 text-center bg-[#FF9933] rounded-xl font-bold text-white">Sign Up</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-[#FF9933]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" />
              Enterprise Grade ERP
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              From Paper Registers to a <span className="text-[#FF9933]">Unified Digital Workspace.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              Unify your Mandir, Goshala, or Ashram operations with military-grade security. Manage devotees, treasuries, 80G receipts, and daily Seva through 46+ specialized Shastric modules.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button onClick={onSignupClick} className="w-full sm:w-auto px-8 py-4 bg-[#FF9933] hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => scrollTo('features')} className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                Watch System Demo
              </button>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
              <div>
                <p className="text-2xl font-extrabold text-slate-900">14,500+</p>
                <p className="text-xs text-slate-500 font-medium">Verified Profiles</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">₹12Cr+</p>
                <p className="text-xs text-slate-500 font-medium">Donations Audited</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">450+</p>
                <p className="text-xs text-slate-500 font-medium">Active Temples</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-2xl">
            <div className="aspect-[4/3] rounded-2xl bg-slate-900 p-2 shadow-2xl shadow-slate-900/20 border border-slate-800 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-orange-500/20 opacity-50" />
               <div className="w-full h-full rounded-xl bg-slate-50 border border-slate-800 flex flex-col overflow-hidden relative z-10">
                 <div className="h-10 border-b border-slate-200 bg-white flex items-center px-4 gap-4">
                   <div className="w-3 h-3 rounded-full bg-rose-500" />
                   <div className="w-3 h-3 rounded-full bg-amber-500" />
                   <div className="w-3 h-3 rounded-full bg-emerald-500" />
                 </div>
                 <div className="flex-1 p-4 flex gap-4">
                   <div className="w-32 hidden sm:flex flex-col gap-2">
                     <div className="h-4 bg-slate-200 rounded w-full" />
                     <div className="h-4 bg-slate-200 rounded w-3/4" />
                     <div className="h-4 bg-slate-200 rounded w-5/6" />
                   </div>
                   <div className="flex-1 flex flex-col gap-4">
                     <div className="flex gap-2">
                       <div className="h-20 bg-orange-100 rounded-xl flex-1 border border-orange-200 flex items-center justify-center"><ShieldCheck className="w-8 h-8 text-orange-400" /></div>
                       <div className="h-20 bg-indigo-50 rounded-xl flex-1 border border-indigo-100 flex items-center justify-center"><Users className="w-8 h-8 text-indigo-400" /></div>
                     </div>
                     <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2">
                        <div className="h-8 bg-slate-100 rounded-lg w-1/3 mb-2" />
                        <div className="h-4 bg-slate-50 rounded w-full" />
                        <div className="h-4 bg-slate-50 rounded w-full" />
                        <div className="h-4 bg-slate-50 rounded w-4/5" />
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10-Workspace Morphing Showcase */}
      <section className="py-24 bg-slate-900 text-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">One Engine. Infinite Adaptability.</h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto">See how the platform instantly morphs its terminology, modules, and workflows to match your specific organizational structure.</p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {WORKSPACES.map((ws, i) => (
              <button 
                key={ws}
                onClick={() => setActiveWorkspaceTab(i)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeWorkspaceTab === i ? 'bg-[#FF9933] text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {ws}
              </button>
            ))}
          </div>

          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 animate-in fade-in zoom-in duration-500" key={activeWorkspaceTab}>
            <div className="flex flex-col md:flex-row items-center gap-8 text-left">
              <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center shrink-0">
                <Building2 className="w-10 h-10 text-[#FF9933]" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{WORKSPACES[activeWorkspaceTab]} Configuration Active</h3>
                <p className="text-slate-400">The entire UI has dynamically shifted. 'Members' are now appropriate to your taxonomy, relevant modules (like Goshala for cows, Gurukul for students) are activated, and irrelevant tools are hidden.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain-Solver Matrix */}
      <section id="why-us" className="py-24 bg-slate-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Why Dharmic Organizations Need This App</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Addressing the real-world operational breakdowns faced by Hindu institutions daily.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {PAIN_SOLVER_MATRIX.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <h4 className="text-sm font-bold text-rose-900 mb-1 flex items-center gap-2"><X className="w-4 h-4" /> {item.pain}</h4>
                  <p className="text-xs text-rose-700">{item.painDesc}</p>
                </div>
                <div className="flex justify-center -my-2 z-10"><ArrowRight className="w-5 h-5 text-slate-300 rotate-90 md:rotate-0" /></div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <h4 className="text-sm font-bold text-emerald-900 mb-1 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {item.solution}</h4>
                  <p className="text-xs text-emerald-700">{item.solutionDesc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section id="pricing" className="py-24 bg-white px-4 sm:px-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Transparent & Accessible</h2>
            <p className="text-lg text-slate-600">No hidden fees. Scale as your community grows.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50 flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Seva Plan</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Free</span>
                <span className="text-slate-500">Forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> Up to 50 Directory Members</li>
                <li className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> Basic Treasury Logs</li>
                <li className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> 3 Master PDF Reports / Month</li>
                <li className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> Community Support</li>
              </ul>
              <button onClick={onSignupClick} className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-colors">Start Free</button>
            </div>

            <div className="p-8 rounded-3xl border-2 border-[#FF9933] bg-orange-50/50 flex flex-col relative shadow-xl shadow-orange-500/10">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#FF9933] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Smart Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">₹999</span>
                <span className="text-slate-500">/ month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-[#FF9933] shrink-0" /> Unlimited Members & Profiles</li>
                <li className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-[#FF9933] shrink-0" /> Unlimited Double-Entry Auditing & PDFs</li>
                <li className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-[#FF9933] shrink-0" /> Verified Scholar Badge (Purohit Market)</li>
                <li className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-[#FF9933] shrink-0" /> Priority 24/7 Live Support</li>
                <li className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-[#FF9933] shrink-0" /> Custom Domain Integration</li>
              </ul>
              <button onClick={onSignupClick} className="w-full py-3 bg-[#FF9933] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-md">Upgrade to Pro</button>
            </div>
          </div>
        </div>
      </section>

      {/* Tech & FAQ */}
      <section id="faq" className="py-24 bg-slate-50 px-4 sm:px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Zero-Cost Enterprise Tech & FAQ</h2>
            <p className="text-lg text-slate-600">Built resiliently for remote Ashrams and scaled for metropolitan Mandirs.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <Smartphone className="w-8 h-8 text-indigo-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Client-Side Compression</h4>
                <p className="text-sm text-slate-600">Images are compressed inside the browser using HTML5 Canvas before uploading, ensuring zero mobile WebView crashes and saving cloud storage fees.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <Globe2 className="w-8 h-8 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Offline-First PWA</h4>
                <p className="text-sm text-slate-600">Log donations and scan gate passes perfectly even with zero internet connectivity. The system syncs automatically when reconnected.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { q: "Who owns my data?", a: "You do. 100%. We provide a zero-sale data pledge. You can export everything to CSV at any time." },
              { q: "Can I import my existing Excel sheets?", a: "Yes, our Universal CSV Bulk Import Desk maps your existing columns into our secure database effortlessly." },
              { q: "How secure is the financial data?", a: "Treasury logs are double-entry audited and isolated in your specific workspace shard. Only authorized roles can view or edit them." },
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button 
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-900 hover:bg-slate-50"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180 text-[#FF9933]' : 'text-slate-400'}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Lead Gen */}
      <section id="contact" className="py-24 bg-white px-4 sm:px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Request a Consultation</h2>
            <p className="text-lg text-slate-600 mb-8">Our onboarding specialists will help map your exact structural requirements to our platform.</p>
            
            <button onClick={openWhatsApp} className="w-full sm:w-auto px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 mb-12">
              <Send className="w-5 h-5" />
              Chat on WhatsApp Now
            </button>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-4">Rotating Shloka</h3>
               <p className="text-xl font-serif text-slate-800 italic mb-2">"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"</p>
               <p className="text-sm text-slate-500">— Bhagavad Gita 2.47</p>
               <p className="text-sm text-slate-600 mt-2">You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.</p>
            </div>
          </div>

          <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Leave an Inquiry</h3>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name *</label>
                  <input required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF9933]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Phone / WhatsApp *</label>
                  <input required value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} type="tel" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF9933]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Organization Type</label>
                  <select value={leadForm.orgType} onChange={e => setLeadForm({...leadForm, orgType: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF9933]">
                    {WORKSPACES.map(ws => <option key={ws} value={ws}>{ws}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Organization Name *</label>
                  <input required value={leadForm.orgName} onChange={e => setLeadForm({...leadForm, orgName: e.target.value})} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF9933]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Message (Optional)</label>
                <textarea rows={4} value={leadForm.message} onChange={e => setLeadForm({...leadForm, message: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF9933]" />
              </div>
              <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-md">Submit Inquiry</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#FF9933]" />
            <span className="font-bold text-white text-xl">SanataniBandhan</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
             <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition-colors">Privacy Policy</button>
             <button onClick={() => setTosOpen(true)} className="hover:text-white transition-colors">Terms of Service</button>
             <button onClick={() => setSecurityOpen(true)} className="hover:text-white transition-colors">Security Whitepaper</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          <p>© 2026 Sanatani Bandhan. Built with devotion by TrackIQ Academy.</p>
          <p className="mt-2 text-[#FF9933] font-bold">Empowering The Global Sanatani Family</p>
        </div>
      </footer>

      {/* Policy Modals */}
      <PrivacyPolicy isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsOfService isOpen={tosOpen} onClose={() => setTosOpen(false)} />
      <SecurityWhitepaper isOpen={securityOpen} onClose={() => setSecurityOpen(false)} />

    </div>
  );
};
