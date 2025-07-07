import React from 'react';
import { Fiche } from '../../../types';
import { FicheViewContext } from '../FicheViewTypes';

interface FicheReviewViewProps {
  fiche: Fiche;
}

const FicheReviewView: React.FC<FicheReviewViewProps> = ({ fiche }) => {
  const context = React.useContext(FicheViewContext);
  if (!context) {
    throw new Error('FicheReviewView must be used within a FicheViewProvider');
  }

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">{fiche.title}</h1>
            <div className="text-sm text-gray-500">
              {fiche.subject} - {fiche.level}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Date: {new Date(fiche.createdAt).toLocaleDateString('fr-FR')}
          </div>
        </div>

        {/* Statut */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">
              {fiche.status}
            </span>
            <button
              onClick={() => {
                // TODO: Ouvrir le panneau de validation
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Modifier le statut
            </button>
          </div>
        </div>

        {/* Composants principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Objectifs */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Objectifs pédagogiques</h2>
            <div className="space-y-2">
              {fiche.objectives?.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="font-medium">{index + 1}. </span>
                  <span className="flex-1">{objective}</span>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    ✎
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ressources */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Ressources</h2>
            <div className="space-y-3">
              {fiche.resources?.map((resource, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-sm text-gray-600">{resource.description}</div>
                  <div className="flex justify-end">
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      ✎
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contenu</h2>
            <div className="prose max-w-none">
              {fiche.content}
            </div>
          </div>

          {/* Évaluation */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Évaluation</h2>
            <div className="space-y-2">
              {fiche.evaluation?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="font-medium">{index + 1}. </span>
                  <span className="flex-1">{item}</span>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    ✎
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Validation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Validation</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Statut actuel
            </label>
            <div className="mt-1">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {fiche.status}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Commentaires
            </label>
            <textarea
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Ajouter des commentaires..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                // TODO: Envoyer pour validation
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Valider
            </button>
            <button
              onClick={() => {
                // TODO: Retourner au mode précédent
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FicheReviewView;
