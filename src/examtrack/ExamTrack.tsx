import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import './index.css';

console.log('ExamTrack module is loading...');

// Chargement direct du composant LandingPage pour éviter les problèmes de chargement paresseux
import { LandingPage } from './components/landing/LandingPage';

// Pages d'authentification - import des exports nommés
const PatronatLoginPage = lazy(() => 
  import('./components/auth/PatronatLogin').then(module => ({
    default: module.PatronatLogin
  }))
);
const SchoolLoginPage = lazy(() => 
  import('./components/auth/SchoolLogin').then(module => ({
    default: module.SchoolLogin
  }))
);
const RegistrationWizardPage = lazy(() => 
  import('./components/registration/RegistrationWizard').then(module => ({
    default: module.RegistrationWizard
  }))
);
const PublicResultsSearchPage = lazy(() => 
  import('./components/results/PublicResultsSearch').then(module => ({
    default: module.PublicResultsSearch
  }))
);

const PatronatDashboardPage = lazy(() => 
  import('./components/dashboard/PatronatDashboard').then(module => ({
    default: module.PatronatDashboard
  }))
);

const SchoolDashboardPage = lazy(() => 
  import('./components/dashboard/SchoolDashboard').then(module => ({
    default: module.SchoolDashboard
  }))
);

// Composant de chargement simple
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-blue-600 to-blue-800">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
      <div className="text-white text-xl font-semibold">Chargement d'ExamTrack...</div>
    </div>
  </div>
);

const ExamTrack = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('ExamTrack component is rendering at path:', location.pathname);
  }, [location]);

  return (
    <div className="examtrack-container">
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="landing" element={<LandingPage />} />
        {/* Ces routes seront implémentées plus tard */}
        <Route path="about" element={
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Page À propos</h1>
            <p>Cette page est en cours de développement.</p>
            <Link to="/examtrack" className="mt-4 inline-block text-blue-600 hover:underline">Retour à l'accueil</Link>
          </div>
        } />
        <Route path="demo" element={
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Page de Démonstration</h1>
            <p>Cette page est en cours de développement.</p>
            <Link to="/examtrack" className="mt-4 inline-block text-blue-600 hover:underline">Retour à l'accueil</Link>
          </div>
        } />
        <Route path="contact" element={
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Page de Contact</h1>
            <p>Cette page est en cours de développement.</p>
            <Link to="/examtrack" className="mt-4 inline-block text-blue-600 hover:underline">Retour à l'accueil</Link>
          </div>
        } />
        <Route path="results" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PublicResultsSearchPage />
          </Suspense>
        } />
        
        {/* Routes d'authentification */}
        <Route path="patronat/login" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PatronatLoginPage />
          </Suspense>
        } />
        <Route path="patronat/register" element={
          <Suspense fallback={<LoadingSpinner />}>
            <RegistrationWizardPage />
          </Suspense>
        } />
        <Route path="school/login" element={
          <Suspense fallback={<LoadingSpinner />}>
            <SchoolLoginPage />
          </Suspense>
        } />
        <Route path="school/dashboard" element={
          <Suspense fallback={<LoadingSpinner />}>
            <SchoolDashboardPage />
          </Suspense>
        } />
        <Route path="school/register" element={
          <Suspense fallback={<LoadingSpinner />}>
            <SchoolLoginPage />
          </Suspense>
        } />
        
        {/* Tableau de bord du patronat */}
        <Route path="patronat/dashboard" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PatronatDashboardPage />
          </Suspense>
        } />
        
        {/* Tableau de bord de l'école */}
        <Route path="school/dashboard" element={
          <Suspense fallback={<LoadingSpinner />}>
            <SchoolDashboardPage />
          </Suspense>
        } />
        
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </div>
  );
}

export default ExamTrack;