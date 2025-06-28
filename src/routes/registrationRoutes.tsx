/**
 * Routes pour le processus d'inscription et de paiement
 * @module routes/registrationRoutes
 */

import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Composants
import SchoolRegistrationForm from '../components/registration/SchoolRegistrationForm';
import SubscriptionPlanSelection from '../components/registration/SubscriptionPlanSelection';
import PaymentPage from '../components/registration/PaymentPage';
import SuccessPage from '../components/registration/SuccessPage';
import KYCVerificationForm from '../components/kyc/KYCVerificationForm';

// Middleware d'authentification
import { RequireAuth } from '../components/auth/RequireAuth';

/**
 * Routes pour le processus d'inscription et de paiement
 */
const RegistrationRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Routes publiques d'inscription */}
      <Route path="/register/school" element={<SchoolRegistrationForm />} />
      <Route path="/register/school/plan" element={<SubscriptionPlanSelection />} />
      <Route path="/register/school/payment" element={<PaymentPage />} />
      <Route path="/register/school/success" element={<SuccessPage />} />
      
      {/* Routes protégées (nécessitent une authentification) */}
      <Route 
        path="/school/kyc-verification" 
        element={
          <RequireAuth>
            <KYCVerificationForm />
          </RequireAuth>
        } 
      />
      
      {/* Redirection par défaut */}
      <Route path="/register" element={<Navigate to="/register/school" replace />} />
    </Routes>
  );
};

export default RegistrationRoutes;
