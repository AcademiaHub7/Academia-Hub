import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Filter, FileText, User, Clock, LayoutGrid } from 'lucide-react';
import FicheList from './FicheList';
import FicheCreateForm from './FicheCreateForm';
import FicheViewer from './FicheViewer';
import FicheDuplicator from './FicheDuplicator';

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

const FichePedagogiqueDashboard: React.FC = () => {
  const [fiches, setFiches] = useState<FichePedagogique[]>([]);
  const [selectedFiche, setSelectedFiche] = useState<FichePedagogique | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'view' | 'duplicate'>('list');
  const [filters, setFilters] = useState({
    matiere: '',
    classe: '',
    statut: '',
    type: 'fiche',
    date: 'all'
  });

  useEffect(() => {
    // Mock data - à remplacer par l'appel API
    const mockFiches: FichePedagogique[] = [
      {
        id: '1',
        titre: 'Planification hebdomadaire',
        matiere: 'Mathématiques',
        classe: '6ème A',
        dateCreation: '2025-07-01',
        dateModification: '2025-07-01',
        auteur: 'Jean Dupont',
        statut: 'brouillon',
        type: 'planification'
      },
      {
        id: '2',
        titre: 'Fiche de préparation - Les fractions',
        matiere: 'Mathématiques',
        classe: '6ème A',
        dateCreation: '2025-06-30',
        dateModification: '2025-07-02',
        auteur: 'Marie Martin',
        statut: 'soumise',
        type: 'fiche'
      }
    ];
    setFiches(mockFiches);
  }, []);

  const handleCreate = () => {
    setViewMode('create');
  };

  const handleEdit = (fiche: FichePedagogique) => {
    setSelectedFiche(fiche);
    setViewMode('edit');
  };

  const handleView = (fiche: FichePedagogique) => {
    setSelectedFiche(fiche);
    setViewMode('view');
  };

  const handleDuplicate = (fiche: FichePedagogique) => {
    setSelectedFiche(fiche);
    setViewMode('duplicate');
  };

  const handleCancel = () => {
    setSelectedFiche(null);
    setViewMode('list');
  };

  const handleSave = (fiche: FichePedagogique) => {
    if (fiche.id) {
      setFiches(fiches.map(f => (f.id === fiche.id ? fiche : f)));
    } else {
      setFiches([...fiches, { ...fiche, id: Date.now().toString() }]);
    }
    handleCancel();
  };

  return (
    <div className="space-y-6">
      {/* Header et actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Gestion des Fiches Pédagogiques</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle fiche
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Mode de vue */}
      {viewMode === 'list' && (
        <FicheList
          fiches={fiches}
          filters={filters}
          onEdit={handleEdit}
          onView={handleView}
          onDuplicate={handleDuplicate}
          onFilterChange={setFilters}
        />
      )}

      {/* Mode création */}
      {viewMode === 'create' && (
        <FicheCreateForm onSave={handleSave} onCancel={handleCancel} />
      )}

      {/* Mode édition */}
      {viewMode === 'edit' && selectedFiche && (
        <FicheEditForm
          fiche={selectedFiche}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Mode visualisation */}
      {viewMode === 'view' && selectedFiche && (
        <FicheViewer fiche={selectedFiche} onClose={handleCancel} />
      )}

      {/* Mode duplication */}
      {viewMode === 'duplicate' && selectedFiche && (
        <FicheDuplicator
          fiche={selectedFiche}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default FichePedagogiqueDashboard;
