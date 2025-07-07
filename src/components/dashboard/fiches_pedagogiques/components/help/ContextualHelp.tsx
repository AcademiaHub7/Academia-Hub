import React, { useState } from 'react';
import { FicheViewContext } from '../FicheViewTypes';

interface HelpItem {
  id: string;
  title: string;
  content: string;
  examples?: string[];
  videoUrl?: string;
}

const helpItems: HelpItem[] = [
  {
    id: 'objectives',
    title: 'Objectifs pédagogiques',
    content: "Les objectifs pédagogiques définissent ce que les élèves doivent savoir ou pouvoir faire à la fin de la séance.",
    examples: [
      "Comprendre les principes de base de la photosynthèse",
      "Savoir résoudre une équation du second degré"
    ]
  },
  {
    id: 'resources',
    title: 'Ressources',
    content: "Les ressources sont les outils et supports utilisés pendant la séance.",
    examples: [
      "Document de travail",
      "Vidéo explicative",
      "Site web de référence"
    ]
  },
  {
    id: 'evaluation',
    title: 'Évaluation',
    content: "L'évaluation permet de vérifier l'atteinte des objectifs pédagogiques.",
    examples: [
      "Quiz de fin de séance",
      "Exercices de consolidation",
      "Observation des compétences"
    ]
  }
];

const ContextualHelp: React.FC = () => {
  const [activeHelp, setActiveHelp] = useState<HelpItem | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const context = React.useContext(FicheViewContext);
  if (!context) {
    throw new Error('ContextualHelp must be used within a FicheViewProvider');
  }

  const showHelpItem = (id: string) => {
    const item = helpItems.find(h => h.id === id);
    if (item) {
      setActiveHelp(item);
      setShowHelp(true);
    }
  };

  const closeHelp = () => {
    setShowHelp(false);
  };

  return (
    <div className="relative">
      {/* Bouton d'aide */}
      <button
        onClick={() => showHelpItem('objectives')}
        className="fixed bottom-4 left-4 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        title="Aide contextuelle"
      >
        ❓
      </button>

      {/* Modal d'aide */}
      {showHelp && activeHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">{activeHelp.title}</h2>
              <button
                onClick={closeHelp}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Contenu */}
            <div className="p-4 space-y-4">
              <div className="prose max-w-none">
                {activeHelp.content}
              </div>

              {activeHelp.examples && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Exemples</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {activeHelp.examples.map((example, index) => (
                      <li key={index} className="text-gray-700">{example}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeHelp.videoUrl && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Tutoriel vidéo</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={activeHelp.videoUrl}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextualHelp;
