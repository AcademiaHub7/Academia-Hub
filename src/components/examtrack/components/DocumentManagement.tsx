import React, { useState, useEffect } from 'react';
import { 
  File, FilePlus, FolderPlus, Search, Download, Eye, Trash2, 
  Edit, Filter, FileText, ExternalLink, FileArchive
} from 'lucide-react';
import { DocumentService } from '../services/documentService';
import { Document, DocumentCategory } from '../types';

export const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'all'>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const docsData = await DocumentService.getDocuments();
        setDocuments(docsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Impossible de charger les documents');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value as DocumentCategory | 'all');
  };

  const handlePreviewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsPreviewOpen(true);
  };

  const handleDownloadDocument = (doc: Document) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.title || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case DocumentCategory.EXAM:
        return 'Examen';
      case DocumentCategory.CORRECTION:
        return 'Corrigé';
      case DocumentCategory.OFFICIAL:
        return 'Officiel';
      case DocumentCategory.PEDAGOGICAL:
        return 'Pédagogique';
      case DocumentCategory.ADMINISTRATIVE:
        return 'Administratif';
      default:
        return category;
    }
  };

  // Status badge class helper (commented out as it's not currently used)
  // const getStatusBadgeClass = (status: DocumentStatus) => {
  //   switch (status) {
  //     case DocumentStatus.APPROVED:
  //       return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  //     case DocumentStatus.UNDER_REVIEW:
  //       return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  //     case DocumentStatus.PUBLISHED:
  //       return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  //     case DocumentStatus.DRAFT:
  //       return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  //     case DocumentStatus.ARCHIVED:
  //       return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
  //     default:
  //       return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  //   }
  // };

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case DocumentCategory.EXAM:
        return <FileText className="h-5 w-5 text-red-500" />;
      case DocumentCategory.CORRECTION:
        return <FileText className="h-5 w-5 text-green-500" />;
      case DocumentCategory.OFFICIAL:
        return <File className="h-5 w-5 text-blue-500" />;
      case DocumentCategory.PEDAGOGICAL:
        return <FileText className="h-5 w-5 text-amber-500" />;
      case DocumentCategory.ADMINISTRATIVE:
        return <FileArchive className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button 
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion Documentaire</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FilePlus className="h-5 w-5 mr-2" />
            Nouveau document
          </button>
          <button
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FolderPlus className="h-5 w-5 mr-2" />
            Nouveau dossier
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-300"
                value={categoryFilter}
                onChange={handleCategoryChange}
                aria-label="Filtrer par catégorie"
              >
                <option value="all">Toutes les catégories</option>
                <option value={DocumentCategory.EXAM}>Épreuves d'examen</option>
                <option value={DocumentCategory.CORRECTION}>Corrections</option>
                <option value={DocumentCategory.OFFICIAL}>Documents officiels</option>
                <option value={DocumentCategory.PEDAGOGICAL}>Ressources pédagogiques</option>
                <option value={DocumentCategory.ADMINISTRATIVE}>Documents administratifs</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un document..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Documents Grid */}
        <div className="p-4">
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden">
                  <div className="p-4 flex items-center space-x-4">
                    {getCategoryIcon(doc.category)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.title}</p>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                      {doc.subjectId} • {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {getCategoryLabel(doc.category)}
                    </span>
                  </div>
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {doc.description || 'Aucune description disponible'}
                    </p>
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {doc.fileSize && formatFileSize(doc.fileSize)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handlePreviewDocument(doc)}
                        className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        aria-label={`Aperçu du document ${doc.title}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadDocument(doc)}
                        className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                        aria-label={`Télécharger le document ${doc.title}`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400"
                        aria-label={`Modifier le document ${doc.title}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        aria-label={`Supprimer le document ${doc.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <p>Aucun document trouvé</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Affichage de <span className="font-medium">{filteredDocuments.length}</span> documents
                </p>
              </div>
              <div>
                {/* Pagination components would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {isPreviewOpen && selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {selectedDocument.title}
                </h3>
                <button 
                  onClick={closePreview}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-2 mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getCategoryLabel(selectedDocument.category)} • {selectedDocument.subjectId}
                </p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {selectedDocument.description || 'Aucune description disponible'}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-md p-4 h-96 overflow-auto">
                {/* Preview would be rendered here based on document type */}
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <File className="h-16 w-16 mx-auto text-gray-400" />
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      Aperçu non disponible. Veuillez télécharger le document.
                    </p>
                    <div className="mt-4">
                      <button 
                        onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Télécharger
                      </button>
                      {selectedDocument?.fileUrl && (
                        <a 
                          href={selectedDocument.fileUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md shadow-sm transition-colors"
                        >
                          <span>Ouvrir le document</span>
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <p>Ajouté par: {selectedDocument.uploadedBy || 'Anonyme'}</p>
                  <p>Date d'ajout: {selectedDocument.uploadedAt && new Date(selectedDocument.uploadedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p>Version: {selectedDocument.version || '1.0'}</p>
                  <p>Taille: {selectedDocument.fileSize && formatFileSize(selectedDocument.fileSize)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;
