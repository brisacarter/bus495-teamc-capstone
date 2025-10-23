import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { ProfileView } from './components/ProfileView';
import { BillingView } from './components/BillingView';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { isAuthenticated, currentScreen } = useApp();

  if (!isAuthenticated) {
    return currentScreen === 'signup' ? <SignupScreen /> : <LoginScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <CalendarView />;
      case 'profile':
        return <ProfileView />;
      case 'billing':
        return <BillingView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppLayout>
      {renderScreen()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="size-full">
        <AppContent />
        <Toaster />
      </div>
    </AppProvider>
  );
}