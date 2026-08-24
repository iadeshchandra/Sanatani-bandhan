import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthWorkspaceProvider } from './context/AuthWorkspaceContext';
import { DataProvider } from './context/DataContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppInitializer } from './context/AppInitializer';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { QuickChandaModal } from './components/common/QuickChandaModal';
import { MySpaceModal } from './components/common/MySpaceModal';
import { GlobalTelemetryModal } from './components/common/GlobalTelemetryModal';
import { DharmicQueryAssistant } from './components/common/DharmicQueryAssistant';
import { TawkToWidget } from './components/common/TawkToWidget';
import { LandingPage } from './components/public/LandingPage';
import { PortalLogin } from './components/public/PortalLogin';
import { useAuthWorkspace } from './context/AuthWorkspaceContext';
import { useData } from './context/DataContext';


// Dashboard
import { DashboardHome } from './components/dashboard/DashboardHome';

// Domain 1: CRM & Lineage
import { DevoteeGrid } from './components/domain1/DevoteeGrid';
import { FamilyHouseholdDesk } from './components/domain1/FamilyHouseholdDesk';
import { VanshavaliDesk } from './components/domain1/VanshavaliDesk';
import { GuestManagerDesk } from './components/domain1/GuestManagerDesk';
import { BulkImportDesk } from './components/domain1/BulkImportDesk';

// Domain 2: Financials & Assets
import { TreasuryLedgerDesk } from './components/domain2/TreasuryLedgerDesk';
import { TaxReceiptDesk } from './components/domain2/TaxReceiptDesk';
import { MandirCampaignsDesk } from './components/domain2/MandirCampaignsDesk';
import { KarmaLedgerDesk } from './components/domain2/KarmaLedgerDesk';
import { AssetInventoryDesk } from './components/domain2/AssetInventoryDesk';
import { InventoryDesk } from './components/domain2/InventoryDesk';

// Domain 3: Vedic Rituals & Astrology
import { PoojaBookingDesk } from './components/domain3/PoojaBookingDesk';
import { MandirPujaDesk } from './components/domain3/MandirPujaDesk';
import { PurohitMarketDesk } from './components/domain3/PurohitMarketDesk';
import { PitruShradhDesk } from './components/domain3/PitruShradhDesk';
import { PanchangMuhuratDesk } from './components/domain3/PanchangMuhuratDesk';

// Domain 4: Gau Seva & Community
import { GauSevaDesk } from './components/domain4/GauSevaDesk';
import { AnnadanamKitchenDesk } from './components/domain4/AnnadanamKitchenDesk';
import { VedicSevaShikshaDesk } from './components/domain4/VedicSevaShikshaDesk';

// Domain 5: Outreach & Scriptures
import { WhatsAppBroadcasterDesk } from './components/domain5/WhatsAppBroadcasterDesk';
import { VedicCalendarEventsDesk } from './components/domain5/VedicCalendarEventsDesk';
import { SanskritLibraryDesk } from './components/domain5/SanskritLibraryDesk';

// Domain 6: Enterprise Control & Multi-Workspace
import { WorkspaceSelectorDesk } from './components/domain6/WorkspaceSelectorDesk';
import { UserRolesDesk } from './components/domain6/UserRolesDesk';
import { AuditLogDesk } from './components/domain6/AuditLogDesk';

const AppContent: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isQuickChandaOpen, setIsQuickChandaOpen] = useState<boolean>(false);
  const [isMySpaceOpen, setIsMySpaceOpen] = useState<boolean>(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);

  const renderActiveDesk = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardHome
            onNavigate={(mod) => setActiveModule(mod)}
            onOpenQuickPay={() => setIsQuickChandaOpen(true)}
          />
        );

      // Domain 1
      case 'devotees':
      case 'devotee-grid':
        return <DevoteeGrid />;
      case 'family':
      case 'household-census':
        return <FamilyHouseholdDesk />;
      case 'vanshavali':
      case 'vanshavali-tree':
        return <VanshavaliDesk />;
      case 'guests':
      case 'guest-pipeline':
        return <GuestManagerDesk />;
      case 'bulkImport':
      case 'universal-csv':
        return <BulkImportDesk />;

      // Domain 2
      case 'treasury':
      case 'treasury-ledger':
        return <TreasuryLedgerDesk onOpenQuickPay={() => setIsQuickChandaOpen(true)} />;
      case 'taxReceipts':
      case 'tax-receipt-80g':
        return <TaxReceiptDesk />;
      case 'campaigns':
      case 'mandir-campaigns':
        return <MandirCampaignsDesk />;
      case 'karmaLedger':
      case 'karma-ledger':
        return <KarmaLedgerDesk />;
      case 'assets':
      case 'asset-register':
        return <AssetInventoryDesk />;
      case 'inventory':
      case 'store-inventory':
        return <InventoryDesk />;

      // Domain 3
      case 'poojaBooking':
      case 'pooja-booking':
        return <PoojaBookingDesk />;
      case 'mandirPuja':
      case 'aarti-roster':
        return <MandirPujaDesk />;
      case 'purohitMarket':
      case 'purohit-marketplace':
        return <PurohitMarketDesk />;
      case 'pitruShradh':
      case 'pitru-shradh':
        return <PitruShradhDesk />;
      case 'panchang':
      case 'panchang-muhurat':
        return <PanchangMuhuratDesk />;

      // Domain 4
      case 'goshala':
      case 'gau-seva-goshala':
        return <GauSevaDesk />;
      case 'annadanam':
      case 'annadanam-kitchen':
        return <AnnadanamKitchenDesk />;
      case 'gurukul':
      case 'gurukul-education':
      case 'gurukulAcademy':
      case 'vidyalaya':
      case 'satsang':
      case 'sanghaDrills':
      case 'sevaTrust':
      case 'granthLibrary':
        return <VedicSevaShikshaDesk />;

      // Domain 5
      case 'sandeshBroadcast':
      case 'whatsapp-broadcaster':
        return <WhatsAppBroadcasterDesk />;
      case 'utsavPanjika':
      case 'events-utsav':
        return <VedicCalendarEventsDesk />;
      case 'shlokaFeed':
      case 'sanskrit-library':
        return <SanskritLibraryDesk />;
      case 'dharmicAssistant':
      case 'dharmic-assistant':
      case 'dharmaMarketing':
        return (
          <DharmicQueryAssistant
            activeModule={activeModule}
            onNavigate={(mod) => setActiveModule(mod)}
          />
        );

      // Domain 6
      case 'workspace-hub':
        return <WorkspaceSelectorDesk />;
      case 'user-roles-rbac':
      case 'trusteeGovernance':
      case 'sevadarRoster':
        return <UserRolesDesk />;
      case 'security-audit-log':
      case 'legalVault':
        return <AuditLogDesk />;

      default:
        return (
          <DashboardHome
            onNavigate={(mod) => setActiveModule(mod)}
            onOpenQuickPay={() => setIsQuickChandaOpen(true)}
          />
        );
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 flex flex-col font-sans overflow-hidden">
      {/* Universal Header */}
      <Header
        activeModule={activeModule}
        onNavigate={(mod) => setActiveModule(mod)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenQuickChanda={() => setIsQuickChandaOpen(true)}
        onOpenMySpace={() => setIsMySpaceOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      <div className="flex grow overflow-hidden">
        {/* Universal 46-Module Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(mod) => setActiveModule(mod)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="grow p-6 flex flex-col gap-6 overflow-hidden">
          <div className="flex flex-col grow overflow-y-auto custom-scrollbar">
            {renderActiveDesk()}
          </div>
        </main>
      </div>

      <Footer onOpenTelemetry={() => setIsTelemetryOpen(true)} />

      {/* Global Modals & Widgets */}
      <QuickChandaModal
        isOpen={isQuickChandaOpen}
        onClose={() => setIsQuickChandaOpen(false)}
      />

      <MySpaceModal
        isOpen={isMySpaceOpen}
        onClose={() => setIsMySpaceOpen(false)}
      />

      <GlobalTelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
      />

      {/* Dharmic AI Sliding Intelligence Drawer */}
      <DharmicQueryAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeModule={activeModule}
        onNavigate={(mod) => {
          setActiveModule(mod);
          setIsAssistantOpen(false);
        }}
        isDrawer={true}
      />

      <TawkToWidget />
    </div>
  );
};


const AppRouter: React.FC = () => {
  const { isAuthenticated, loginWithPin } = useAuthWorkspace();
  const { devotees } = useData();
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    if (action === 'autologin' && !isAuthenticated) {
      const pin = params.get('pin');
      if (pin) {
        const success = loginWithPin(pin, devotees);
        if (success) {
          // Clear URL params safely
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, [isAuthenticated, loginWithPin, devotees]);

  if (isAuthenticated) {
    return <AppContent />;
  }

  if (view === 'login' || view === 'signup') {
    return (
      <PortalLogin 
        initialMode={view} 
        onBack={() => setView('landing')} 
        onSuccess={() => {}} 
      />
    );
  }

  return (
    <LandingPage 
      onLoginClick={() => setView('login')} 
      onSignupClick={() => setView('signup')} 
    />
  );
};


export default function App() {
  return (
    <ErrorBoundary>
      <AppInitializer>
        <ToastProvider>
          <LanguageProvider>
            <AuthWorkspaceProvider>
              <DataProvider>
                <AppRouter />
              </DataProvider>
            </AuthWorkspaceProvider>
          </LanguageProvider>
        </ToastProvider>
      </AppInitializer>
    </ErrorBoundary>
  );
}
