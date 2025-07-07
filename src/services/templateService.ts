import { Template } from '../components/dashboard/fiches_pedagogiques/types/template';

export class TemplateService {
  // Méthode pour récupérer un modèle de fiche par son ID
  async getTemplateById(id: string): Promise<Template | null> {
    // Simulation de récupération de données
    return {
      id,
      name: 'Modèle standard',
      subject: 'math',
      description: 'Modèle standard pour les cours de mathématiques',
      structure: {
        sections: [
          { id: 'objectives', name: 'Objectifs', required: true },
          { id: 'activities', name: 'Activités', required: true },
          { id: 'assessment', name: 'Évaluation', required: false }
        ]
      },
      planningSections: [
        { id: 'preparation', name: 'Préparation', required: true },
        { id: 'execution', name: 'Exécution', required: true },
        { id: 'reflection', name: 'Réflexion', required: false }
      ],
      procedureTable: {
        columns: [
          { id: 'time', name: 'Durée', type: 'number' },
          { id: 'instruction', name: 'Consigne', type: 'text' },
          { id: 'activity', name: 'Activité', type: 'text' },
          { id: 'material', name: 'Matériel', type: 'text' }
        ]
      },
      steps: [
        { name: 'Introduction', duration: 10, description: 'Présentation du sujet' },
        { name: 'Développement', duration: 30, description: 'Activités principales' },
        { name: 'Conclusion', duration: 10, description: 'Synthèse et évaluation' }
      ],
      tags: ['standard', 'mathématiques'],
      isDefault: true,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Méthode pour valider un modèle de fiche
  async validateTemplate(templateId: string): Promise<{ isValid: boolean; messages: string[] }> {
    // Simulation de validation
    return {
      isValid: true,
      messages: ['Le modèle est conforme aux standards pédagogiques.']
    };
  }
}
