import axios from 'axios';
import { Grade, GradeStatus } from '../types';
import { AuthService } from './authService';

const API_URL = '/api/examtrack';

/**
 * Service de gestion des notes
 */
export class GradeService {
  /**
   * Récupère toutes les notes
   * @param filters Filtres optionnels
   * @returns Liste des notes
   */
  static async getGrades(filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/grades`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` },
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Get grades error:', error);
      throw error;
    }
  }

  /**
   * Récupère une note par son ID
   * @param id ID de la note
   * @returns Détails de la note
   */
  static async getGradeById(id: string) {
    try {
      const response = await axios.get(`${API_URL}/grades/${id}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get grade ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle note
   * @param grade Données de la note
   * @returns Note créée
   */
  static async createGrade(grade: Partial<Grade>) {
    try {
      const response = await axios.post(`${API_URL}/grades`, grade, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Create grade error:', error);
      throw error;
    }
  }

  /**
   * Met à jour une note
   * @param id ID de la note
   * @param grade Données à mettre à jour
   * @returns Note mise à jour
   */
  static async updateGrade(id: string, grade: Partial<Grade>) {
    try {
      const response = await axios.put(`${API_URL}/grades/${id}`, grade, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Update grade ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Supprime une note
   * @param id ID de la note
   * @returns Résultat de la suppression
   */
  static async deleteGrade(id: string) {
    try {
      const response = await axios.delete(`${API_URL}/grades/${id}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete grade ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Change le statut d'une note
   * @param id ID de la note
   * @param status Nouveau statut
   * @returns Note mise à jour
   */
  static async changeGradeStatus(id: string, status: GradeStatus) {
    try {
      const response = await axios.patch(`${API_URL}/grades/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Change grade ${id} status error:`, error);
      throw error;
    }
  }

  /**
   * Récupère les notes par examen
   * @param examId ID de l'examen
   * @returns Liste des notes pour l'examen spécifié
   */
  static async getGradesByExam(examId: string) {
    try {
      const response = await axios.get(`${API_URL}/grades/exam/${examId}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get grades by exam ${examId} error:`, error);
      throw error;
    }
  }

  /**
   * Récupère les notes par étudiant
   * @param studentId ID de l'étudiant
   * @returns Liste des notes pour l'étudiant spécifié
   */
  static async getGradesByStudent(studentId: string) {
    try {
      const response = await axios.get(`${API_URL}/grades/student/${studentId}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get grades by student ${studentId} error:`, error);
      throw error;
    }
  }

  /**
   * Récupère les notes par classe
   * @param classId ID de la classe
   * @returns Liste des notes pour la classe spécifiée
   */
  static async getGradesByClass(classId: string) {
    try {
      const response = await axios.get(`${API_URL}/grades/class/${classId}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get grades by class ${classId} error:`, error);
      throw error;
    }
  }

  /**
   * Importe des notes depuis un fichier CSV/Excel
   * @param examId ID de l'examen
   * @param file Fichier à importer
   * @returns Résultat de l'importation
   */
  static async importGrades(examId: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/grades/import/${examId}`, formData, {
        headers: { 
          Authorization: `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Import grades for exam ${examId} error:`, error);
      throw error;
    }
  }

  /**
   * Exporte des notes au format CSV/Excel
   * @param examId ID de l'examen
   * @param format Format d'exportation ('csv' ou 'excel')
   * @returns Blob du fichier exporté
   */
  static async exportGrades(examId: string, format: 'csv' | 'excel' = 'excel') {
    try {
      const response = await axios.get(`${API_URL}/grades/export/${examId}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` },
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Export grades for exam ${examId} error:`, error);
      throw error;
    }
  }

  /**
   * Calcule les moyennes pour une classe
   * @param classId ID de la classe
   * @param period Période (trimestre, semestre, etc.)
   * @returns Résultats calculés
   */
  static async calculateAverages(classId: string, period: string) {
    try {
      const response = await axios.post(`${API_URL}/grades/calculate-averages`, { classId, period }, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Calculate averages for class ${classId} error:`, error);
      throw error;
    }
  }

  /**
   * Génère les bulletins pour une classe
   * @param classId ID de la classe
   * @param period Période (trimestre, semestre, etc.)
   * @returns URL des bulletins générés
   */
  static async generateReportCards(classId: string, period: string) {
    try {
      const response = await axios.post(`${API_URL}/grades/report-cards`, { classId, period }, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Generate report cards for class ${classId} error:`, error);
      throw error;
    }
  }
}
