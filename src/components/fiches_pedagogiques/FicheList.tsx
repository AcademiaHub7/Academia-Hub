import React from 'react';
import { FileText, Eye, Edit, Copy, Calendar } from 'lucide-react';

interface FichePedagogique {
  id: string;
  titre: string;
  matiere: string;
  classe: string;
  dateCreation: string;
  dateModification: string;
  auteur: string;
  statut: 'brouillon' | 'soumise' | 'validée' | 'rejetée' | 'à_corriger';
  type: 'fiche' | 'planification';
}

interface FicheListProps {
  fiches: FichePedagogique[];
  filters: {
    matiere: string;
    classe: string;
    statut: string;
    type: string;
    date: string;
  };
  onEdit: (fiche: FichePedagogique) => void;
  onView: (fiche: FichePedagogique) => void;
  onDuplicate: (fiche: FichePedagogique) => void;
  onFilterChange: (filters: any) => void;
}

const FicheList: React.FC<FicheListProps> = ({
  fiches,
  filters,
  onEdit,
  onView,
  onDuplicate,
  onFilterChange
}) => {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'brouillon': return 'bg-yellow-100 text-yellow-800';
      case 'soumise': return 'bg-blue-100 text-blue-800';
      case 'validée': return 'bg-green-100 text-green-800';
      case 'rejetée': return 'bg-red-100 text-red-800';
      case 'à_corriger': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFiches = fiches.filter(fiche => {
    return (
      (!filters.matiere || fiche.matiere === filters.matiere) &&
      (!filters.classe || fiche.classe === filters.classe) &&
      (!filters.statut || fiche.statut === filters.statut) &&
      (!filters.type || fiche.type === filters.type)
    );
  });

  return (
    <div className="space-y-4">
      {/* Barre de filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.matiere}
            onChange={(e) => onFilterChange({ ...filters, matiere: e.target.value })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            <option value="">Toutes les matières</option>
            <option value="Mathématiques">Mathématiques</option>
            <option value="Français">Français</option>
            <option value="Histoire">Histoire</option>
          </select>
          <select
            value={filters.classe}
            onChange={(e) => onFilterChange({ ...filters, classe: e.target.value })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            <option value="">Toutes les classes</option>
            <option value="6ème A">6ème A</option>
            <option value="5ème B">5ème B</option>
          </select>
          <select
            value={filters.statut}
            onChange={(e) => onFilterChange({ ...filters, statut: e.target.value })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            <option value="">Tous les statuts</option>
            <option value="brouillon">Brouillon</option>
            <option value="soumise">Soumise</option>
            <option value="validée">Validée</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            <option value="">Tous les types</option>
            <option value="fiche">Fiche de préparation</option>
            <option value="planification">Planification</option>
          </select>
        </div>
      </div>

      {/* Liste des fiches */}
      <div className="space-y-4">
        {filteredFiches.map((fiche) => (
          <div key={fiche.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{fiche.titre}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {fiche.matiere} - {fiche.classe}
                </p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(fiche.statut)}`}>
                  {fiche.statut}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onView(fiche)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Voir"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(fiche)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Éditer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDuplicate(fiche)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Dupliquer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(fiche.dateModification).toLocaleDateString('fr-FR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FicheList;
