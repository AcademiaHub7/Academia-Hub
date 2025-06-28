/**
 * Trait StatusTransition - Gère les transitions de statut pour les modèles
 * @module traits/StatusTransition
 */

/**
 * Interface pour les modèles qui implémentent le trait StatusTransition
 */
export interface StatusAwareModel<T extends string> {
  status: T;
  updated_at: string;
}

/**
 * Type pour définir les transitions de statut possibles
 */
export type StatusTransitions<T extends string> = Record<T, T[]>;

/**
 * Classe de trait pour la gestion des transitions de statut
 * Fournit des méthodes réutilisables pour gérer les changements de statut
 */
export class StatusTransition<T extends string> {
  private model: StatusAwareModel<T>;
  private transitions: StatusTransitions<T>;
  private statusChangeCallbacks: Partial<Record<T, () => Promise<void>>>;

  /**
   * Constructeur du trait StatusTransition
   * @param model - Modèle avec un statut
   * @param transitions - Définition des transitions possibles
   */
  constructor(model: StatusAwareModel<T>, transitions: StatusTransitions<T>) {
    this.model = model;
    this.transitions = transitions;
    this.statusChangeCallbacks = {};
  }

  /**
   * Vérifie si une transition de statut est valide
   * @param fromStatus - Statut actuel
   * @param toStatus - Statut cible
   * @returns boolean
   */
  isValidTransition(fromStatus: T, toStatus: T): boolean {
    // Si les statuts sont identiques, c'est valide
    if (fromStatus === toStatus) {
      return true;
    }
    
    // Vérifier si la transition est définie
    const allowedTransitions = this.transitions[fromStatus];
    return allowedTransitions ? allowedTransitions.includes(toStatus) : false;
  }

  /**
   * Enregistre un callback à exécuter lors d'un changement de statut
   * @param status - Statut qui déclenche le callback
   * @param callback - Fonction à exécuter
   */
  onStatusChange(status: T, callback: () => Promise<void>): void {
    this.statusChangeCallbacks[status] = callback;
  }

  /**
   * Change le statut du modèle si la transition est valide
   * @param newStatus - Nouveau statut
   * @returns Promise<boolean>
   */
  async changeStatus(newStatus: T): Promise<boolean> {
    const currentStatus = this.model.status;
    
    // Vérifier si la transition est valide
    if (!this.isValidTransition(currentStatus, newStatus)) {
      console.error(`Transition de statut invalide: ${currentStatus} -> ${newStatus}`);
      return false;
    }
    
    // Mettre à jour le statut
    this.model.status = newStatus;
    this.model.updated_at = new Date().toISOString();
    
    // Exécuter le callback si défini
    if (this.statusChangeCallbacks[newStatus]) {
      try {
        await this.statusChangeCallbacks[newStatus]!();
      } catch (error) {
        console.error(`Erreur lors de l'exécution du callback pour le statut ${newStatus}:`, error);
      }
    }
    
    return true;
  }

  /**
   * Obtient les transitions possibles à partir du statut actuel
   * @returns T[]
   */
  getPossibleTransitions(): T[] {
    return this.transitions[this.model.status] || [];
  }

  /**
   * Vérifie si le modèle a un statut spécifique
   * @param status - Statut à vérifier
   * @returns boolean
   */
  hasStatus(status: T): boolean {
    return this.model.status === status;
  }
}

export default StatusTransition;
