import { Fiche } from '../../types';
import { CompetencyService } from '../competencyService';
import { TemplateService } from '../templateService';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  validate: (fiche: Fiche) => Promise<boolean>;
  suggestions?: (fiche: Fiche) => string[];
}

export class FicheValidationService {
  private competencyService: CompetencyService;
  private templateService: TemplateService;
  private validationRules: ValidationRule[];

  constructor(
    competencyService: CompetencyService,
    templateService: TemplateService
  ) {
    this.competencyService = competencyService;
    this.templateService = templateService;
    this.validationRules = this.initializeValidationRules();
  }

  private initializeValidationRules(): ValidationRule[] {
    return [
      // Contrôles automatiques
      {
        id: 'competencies-types',
        name: 'Types de compétences',
        description: 'Vérifie la présence des 4 types de compétences',
        validate: async (fiche: Fiche) => {
          const requiredTypes = ['cognitive', 'pratique', 'sociale', 'affective'];
          const competencies = await this.competencyService.getCompetenciesByFiche(fiche);
          const types = new Set(competencies.map(c => c.type));
          return requiredTypes.every(type => types.has(type));
        },
        suggestions: (fiche: Fiche) => [
          `Ajouter des compétences ${
            ['cognitive', 'pratique', 'sociale', 'affective'].filter(type => 
              !fiche.competencies.some(c => c.type === type)
            ).join(', ')
          }`
        ]
      },

      {
        id: 'objectives-activities-coherence',
        name: 'Cohérence objectifs/activités',
        description: 'Vérifie que les activités correspondent aux objectifs',
        validate: async (fiche: Fiche) => {
          const objectives = fiche.objectives.map(o => o.description.toLowerCase());
          const activities = fiche.content.split('<h3>').filter(s => s.includes('Activité'));
          
          // Vérifie que chaque activité couvre au moins un objectif
          return activities.every(activity => 
            objectives.some(obj => 
              activity.toLowerCase().includes(obj.toLowerCase())
            )
          );
        },
        suggestions: (fiche: Fiche) => [
          'Aligner les activités avec les objectifs d\'apprentissage',
          'Ajouter des activités qui couvrent les objectifs manquants'
        ]
      },

      {
        id: 'phases-mandatory',
        name: 'Phases obligatoires',
        description: 'Vérifie la présence des phases obligatoires',
        validate: async (fiche: Fiche) => {
          const requiredPhases = ['Introduction', 'Présentation', 'Activités', 'Synthèse'];
          const phases = fiche.content.split('<h3>').map(s => s.split('<')[0].trim());
          return requiredPhases.every(phase => phases.includes(phase));
        },
        suggestions: (fiche: Fiche) => [
          'Ajouter la phase Introduction',
          'Ajouter la phase Présentation',
          'Ajouter la phase Activités',
          'Ajouter la phase Synthèse'
        ]
      },

      // Validation pédagogique
      {
        id: 'pedagogical-progress',
        name: 'Progression pédagogique',
        description: 'Vérifie la progression pédagogique',
        validate: async (fiche: Fiche) => {
          const activities = fiche.content.split('<h3>').filter(s => s.includes('Activité'));
          const levels = activities.map(a => this.getTaxonomicLevel(a));
          
          // Vérifie que les niveaux augmentent progressivement
          return levels.every((level, i) => 
            i === 0 || level >= levels[i - 1]
          );
        },
        suggestions: (fiche: Fiche) => [
          'Réorganiser les activités pour une progression ascendante',
          'Adapter les niveaux taxonomiques pour une progression logique'
        ]
      },

      // Workflow de validation
      {
        id: 'workflow-status',
        name: 'État du workflow',
        description: 'Vérifie l\'état actuel du workflow',
        validate: async (fiche: Fiche) => {
          const statusOrder = ['draft', 'teacher_review', 'collegial_review', 'hierarchical_review', 'pedagogical_review', 'validated'];
          const index = statusOrder.indexOf(fiche.status);
          return index >= 0;
        },
        suggestions: (fiche: Fiche) => {
          const statusOrder = ['draft', 'teacher_review', 'collegial_review', 'hierarchical_review', 'pedagogical_review', 'validated'];
          const index = statusOrder.indexOf(fiche.status);
          const nextStatus = statusOrder[index + 1] || 'validated';
          return [
            `Passer à l\'étape suivante : ${nextStatus}`
          ];
        }
      }
    ];
  }

  private getTaxonomicLevel(activity: string): number {
    // Analyse le niveau taxonomique de l'activité
    // 1: Connaissance, 2: Compréhension, 3: Application, 4: Analyse, 5: Évaluation, 6: Création
    const keywords = {
      1: ['savoir', 'identifier', 'nommer', 'reconnaître'],
      2: ['comprendre', 'expliquer', 'décrire', 'illustrer'],
      3: ['appliquer', 'utiliser', 'mettre en pratique'],
      4: ['analyser', 'comparer', 'différencier'],
      5: ['évaluer', 'juger', 'critiquer'],
      6: ['créer', 'innover', 'concevoir']
    };

    const activityText = activity.toLowerCase();
    return Object.entries(keywords).reduce((maxLevel, [level, words]) => {
      if (words.some(word => activityText.includes(word))) {
        return Math.max(maxLevel, parseInt(level));
      }
      return maxLevel;
    }, 0);
  }

  async validateFiche(fiche: Fiche): Promise<{
    isValid: boolean;
    results: {
      [key: string]: {
        isValid: boolean;
        suggestions?: string[];
      };
    };
    score: number;
  }> {
    const results = {};
    let score = 0;
    let totalRules = 0;

    for (const rule of this.validationRules) {
      try {
        const isValid = await rule.validate(fiche);
        results[rule.id] = {
          isValid,
          suggestions: isValid ? undefined : (rule.suggestions ? rule.suggestions(fiche) : [])
        };
        
        if (isValid) {
          score += 1;
        }
        totalRules += 1;
      } catch (error) {
        console.error(`Erreur lors de la validation de la règle ${rule.id}:`, error);
        results[rule.id] = {
          isValid: false,
          suggestions: ['Erreur lors de la validation']
        };
      }
    }

    return {
      isValid: Object.values(results).every(r => r.isValid),
      results,
      score: Math.round((score / totalRules) * 100)
    };
  }

  async getNextValidationStep(fiche: Fiche): Promise<string> {
    const statusOrder = ['draft', 'teacher_review', 'collegial_review', 'hierarchical_review', 'pedagogical_review', 'validated'];
    const index = statusOrder.indexOf(fiche.status);
    return statusOrder[index + 1] || 'validated';
  }

  async updateValidationStatus(fiche: Fiche, newStatus: string): Promise<Fiche> {
    // Mettre à jour le statut de validation dans la base de données
    // À implémenter avec l'API appropriée
    return {
      ...fiche,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
  }
}
