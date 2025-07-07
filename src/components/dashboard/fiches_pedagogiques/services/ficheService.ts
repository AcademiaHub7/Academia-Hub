import { Fiche, FicheFilters, FicheStats, Notification, FicheStatus } from '../types';

// Données factices pour les fiches pédagogiques
const mockFiches: Fiche[] = [
  {
    id: '1',
    title: 'Introduction à l\'algèbre',
    subject: 'math',
    class: '4A',
    level: '4',
    duration: 55,
    date: new Date('2025-07-15'),
    description: 'Introduction aux concepts de base de l\'algèbre pour les élèves de 4ème',
    objectives: ['Comprendre les expressions algébriques', 'Résoudre des équations simples'],
    content: 'Contenu détaillé de la fiche pédagogique...',
    resources: ['Manuel p.45-48', 'Exercices en ligne'],
    status: 'validated',
    createdBy: 'user123',
    createdAt: new Date('2025-06-10'),
    updatedAt: new Date('2025-06-12'),
    validatedBy: 'director456',
    validatedAt: new Date('2025-06-14'),
    isFavorite: true,
    isRecent: true
  },
  {
    id: '2',
    title: 'Les figures de style',
    subject: 'french',
    class: '3B',
    level: '3',
    duration: 50,
    date: new Date('2025-07-18'),
    description: 'Étude des principales figures de style en littérature',
    objectives: ['Identifier les figures de style', 'Comprendre leur effet dans un texte'],
    content: 'Contenu détaillé de la fiche pédagogique...',
    resources: ['Extraits littéraires', 'Fiches récapitulatives'],
    status: 'pending',
    createdBy: 'user123',
    createdAt: new Date('2025-06-20'),
    updatedAt: new Date('2025-06-20'),
    isFavorite: false,
    isRecent: true
  },
  {
    id: '3',
    title: 'La Révolution française',
    subject: 'history',
    class: '4C',
    level: '4',
    duration: 110,
    date: new Date('2025-07-22'),
    description: 'Cours sur les causes et conséquences de la Révolution française',
    objectives: ['Comprendre les causes de la Révolution', 'Analyser les grandes étapes'],
    content: 'Contenu détaillé de la fiche pédagogique...',
    resources: ['Manuel p.78-85', 'Documents historiques'],
    status: 'draft',
    createdBy: 'user123',
    createdAt: new Date('2025-06-25'),
    updatedAt: new Date('2025-06-25'),
    isFavorite: false,
    isRecent: true
  },
  {
    id: '4',
    title: 'Les réactions chimiques',
    subject: 'physics',
    class: '3A',
    level: '3',
    duration: 55,
    date: new Date('2025-07-25'),
    description: 'TP sur les réactions chimiques et leur équilibrage',
    objectives: ['Comprendre le principe de conservation de la masse', 'Équilibrer des équations chimiques'],
    content: 'Contenu détaillé de la fiche pédagogique...',
    resources: ['Manuel p.112-115', 'Matériel de laboratoire'],
    status: 'rejected',
    createdBy: 'user123',
    createdAt: new Date('2025-06-28'),
    updatedAt: new Date('2025-06-30'),
    comments: [
      {
        id: 'c1',
        text: 'Le protocole expérimental manque de précision. Veuillez détailler davantage les étapes.',
        author: 'advisor789',
        createdAt: new Date('2025-06-30'),
        isRead: false
      }
    ],
    isFavorite: false,
    isRecent: true
  }
];

// Notifications factices
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    message: 'Nouvelle fiche à valider',
    date: new Date(),
    read: false,
    link: '#validation',
    relatedFicheId: '2'
  },
  {
    id: '2',
    type: 'success',
    message: 'Fiche "Introduction à l\'algèbre" validée',
    date: new Date(Date.now() - 86400000),
    read: true,
    relatedFicheId: '1'
  },
  {
    id: '3',
    type: 'warning',
    message: 'Commentaire sur votre fiche "Les réactions chimiques"',
    date: new Date(Date.now() - 172800000),
    read: false,
    relatedFicheId: '4'
  }
];

// Service pour gérer les fiches pédagogiques
export const ficheService = {
  // Récupérer toutes les fiches
  getAllFiches: async (): Promise<Fiche[]> => {
    // Simulation d'un appel API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockFiches]);
      }, 300);
    });
  },

  // Récupérer une fiche par son ID
  getFicheById: async (id: string): Promise<Fiche | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fiche = mockFiches.find(f => f.id === id);
        resolve(fiche ? { ...fiche } : undefined);
      }, 200);
    });
  },

  // Filtrer les fiches selon les critères
  filterFiches: async (filters: FicheFilters): Promise<Fiche[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockFiches];
        
        // Filtre par matière
        if (filters.subject) {
          filtered = filtered.filter(f => f.subject === filters.subject);
        }
        
        // Filtre par classe
        if (filters.class) {
          filtered = filtered.filter(f => f.level === filters.class);
        }
        
        // Filtre par statut
        if (filters.status) {
          filtered = filtered.filter(f => f.status === filters.status);
        }
        
        // Filtre par recherche
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(f => 
            f.title.toLowerCase().includes(searchLower) || 
            f.description.toLowerCase().includes(searchLower)
          );
        }
        
        // Filtre par favoris
        if (filters.favorite) {
          filtered = filtered.filter(f => f.isFavorite);
        }
        
        // Filtre par récents
        if (filters.recent) {
          filtered = filtered.filter(f => f.isRecent);
        }
        
        resolve(filtered);
      }, 300);
    });
  },

  // Créer une nouvelle fiche
  createFiche: async (fiche: Omit<Fiche, 'id' | 'createdAt' | 'updatedAt'>): Promise<Fiche> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFiche: Fiche = {
          ...fiche,
          id: `${mockFiches.length + 1}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockFiches.push(newFiche);
        resolve({ ...newFiche });
      }, 400);
    });
  },

  // Mettre à jour une fiche existante
  updateFiche: async (id: string, updates: Partial<Fiche>): Promise<Fiche | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockFiches.findIndex(f => f.id === id);
        if (index !== -1) {
          mockFiches[index] = {
            ...mockFiches[index],
            ...updates,
            updatedAt: new Date()
          };
          resolve({ ...mockFiches[index] });
        } else {
          resolve(undefined);
        }
      }, 400);
    });
  },

  // Supprimer une fiche
  deleteFiche: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockFiches.findIndex(f => f.id === id);
        if (index !== -1) {
          mockFiches.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },

  // Changer le statut d'une fiche
  updateFicheStatus: async (id: string, status: FicheStatus, validatedBy?: string): Promise<Fiche | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockFiches.findIndex(f => f.id === id);
        if (index !== -1) {
          mockFiches[index] = {
            ...mockFiches[index],
            status,
            updatedAt: new Date(),
            ...(status === 'validated' ? {
              validatedBy,
              validatedAt: new Date()
            } : {})
          };
          resolve({ ...mockFiches[index] });
        } else {
          resolve(undefined);
        }
      }, 300);
    });
  },

  // Ajouter/supprimer des favoris
  toggleFavorite: async (id: string): Promise<Fiche | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockFiches.findIndex(f => f.id === id);
        if (index !== -1) {
          mockFiches[index] = {
            ...mockFiches[index],
            isFavorite: !mockFiches[index].isFavorite
          };
          resolve({ ...mockFiches[index] });
        } else {
          resolve(undefined);
        }
      }, 200);
    });
  },

  // Récupérer les statistiques
  getStats: async (): Promise<FicheStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats: FicheStats = {
          created: mockFiches.length,
          validated: mockFiches.filter(f => f.status === 'validated').length,
          pending: mockFiches.filter(f => f.status === 'pending').length,
          rejected: mockFiches.filter(f => f.status === 'rejected').length,
          bySubject: {},
          byClass: {},
          byMonth: {}
        };
        
        // Stats par matière
        mockFiches.forEach(f => {
          if (!stats.bySubject[f.subject]) {
            stats.bySubject[f.subject] = 0;
          }
          stats.bySubject[f.subject]++;
        });
        
        // Stats par classe
        mockFiches.forEach(f => {
          if (!stats.byClass[f.level]) {
            stats.byClass[f.level] = 0;
          }
          stats.byClass[f.level]++;
        });
        
        // Stats par mois
        mockFiches.forEach(f => {
          const month = f.date.toISOString().substring(0, 7); // Format YYYY-MM
          if (!stats.byMonth[month]) {
            stats.byMonth[month] = 0;
          }
          stats.byMonth[month]++;
        });
        
        resolve(stats);
      }, 400);
    });
  },

  // Récupérer les notifications
  getNotifications: async (): Promise<Notification[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockNotifications]);
      }, 200);
    });
  },

  // Marquer une notification comme lue
  markNotificationAsRead: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockNotifications.findIndex(n => n.id === id);
        if (index !== -1) {
          mockNotifications[index] = {
            ...mockNotifications[index],
            read: true
          };
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  }
};
