import React, { useState } from 'react';
import { FileText, Clock, User, BookOpen, LayoutGrid, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import FicheCreateForm from './FicheCreateForm';

interface FichePedagogique {
  id: string;
  titre: string;
  matiere: string;
  classe: string;
  auteur: string;
  dateCreation: string;
  dateModification: string;
  statut: 'brouillon' | 'soumise' | 'validée' | 'rejetée' | 'à_corriger';
  type: 'fiche' | 'planification';
  objectifs: string[];
  competences: string[];
  deroulement: any[];
  consignes: string[];
  resultats: string[];
  strategies: string[];
  template: string;
}

interface FicheDuplicatorProps {
  fiche: FichePedagogique;
  onSave: (fiche: FichePedagogique) => void;
  onCancel: () => void;
}

const FicheDuplicator: React.FC<FicheDuplicatorProps> = ({
  fiche,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<FichePedagogique>({
    ...fiche,
    id: '', // Nouvel ID pour la copie
    titre: `${fiche.titre} - Copie`,
    dateCreation: new Date().toISOString(),
    dateModification: new Date().toISOString(),
    statut: 'brouillon',
    auteur: '' // À remplir par l'utilisateur
  });

  const handleInputChange = (field: keyof FichePedagogique, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            <Plus className="w-4 h-4 inline-block mr-2" />
            Dupliquer la fiche
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Adaptation de la copie
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nouveau titre
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => handleInputChange('titre', e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Titre de la copie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Auteur
                </label>
                <input
                  type="text"
                  value={formData.auteur}
                  onChange={(e) => handleInputChange('auteur', e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Votre nom"
                />
              </div>
            </div>
          </div>

          {/* Formulaire de création avec les données pré-remplies */}
          <FicheCreateForm
            onSave={handleSubmit}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default FicheDuplicator;
