import React, { useState } from 'react';
import {
  Search,
  Globe2,
  ShieldCheck,
  Sparkles,
  QrCode,
  Activity,
  Menu,
  Bell,
  ChevronDown,
  Building2,
  Coins,
  Crown,
} from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { useWorkspaceTaxonomy } from '../../hooks/useWorkspaceTaxonomy';
import { calculatePanchang } from '../../utils/panchang';
import { AppLanguage, UserRole, WorkspaceType } from '../../types';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenTelemetry: () => void;
  onOpenMySpace: () => void;
  onOpenQuickPay?: () => void;
  onOpenQuickChanda?: () => void;
  onOpenAssistant?: () => void;
  onOpenGodMode?: () => void;
  activeModule: string;
  onSelectModule?: (module: string) => void;
  onNavigate?: (module: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  onOpenTelemetry,
  onOpenMySpace,
  onOpenQuickPay,
  onOpenQuickChanda,
  onOpenAssistant,
  onOpenGodMode,
  activeModule,
  onSelectModule,
  onNavigate,
}) => {
  const handleSelectModule = onNavigate || onSelectModule || (() => {});
  const handleQuickPay = onOpenQuickChanda || onOpenQuickPay || (() => {});
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    currentRole,
    switchRole,
    currentDevotee,
  } = useAuthWorkspace();

  const { language, setLanguage, t } = useLanguage();
  const [showWsDropdown, setShowWsDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const panchang = calculatePanchang();
  const taxonomy = useWorkspaceTaxonomy();

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'master_admin':
        return 'God Mode (Super Admin)';
      case 'head_admin':
        return 'Head Admin (Trustee)';
      case 'manager':
        return 'Staff Manager';
      case 'devotee':
        return `Personal Mode (${taxonomy.memberNoun})`;
    }
  };

  const getRoleBadgeColor = (r: UserRole) => {
    switch (r) {
      case 'master_admin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'head_admin':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'manager':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'devotee':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-4">
        {/* Left Side: Menu toggle & Brand / Workspace Selector */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            id="sidebar-toggle-btn"
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 bg-[#FF9933] rounded-lg hidden sm:flex items-center justify-center text-white font-bold text-xl shadow-inner shrink-0">
            ॐ
          </div>

          {/* Workspace Switcher */}
          <div className="relative">
            <button
              type="button"
              id="workspace-switcher-btn"
              onClick={() => setShowWsDropdown(!showWsDropdown)}
              className="flex flex-col text-left cursor-pointer transition-opacity hover:opacity-80 group"
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF9933]">Sanatani Bandhan</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#FF9933] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h1 className="text-lg font-serif font-semibold text-slate-800 leading-tight">
                {activeWorkspace.name} <span className="text-sm font-sans font-normal text-slate-500">• {activeWorkspace.city}</span>
              </h1>
            </button>

            {showWsDropdown && (
              <div
                id="workspace-dropdown-menu"
                className="absolute left-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Workspace
                  </p>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => {
                        switchWorkspace(ws.id);
                        setShowWsDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        ws.id === activeWorkspace.id
                          ? 'bg-[#FF9933]/10 text-[#FF9933] font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-semibold">{ws.name}</p>
                        <p className="text-[10px] opacity-80">{ws.type} • {ws.city}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Center/Right side controls */}
        <div className="flex items-center gap-6">
          {/* Live Panjika & Tithi Widget (Hidden on small screens) */}
          <div className="hidden md:flex flex-col items-end border-r border-slate-200 pr-6">
            <span className="text-[10px] uppercase font-bold text-slate-400">Vikram 2083 / San 1433</span>
            <span className="text-sm font-medium text-slate-700 italic">
              {panchang.tithi} • {panchang.nakshatra}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Chanda Button */}
            <button
              type="button"
              id="quick-chanda-header-btn"
              onClick={handleQuickPay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF9933]/10 hover:bg-[#FF9933]/20 text-[#FF9933] font-bold text-xs transition-colors"
            >
              <Coins className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('quickPay')}</span>
              <span className="sm:hidden">Pay</span>
            </button>

            {/* Trilingual Language Selector */}
            <div className="relative">
              <button
                type="button"
                id="language-selector-btn"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 transition-colors"
              >
                <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">{language === 'en' ? 'EN' : language === 'hi' ? 'HI' : 'BN'}</span>
              </button>

              {showLangDropdown && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-32 rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 z-50"
                >
                  <button type="button" onClick={() => { setLanguage('en'); setShowLangDropdown(false); }} className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${language === 'en' ? 'bg-[#FF9933]/10 text-[#FF9933]' : 'hover:bg-slate-50 text-slate-700'}`}>English</button>
                  <button type="button" onClick={() => { setLanguage('hi'); setShowLangDropdown(false); }} className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${language === 'hi' ? 'bg-[#FF9933]/10 text-[#FF9933]' : 'hover:bg-slate-50 text-slate-700'}`}>हिन्दी</button>
                  <button type="button" onClick={() => { setLanguage('bn'); setShowLangDropdown(false); }} className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${language === 'bn' ? 'bg-[#FF9933]/10 text-[#FF9933]' : 'hover:bg-slate-50 text-slate-700'}`}>বাংলা</button>
                </div>
              )}
            </div>

            {/* Dharmic Query Assistant AI Trigger */}
            {onOpenAssistant && (
              <button
                type="button"
                id="dharmic-assistant-header-btn"
                onClick={onOpenAssistant}
                title="Dharmic Query Assistant (Gemini 3.7 AI)"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 text-amber-700 text-xs font-bold transition-all shadow-xs"
              >
                <span className="font-serif font-bold text-amber-600 text-xs">ॐ</span>
                <span className="hidden md:inline">Dharmic AI</span>
                <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
              </button>
            )}

            {/* Telemetry Monitor Live Badge */}
            <button
              type="button"
              id="telemetry-monitor-btn"
              onClick={onOpenTelemetry}
              title="GA4 Telemetry Log Inspector"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <Activity className="w-4 h-4" />
            </button>

            {/* My Space & ID Pass */}
            <button
              type="button"
              id="my-space-btn"
              onClick={onOpenMySpace}
              title={`My Smart Pass & ${taxonomy.memberNoun || 'Devotee'} Card`}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* God Mode Sovereign Backend Control Trigger */}
            {onOpenGodMode && (
              <button
                type="button"
                id="god-mode-header-btn"
                onClick={onOpenGodMode}
                title="sonatanibandhan.web.app/own/backend - Sovereign God Mode"
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 hover:text-amber-800 text-[11px] font-bold border border-amber-500/30 transition-all cursor-pointer shadow-xs"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden lg:inline">God Mode</span>
              </button>
            )}

            {/* Role Switcher Pill & Profile */}
            <div className="relative border-l border-slate-200 pl-3 ml-1">
              <button
                type="button"
                id="role-switcher-btn"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-3 text-left cursor-pointer group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-slate-800">{getRoleLabel(currentRole)}</p>
                  <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Tap to Switch</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-sm">
                    {currentRole.substring(0,2).toUpperCase()}
                  </div>
                </div>
              </button>

              {showRoleDropdown && (
                <div
                  id="role-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-lg p-2 z-50"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Role-Based Access
                    </p>
                  </div>
                  {(['master_admin', 'head_admin', 'manager', 'devotee'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        switchRole(r);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        currentRole === r
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{getRoleLabel(r)}</span>
                      {currentRole === r && <span className="text-indigo-600">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
};
