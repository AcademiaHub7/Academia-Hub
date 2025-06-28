/**
 * Trait TenantAware - Fournit des fonctionnalités communes pour les modèles multi-tenant
 * @module traits/TenantAware
 */

import { School } from '../models/School';
import { api } from '../services/api/client';

/**
 * Interface pour les modèles qui implémentent le trait TenantAware
 */
export interface TenantAwareModel {
  tenant_id: string;
}

/**
 * Classe de trait pour la logique multi-tenant
 * Fournit des méthodes réutilisables pour les modèles liés à un tenant
 */
export class TenantAware {
  /**
   * Vérifie si un modèle appartient à un tenant spécifique
   * @param model - Modèle à vérifier
   * @param tenantId - ID du tenant
   * @returns boolean
   */
  static belongsToTenant(model: TenantAwareModel, tenantId: string): boolean {
    return model.tenant_id === tenantId;
  }

  /**
   * Récupère l'école (tenant) associée à un modèle
   * @param model - Modèle tenant-aware
   * @returns Promise<School | null>
   */
  static async getSchool(model: TenantAwareModel): Promise<School | null> {
    try {
      const response = await api.get<{ data: Record<string, unknown> }>(`/schools/${model.tenant_id}`);
      return new School(response.data.data as Record<string, unknown>);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'école:', error);
      return null;
    }
  }

  /**
   * Vérifie si le tenant est actif
   * @param model - Modèle tenant-aware
   * @returns Promise<boolean>
   */
  static async isTenantActive(model: TenantAwareModel): Promise<boolean> {
    const school = await this.getSchool(model);
    return school ? school.isActive() : false;
  }

  /**
   * Filtre une liste de modèles par tenant
   * @param models - Liste de modèles
   * @param tenantId - ID du tenant
   * @returns Array de modèles filtrés
   */
  static filterByTenant<T extends TenantAwareModel>(models: T[], tenantId: string): T[] {
    return models.filter(model => model.tenant_id === tenantId);
  }

  /**
   * Récupère l'ID du tenant courant depuis le contexte (pour les applications frontend)
   * @returns string | null
   */
  static getCurrentTenantId(): string | null {
    // Récupérer depuis le localStorage ou le contexte de l'application
    return localStorage.getItem('current_tenant_id');
  }

  /**
   * Définit l'ID du tenant courant dans le contexte (pour les applications frontend)
   * @param tenantId - ID du tenant
   */
  static setCurrentTenantId(tenantId: string): void {
    localStorage.setItem('current_tenant_id', tenantId);
  }

  /**
   * Efface l'ID du tenant courant du contexte (pour les applications frontend)
   */
  static clearCurrentTenantId(): void {
    localStorage.removeItem('current_tenant_id');
  }

  /**
   * Récupère le sous-domaine du tenant courant (pour les applications frontend)
   * @returns string | null
   */
  static getCurrentSubdomain(): string | null {
    // Extraire le sous-domaine de l'URL actuelle
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Si nous avons un sous-domaine (ex: ecole.academiahub.com)
    if (parts.length > 2 && parts[0] !== 'www') {
      return parts[0];
    }
    
    return null;
  }

  /**
   * Ajoute l'ID du tenant courant à un objet
   * @param obj - Objet à enrichir avec l'ID du tenant
   * @returns Objet avec l'ID du tenant ajouté
   */
  static withTenantId<T extends Record<string, unknown>>(obj: T): T & Partial<TenantAwareModel> {
    // Si l'objet a déjà un tenant_id, on ne le modifie pas
    if ('tenant_id' in obj && obj.tenant_id) {
      return obj;
    }
    
    // Récupérer l'ID du tenant courant
    const currentTenantId = this.getCurrentTenantId();
    
    // Si aucun tenant courant n'est défini, retourner l'objet tel quel
    if (!currentTenantId) {
      return obj;
    }
    
    // Créer une copie de l'objet avec l'ID du tenant ajouté
    return {
      ...obj,
      tenant_id: currentTenantId
    };
  }
}

export default TenantAware;
