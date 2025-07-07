export interface Template {
  id: string;
  nom: string;
  description: string;
  matiere: string;
  type: 'fiche' | 'planification';
  version: string;
  sections: Section[];
  validationRules?: {
    competences: {
      obligatoires: string[];
      min: number;
      max: number;
    };
    phases: string[];
    coherence: string[];
  };
}

export interface Section {
  titre: string;
  type: 'info' | 'competences' | 'table';
  champs?: Champ[];
  sous_sections?: SousSection[];
  colonnes?: Colonne[];
  lignes?: Ligne[];
}

export interface Champ {
  label: string;
  type: 'text' | 'number' | 'date' | 'time';
}

export interface SousSection {
  titre: string;
  type: 'competence' | 'text';
  sous_sections?: SousSection[];
}

export interface Colonne {
  titre: string;
  type: 'text' | 'number';
}

export interface Ligne {
  titre: string;
  sous_sections?: SousSection[];
}

export interface TemplateValidationResult {
  isValid: boolean;
  errors: {
    competences?: string[];
    phases?: string[];
    coherence?: string[];
  };
}

export const MATIERES = [
  'Mathématiques',
  'Français',
  'Sciences',
  'Histoire-Géographie',
  'EPS',
  'Arts'
] as const;

export const TEMPLATE_TYPES = {
  MATHS: {
    nom: 'Mathématiques - Résolution de problèmes',
    description: 'Template standard pour les fiches pédagogiques en mathématiques',
    matiere: 'Mathématiques',
    sections: [
      {
        titre: 'SA N°, SÉQUENCE N°, Date, Cours, Durée, TITRE',
        type: 'info',
        champs: [
          { label: 'SA N°', type: 'number' },
          { label: 'SÉQUENCE N°', type: 'number' },
          { label: 'Date', type: 'date' },
          { label: 'Cours', type: 'text' },
          { label: 'Durée', type: 'time' },
          { label: 'TITRE', type: 'text' }
        ]
      },
      {
        titre: 'Éléments de planification',
        type: 'competences',
        sous_sections: [
          { titre: 'Compétences disciplinaires', type: 'competence' },
          { titre: 'Compétences Transversales', type: 'competence' },
          { titre: 'Compétences Transdisciplinaires', type: 'competence' },
          { titre: 'Compétences et Techniques', type: 'competence' },
          { titre: 'Stratégie Objet d\'Apprentissage', type: 'text' },
          { titre: 'Stratégie d\'enseignement/Apprentissage/Evaluation', type: 'text' },
          { titre: 'Matériel', type: 'text' }
        ]
      },
      {
        titre: 'Déroulement',
        type: 'table',
        colonnes: [
          { titre: 'Colonne N°', type: 'number' },
          { titre: 'Consignes', type: 'text' },
          { titre: 'Résultats attendus', type: 'text' }
        ],
        lignes: [
          {
            titre: 'Activités préliminaires',
            sous_sections: [
              {
                titre: 'Introduction',
                sous_sections: [
                  { titre: 'Mise en situation', type: 'text' },
                  {
                    titre: 'Proposition de nouvelles acquisitions',
                    sous_sections: [
                      { titre: 'Pré-conception', type: 'text' },
                      { titre: 'Pré-requis', type: 'text' }
                    ]
                  }
                ]
              },
              { titre: 'Réalisation', type: 'text' },
              {
                titre: 'Retour et projection',
                sous_sections: [
                  { titre: 'Objectivation', type: 'text' },
                  { titre: 'Evaluation', type: 'text' },
                  { titre: 'Projection', type: 'text' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  FRANCAIS: {
    nom: 'Français - Compréhension/Expression',
    description: 'Template standard pour les fiches pédagogiques en français',
    matiere: 'Français',
    sections: [
      // ... Configuration spécifique pour le français
    ]
  },
  SCIENCES: {
    nom: 'Sciences - Expérimentation/Observation',
    description: 'Template standard pour les fiches pédagogiques en sciences',
    matiere: 'Sciences',
    sections: [
      // ... Configuration spécifique pour les sciences
    ]
  },
  HISTOIRE: {
    nom: 'Histoire-Géographie - Analyse Documentaire',
    description: 'Template standard pour les fiches pédagogiques en histoire-géographie',
    matiere: 'Histoire-Géographie',
    sections: [
      // ... Configuration spécifique pour l'histoire-géo
    ]
  },
  EPS: {
    nom: 'EPS - Echauffement/Apprentissage/Récupération',
    description: 'Template standard pour les fiches pédagogiques en EPS',
    matiere: 'EPS',
    sections: [
      // ... Configuration spécifique pour l'EPS
    ]
  },
  ARTS: {
    nom: 'Arts - Création/Appréciation',
    description: 'Template standard pour les fiches pédagogiques en arts',
    matiere: 'Arts',
    sections: [
      // ... Configuration spécifique pour les arts
    ]
  }
} as const;

export const TEMPLATE_VALIDATION_RULES = {
  competences: {
    obligatoires: ['Compétences disciplinaires', 'Compétences Transversales'],
    min: 2,
    max: 10
  },
  phases: ['Introduction', 'Réalisation', 'Retour et projection'],
  coherence: [
    'Les compétences doivent être cohérentes avec la matière',
    'Le déroulement doit contenir toutes les phases obligatoires',
    'Les objectifs doivent être alignés avec les compétences'
  ]
};
