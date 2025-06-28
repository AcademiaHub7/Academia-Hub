import axios from 'axios';
import { Document, DocumentCategory } from '../types';
import { AuthService } from './authService';

const API_URL = '/api/examtrack';

/**
 * Service de gestion des documents et épreuves
 */
export class DocumentService {
  /**
   * Récupère tous les documents
   * @param filters Filtres optionnels
   * @returns Liste des documents
   */
  static async getDocuments(filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/documents`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` },
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  }

  /**
   * Récupère un document par son ID
   * @param id ID du document
   * @returns Détails du document
   */
  static async getDocumentById(id: string) {
    try {
      const response = await axios.get(`${API_URL}/documents/${id}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get document ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Télécharge un document
   * @param id ID du document
   * @returns Blob du document
   */
  static async downloadDocument(id: string) {
    try {
      const response = await axios.get(`${API_URL}/documents/${id}/download`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Download document ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouveau document
   * @param document Métadonnées du document
   * @param file Fichier à télécharger
   * @returns Document créé
   */
  static async createDocument(document: Partial<Document>, file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document', JSON.stringify(document));
      
      const response = await axios.post(`${API_URL}/documents`, formData, {
        headers: { 
          Authorization: `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create document error:', error);
      throw error;
    }
  }

  /**
   * Met à jour un document
   * @param id ID du document
   * @param document Données à mettre à jour
   * @param file Nouveau fichier (optionnel)
   * @returns Document mis à jour
   */
  static async updateDocument(id: string, document: Partial<Document>, file?: File) {
    try {
      const formData = new FormData();
      formData.append('document', JSON.stringify(document));
      
      if (file) {
        formData.append('file', file);
      }
      
      const response = await axios.put(`${API_URL}/documents/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Update document ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Supprime un document
   * @param id ID du document
   * @returns Résultat de la suppression
   */
  static async deleteDocument(id: string) {
    try {
      const response = await axios.delete(`${API_URL}/documents/${id}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete document ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Récupère les documents par catégorie
   * @param category Catégorie de document
   * @returns Liste des documents de la catégorie spécifiée
   */
  static async getDocumentsByCategory(category: DocumentCategory) {
    try {
      const response = await axios.get(`${API_URL}/documents/category/${category}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get documents by category ${category} error:`, error);
      throw error;
    }
  }

  /**
   * Récupère les documents par matière
   * @param subjectId ID de la matière
   * @returns Liste des documents pour la matière spécifiée
   */
  static async getDocumentsBySubject(subjectId: string) {
    try {
      const response = await axios.get(`${API_URL}/documents/subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get documents by subject ${subjectId} error:`, error);
      throw error;
    }
  }

  /**
   * Récupère les documents par examen
   * @param examId ID de l'examen
   * @returns Liste des documents pour l'examen spécifié
   */
  static async getDocumentsByExam(examId: string) {
    try {
      const response = await axios.get(`${API_URL}/documents/exam/${examId}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get documents by exam ${examId} error:`, error);
      throw error;
    }
  }

  /**
   * Recherche de documents
   * @param query Terme de recherche
   * @returns Liste des documents correspondants
   */
  static async searchDocuments(query: string) {
    try {
      const response = await axios.get(`${API_URL}/documents/search`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` },
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error(`Search documents with query "${query}" error:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle version d'un document
   * @param id ID du document original
   * @param file Nouveau fichier
   * @param comment Commentaire sur la nouvelle version
   * @returns Nouvelle version du document
   */
  static async createDocumentVersion(id: string, file: File, comment: string) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('comment', comment);
      
      const response = await axios.post(`${API_URL}/documents/${id}/versions`, formData, {
        headers: { 
          Authorization: `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Create version for document ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Récupère l'historique des versions d'un document
   * @param id ID du document
   * @returns Liste des versions du document
   */
  static async getDocumentVersions(id: string) {
    try {
      const response = await axios.get(`${API_URL}/documents/${id}/versions`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get versions for document ${id} error:`, error);
      throw error;
    }
  }
}
