import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add imports for public pages
imports = """
import { LandingPage } from './components/public/LandingPage';
import { PortalLogin } from './components/public/PortalLogin';
import { useAuthWorkspace } from './context/AuthWorkspaceContext';
import { useData } from './context/DataContext';
"""
content = content.replace("import { TawkToWidget } from './components/common/TawkToWidget';", "import { TawkToWidget } from './components/common/TawkToWidget';" + imports)

# Add AppRouter
app_router_code = """
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
"""

content = content.replace("export default function App() {", app_router_code + "\n\nexport default function App() {")

# Replace <AppContent /> with <AppRouter /> in App
content = content.replace("<AppContent />", "<AppRouter />")

with open('src/App.tsx', 'w') as f:
    f.write(content)
