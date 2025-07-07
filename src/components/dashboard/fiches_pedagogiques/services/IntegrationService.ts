import {
  JournalEntry,
  TextbookEntry,
  ScheduleEntry,
  IntegrationStatus,
  IntegrationAlert
} from '../types/IntegrationTypes';
import { Fiche } from '../types/Fiche';

export class IntegrationService {
  private static instance: IntegrationService;
  private alerts: IntegrationAlert[] = [];
  private status: IntegrationStatus = {
    journal: {
      lastSync: new Date(),
      status: 'synced'
    },
    textbook: {
      lastSync: new Date(),
      status: 'synced'
    },
    schedule: {
      lastSync: new Date(),
      status: 'synced'
    }
  };

  private constructor() {}

  public static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
    }
    return IntegrationService.instance;
  }

  // Cahier journal
  public async syncWithJournal(fiche: Fiche): Promise<JournalEntry> {
    try {
      const entry: JournalEntry = {
        id: this.generateId(),
        date: fiche.date,
        ficheId: fiche.id,
        content: fiche.objectives,
        status: 'planned',
        modifications: []
      };

      // Vérifier la cohérence
      const divergence = this.checkJournalDivergence(fiche, entry);
      if (divergence) {
        this.addAlert({
          type: 'divergence',
          severity: 'warning',
          message: 'Divergence détectée entre la fiche et le journal',
          details: divergence,
          timestamp: new Date()
        });
      }

      this.status.journal = {
        lastSync: new Date(),
        status: 'synced'
      };

      return entry;
    } catch (error) {
      this.status.journal = {
        lastSync: new Date(),
        status: 'error',
        error: error.message
      };
      throw error;
    }
  }

  private checkJournalDivergence(fiche: Fiche, entry: JournalEntry): string | null {
    if (fiche.date !== entry.date) {
      return 'Dates incongruentes';
    }
    if (fiche.objectives !== entry.content) {
      return 'Objectifs différents';
    }
    return null;
  }

  // Cahier de texte
  public async syncWithTextbook(fiche: Fiche): Promise<TextbookEntry> {
    try {
      const entry: TextbookEntry = {
        id: this.generateId(),
        ficheId: fiche.id,
        date: fiche.date,
        content: fiche.description,
        realization: {
          planned: fiche.activities.map(a => a.title),
          completed: [],
          pending: []
        },
        progression: {
          current: 0,
          target: fiche.activities.length
        },
        modifications: []
      };

      // Vérifier la cohérence
      const divergence = this.checkTextbookDivergence(fiche, entry);
      if (divergence) {
        this.addAlert({
          type: 'divergence',
          severity: 'warning',
          message: 'Divergence détectée entre la fiche et le cahier de texte',
          details: divergence,
          timestamp: new Date()
        });
      }

      this.status.textbook = {
        lastSync: new Date(),
        status: 'synced'
      };

      return entry;
    } catch (error) {
      this.status.textbook = {
        lastSync: new Date(),
        status: 'error',
        error: error.message
      };
      throw error;
    }
  }

  private checkTextbookDivergence(fiche: Fiche, entry: TextbookEntry): string | null {
    if (fiche.activities.length !== entry.realization.planned.length) {
      return 'Nombre d'activités différent';
    }
    if (fiche.description !== entry.content) {
      return 'Contenu différent';
    }
    return null;
  }

  // Emploi du temps
  public async syncWithSchedule(fiche: Fiche): Promise<ScheduleEntry> {
    try {
      const entry: ScheduleEntry = {
        id: this.generateId(),
        ficheId: fiche.id,
        slotId: this.generateSlotId(fiche),
        date: fiche.date,
        startTime: fiche.startTime,
        endTime: fiche.endTime,
        room: fiche.room,
        teacher: fiche.teacher,
        status: 'pending',
        constraints: this.generateConstraints(fiche)
      };

      // Vérifier les contraintes
      const constraintIssues = this.checkConstraints(entry);
      if (constraintIssues.length > 0) {
        this.addAlert({
          type: 'constraint',
          severity: 'error',
          message: 'Problèmes de contraintes détectés',
          details: constraintIssues,
          timestamp: new Date()
        });
      }

      this.status.schedule = {
        lastSync: new Date(),
        status: 'synced'
      };

      return entry;
    } catch (error) {
      this.status.schedule = {
        lastSync: new Date(),
        status: 'error',
        error: error.message
      };
      throw error;
    }
  }

  private checkConstraints(entry: ScheduleEntry): string[] {
    const issues: string[] = [];

    // Vérifier les chevauchements
    if (this.checkTimeOverlap(entry)) {
      issues.push('Chevauchement horaire détecté');
    }

    // Vérifier la disponibilité de la salle
    if (this.checkRoomAvailability(entry)) {
      issues.push('Salle non disponible');
    }

    return issues;
  }

  private checkTimeOverlap(entry: ScheduleEntry): boolean {
    // Logique de vérification des chevauchements
    return false;
  }

  private checkRoomAvailability(entry: ScheduleEntry): boolean {
    // Logique de vérification de la disponibilité de la salle
    return false;
  }

  // Gestion des modifications
  public async handleModification(
    fiche: Fiche,
    changes: Record<string, any>
  ): Promise<void> {
    try {
      // Mise à jour du journal
      if ('date' in changes || 'objectives' in changes) {
        await this.syncWithJournal(fiche);
      }

      // Mise à jour du cahier de texte
      if ('activities' in changes || 'description' in changes) {
        await this.syncWithTextbook(fiche);
      }

      // Mise à jour de l'emploi du temps
      if (
        'date' in changes ||
        'startTime' in changes ||
        'endTime' in changes ||
        'room' in changes
      ) {
        await this.syncWithSchedule(fiche);
      }
    } catch (error) {
      this.addAlert({
        type: 'modification',
        severity: 'error',
        message: 'Erreur lors de la synchronisation après modification',
        details: error,
        timestamp: new Date()
      });
      throw error;
    }
  }

  // Gestion des alertes
  private addAlert(alert: IntegrationAlert): void {
    this.alerts.push(alert);
    // Logique de notification (à implémenter)
  }

  public getAlerts(): IntegrationAlert[] {
    return [...this.alerts];
  }

  public clearAlerts(): void {
    this.alerts = [];
  }

  // Utilitaires
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateSlotId(fiche: Fiche): string {
    return `${fiche.teacher}-${fiche.date.toISOString()}-${fiche.startTime}`;
  }

  private generateConstraints(fiche: Fiche): ScheduleConstraint[] {
    return [
      { type: 'time', value: `${fiche.startTime}-${fiche.endTime}`, priority: 1 },
      { type: 'room', value: fiche.room, priority: 2 },
      { type: 'teacher', value: fiche.teacher, priority: 3 },
      { type: 'student', value: fiche.group, priority: 4 }
    ];
  }

  // Statut
  public getStatus(): IntegrationStatus {
    return { ...this.status };
  }
}
