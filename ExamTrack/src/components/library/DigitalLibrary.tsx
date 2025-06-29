import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useLibraryStore } from '../../stores/libraryStore';
import { 
  BookOpen, 
  Search, 
  Filter,
  Download,
  Eye,
  Star,
  Clock,
  Users,
  FileText,
  Video,
  Headphones,
  Image as ImageIcon,
  Grid,
  List
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface LibraryResource {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'document' | 'video' | 'audio' | 'image';
  category: string;
  subject: string;
  level: string;
  author: string;
  publishedDate: Date;
  fileSize: string;
  downloadCount: number;
  rating: number;
  tags: string[];
  thumbnailUrl: string;
  fileUrl: string;
  isOfficial: boolean;
}

const resourceTypes = [
  { value: 'book', label: 'Livres', icon: BookOpen, color: 'text-blue-600' },
  { value: 'document', label: 'Documents', icon: FileText, color: 'text-green-600' },
  { value: 'video', label: 'Vidéos', icon: Video, color: 'text-red-600' },
  { value: 'audio', label: 'Audio', icon: Headphones, color: 'text-purple-600' },
  { value: 'image', label: 'Images', icon: ImageIcon, color: 'text-yellow-600' }
];

const categories = [
  'Manuels Scolaires',
  'Programmes Officiels',
  'Guides Pédagogiques',
  'Exercices et Devoirs',
  'Ressources Multimédias',
  'Documents Administratifs',
  'Formations Enseignants'
];

const subjects = [
  'Mathématiques',
  'Français',
  'Anglais',
  'Sciences Physiques',
  'SVT',
  'Histoire-Géographie',
  'Philosophie',
  'Arts Plastiques',
  'EPS',
  'Informatique'
];

const levels = [
  'Maternelle',
  'CP', 'CE1', 'CE2', 'CM1', 'CM2',
  '6ème', '5ème', '4ème', '3ème',
  '2nde', '1ère', 'Terminale'
];

export const DigitalLibrary: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const { resources, fetchResources, isLoading } = useLibraryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock library resources
  const mockResources: LibraryResource[] = [
    {
      id: '1',
      title: 'Manuel de Mathématiques 6ème',
      description: 'Manuel officiel de mathématiques pour la classe de 6ème, conforme au programme béninois.',
      type: 'book',
      category: 'Manuels Scolaires',
      subject: 'Mathématiques',
      level: '6ème',
      author: 'Ministère de l\'Éducation Nationale',
      publishedDate: new Date('2024-01-15'),
      fileSize: '25.4 MB',
      downloadCount: 1247,
      rating: 4.8,
      tags: ['officiel', 'programme', 'exercices'],
      thumbnailUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
      fileUrl: '/resources/manuel-math-6eme.pdf',
      isOfficial: true
    },
    {
      id: '2',
      title: 'Guide Pédagogique Français CE2',
      description: 'Guide complet pour l\'enseignement du français en CE2 avec méthodes et exercices.',
      type: 'document',
      category: 'Guides Pédagogiques',
      subject: 'Français',
      level: 'CE2',
      author: 'Direction de l\'Enseignement Primaire',
      publishedDate: new Date('2024-02-10'),
      fileSize: '18.7 MB',
      downloadCount: 892,
      rating: 4.6,
      tags: ['pédagogie', 'méthodes', 'enseignants'],
      thumbnailUrl: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=300',
      fileUrl: '/resources/guide-francais-ce2.pdf',
      isOfficial: true
    },
    {
      id: '3',
      title: 'Cours de Sciences Physiques - Électricité',
      description: 'Vidéo explicative sur les bases de l\'électricité pour les classes de 4ème et 3ème.',
      type: 'video',
      category: 'Ressources Multimédias',
      subject: 'Sciences Physiques',
      level: '4ème',
      author: 'Prof. AKPOVI Jean',
      publishedDate: new Date('2024-03-05'),
      fileSize: '156 MB',
      downloadCount: 634,
      rating: 4.9,
      tags: ['électricité', 'expériences', 'démonstration'],
      thumbnailUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300',
      fileUrl: '/resources/cours-electricite.mp4',
      isOfficial: false
    },
    {
      id: '4',
      title: 'Exercices de Grammaire Française',
      description: 'Recueil d\'exercices de grammaire française avec corrigés pour tous niveaux.',
      type: 'document',
      category: 'Exercices et Devoirs',
      subject: 'Français',
      level: 'Tous niveaux',
      author: 'Mme ASSOGBA Sylvie',
      publishedDate: new Date('2024-02-28'),
      fileSize: '12.3 MB',
      downloadCount: 1156,
      rating: 4.7,
      tags: ['grammaire', 'exercices', 'corrigés'],
      thumbnailUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300',
      fileUrl: '/resources/exercices-grammaire.pdf',
      isOfficial: false
    },
    {
      id: '5',
      title: 'Programme Officiel SVT 2024',
      description: 'Programme officiel de Sciences de la Vie et de la Terre pour l\'année scolaire 2024-2025.',
      type: 'document',
      category: 'Programmes Officiels',
      subject: 'SVT',
      level: 'Tous niveaux',
      author: 'Ministère de l\'Éducation Nationale',
      publishedDate: new Date('2024-01-10'),
      fileSize: '8.9 MB',
      downloadCount: 2341,
      rating: 5.0,
      tags: ['programme', 'officiel', '2024'],
      thumbnailUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=300',
      fileUrl: '/resources/programme-svt-2024.pdf',
      isOfficial: true
    }
  ];

  const [filteredResources, setFilteredResources] = useState<LibraryResource[]>(mockResources);

  useEffect(() => {
    let filtered = mockResources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(resource => 
        resource.level === selectedLevel || resource.level === 'Tous niveaux'
      );
    }

    // Sort resources
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.publishedDate.getTime() - a.publishedDate.getTime();
        case 'popular':
          return b.downloadCount - a.downloadCount;
        case 'rating':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredResources(filtered);
  }, [searchTerm, selectedType, selectedCategory, selectedSubject, selectedLevel, sortBy]);

  const getTypeIcon = (type: string) => {
    const typeData = resourceTypes.find(t => t.value === type);
    if (!typeData) return <FileText className="w-5 h-5" />;
    const Icon = typeData.icon;
    return <Icon className={`w-5 h-5 ${typeData.color}`} />;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bibliothèque Numérique</h1>
            <p className="text-gray-600 mt-1">
              Ressources pédagogiques officielles et supports d'enseignement
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary-color" />
            <span className="text-sm font-medium text-primary-color">
              {filteredResources.length} ressources disponibles
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher des ressources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="all">Tous types</option>
              {resourceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
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
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="all">Toutes matières</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="all">Tous niveaux</option>
              {levels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort and View Options */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="recent">Plus récents</option>
              <option value="popular">Plus téléchargés</option>
              <option value="rating">Mieux notés</option>
              <option value="title">Ordre alphabétique</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-color text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-color text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Resource Type Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {resourceTypes.map(type => {
          const count = filteredResources.filter(r => r.type === type.value).length;
          const Icon = type.icon;
          return (
            <div key={type.value} className="bg-white rounded-lg shadow-sm border p-4 text-center">
              <Icon className={`w-8 h-8 mx-auto mb-2 ${type.color}`} />
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600">{type.label}</p>
            </div>
          );
        })}
      </div>

      {/* Resources Grid/List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune ressource trouvée</h3>
            <p className="text-gray-600">
              Aucune ressource ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    {getTypeIcon(resource.type)}
                  </div>
                  {resource.isOfficial && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary-color text-white text-xs px-2 py-1 rounded-full">
                        Officiel
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(resource.rating)}
                    <span className="text-sm text-gray-600 ml-2">
                      ({resource.rating})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>{resource.subject}</span>
                    <span>{resource.level}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{resource.author}</span>
                    <span>{resource.fileSize}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Télécharger</span>
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <img
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getTypeIcon(resource.type)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {resource.title}
                          </h3>
                          {resource.isOfficial && (
                            <span className="bg-primary-color text-white text-xs px-2 py-1 rounded-full">
                              Officiel
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-2">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{resource.author}</span>
                          <span>{resource.subject} - {resource.level}</span>
                          <span>{resource.fileSize}</span>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{resource.downloadCount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="flex items-center space-x-1">
                          {renderStars(resource.rating)}
                        </div>
                        <button className="flex items-center space-x-1 px-3 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Télécharger</span>
                        </button>
                        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};