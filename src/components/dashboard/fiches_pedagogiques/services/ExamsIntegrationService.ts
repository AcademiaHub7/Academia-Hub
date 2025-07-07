import {
  Assessment,
  AssessmentCriteria,
  Grade,
  CompetencyProgress,
  AssessmentAnalysis,
  ExamIntegrationStatus,
  AssessmentRubric,
  ProgressTrend
} from '../types/ExamsIntegrationTypes';
import { Fiche } from '../types/Fiche';

export class ExamsIntegrationService {
  private static instance: ExamsIntegrationService;
  private assessments: Assessment[] = [];
  private grades: Grade[] = [];
  private progress: Record<string, CompetencyProgress> = {};

  private constructor() {}

  public static getInstance(): ExamsIntegrationService {
    if (!ExamsIntegrationService.instance) {
      ExamsIntegrationService.instance = new ExamsIntegrationService();
    }
    return ExamsIntegrationService.instance;
  }

  // Synchronisation avec les évaluations prévues
  public async syncWithAssessments(fiche: Fiche): Promise<Assessment[]> {
    try {
      const assessments = this.generateAssessmentsFromFiche(fiche);
      this.assessments = [...this.assessments, ...assessments];
      return assessments;
    } catch (error) {
      console.error('Erreur de synchronisation des évaluations:', error);
      throw error;
    }
  }

  private generateAssessmentsFromFiche(fiche: Fiche): Assessment[] {
    const assessments: Assessment[] = [];

    // Générer une évaluation par compétence
    fiche.competences.forEach((competency: Fiche['competences'][0]) => {
      const assessment: Assessment = {
        id: this.generateId(),
        ficheId: fiche.id,
        date: fiche.createdAt,
        type: this.determineAssessmentType(fiche),
        competencies: [competency.id],
        criteria: this.generateCriteriaFromCompetency(competency),
        status: 'planned'
      };
      assessments.push(assessment);
    });

    return assessments;
  }

  private determineAssessmentType(fiche: Fiche): Assessment['type'] {
    if (fiche.evaluations?.type === 'formative') {
      return 'formative';
    } else if (fiche.evaluations?.type === 'summative') {
      return 'summative';
    }
    return 'continuous';
  }

  private generateCriteriaFromCompetency(competency: Fiche['competences'][0]): AssessmentCriteria[] {
    const criteria: AssessmentCriteria[] = [];

    // Générer des critères basés sur les indicateurs de la compétence
    competency.indicators?.forEach((indicator: { description: string }) => {
      const criterion: AssessmentCriteria = {
        id: this.generateId(),
        description: indicator.description,
        weight: 100 / competency.indicators.length,
        competency: competency.id,
        rubric: this.generateRubric()
      };
      criteria.push(criterion);
    });

    return criteria;
  }

  private generateRubric(): AssessmentRubric {
    return {
      id: this.generateId(),
      levels: [
        { id: '0', score: 0, description: 'Insuffisant', indicators: ['Non atteint'] },
        { id: '1', score: 1, description: 'Partiellement atteint', indicators: ['Partiellement réussi'] },
        { id: '2', score: 2, description: 'Atteint', indicators: ['Atteint'] },
        { id: '3', score: 3, description: 'Excellence', indicators: ['Excellence'] }
      ],
      type: 'numeric'
    };
  }

  // Suivi des compétences évaluées
  public async trackCompetencyProgress(): Promise<Record<string, CompetencyProgress>> {
    try {
      const progress: Record<string, CompetencyProgress> = {};

      // Calculer la progression pour chaque compétence
      this.assessments.forEach(assessment => {
        const competency = assessment.competencies[0];
        if (!progress[competency]) {
          progress[competency] = {
            competency,
            assessments: [],
            scores: [],
            average: 0,
            trends: []
          };
        }

        progress[competency].assessments.push(assessment.id);
      });

      // Calculer les scores moyens
      Object.values(progress).forEach((compProgress: CompetencyProgress) => {
        const relatedGrades = this.grades.filter(
          grade => compProgress.assessments.includes(grade.assessmentId)
        );

        compProgress.scores = relatedGrades.map(grade => {
          return Object.values(grade.scores).reduce((a, b) => a + b, 0) / 
            Object.keys(grade.scores).length;
        });

        compProgress.average = compProgress.scores.reduce((a, b) => a + b, 0) / 
          compProgress.scores.length;

        // Calculer les tendances
        compProgress.trends = this.calculateTrends(compProgress.scores);
      });

      this.progress = progress;
      return progress;
    } catch (error) {
      console.error('Erreur de calcul de la progression:', error);
      throw error;
    }
  }

  private calculateTrends(scores: number[]): ProgressTrend[] {
    const trends: ProgressTrend[] = [];
    const periods = Math.floor(scores.length / 4);

    for (let i = 0; i < periods; i++) {
      const start = i * 4;
      const end = (i + 1) * 4;
      const periodScores = scores.slice(start, end);
      const average = periodScores.reduce((a, b) => a + b, 0) / periodScores.length;

      const direction = this.determineTrendDirection(
        i === 0 ? 0 : trends[i - 1].value,
        average
      );

      trends.push({
        period: `P${i + 1}`,
        value: average,
        direction,
        comments: this.generateTrendComments(average, direction)
      });
    }

    return trends;
  }

  private determineTrendDirection(prev: number, current: number): ProgressTrend['direction'] {
    if (current > prev) return 'up';
    if (current < prev) return 'down';
    return 'stable';
  }

  private generateTrendComments(average: number, direction: ProgressTrend['direction']): string {
    const comments = {
      up: 'Progression positive observée',
      down: 'Progression en baisse',
      stable: 'Stabilité des performances'
    };
    return `${comments[direction]} (Moyenne: ${average.toFixed(2)})`;
  }

  // Analyse des résultats
  public async analyzeAssessments(): Promise<AssessmentAnalysis> {
    try {
      const analysis: AssessmentAnalysis = {
        competencyDistribution: {},
        criteriaCoverage: {},
        gradeTrends: [],
        correlation: []
      };

      // Distribution des compétences
      this.assessments.forEach(assessment => {
        assessment.competencies.forEach(competency => {
          analysis.competencyDistribution[competency] = 
            (analysis.competencyDistribution[competency] || 0) + 1;
        });
      });

      // Couverture des critères
      this.assessments.forEach(assessment => {
        assessment.criteria.forEach(criterion => {
          analysis.criteriaCoverage[criterion.id] = 
            (analysis.criteriaCoverage[criterion.id] || 0) + 1;
        });
      });

      // Tendances des notes
      analysis.gradeTrends = this.calculateOverallTrends();

      // Corrélations
      analysis.correlation = this.calculateCorrelations();

      return analysis;
    } catch (error) {
      console.error('Erreur d\'analyse des évaluations:', error);
      throw error;
    }
  }

  private calculateOverallTrends(): ProgressTrend[] {
    const allScores = this.grades.flatMap(grade => 
      Object.values(grade.scores)
    );

    return this.calculateTrends(allScores);
  }

  private calculateCorrelations(): AssessmentAnalysis['correlation'] {
    const correlations: AssessmentAnalysis['correlation'] = [];

    // Calculer les corrélations entre compétences et critères
    this.assessments.forEach(assessment => {
      assessment.competencies.forEach(competency => {
        assessment.criteria.forEach(criterion => {
          correlations.push({
            competency,
            criteria: criterion.id,
            correlation: Math.random() * 0.9 + 0.1, // Simuler une corrélation
            significance: Math.random() * 0.05 + 0.95
          });
        });
      });
    });

    return correlations;
  }

  // Statut d'intégration
  public getStatus(): ExamIntegrationStatus {
    const status: ExamIntegrationStatus = {
      assessments: {
        planned: this.assessments.filter(a => a.status === 'planned').length,
        completed: this.assessments.filter(a => a.status === 'completed').length,
        pending: this.assessments.filter(a => a.status === 'in_progress').length
      },
      grades: {
        total: this.grades.length,
        validated: this.grades.filter(g => g.status === 'validated').length,
        pending: this.grades.filter(g => g.status === 'draft').length
      },
      coverage: {
        competencies: this.assessments.reduce((acc, a) => 
          acc + new Set(a.competencies).size, 0
        ),
        criteria: this.assessments.reduce((acc, a) => 
          acc + a.criteria.length, 0
        ),
        rubrics: this.assessments.reduce((acc, a) => 
          acc + a.criteria.reduce((a, c) => a + 1, 0), 0
        )
      },
      warnings: this.generateWarnings()
    };

    return status;
  }

  private generateWarnings(): string[] {
    const warnings: string[] = [];

    // Vérifier la couverture des compétences
    const competencyCoverage = this.assessments.reduce((acc, a) => {
      a.competencies.forEach(c => {
        acc[c] = (acc[c] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    Object.entries(competencyCoverage).forEach(([competency, count]) => {
      if (count < 2) {
        warnings.push(`Compétence ${competency} peu évaluée (${count} fois)`);
      }
    });

    // Vérifier les critères non couverts
    const criteriaCoverage = this.assessments.reduce((acc, a) => {
      a.criteria.forEach(c => {
        acc[c.id] = (acc[c.id] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    Object.entries(criteriaCoverage).forEach(([criteria, count]) => {
      if (count < 1) {
        warnings.push(`Critère ${criteria} non évalué`);
      }
    });

    return warnings;
  }

  // Utilitaires
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
