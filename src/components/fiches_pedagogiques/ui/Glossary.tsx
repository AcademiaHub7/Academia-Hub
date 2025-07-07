import React, { useState } from 'react';
import { BookOpen, Search, Info } from 'lucide-react';

interface GlossaryEntry {
  term: string;
  definition: string;
  examples: string[];
  related: string[];
  category: string;
}

interface GlossaryProps {
  onClose: () => void;
  onSearch?: (query: string) => void;
}

const Glossary: React.FC<GlossaryProps> = ({ onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  // Données du glossaire (exemples)
  const glossaryData: GlossaryEntry[] = [
    {
      term: 'Savoir',
      definition: 'Connaissance théorique et conceptuelle d\'un domaine.',
      examples: ['Comprendre les concepts mathématiques', 'Connaître les règles de grammaire'],
      related: ['Savoir-faire', 'Savoir-être'],
      category: 'Compétences'
    },
    {
      term: 'Savoir-faire',
      definition: 'Capacité à mettre en œuvre des connaissances dans des situations concrètes.',
      examples: ['Résoudre des équations', 'Écrire un texte argumentatif'],
      related: ['Savoir', 'Savoir-être'],
      category: 'Compétences'
    },
    {
      term: 'Savoir-être',
      definition: 'Qualités personnelles et attitudes professionnelles.',
      examples: ['Travailler en équipe', 'Gérer son stress'],
      related: ['Savoir', 'Savoir-faire'],
      category: 'Compétences'
    },
    {
      term: 'Compétence transversale',
      definition: 'Compétence applicable dans plusieurs domaines.',
      examples: ['Communication', 'Résolution de problèmes'],
      related: ['Savoir', 'Savoir-faire'],
      category: 'Compétences'
    },
    {
      term: 'Progression pédagogique',
      definition: 'Organisation cohérente des apprentissages.',
      examples: ['Gradation des difficultés', 'Séquencement des activités'],
      related: ['Objectifs', 'Évaluation'],
      category: 'Pédagogie'
    }
  ];

  // Filtrer les termes selon la recherche
  const filteredTerms = glossaryData.filter(term =>
    term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Trouver les termes liés
  const getRelatedTerms = (term: string) => {
    const entry = glossaryData.find(t => t.term === term);
    return entry?.related || [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            <BookOpen className="w-5 h-5 inline-block mr-2" />
            Glossaire pédagogique
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Barre de recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un terme..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          {/* Liste des termes */}
          <div className="space-y-6">
            {filteredTerms.map((term) => (
              <div
                key={term.term}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                onClick={() => setSelectedTerm(term.term)}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {term.term}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {term.definition}
                </p>
                {term.examples.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exemples
                    </h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      {term.examples.map((example, index) => (
                        <li key={index} className="list-disc ml-4">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {term.related.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Termes liés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {term.related.map((related, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTerm(related)}
                          className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {related}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Barre de navigation */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredTerms.length} résultats trouvés
                </span>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Glossary;
