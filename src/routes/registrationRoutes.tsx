/**
 * Routes pour le processus d'inscription et de paiement
 * @module routes/registrationRoutes
 */

import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Ancien composants (conservés pour référence)
// import SchoolRegistrationForm from '../components/registration/SchoolRegistrationForm';
// import SubscriptionPlanSelection from '../components/registration/SubscriptionPlanSelection';
// import PaymentPage from '../components/registration/PaymentPage';
// import SuccessPage from '../components/registration/SuccessPage';
// import KYCVerificationForm from '../components/kyc/KYCVerificationForm';

// Nouveau flux d'inscription multi-étapes
import RegistrationFlow from '../components/registration/RegistrationFlow';

// Middleware d'authentification
import { RequireAuth } from '../components/auth/RequireAuth';

/**
 * Routes pour le processus d'inscription et de paiement
 */
const RegistrationRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Nouveau flux d'inscription multi-étapes */}
      <Route path="/register/flow" element={<RegistrationFlow />} />
      
      {/* Routes protégées (nécessitent une authentification) */}
      <Route 
        path="/school/kyc-verification" 
        element={
          <RequireAuth>
            <RegistrationFlow initialStep="kyc" />
          </RequireAuth>
        } 
      />
      
      {/* Anciennes routes (redirection vers le nouveau flux) */}
      <Route path="/register/school" element={<Navigate to="/register/flow" replace />} />
      <Route path="/register/school/plan" element={<Navigate to="/register/flow" replace />} />
      <Route path="/register/school/payment" element={<Navigate to="/register/flow" replace />} />
      <Route path="/register/school/success" element={<Navigate to="/register/flow" replace />} />
      
      {/* Redirection par défaut */}
      <Route path="/register" element={<Navigate to="/register/flow" replace />} />
    </Routes>
  );
};

export default RegistrationRoutes;
