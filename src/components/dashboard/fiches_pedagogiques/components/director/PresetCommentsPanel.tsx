import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PresetComment } from '../../types/DirectorValidationTypes';

interface PresetCommentsPanelProps {
  selectedComment: PresetComment | null;
  onCommentSelect: (comment: PresetComment) => void;
  onCommentCreate: (comment: string) => void;
  onCommentUpdate: (comment: PresetComment) => void;
  onCommentDelete: (commentId: string) => void;
}

const PresetCommentsPanel: React.FC<PresetCommentsPanelProps> = ({
  selectedComment,
  onCommentSelect,
  onCommentCreate,
  onCommentUpdate,
  onCommentDelete
}) => {
  // États locaux
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');
  const [showCategories, setShowCategories] = React.useState(false);

  // Données simulées des commentaires prédéfinis
  const presetComments: PresetComment[] = [
    {
      id: '1',
      category: 'Structure',
      content: 'La structure de la fiche est claire et logique.',
      tags: ['structure', 'organisation'],
      usageCount: 45
    },
    {
      id: '2',
      category: 'Contenu',
      content: 'Le contenu est pertinent et bien documenté.',
      tags: ['contenu', 'qualité'],
      usageCount: 32
    },
    {
      id: '3',
      category: 'Format',
      content: 'Le format des références bibliographiques est correct.',
      tags: ['format', 'références'],
      usageCount: 28
    }
  ];

  // Filtrer les commentaires
  const filteredComments = presetComments.filter(comment =>
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Grouper par catégorie
  const groupedComments = filteredComments.reduce((acc, comment) => {
    if (!acc[comment.category]) {
      acc[comment.category] = [];
    }
    acc[comment.category].push(comment);
    return acc;
  }, {} as Record<string, PresetComment[]>);

  return (
    <div className="preset-comments-panel">
      {/* Barre de recherche */}
      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un commentaire..."
          aria-label="Rechercher un commentaire prédéfini"
        />
      </div>

      {/* Bouton pour créer un nouveau commentaire */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="create-comment-btn"
        aria-label="Créer un nouveau commentaire prédéfini"
      >
        <BookOpen />
        {showCreateForm ? 'Annuler' : 'Créer un commentaire'}
      </button>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="create-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Rédiger le nouveau commentaire..."
            aria-label="Rédiger un nouveau commentaire prédéfini"
          />
          <div className="form-actions">
            <button
              onClick={() => onCommentCreate(newComment)}
              className="save-btn"
              aria-label="Enregistrer le nouveau commentaire"
            >
              <CheckCircle2 />
              Enregistrer
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="cancel-btn"
              aria-label="Annuler la création du commentaire"
            >
              <XCircle />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des catégories */}
      <div className="categories-list">
        {Object.entries(groupedComments).map(([category, comments]) => (
          <div key={category} className="category-section">
            <div className="category-header" onClick={() => setShowCategories(!showCategories)}>
              <h3>{category}</h3>
              {showCategories ? <ChevronUp /> : <ChevronDown />}
            </div>
            {showCategories && (
              <div className="comments-grid">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`comment-card ${comment.id === selectedComment?.id ? 'selected' : ''}`}
                    onClick={() => onCommentSelect(comment)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Commentaire: ${comment.content}`}
                  >
                    <div className="comment-content">{comment.content}</div>
                    <div className="comment-meta">
                      <span className="usage-count">{comment.usageCount} utilisations</span>
                      <div className="action-buttons">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCommentUpdate(comment);
                          }}
                          aria-label="Modifier le commentaire"
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCommentDelete(comment.id);
                          }}
                          aria-label="Supprimer le commentaire"
                        >
                          ❌
                        </button>
                      </div>
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

export default PresetCommentsPanel;
