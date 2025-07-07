import { Fiche } from '../types/Fiche';
import { 
  CompetenceAnalysis, 
  ActivityAnalysis, 
  PedagogicalAnalysis, 
  CompetenceValidation,
  CompetenceValidationResult, 
  ValidationStatus,
  EvaluationType
} from '../types/CompetenceValidationTypes';

// Service de validation des fiches pédagogiques basé sur les compétences
export class CompetenceValidationService {
  private static instance: CompetenceValidationService;
  private constructor() {}

  public static getInstance(): CompetenceValidationService {
    if (!CompetenceValidationService.instance) {
      CompetenceValidationService.instance = new CompetenceValidationService();
    }
    return CompetenceValidationService.instance;
  }

  private calculateTaxonomicLevel(fiche: Fiche): number {
    const levelMap = {
      remember: 1,
      understand: 2,
      apply: 3,
      analyze: 4,
      evaluate: 5,
      create: 6
    } as const;
    
    const objectives = fiche.objectives || [];
    let totalLevel = 0;
    let count = 0;
    
    for (const obj of objectives) {
      const verbs = obj.description?.toLowerCase().match(/\b(remember|understand|apply|analyze|evaluate|create)\b/g);
      if (verbs) {
        const verb = verbs[0] as keyof typeof levelMap;
        totalLevel += levelMap[verb];
        count++;
      }
    }
    
    return count > 0 ? totalLevel / count : 3;
  }

  private analyzeCompetences(fiche: Fiche): CompetenceAnalysis[] {
    return (fiche.competences || []).map(competence => ({
      type: competence.type,
      present: true,
      score: 1,
      recommendations: []
    }));
  }

  private analyzeActivities(fiche: Fiche): ActivityAnalysis[] {
    return (fiche.activities || []).map(activity => ({
      id: activity.id,
      durationValid: activity.duration >= 0,
      materialValid: activity.materials.every(m => m.available),
      phaseValid: activity.phase >= 1 && activity.phase <= 3,
      recommendations: []
    }));
  }

  private analyzePedagogy(fiche: Fiche): PedagogicalAnalysis {
    const coherenceScore = this.calculateCoherenceScore(fiche);
    const progressionScore = this.calculateProgressionScore(fiche);
    const taxonomicLevel = this.calculateTaxonomicLevel(fiche);
    const evaluationScore = this.calculateEvaluationScore(fiche);
    const programCompliance = this.checkProgramCompliance(fiche);

    return {
      coherenceScore,
      progressionScore,
      taxonomicLevel,
      evaluationScore,
      programCompliance,
      recommendations: []
    };
  }

  private calculateCoherenceScore(fiche: Fiche): number {
    const objectives = fiche.objectives || [];
    const activities = fiche.activities || [];
    
    const totalPairs = objectives.length * activities.length;
    let matchingPairs = 0;

    objectives.forEach(obj => {
      activities.forEach(act => {
        if (obj.description.toLowerCase().includes(act.description.toLowerCase())) {
          matchingPairs++;
        }
      });
    });

    return totalPairs > 0 ? matchingPairs / totalPairs : 0;
  }

  private calculateProgressionScore(fiche: Fiche): number {
    const activities = fiche.activities || [];
    
    const phaseCounts: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0
    };

    activities.forEach(act => {
      const phase = act.phase;
      if (phase >= 1 && phase <= 3) {
        phaseCounts[phase] = (phaseCounts[phase] || 0) + 1;
      }
    });

    const totalPhases = activities.length * 3;
    const achievedPhases = Object.values(phaseCounts).reduce((sum: number, count: number) => {
      return sum + count;
    }, 0);

    return totalPhases > 0 ? achievedPhases / totalPhases : 0;
  }

  private calculateEvaluationScore(fiche: Fiche): number {
    const evaluations = fiche.evaluations || [];
    
    const typeCounts: Record<EvaluationType, number> = {
      formative: 0,
      summative: 0,
      diagnostic: 0
    };

    evaluations.forEach(evaluation => {
      const type = evaluation.type as EvaluationType;
      if (type in typeCounts) {
        typeCounts[type]++;
      }
    });

    const diversityScore = Object.values(typeCounts).filter((count: number) => count > 0).length / 3;
    const coverageScore = evaluations.length / 3;

    return (diversityScore + coverageScore) / 2;
  }

  private checkProgramCompliance(fiche: Fiche): boolean {
    if (!fiche.programId || !fiche.competences?.length) {
      return false;
    }

    // TODO: Implémentation de la vérification de conformité avec le programme
    // Pour une implémentation complète, nous devrions :
    // 1. Récupérer les détails du programme à partir de programId
    // 2. Vérifier la conformité des compétences avec les exigences du programme
    // 3. Vérifier l'ordre des compétences selon le programme

    // Pour l'instant, nous retournons true car nous n'avons pas accès aux détails du programme
    return true;
  }

  private generateSuggestions(fiche: Fiche): {
    improvements: string[];
    alternatives: string[];
    methodological: string[];
    warnings: string[];
    qualityScore: number;
  } {
    const suggestions = {
      improvements: [] as string[],
      alternatives: [] as string[],
      methodological: [] as string[],
      warnings: [] as string[],
      qualityScore: 0
    };

    if (!fiche.competences?.length) {
      suggestions.warnings.push('Aucune compétence définie');
    }

    if (!fiche.activities?.length) {
      suggestions.warnings.push('Aucune activité définie');
    }

    const phases = [1, 2, 3];
    const activityPhases = fiche.activities?.map(a => a.phase) || [];

    phases.forEach((phase, index) => {
      if (!activityPhases.includes(phase)) {
        const phaseName = ['introduction', 'développement', 'conclusion'][index];
        suggestions.improvements.push(`Ajouter une phase d'${phaseName}`);
      }
    });

    if (!fiche.evaluations?.length) {
      suggestions.warnings.push('Aucune évaluation définie');
    } else {
      const evalTypes = fiche.evaluations.map(e => e.type);
      if (!evalTypes.includes('formative')) {
        suggestions.improvements.push('Ajouter une évaluation formative');
      }
      if (!evalTypes.includes('summative')) {
        suggestions.improvements.push('Ajouter une évaluation sommative');
      }
      if (!evalTypes.includes('diagnostic')) {
        suggestions.alternatives.push('Considérer une évaluation diagnostique');
      }
    }

    suggestions.qualityScore = (
      (suggestions.improvements.length * 0.3) +
      (suggestions.alternatives.length * 0.2) +
      (suggestions.methodological.length * 0.2) +
      (suggestions.warnings.length * 0.3)
    ) / 4;

    return suggestions;
  }

  public validateFiche(fiche: Fiche): CompetenceValidationResult {
    const competencesAnalysis = this.analyzeCompetences(fiche);
    const activitiesAnalysis = this.analyzeActivities(fiche);
    const pedagogyAnalysis = this.analyzePedagogy(fiche);
    const suggestions = this.generateSuggestions(fiche);
    
    const competenceScore = competencesAnalysis.reduce(
      (sum: number, c: CompetenceAnalysis) => sum + (c.present ? 1 : 0),
      0
    ) / (competencesAnalysis.length || 1);

    const activityScore = activitiesAnalysis.reduce(
      (sum: number, a: ActivityAnalysis) => 
        sum + (a.durationValid && a.materialValid && a.phaseValid ? 1 : 0),
      0
    ) / (activitiesAnalysis.length || 1);

    const pedagogyScore = (
      pedagogyAnalysis.coherenceScore +
      pedagogyAnalysis.progressionScore +
      pedagogyAnalysis.evaluationScore +
      (pedagogyAnalysis.programCompliance ? 1 : 0)
    ) / 4;

    const status = this.determineStatus(
      competencesAnalysis,
      activitiesAnalysis,
      pedagogyAnalysis
    );

    const validation: CompetenceValidation = {
      ficheId: fiche.id,
      competences: competencesAnalysis,
      activities: activitiesAnalysis,
      pedagogicalAnalysis: pedagogyAnalysis,
      workflow: {
        status: status,
        currentStep: 'completed',
        history: [
          {
            step: 'validation',
            timestamp: new Date(),
            comments: []
          }
        ],
        notifications: []
      },
      score: (competenceScore + activityScore + pedagogyScore) / 3,
      overallStatus: status,
      recommendations: suggestions.improvements.concat(
        suggestions.alternatives,
        suggestions.methodological,
        suggestions.warnings
      ),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return {
      fiche,
      validation,
      suggestions: {
        improvements: suggestions.improvements,
        alternatives: suggestions.alternatives,
        methodological: suggestions.methodological,
        warnings: suggestions.warnings,
        qualityScore: suggestions.qualityScore
      }
    };
  }

  private determineStatus(
    competencesAnalysis: CompetenceAnalysis[],
    activitiesAnalysis: ActivityAnalysis[],
    pedagogyAnalysis: PedagogicalAnalysis
  ): ValidationStatus {
    const hasAllCompetences = competencesAnalysis.every(c => c.present);
    const hasValidActivities = activitiesAnalysis.every(
      a => a.durationValid && a.materialValid && a.phaseValid
    );
    const pedagogyScore =
      pedagogyAnalysis.coherenceScore * 0.4 +
      pedagogyAnalysis.progressionScore * 0.3 +
      pedagogyAnalysis.evaluationScore * 0.2 +
      (pedagogyAnalysis.programCompliance ? 0.1 : 0);

    if (!hasAllCompetences) return ValidationStatus.NEEDS_REVISION;
    if (!hasValidActivities) return ValidationStatus.NEEDS_REVISION;
    if (pedagogyScore < 0.6) return ValidationStatus.NEEDS_REVISION;
    
    return ValidationStatus.APPROVED;
  }
}
