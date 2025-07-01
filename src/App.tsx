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

// Nouvelles routes d'inscription et KYC
import RegistrationRoutes from './routes/registrationRoutes';
import SchoolRegistrationForm from './components/registration/SchoolRegistrationForm';
import SubscriptionPlanSelection from './components/registration/SubscriptionPlanSelection';
import PaymentPage from './components/registration/PaymentPage';
import SuccessPage from './components/registration/SuccessPage';
import KYCVerificationForm from './components/kyc/KYCVerificationForm';

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
                <Route path="/register" element={<Register />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                
                {/* Route pour le module ExamTrack */}
                <Route path="/examtrack/*" element={
                  <div className="examtrack-module">
                    <ExamTrack />
                  </div>
                } />
                
                {/* Nouvelles routes d'inscription école */}
                <Route path="/register/school" element={<SchoolRegistrationForm />} />
                <Route path="/register/school/plan" element={<SubscriptionPlanSelection />} />
                <Route path="/register/school/payment" element={<PaymentPage />} />
                <Route path="/register/school/success" element={<SuccessPage />} />
                <Route path="/school/kyc-verification" element={<KYCVerificationForm />} />
                
                {/* Routes imbriquées pour le processus d'inscription */}
                <Route path="/register/*" element={<RegistrationRoutes />} />
                
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