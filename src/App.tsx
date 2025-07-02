import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Subscription from './components/Subscription';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Nouveau flux d'inscription multi-étapes
import RegistrationFlow from './components/registration/RegistrationFlow';

// Loading page component
import LoadingPage from './components/loading/LoadingPage';

// Styles pour les composants de paiement et KYC
import './styles/payment-kyc.css';

// Import du module ExamTrack depuis le bon chemin
import ExamTrack from './examtrack/ExamTrack';
// Désactiver l'ancienne version pour éviter les conflits
// import ExamTrackOld from './components/examtrack/ExamTrack';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate application initialization
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // 3.5 seconds loading time
    
    return () => clearTimeout(loadingTimer);
  }, []);
  
  if (isLoading) {
    return <LoadingPage onLoadingComplete={() => setIsLoading(false)} />;
  }
  
  return (
    <AuthProvider>
      <TenantProvider>
        <ThemeProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-color)',
                color: 'var(--text-color)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: 'white',
                },
              },
            }}
          />
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                {/* Redirection de l'ancienne route /register vers le nouveau flux */}
                <Route path="/register" element={<Navigate to="/register/flow" replace />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                
                {/* Route pour le module ExamTrack */}
                <Route path="/examtrack/*" element={
                  <div className="examtrack-module">
                    <ExamTrack />
                  </div>
                } />
                
                {/* Nouveau flux d'inscription multi-étapes */}
                <Route path="/register/flow" element={<RegistrationFlow />} />
                
                {/* Route de secours pour les chemins non trouvés */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;