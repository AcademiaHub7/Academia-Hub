import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Fiche, FicheFilters, FicheStats, Notification } from '../types';
import { ficheService } from '../services/ficheService';

// Interface pour le contexte
interface FicheContextType {
  // Données
  fiches: Fiche[];
  selectedFiche: Fiche | null;
  stats: FicheStats | null;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  
  // Filtres
  filters: FicheFilters;
  setFilters: (filters: FicheFilters) => void;
  
  // Actions
  fetchFiches: () => Promise<void>;
  getFicheById: (id: string) => Promise<void>;
  createFiche: (fiche: Omit<Fiche, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFiche: (id: string, updates: Partial<Fiche>) => Promise<void>;
  deleteFiche: (id: string) => Promise<void>;
  updateFicheStatus: (id: string, status: Fiche['status'], validatedBy?: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

// Création du contexte
const FicheContext = createContext<FicheContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useFicheContext = () => {
  const context = useContext(FicheContext);
  if (!context) {
    throw new Error('useFicheContext must be used within a FicheProvider');
  }
  return context;
};

// Props pour le provider
interface FicheProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const FicheProvider: React.FC<FicheProviderProps> = ({ children }) => {
  // États
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [selectedFiche, setSelectedFiche] = useState<Fiche | null>(null);
  const [stats, setStats] = useState<FicheStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filtres
  const [filters, setFilters] = useState<FicheFilters>({
    subject: '',
    class: '',
    status: '',
    period: 'all',
    search: '',
    favorite: false,
    recent: false
  });
  
  // Charger les fiches initiales
  useEffect(() => {
    fetchFiches();
    fetchStats();
    fetchNotifications();
  }, []);
  
  // Charger les fiches filtrées lorsque les filtres changent
  useEffect(() => {
    applyFilters();
  }, [filters]);
  
  // Récupérer toutes les fiches
  const fetchFiches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ficheService.getAllFiches();
      setFiches(data);
    } catch (err) {
      setError('Erreur lors du chargement des fiches');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Appliquer les filtres
  const applyFilters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ficheService.filterFiches(filters);
      setFiches(data);
    } catch (err) {
      setError('Erreur lors de l\'application des filtres');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Récupérer une fiche par son ID
  const getFicheById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fiche = await ficheService.getFicheById(id);
      setSelectedFiche(fiche || null);
    } catch (err) {
      setError('Erreur lors du chargement de la fiche');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Créer une nouvelle fiche
  const createFiche = async (fiche: Omit<Fiche, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newFiche = await ficheService.createFiche(fiche);
      setFiches(prev => [...prev, newFiche]);
      fetchStats(); // Mettre à jour les statistiques
    } catch (err) {
      setError('Erreur lors de la création de la fiche');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mettre à jour une fiche
  const updateFiche = async (id: string, updates: Partial<Fiche>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedFiche = await ficheService.updateFiche(id, updates);
      if (updatedFiche) {
        setFiches(prev => prev.map(f => f.id === id ? updatedFiche : f));
        if (selectedFiche && selectedFiche.id === id) {
          setSelectedFiche(updatedFiche);
        }
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de la fiche');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Supprimer une fiche
  const deleteFiche = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await ficheService.deleteFiche(id);
      if (success) {
        setFiches(prev => prev.filter(f => f.id !== id));
        if (selectedFiche && selectedFiche.id === id) {
          setSelectedFiche(null);
        }
        fetchStats(); // Mettre à jour les statistiques
      }
    } catch (err) {
      setError('Erreur lors de la suppression de la fiche');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mettre à jour le statut d'une fiche
  const updateFicheStatus = async (id: string, status: Fiche['status'], validatedBy?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedFiche = await ficheService.updateFicheStatus(id, status, validatedBy);
      if (updatedFiche) {
        setFiches(prev => prev.map(f => f.id === id ? updatedFiche : f));
        if (selectedFiche && selectedFiche.id === id) {
          setSelectedFiche(updatedFiche);
        }
        fetchStats(); // Mettre à jour les statistiques
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ajouter/supprimer des favoris
  const toggleFavorite = async (id: string) => {
    try {
      const updatedFiche = await ficheService.toggleFavorite(id);
      if (updatedFiche) {
        setFiches(prev => prev.map(f => f.id === id ? updatedFiche : f));
        if (selectedFiche && selectedFiche.id === id) {
          setSelectedFiche(updatedFiche);
        }
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour des favoris');
      console.error(err);
    }
  };
  
  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
      const statsData = await ficheService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques', err);
    }
  };
  
  // Récupérer les notifications
  const fetchNotifications = async () => {
    try {
      const notifs = await ficheService.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error('Erreur lors du chargement des notifications', err);
    }
  };
  
  // Marquer une notification comme lue
  const markNotificationAsRead = async (id: string) => {
    try {
      const success = await ficheService.markNotificationAsRead(id);
      if (success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la notification', err);
    }
  };
  
  // Valeur du contexte
  const value: FicheContextType = {
    fiches,
    selectedFiche,
    stats,
    notifications,
    isLoading,
    error,
    filters,
    setFilters,
    fetchFiches,
    getFicheById,
    createFiche,
    updateFiche,
    deleteFiche,
    updateFicheStatus,
    toggleFavorite,
    markNotificationAsRead
  };
  
  return (
    <FicheContext.Provider value={value}>
      {children}
    </FicheContext.Provider>
  );
};
