/**
 * Composant pour la protection des routes nécessitant une authentification
 * @module components/auth/RequireAuth
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Composant qui protège les routes nécessitant une authentification
 * @param {React.PropsWithChildren} props - Les props du composant
 * @returns {JSX.Element} - Le composant protégé ou une redirection vers la page de connexion
 */
export const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
