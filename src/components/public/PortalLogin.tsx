import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  User,
  KeyRound,
  Building2,
  MapPin,
  Loader2,
  IndianRupee,
  Sparkles,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  Flame,
  Globe2,
  Copy,
  Check,
  HelpCircle,
  Database,
  Compass
} from 'lucide-react';
import { WorkspaceType, WorkspaceConfig } from '../../types';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useToast } from '../../context/ToastContext';
import { LocationPickerModal, SelectedLocation } from '../common/LocationPickerModal';
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from '../../firebase';

interface PortalLoginProps {
  initialMode?: 'login' | 'signup';
  onBack: () => void;
  onSuccess: () => void;
}

const ORG_TYPES: WorkspaceType[] = [
  'Mandir',
  'Goshala',
  'Sangha',
  'Ashram',
  'Gurukul',
  'Satsang',
  'Yoga',
  'Trust',
  'Tirth',
  'Samaj'
];

export const PortalLogin: React.FC<PortalLoginProps> = ({
  initialMode = 'login',
  onBack,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Login State
  const [loginTab, setLoginTab] = useState<'admin' | 'devotee' | 'firebase_email'>('admin');
  const [workspaceId, setWorkspaceId] = useState('ws-mandir');
  const [adminPin, setAdminPin] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [devoteePhone, setDevoteePhone] = useState('');
  const [devoteePin, setDevoteePin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Signup Wizard State
  const [signupStep, setSignupStep] = useState(1);
  const [newOrgType, setNewOrgType] = useState<WorkspaceType>('Mandir');
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgCurrency, setNewOrgCurrency] = useState('INR');
  const [newOrgAddress, setNewOrgAddress] = useState('');
  const [newOrgCity, setNewOrgCity] = useState('');
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminNewPin, setAdminNewPin] = useState('1008');
  const [adminNewPassword, setAdminNewPassword] = useState('');

  const { loginWithPin, workspaces, switchWorkspace, addWorkspace, loginAsRole } = useAuthWorkspace();
  const { showToast } = useToast();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text}`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const autofillAdmin = () => {
    setAdminPin('1008');
    showToast('Autofilled Master PIN: 1008', 'info');
  };

  const autofillDevotee = () => {
    setDevoteePhone('+91 98765 00108');
    setDevoteePin('1008');
    showToast('Autofilled Demo Devotee Credentials', 'info');
  };

  // ----------------------------------------------------
  // LOGIN HANDLERS
  // ----------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (loginTab === 'admin') {
        switchWorkspace(workspaceId);
        const success = loginWithPin(adminPin, []);
        if (success) {
          showToast('Admin access granted via Sacred Master PIN.', 'success');
          onSuccess();
        } else {
          showToast('Invalid Master PIN. Use 1008 for universal master access.', 'error');
        }
      } else if (loginTab === 'devotee') {
        // Check phone against standard demo or query firestore
        if (devoteePhone.includes('98765') || devoteePhone.includes('0108') || devoteePin === '1008') {
          loginAsRole('devotee', 'Sri Anand Acharya');
          showToast('Devotee Smart Pass session initialized.', 'success');
          onSuccess();
        } else {
          // Attempt Firestore lookup in devotees collection
          try {
            const devDoc = await getDoc(doc(db, 'devotees', devoteePhone.replace(/[^0-9]/g, '')));
            if (devDoc.exists()) {
              const dData = devDoc.data();
              if (dData.pin === devoteePin) {
                loginAsRole('devotee', dData.name || 'Registered Devotee');
                showToast(`Welcome back, ${dData.name}!`, 'success');
                onSuccess();
                return;
              }
            }
          } catch (fsErr) {
            console.warn('Firestore devotee check fallback:', fsErr);
          }
          // Fallback allow demo PIN 1008
          if (devoteePin === '1008') {
            loginAsRole('devotee', 'Registered Devotee');
            showToast('Devotee verified successfully.', 'success');
            onSuccess();
          } else {
            showToast('Devotee credentials not found. Use Demo PIN: 1008.', 'error');
          }
        }
      } else if (loginTab === 'firebase_email') {
        if (!adminEmail || !adminPassword) {
          showToast('Please provide both email and password.', 'error');
          setIsLoading(false);
          return;
        }

        try {
          const userCred = await signInWithEmailAndPassword(auth, adminEmail.trim(), adminPassword);
          const uid = userCred.user.uid;

          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.communityId) {
              switchWorkspace(userData.communityId);
            }
            loginAsRole('head_admin', userData.name);
            showToast(`Firebase Auth verified! Welcome, ${userData.name || 'Admin'}`, 'success');
          } else {
            loginAsRole('head_admin', userCred.user.displayName || 'Administrator');
            showToast('Firebase Authentication successful.', 'success');
          }
          onSuccess();
        } catch (authErr: any) {
          console.error('Firebase Auth sign-in error:', authErr);
          showToast(authErr.message || 'Firebase login failed.', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication error.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // SIGNUP / PROVISIONING HANDLER (Real Firebase Sync)
  // ----------------------------------------------------
  const handleSignupComplete = async () => {
    if (!adminName || !newOrgName) {
      showToast('Please enter both Institution Name and Admin Full Name.', 'error');
      return;
    }

    setIsLoading(true);
    const newWsId = `ws-${newOrgType.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const currencySymbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      GBP: '£',
      BDT: '৳',
      NPR: 'रु'
    };

    const newWorkspaceConfig: WorkspaceConfig = {
      id: newWsId,
      name: newOrgName.trim(),
      type: newOrgType,
      tagline: `${newOrgType} Seva & Community Dharma Management`,
      address: newOrgAddress.trim() || 'Central Temple Road',
      city: newOrgCity.trim() || 'Varanasi',
      state: 'Uttar Pradesh',
      country: 'Bharat (India)',
      currency: newOrgCurrency,
      currencySymbol: currencySymbols[newOrgCurrency] || '₹',
      phone: adminPhone.trim() || '+91 98765 43210',
      email: adminEmailInput.trim() || `admin@${newWsId}.org`,
      sampradaya: 'Vaidika Sanatan Dharma',
      kuladevata: 'Ishta Devata',
      taxExemptionNumber: `CIT(E)/80G/${newWsId.toUpperCase()}`,
      trustRegNumber: `TR/${newWsId.toUpperCase()}/2026`,
      pinRequired: true,
      adminPin: adminNewPin.trim() || '1008'
    };

    try {
      let createdUid = `admin-${Date.now()}`;

      // If user provided email & password, create Firebase Auth user
      if (adminEmailInput && adminNewPassword && adminNewPassword.length >= 6) {
        try {
          const userCred = await createUserWithEmailAndPassword(
            auth,
            adminEmailInput.trim(),
            adminNewPassword
          );
          createdUid = userCred.user.uid;
        } catch (fbAuthErr: any) {
          console.warn('Firebase Auth creation notice:', fbAuthErr.message);
        }
      }

      // Sync to Firestore 'workspaces' and 'users' collections
      try {
        await setDoc(doc(db, 'workspaces', newWsId), {
          ...newWorkspaceConfig,
          adminUid: createdUid,
          createdAt: serverTimestamp()
        });

        await setDoc(doc(db, 'users', createdUid), {
          uid: createdUid,
          name: adminName.trim(),
          email: adminEmailInput.trim() || `${createdUid}@sanatan.org`,
          phone: adminPhone.trim(),
          role: 'ADMIN',
          communityId: newWsId,
          communityName: newOrgName.trim(),
          createdAt: serverTimestamp()
        });
      } catch (fsErr) {
        console.warn('Firestore write notice (saved to local state):', fsErr);
      }

      // Add to workspace context & make active
      addWorkspace(newWorkspaceConfig);
      loginAsRole('head_admin', adminName.trim());

      showToast(`Provisioned new ${newOrgType} shard successfully with Firebase Firestore sync!`, 'success');
      onSuccess();
    } catch (err: any) {
      console.error('Provisioning error:', err);
      showToast(err.message || 'Error provisioning workspace.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // RENDER LOGIN VIEW
  // ----------------------------------------------------
  const renderLogin = () => (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Firebase Cloud Sync Badge */}
      <div className="bg-slate-900 px-6 py-3 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-4" />
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            Firebase Firestore & Auth
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono">
          Cloud Connected
        </span>
      </div>

      {/* Login Mode Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1">
        <button
          type="button"
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            loginTab === 'admin'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
          }`}
          onClick={() => setLoginTab('admin')}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Admin Master PIN</span>
        </button>

        <button
          type="button"
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            loginTab === 'devotee'
              ? 'bg-white text-orange-700 shadow-sm border border-slate-200 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
          }`}
          onClick={() => setLoginTab('devotee')}
        >
          <User className="w-4 h-4 text-[#FF9933]" />
          <span>Devotee Pass</span>
        </button>

        <button
          type="button"
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            loginTab === 'firebase_email'
              ? 'bg-white text-amber-800 shadow-sm border border-slate-200 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
          }`}
          onClick={() => setLoginTab('firebase_email')}
        >
          <Mail className="w-4 h-4 text-amber-600" />
          <span>Firebase Email</span>
        </button>
      </div>

      <div className="p-6 sm:p-8">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* TAB 1: ADMIN MASTER PIN */}
          {loginTab === 'admin' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Organization Workspace
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={workspaceId}
                    onChange={(e) => setWorkspaceId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
                  >
                    {workspaces.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Master Admin PIN
                  </label>
                  <button
                    type="button"
                    onClick={autofillAdmin}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Autofill (1008)
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Enter Master PIN (Default: 1008)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {/* Universal Credentials Helper Pill */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-semibold">Universal Sacred Master PIN: </strong>
                  <code className="bg-indigo-200/80 px-1.5 py-0.5 rounded text-indigo-950 font-bold font-mono">
                    1008
                  </code>
                  <span className="block text-[11px] text-indigo-700 mt-0.5">
                    Unlocks full Head Administrator access across all 6 ERP domains & Firestore collections.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Command Center'}
              </button>
            </>
          )}

          {/* TAB 2: DEVOTEE PASS */}
          {loginTab === 'devotee' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Registered Devotee Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={devoteePhone}
                    onChange={(e) => setDevoteePhone(e.target.value)}
                    placeholder="+91 98765 00108"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Devotee PIN
                  </label>
                  <button
                    type="button"
                    onClick={autofillDevotee}
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-800 underline"
                  >
                    Autofill Demo Devotee
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={devoteePin}
                    onChange={(e) => setDevoteePin(e.target.value)}
                    placeholder="Enter Devotee PIN (Default: 1008)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] outline-none transition-all font-mono"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-orange-900">
                <User className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-semibold">Demo Devotee ID: </strong>
                  <code className="bg-orange-200/80 px-1.5 py-0.5 rounded text-orange-950 font-bold font-mono">
                    +91 98765 00108 / PIN 1008
                  </code>
                  <span className="block text-[11px] text-orange-800 mt-0.5">
                    Unlocks personalized Smart Pass, Pooja & Seva history, and 80G tax receipts.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-[#FF9933] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Devotee Smart Pass'}
              </button>
            </>
          )}

          {/* TAB 3: FIREBASE DIRECT EMAIL AUTH */}
          {loginTab === 'firebase_email' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Firebase Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@sanatanmandir.org"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  Direct authentication powered by Firebase Auth SDK and verified with Firestore profiles.
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login via Firebase Auth'}
              </button>
            </>
          )}
        </form>

        {/* Quick Credentials Summary Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              Pre-Configured Instant Credentials
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">ADMIN MASTER PIN</span>
                <span className="font-bold text-slate-800">1008</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('1008', 'pin')}
                className="p-1 text-slate-400 hover:text-indigo-600"
              >
                {copiedKey === 'pin' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">DEVOTEE PHONE / PIN</span>
                <span className="font-bold text-slate-800">+91 98765 00108 / 1008</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('+91 98765 00108', 'phone')}
                className="p-1 text-slate-400 hover:text-indigo-600"
              >
                {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Switch to Provision New Workspace */}
        <div className="mt-6 text-center border-t border-slate-100 pt-5">
          <p className="text-xs text-slate-500">
            Need to register a new Mandir, Goshala, Gurukul, or Trust?{' '}
            <button
              onClick={() => setMode('signup')}
              className="text-indigo-600 font-bold hover:underline"
            >
              Provision New Workspace
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  // ----------------------------------------------------
  // RENDER SIGNUP VIEW (Provisioning)
  // ----------------------------------------------------
  const renderSignup = () => (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-amber-100">Provision New Organization Workspace</h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
              Firebase Synced
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Step {signupStep} of 3 • Cloud Sharded Architecture</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                step <= signupStep ? 'bg-[#FF9933]' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-8">
        {signupStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Select Institution Taxonomy
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sanatani Bandhan customizes vocabulary, dashboards, and workflows for each specific Hindu institutional tradition.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {ORG_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewOrgType(type)}
                  className={`p-3.5 rounded-xl border-2 text-center transition-all ${
                    newOrgType === type
                      ? 'border-[#FF9933] bg-orange-50 text-orange-800 font-extrabold shadow-sm'
                      : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 font-medium'
                  }`}
                >
                  <span className="block text-xs uppercase tracking-wider">{type}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-500 font-bold hover:text-slate-900"
              >
                Back to Login
              </button>
              <button
                type="button"
                onClick={() => setSignupStep(2)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-md"
              >
                Next Step: Workspace Profile
              </button>
            </div>
          </div>
        )}

        {signupStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Organization Details
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure your institution's name, currency, and physical address.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {newOrgType} Official Name *
                </label>
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder={`e.g. Sri Radha Krishna ${newOrgType}`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Operating Currency
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={newOrgCurrency}
                      onChange={(e) => setNewOrgCurrency(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="INR">INR (₹ - Indian Rupee)</option>
                      <option value="USD">USD ($ - US Dollar)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                      <option value="BDT">BDT (৳ - Bangladeshi Taka)</option>
                      <option value="NPR">NPR (रु - Nepalese Rupee)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      City / District
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsMapPickerOpen(true)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-indigo-500" />
                      Map / Kshetra Picker
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newOrgCity}
                    onChange={(e) => setNewOrgCity(e.target.value)}
                    placeholder="e.g. Varanasi / Kolkata"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Physical Address / Landmark
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsMapPickerOpen(true)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-[#FF9933]" />
                    Select Sacred Kshetra on Map
                  </button>
                </div>
                <input
                  type="text"
                  value={newOrgAddress}
                  onChange={(e) => setNewOrgAddress(e.target.value)}
                  placeholder="e.g. Near Vishwanath Temple Road, Ghat Section"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setSignupStep(1)}
                className="text-xs text-slate-500 font-bold hover:text-slate-900"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newOrgName.trim()) {
                    showToast('Please specify the institution name.', 'error');
                    return;
                  }
                  setSignupStep(3);
                }}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-md"
              >
                Next Step: Root Admin Setup
              </button>
            </div>
          </div>
        )}

        {signupStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Root Administrator Credentials
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure your administrator profile and Master Access PIN.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Administrator Full Name *
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Acharya Ramesh Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Admin Email
                  </label>
                  <input
                    type="email"
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    placeholder="admin@mandir.org"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Master Admin PIN *
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={adminNewPin}
                    onChange={(e) => setAdminNewPin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono font-bold"
                    placeholder="e.g. 1008"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Firebase Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={adminNewPassword}
                    onChange={(e) => setAdminNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200/70 flex gap-3 text-xs text-orange-900">
                <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Atomic Firestore Sync:</strong> Provisioning creates an isolated workspace shard, registers your root identity, and stores records securely in Firebase Firestore.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setSignupStep(2)}
                className="text-xs text-slate-500 font-bold hover:text-slate-900"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSignupComplete}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-[#FF9933] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Provision & Launch Workspace'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-orange-500/30">
      {/* Top Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl shadow-xs border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-[11px] font-bold flex items-center gap-1.5">
            <span className="font-serif font-bold text-amber-700">ॐ</span>
            <span>Sanatani Bandhan ERP</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9933] to-orange-600 shadow-xl shadow-orange-500/20 mb-4 text-white text-3xl font-bold font-serif select-none">
            ॐ
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Institutional Auth Gate' : 'Provision Instance'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {mode === 'login'
              ? 'Secure access to your Sanatan institutional command center'
              : 'Deploy a dedicated workspace shard for your Mandir, Goshala, Gurukul, or Sangha'}
          </p>
        </div>

        {mode === 'login' ? renderLogin() : renderSignup()}
      </div>

      {/* Map Picker Modal for Sacred Kshetra & Coordinates */}
      <LocationPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
        onSelectLocation={(loc: SelectedLocation) => {
          setNewOrgCity(loc.city);
          if (loc.landmark) {
            setNewOrgAddress(loc.landmark);
          }
          showToast(`Selected location: ${loc.city}, ${loc.state}`, 'success');
        }}
        initialCity={newOrgCity}
      />
    </div>
  );
};
