import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { Template, TemplateValidationResult, TEMPLATE_VALIDATION_RULES } from './types';

interface TemplateValidatorProps {
  template: Template;
  onValidationSuccess: (template: Template) => void;
}

const TemplateValidator: React.FC<TemplateValidatorProps> = ({
  template,
  onValidationSuccess
}) => {
  const validateTemplate = (): TemplateValidationResult => {
    const result: TemplateValidationResult = {
      isValid: true,
      errors: {}
    };

    // Validation des compétences
    const competences = template.sections.find(s => s.type === 'competences')?.sous_sections || [];
    const competenceTitles = competences.map(c => c.titre);

    // Vérification des compétences obligatoires
    const missingObligatory = TEMPLATE_VALIDATION_RULES.competences.obligatoires.filter(
      required => !competenceTitles.includes(required)
    );
    if (missingObligatory.length > 0) {
      result.isValid = false;
      result.errors.competences = [
        `Compétences obligatoires manquantes : ${missingObligatory.join(', ')}`
      ];
    }

    // Vérification du nombre de compétences
    if (competenceTitles.length < TEMPLATE_VALIDATION_RULES.competences.min) {
      result.isValid = false;
      result.errors.competences = [
        ...(result.errors.competences || []),
        `Nombre minimum de compétences non atteint (${TEMPLATE_VALIDATION_RULES.competences.min} requis)`
      ];
    }

    // Validation des phases
    const tableSection = template.sections.find(s => s.type === 'table')?.lignes || [];
    const phases = tableSection.map(l => l.titre);
    const missingPhases = TEMPLATE_VALIDATION_RULES.phases.filter(
      required => !phases.includes(required)
    );

    if (missingPhases.length > 0) {
      result.isValid = false;
      result.errors.phases = [
        `Phases obligatoires manquantes : ${missingPhases.join(', ')}`
      ];
    }

    // Validation de la cohérence
    const coherenceIssues = TEMPLATE_VALIDATION_RULES.coherence.filter(rule => {
      // Logique de validation de cohérence spécifique à implémenter
      return false; // À implémenter selon les besoins
    });

    if (coherenceIssues.length > 0) {
      result.isValid = false;
      result.errors.coherence = coherenceIssues;
    }

    return result;
  };

  const handleValidate = () => {
    const validation = validateTemplate();
    if (validation.isValid) {
      onValidationSuccess(template);
    } else {
      // Afficher les erreurs
      console.error('Validation échouée:', validation.errors);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Validation du Template
      </h3>
      
      <button
        onClick={handleValidate}
        className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Valider le Template
      </button>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Règles de validation
        </h4>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>
            <span className="font-medium">Compétences obligatoires:</span>
            {TEMPLATE_VALIDATION_RULES.competences.obligatoires.join(', ')}
          </li>
          <li>
            <span className="font-medium">Phases obligatoires:</span>
            {TEMPLATE_VALIDATION_RULES.phases.join(', ')}
          </li>
          <li>
            <span className="font-medium">Cohérence:</span>
            {TEMPLATE_VALIDATION_RULES.coherence.map((rule, index) => (
              <span key={index}>{rule}</span>
            ))}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TemplateValidator;
