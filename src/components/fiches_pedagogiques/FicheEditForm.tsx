import React from 'react';
import { FichePedagogique } from '../../types/fiches_pedagogiques';

interface FicheEditFormProps {
  fiche: FichePedagogique;
  onSave: (fiche: FichePedagogique) => void;
  onCancel: () => void;
}

const FicheEditForm: React.FC<FicheEditFormProps> = ({ fiche, onSave, onCancel }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(fiche);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Champs du formulaire pour éditer la fiche */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            value={fiche.titre}
            onChange={(e) => {
              fiche.titre = e.target.value;
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        {/* Autres champs du formulaire */}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Sauvegarder
        </button>
      </div>
    </form>
  );
};

export default FicheEditForm;
