/**
 * Données simulées pour le développement
 * Ce fichier fournit des données fictives pour permettre le développement sans backend
 */

import { PaymentStatus } from '../../types/common';

// Générer un ID unique
export const generateId = () => `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Session d'inscription simulée
export const mockSession = {
  id: generateId(),
  status: 'pending',
  promoter: {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    position: '',
    emailVerified: false
  },
  school: {
    name: '',
    type: '',
    address: '',
    subdomain: '',
    country: '',
    city: '',
    postalCode: '',
    phone: '',
    website: '',
    foundedYear: null,
    numberOfStudents: null
  },
  plan: null,
  payment: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {}
};

// Transaction de paiement simulée
export const mockPayment = {
  payment_url: 'https://pay.example.com/checkout',
  transaction_id: generateId()
};

// Statut de paiement simulé
export const mockPaymentStatus = {
  status: PaymentStatus.COMPLETED as PaymentStatus,
  message: 'Paiement effectué avec succès'
};

// Activer les logs pour le mode mock
export const logMockData = (methodName: string, endpoint: string, data?: any) => {
  console.log(`%c[MOCK API] ${methodName} ${endpoint}`, 'color: orange; font-weight: bold');
  if (data) {
    console.log('%cInput Data:', 'color: blue', data);
  }
};

// Fonction utilitaire pour simuler un délai de réseau
export const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
