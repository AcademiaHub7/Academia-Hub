import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useForumStore } from '../../stores/forumStore';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Pin,
  Lock,
  Eye,
  Clock,
  Users,
  Tag,
  Send,
  Paperclip
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  views: number;
  replies: number;
  likes: number;
  dislikes: number;
  isPinned: boolean;
  isLocked: boolean;
  isSolved: boolean;
}

interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  createdAt: Date;
  likes: number;
  dislikes: number;
  isAccepted: boolean;
}

const categories = [
  'Questions Pédagogiques',
  'Support Technique',
  'Échanges d\'Expériences',
  'Ressources Partagées',
  'Annonces Officielles',
  'Suggestions d\'Amélioration'
];

const tags = [
  'mathématiques', 'français', 'sciences', 'histoire',
  'pédagogie', 'évaluation', 'gestion-classe', 'numérique',
  'examens', 'notes', 'bulletins', 'parents'
];

export const ForumDiscussion: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const { posts, replies, fetchPosts, createPost, isLoading } = useForumStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>([]);

  // Mock forum posts
  const mockPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Comment améliorer l\'engagement des élèves en mathématiques ?',
      content: 'Je cherche des méthodes innovantes pour rendre mes cours de mathématiques plus interactifs et captivants pour mes élèves de 6ème. Avez-vous des suggestions ?',
      category: 'Questions Pédagogiques',
      tags: ['mathématiques', 'pédagogie', 'engagement'],
      author: {
        id: '2',
        name: 'Marie AGBODJAN',
        role: 'Enseignant',
        avatar: undefined
      },
      createdAt: new Date('2024-12-09T14:30:00'),
      updatedAt: new Date('2024-12-09T14:30:00'),
      views: 45,
      replies: 8,
      likes: 12,
      dislikes: 0,
      isPinned: false,
      isLocked: false,
      isSolved: false
    },
    {
      id: '2',
      title: 'Problème de synchronisation des notes',
      content: 'Depuis la dernière mise à jour, j\'ai des difficultés à synchroniser les notes entre les différents modules. Quelqu\'un a-t-il rencontré ce problème ?',
      category: 'Support Technique',
      tags: ['notes', 'synchronisation', 'technique'],
      author: {
        id: '3',
        name: 'Jean AKPOVI',
        role: 'Enseignant',
        avatar: undefined
      },
      createdAt: new Date('2024-12-08T16:45:00'),
      updatedAt: new Date('2024-12-09T09:15:00'),
      views: 23,
      replies: 5,
      likes: 7,
      dislikes: 1,
      isPinned: false,
      isLocked: false,
      isSolved: true
    },
    {
      id: '3',
      title: 'Nouvelle procédure d\'évaluation - Année 2024-2025',
      content: 'Veuillez prendre connaissance des nouvelles directives concernant l\'évaluation des élèves pour l\'année scolaire en cours. Document joint en pièce jointe.',
      category: 'Annonces Officielles',
      tags: ['évaluation', 'procédure', 'officiel'],
      author: {
        id: '1',
        name: 'Paul ADJOVI',
        role: 'Administrateur',
        avatar: undefined
      },
      createdAt: new Date('2024-12-07T10:00:00'),
      updatedAt: new Date('2024-12-07T10:00:00'),
      views: 156,
      replies: 12,
      likes: 25,
      dislikes: 2,
      isPinned: true,
      isLocked: false,
      isSolved: false
    }
  ];

  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>(mockPosts);

  useEffect(() => {
    let filtered = mockPosts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'replies':
          return b.replies - a.replies;
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

    // Pinned posts first
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, selectedTag, sortBy]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrateur':
        return 'bg-red-100 text-red-800';
      case 'Enseignant':
        return 'bg-blue-100 text-blue-800';
      case 'Élève':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newPost = {
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      tags: newPostTags
    };

    await createPost(newPost);
    setShowCreateModal(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('');
    setNewPostTags([]);
  };

  const toggleTag = (tag: string) => {
    setNewPostTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Forum de Discussion</h1>
            <p className="text-gray-600 mt-1">
              Espace d'échanges et d'entraide pour la communauté éducative
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Discussion</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher dans le forum..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="all">Toutes catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="all">Tous les tags</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="recent">Plus récents</option>
              <option value="popular">Plus populaires</option>
              <option value="replies">Plus de réponses</option>
              <option value="views">Plus vus</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forum Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Discussions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{filteredPosts.length}</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3 text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Réponses</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {filteredPosts.reduce((sum, post) => sum + post.replies, 0)}
              </p>
            </div>
            <div className="bg-green-500 rounded-lg p-3 text-white">
              <Reply className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Membres Actifs</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">24</p>
            </div>
            <div className="bg-purple-500 rounded-lg p-3 text-white">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Questions Résolues</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {filteredPosts.filter(p => p.isSolved).length}
              </p>
            </div>
            <div className="bg-orange-500 rounded-lg p-3 text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Forum Posts */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-color rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.isPinned && <Pin className="w-4 h-4 text-primary-color" />}
                        {post.isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-color cursor-pointer">
                          {post.title}
                        </h3>
                        {post.isSolved && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Résolu
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-900">{post.author.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(post.author.role)}`}>
                            {post.author.role}
                          </span>
                        </div>
                        <span>{getTimeAgo(post.createdAt)}</span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                          {post.category}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        {post.tags.map(tag => (
                          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Reply className="w-4 h-4" />
                          <span>{post.replies} réponses</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-red-600 transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                            <span>{post.dislikes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune discussion trouvée</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedTag !== 'all'
                ? 'Aucune discussion ne correspond à vos critères de recherche.'
                : 'Soyez le premier à lancer une discussion !'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Discussion</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Nouvelle Discussion</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                    placeholder="Titre de votre discussion..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu *
                  </label>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                    placeholder="Décrivez votre question ou partagez votre expérience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          newPostTags.includes(tag)
                            ? 'bg-primary-color text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Paperclip className="w-4 h-4" />
                    <span>Joindre fichier</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      <span>Publier</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};