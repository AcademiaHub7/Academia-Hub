import React, { useState } from 'react';
import { FicheViewContext } from '../FicheViewTypes';

interface GlossaryItem {
  term: string;
  definition: string;
  examples?: string[];
  relatedTerms?: string[];
}

const glossaryItems: GlossaryItem[] = [
  {
    term: 'Objectif pédagogique',
    definition: "Énoncé clair et précis qui décrit ce que l'élève doit savoir ou pouvoir faire à la fin d'une séance ou d'un module.",
    examples: [
      "Comprendre le cycle de l'eau",
      "Savoir résoudre une équation du premier degré"
    ]
  },
  {
    term: 'Compétence',
    definition: "Capacité à mettre en œuvre des connaissances, des savoir-faire et des attitudes dans un contexte donné.",
    relatedTerms: ['Compétence transversale', 'Compétence disciplinaire']
  },
  {
    term: 'Évaluation formative',
    definition: "Évaluation qui vise à améliorer l'apprentissage en cours de processus, plutôt qu'à le juger à la fin.",
    examples: [
      "Quiz de compréhension",
      "Auto-évaluation",
      "Observation en classe"
    ]
  }
];

const Glossary: React.FC = () => {
  const [showGlossary, setShowGlossary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const context = React.useContext(FicheViewContext);
  if (!context) {
    throw new Error('Glossary must be used within a FicheViewProvider');
  }

  const filteredItems = glossaryItems.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleGlossary = () => {
    setShowGlossary(!showGlossary);
  };

  return (
    <div className="relative">
      {/* Bouton du glossaire */}
      <button
        onClick={toggleGlossary}
        className="fixed bottom-4 right-4 p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
        title="Glossaire pédagogique"
      >
        📚
      </button>

      {/* Modal du glossaire */}
      {showGlossary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Glossaire pédagogique</h2>
              <button
                onClick={toggleGlossary}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Contenu */}
            <div className="p-4 space-y-4">
              {/* Barre de recherche */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un terme..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Liste des termes */}
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2">{item.term}</h3>
                    <div className="prose max-w-none text-gray-700">
                      {item.definition}
                    </div>

                    {item.examples && (
                      <div className="mt-2">
                        <h4 className="font-medium">Exemples</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {item.examples.map((example, i) => (
                            <li key={i} className="text-gray-600">{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.relatedTerms && (
                      <div className="mt-2">
                        <h4 className="font-medium">Termes liés</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {item.relatedTerms.map((term, i) => (
                            <li key={i} className="text-gray-600">{term}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <p className="text-center text-gray-500">Aucun terme trouvé</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Glossary;
