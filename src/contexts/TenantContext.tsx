import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { School } from '../types/school';
import { schoolService } from '../services/school/schoolService';

/**
 * Interface pour le contexte du tenant
 */
interface TenantContextType {
  /**
   * École (tenant) actuellement sélectionnée
   */
  school: School | null;
  
  /**
   * Indique si les données de l'école sont en cours de chargement
   */
  loading: boolean;
  
  /**
   * Message d'erreur en cas d'échec de chargement
   */
  error: string | null;
  
  /**
   * Définit l'école active
   */
  setSchool: (school: School) => void;
  
  /**
   * Charge une école par son sous-domaine
   */
  loadSchoolBySubdomain: (subdomain: string) => Promise<void>;
  
  /**
   * Rafraîchit les données de l'école actuelle
   */
  refreshSchool: () => Promise<void>;
}

// Création du contexte
const TenantContext = createContext<TenantContextType | undefined>(undefined);

/**
 * Hook personnalisé pour accéder au contexte du tenant
 * @returns Contexte du tenant
 */
export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

/**
 * Extrait le sous-domaine de l'URL actuelle
 * @returns Le sous-domaine ou null si non disponible
 */
const extractSubdomainFromUrl = (): string | null => {
  const hostname = window.location.hostname;
  
  // Si c'est localhost, on extrait le sous-domaine de l'URL
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const pathParts = window.location.pathname.split('/');
    // On suppose que le sous-domaine est le premier segment du chemin
    if (pathParts.length > 1 && pathParts[1]) {
      return pathParts[1];
    }
    return null;
  }
  
  // Pour les environnements de production avec des sous-domaines réels
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
};

interface TenantProviderProps {
  children: ReactNode;
}

/**
 * Fournisseur de contexte pour les données du tenant (école)
 */
export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charge une école par son sous-domaine
   */
  const loadSchoolBySubdomain = useCallback(async (subdomain: string) => {
    if (!subdomain) return;
    
    try {
      setLoading(true);
      setError(null);
      const schoolData = await schoolService.getSchoolBySubdomain(subdomain);
      setSchool(schoolData);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'école:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'école');
      setSchool(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rafraîchit les données de l'école actuelle
   */
  const refreshSchool = useCallback(async () => {
    if (!school) return;
    
    try {
      setLoading(true);
      const refreshedSchool = await schoolService.getSchoolById(school.id);
      setSchool(refreshedSchool);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement des données de l\'école:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du rafraîchissement des données');
    } finally {
      setLoading(false);
    }
  }, [school]);

  // Effet pour charger automatiquement l'école à partir du sous-domaine
  useEffect(() => {
    const subdomain = extractSubdomainFromUrl();
    if (subdomain) {
      loadSchoolBySubdomain(subdomain);
    } else {
      // Si pas de sous-domaine, on est probablement sur la page d'accueil
      setLoading(false);
    }
  }, [loadSchoolBySubdomain]);

  const value = {
    school,
    loading,
    error,
    setSchool,
    loadSchoolBySubdomain,
    refreshSchool
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};