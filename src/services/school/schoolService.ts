/**
 * Service pour la gestion des écoles (tenants)
 * @module services/school/schoolService
 */

import { api } from '../api/client';
import { School, SchoolCreateData } from '../../types/school';

/**
 * Interface pour les réponses API des écoles
 */
interface SchoolResponse {
  data: School;
  message: string;
}

/**
 * Interface pour les réponses API de liste d'écoles
 */
interface SchoolListResponse {
  data: School[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

/**
 * Service pour la gestion des écoles
 */
export const schoolService = {
  /**
   * Récupère une école par son ID
   * @param id - ID de l'école
   * @returns Promesse avec les données de l'école
   */
  async getSchoolById(id: string): Promise<School> {
    const response = await api.get<SchoolResponse>(`/schools/${id}`);
    return response.data;
  },

  /**
   * Récupère une école par son sous-domaine
   * @param subdomain - Sous-domaine de l'école
   * @returns Promesse avec les données de l'école
   */
  async getSchoolBySubdomain(subdomain: string): Promise<School> {
    const response = await api.get<SchoolResponse>(`/schools/subdomain/${subdomain}`);
    return response.data;
  },

  /**
   * Crée une nouvelle école
   * @param schoolData - Données de l'école à créer
   * @returns Promesse avec les données de l'école créée
   */
  async createSchool(schoolData: SchoolCreateData): Promise<School> {
    const response = await api.post<SchoolResponse>('/schools', schoolData);
    return response.data;
  },

  /**
   * Met à jour une école
   * @param id - ID de l'école
   * @param schoolData - Données de l'école à mettre à jour
   * @returns Promesse avec les données de l'école mise à jour
   */
  async updateSchool(id: string, schoolData: Partial<School>): Promise<School> {
    const response = await api.put<SchoolResponse>(`/schools/${id}`, schoolData);
    return response.data;
  },

  /**
   * Change le statut d'une école
   * @param id - ID de l'école
   * @param status - Nouveau statut
   * @returns Promesse avec les données de l'école mise à jour
   */
  async updateSchoolStatus(id: string, status: School['status']): Promise<School> {
    const response = await api.put<SchoolResponse>(`/schools/${id}/status`, { status });
    return response.data;
  },

  /**
   * Met à jour le statut KYC d'une école
   * @param id - ID de l'école
   * @param kycStatus - Nouveau statut KYC
   * @returns Promesse avec les données de l'école mise à jour
   */
  async updateKycStatus(id: string, kycStatus: School['kyc_status']): Promise<School> {
    const response = await api.put<SchoolResponse>(`/schools/${id}/kyc-status`, { kyc_status: kycStatus });
    return response.data;
  },

  /**
   * Liste toutes les écoles (pour les administrateurs système)
   * @param page - Numéro de page
   * @param limit - Limite par page
   * @returns Promesse avec la liste des écoles
   */
  async listSchools(page = 1, limit = 10): Promise<SchoolListResponse> {
    return api.get<SchoolListResponse>('/schools', {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  },
};
