import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CorrectionCode } from '../../types/DirectorValidationTypes';

interface CorrectionCodesPanelProps {
  selectedCode: CorrectionCode | null;
  onCodeSelect: (code: CorrectionCode) => void;
  onCodeCreate: (code: CorrectionCode) => void;
  onCodeUpdate: (code: CorrectionCode) => void;
  onCodeDelete: (codeId: string) => void;
}

const CorrectionCodesPanel: React.FC<CorrectionCodesPanelProps> = ({
  selectedCode,
  onCodeSelect,
  onCodeCreate,
  onCodeUpdate,
  onCodeDelete
}) => {
  // États locaux
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newCode, setNewCode] = React.useState({
    category: '',
    description: '',
    examples: [],
    suggestions: []
  });
  const [showCategories, setShowCategories] = React.useState(false);

  // Données simulées des codes de correction
  const correctionCodes: CorrectionCode[] = [
    {
      id: '1',
      category: 'Structure',
      description: 'Structure non hiérarchisée',
      examples: [
        'Absence de titres de niveau 1',
        'Titres non numérotés',
        'Structure non cohérente'
      ],
      suggestions: [
        'Ajouter des titres de niveau 1',
        'Numéroter les sections',
        'Réorganiser la structure'
      ]
    },
    {
      id: '2',
      category: 'Contenu',
      description: 'Contenu non documenté',
      examples: [
        'Références manquantes',
        'Sources non citées',
        'Contenu non vérifié'
      ],
      suggestions: [
        'Ajouter des références',
        'Citer les sources',
        'Vérifier l\'exactitude'
      ]
    },
    {
      id: '3',
      category: 'Format',
      description: 'Format non standard',
      examples: [
        'Police non standard',
        'Mise en page incorrecte',
        'Espacement incohérent'
      ],
      suggestions: [
        'Utiliser la police standard',
        'Appliquer la mise en page standard',
        'Uniformiser l\'espacement'
      ]
    }
  ];

  // Filtrer les codes
  const filteredCodes = correctionCodes.filter(code =>
    code.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.examples.some(example => example.toLowerCase().includes(searchQuery.toLowerCase())) ||
    code.suggestions.some(suggestion => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Grouper par catégorie
  const groupedCodes = filteredCodes.reduce((acc, code) => {
    if (!acc[code.category]) {
      acc[code.category] = [];
    }
    acc[code.category].push(code);
    return acc;
  }, {} as Record<string, CorrectionCode[]>);

  return (
    <div className="correction-codes-panel">
      {/* Barre de recherche */}
      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un code de correction..."
          aria-label="Rechercher un code de correction"
        />
      </div>

      {/* Bouton pour créer un nouveau code */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="create-code-btn"
        aria-label="Créer un nouveau code de correction"
      >
        <AlertCircle />
        {showCreateForm ? 'Annuler' : 'Créer un code'}
      </button>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="create-form">
          <div className="form-group">
            <label htmlFor="category">Catégorie</label>
            <input
              type="text"
              id="category"
              value={newCode.category}
              onChange={(e) => setNewCode(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Catégorie du code"
              aria-label="Catégorie du code de correction"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={newCode.description}
              onChange={(e) => setNewCode(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description du problème"
              aria-label="Description du problème"
            />
          </div>

          <div className="form-group">
            <label htmlFor="examples">Exemples</label>
            <textarea
              id="examples"
              value={newCode.examples.join('\n')}
              onChange={(e) => setNewCode(prev => ({
                ...prev,
                examples: e.target.value.split('\n').filter(Boolean)
              }))}
              placeholder="Liste des exemples (un par ligne)"
              aria-label="Exemples de problèmes"
            />
          </div>

          <div className="form-group">
            <label htmlFor="suggestions">Suggestions</label>
            <textarea
              id="suggestions"
              value={newCode.suggestions.join('\n')}
              onChange={(e) => setNewCode(prev => ({
                ...prev,
                suggestions: e.target.value.split('\n').filter(Boolean)
              }))}
              placeholder="Liste des suggestions (un par ligne)"
              aria-label="Suggestions de correction"
            />
          </div>

          <div className="form-actions">
            <button
              onClick={() => onCodeCreate(newCode)}
              className="save-btn"
              aria-label="Enregistrer le nouveau code"
            >
              <CheckCircle2 />
              Enregistrer
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="cancel-btn"
              aria-label="Annuler la création du code"
            >
              <XCircle />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des catégories */}
      <div className="categories-list">
        {Object.entries(groupedCodes).map(([category, codes]) => (
          <div key={category} className="category-section">
            <div className="category-header" onClick={() => setShowCategories(!showCategories)}>
              <h3>{category}</h3>
              {showCategories ? <ChevronUp /> : <ChevronDown />}
            </div>
            {showCategories && (
              <div className="codes-grid">
                {codes.map((code) => (
                  <div
                    key={code.id}
                    className={`code-card ${code.id === selectedCode?.id ? 'selected' : ''}`}
                    onClick={() => onCodeSelect(code)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Code de correction: ${code.description}`}
                  >
                    <div className="code-header">
                      <span className="category-tag">{category}</span>
                      <div className="action-buttons">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCodeUpdate(code);
                          }}
                          aria-label="Modifier le code"
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCodeDelete(code.id);
                          }}
                          aria-label="Supprimer le code"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                    <div className="code-description">{code.description}</div>
                    <div className="code-examples">
                      <h4>Exemples:</h4>
                      <ul>
                        {code.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="code-suggestions">
                      <h4>Suggestions:</h4>
                      <ul>
                        {code.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CorrectionCodesPanel;
