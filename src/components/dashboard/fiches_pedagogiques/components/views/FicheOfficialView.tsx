import React from 'react';
import { Fiche } from '../../../types';
import { FicheViewContext } from '../FicheViewTypes';

interface FicheOfficialViewProps {
  fiche: Fiche;
}

const FicheOfficialView: React.FC<FicheOfficialViewProps> = ({ fiche }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* En-tête officiel */}
      <div className="border-b pb-4 mb-6">
        <div className="flex justify-between items-center">
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
      </div>

      {/* Contenu officiel */}
      <div className="space-y-6">
        {/* Objectifs */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Objectifs pédagogiques</h2>
          <div className="space-y-2">
            {fiche.objectives?.map((objective, index) => (
              <div key={index} className="pl-4">
                <span className="font-medium">{index + 1}. </span>
                {objective}
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

        {/* Ressources */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Ressources</h2>
          <div className="space-y-3">
            {fiche.resources?.map((resource, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="font-medium">{resource.title}</div>
                <div className="text-sm text-gray-600">{resource.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Évaluation */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Évaluation</h2>
          <div className="space-y-2">
            {fiche.evaluation?.map((item, index) => (
              <div key={index} className="pl-4">
                <span className="font-medium">{index + 1}. </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FicheOfficialView;
