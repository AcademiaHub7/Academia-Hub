import { 
  Fiche, 
  CompetenceValidation 
} from '../types/Fiche';
import { 
  FicheStats, 
  PedagogicalAnalysis, 
  AdministrativeReport, 
  ExportOptions, 
  ReportData, 
  ReportProgress 
} from '../types/AnalyticsTypes';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private reportsInProgress: Record<string, ReportProgress> = {};

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Statistiques
  public calculateFicheStats(fiches: Fiche[]): FicheStats {
    const stats: FicheStats = {
      total: fiches.length,
      byTeacher: {},
      bySubject: {},
      byLevel: {},
      byStatus: {},
      averageValidationTime: 0,
      averageScore: 0
    };

    fiches.forEach(fiche => {
      // Par enseignant
      stats.byTeacher[fiche.teacherId] = (stats.byTeacher[fiche.teacherId] || 0) + 1;

      // Par matière
      stats.bySubject[fiche.subject] = (stats.bySubject[fiche.subject] || 0) + 1;

      // Par niveau
      stats.byLevel[fiche.level] = (stats.byLevel[fiche.level] || 0) + 1;

      // Par statut
      stats.byStatus[fiche.status] = (stats.byStatus[fiche.status] || 0) + 1;

      // Temps de validation
      if (fiche.validation) {
        const validationTime = Math.abs(
          new Date(fiche.validation.createdAt).getTime() - 
          new Date(fiche.createdAt).getTime()
        );
        stats.averageValidationTime += validationTime;
      }
    });

    // Calcul des moyennes
    stats.averageValidationTime = fiches.length > 0 ? 
      stats.averageValidationTime / fiches.length : 0;

    // Calcul du score moyen
    const validFiches = fiches.filter(f => f.validation?.score);
    stats.averageScore = validFiches.length > 0 ? 
      validFiches.reduce((sum, f) => sum + (f.validation?.score || 0), 0) / validFiches.length : 0;

    return stats;
  }

  // Analyse pédagogique
  public analyzePedagogy(fiches: Fiche[]): PedagogicalAnalysis {
    const analysis: PedagogicalAnalysis = {
      competenceDistribution: {
        cognitive: 0,
        procedural: 0,
        attitudinal: 0
      },
      teachingStrategies: {
        direct: 0,
        collaborative: 0,
        inquiry: 0,
        project: 0
      },
      evaluationMethods: {
        formative: 0,
        summative: 0,
        self: 0,
        peer: 0
      },
      progressionQuality: 0,
      gaps: []
    };

    fiches.forEach(fiche => {
      // Distribution des compétences
      fiche.competences?.forEach(comp => {
        switch (comp.type) {
          case 'cognitive':
            analysis.competenceDistribution.cognitive++;
            break;
          case 'procedural':
            analysis.competenceDistribution.procedural++;
            break;
          case 'attitudinal':
            analysis.competenceDistribution.attitudinal++;
            break;
        }
      });

      // Stratégies d'enseignement
      fiche.activities?.forEach(activity => {
        if (activity.strategy) {
          switch (activity.strategy) {
            case 'direct':
              analysis.teachingStrategies.direct++;
              break;
            case 'collaborative':
              analysis.teachingStrategies.collaborative++;
              break;
            case 'inquiry':
              analysis.teachingStrategies.inquiry++;
              break;
            case 'project':
              analysis.teachingStrategies.project++;
              break;
          }
        }
      });

      // Méthodes d'évaluation
      fiche.evaluations?.forEach(evaluation => {
        if (evaluation.type) {
          switch (evaluation.type) {
            case 'formative':
              analysis.evaluationMethods.formative++;
              break;
            case 'summative':
              analysis.evaluationMethods.summative++;
              break;
            case 'self':
              analysis.evaluationMethods.self++;
              break;
            case 'peer':
              analysis.evaluationMethods.peer++;
              break;
          }
        }
      });

      // Progrès
      if (fiche.activities) {
        const phases = fiche.activities.map(a => a.phase || 0);
        const progression = Math.min(...phases) / 3;
        analysis.progressionQuality += progression;
      }
    });

    // Calcul de la qualité moyenne de progression
    analysis.progressionQuality = fiches.length > 0 ? 
      analysis.progressionQuality / fiches.length : 0;

    // Détection des lacunes
    if (fiches.length > 0) {
      const totalCompetences = fiches.reduce((sum, f) => sum + (f.competences?.length || 0), 0);
      const totalActivities = fiches.reduce((sum, f) => sum + (f.activities?.length || 0), 0);
      const totalEvaluations = fiches.reduce((sum, f) => sum + (f.evaluations?.length || 0), 0);

      if (totalCompetences === 0) {
        analysis.gaps.push('Aucune compétence définie');
      }
      if (totalActivities === 0) {
        analysis.gaps.push('Aucune activité définie');
      }
      if (totalEvaluations === 0) {
        analysis.gaps.push('Aucune évaluation définie');
      }
    }

    return analysis;
  }

  // Rapport administratif
  public generateAdministrativeReport(fiches: Fiche[]): AdministrativeReport {
    const report: AdministrativeReport = {
      preparationRate: 0,
      programCompliance: 0,
      averagePedagogicalQuality: 0,
      trainingNeeds: [],
      practiceEvaluation: {
        strengths: [],
        areasForImprovement: []
      }
    };

    // Taux de préparation
    const prepared = fiches.filter(f => f.status === 'prepared').length;
    report.preparationRate = fiches.length > 0 ? 
      (prepared / fiches.length) * 100 : 0;

    // Conformité au programme
    const compliant = fiches.filter(f => f.programCompliance === true).length;
    report.programCompliance = fiches.length > 0 ? 
      (compliant / fiches.length) * 100 : 0;

    // Qualité pédagogique moyenne
    const validFiches = fiches.filter(f => f.validation?.score);
    report.averagePedagogicalQuality = validFiches.length > 0 ? 
      validFiches.reduce((sum, f) => sum + (f.validation?.score || 0), 0) / validFiches.length : 0;

    // Identification des besoins de formation
    const scores = validFiches.map(f => f.validation?.score || 0);
    if (scores.some(score => score < 0.7)) {
      report.trainingNeeds.push('Amélioration des pratiques pédagogiques');
    }

    // Évaluation des pratiques
    if (report.averagePedagogicalQuality > 0.8) {
      report.practiceEvaluation.strengths.push('Haute qualité pédagogique');
    } else if (report.averagePedagogicalQuality < 0.6) {
      report.practiceEvaluation.areasForImprovement.push('Qualité pédagogique à améliorer');
    }

    return report;
  }

  // Export
  public async generateReport(options: ExportOptions): Promise<ReportProgress> {
    const id = this.generateReportId();
    this.reportsInProgress[id] = {
      status: ReportStatus.GENERATING,
      progress: 0
    };

    try {
      // Simuler la génération (à remplacer par la logique réelle)
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.reportsInProgress[id] = {
        status: ReportStatus.READY,
        progress: 100
      };

      return this.reportsInProgress[id];
    } catch (error) {
      this.reportsInProgress[id] = {
        status: ReportStatus.ERROR,
        progress: 0,
        message: 'Erreur lors de la génération du rapport'
      };
      return this.reportsInProgress[id];
    }
  }

  private generateReportId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  public getReportProgress(id: string): ReportProgress | null {
    return this.reportsInProgress[id] || null;
  }
}
