import axios from 'axios';
import { Exam, ExamStatus, ExamType } from '../types';
import { AuthService } from './authService';

const API_URL = '/api/examtrack';

/**
 * Service de gestion des examens
 */
export class ExamService {
  /**
   * Récupère tous les examens
   * @param filters Filtres optionnels
   * @returns Liste des examens
   */
  static async getExams(filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/exams`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` },
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Get exams error:', error);
      throw error;
    }
  }

  /**
   * Récupère un examen par son ID
   * @param id ID de l'examen
   * @returns Détails de l'examen
   */
  static async getExamById(id: string) {
    try {
      const response = await axios.get(`${API_URL}/exams/${id}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get exam ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouvel examen
   * @param exam Données de l'examen
   * @returns Examen créé
   */
  static async createExam(exam: Partial<Exam>) {
    try {
      const response = await axios.post(`${API_URL}/exams`, exam, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Create exam error:', error);
      throw error;
    }
  }

  /**
   * Met à jour un examen
   * @param id ID de l'examen
   * @param exam Données à mettre à jour
   * @returns Examen mis à jour
   */
  static async updateExam(id: string, exam: Partial<Exam>) {
    try {
      const response = await axios.put(`${API_URL}/exams/${id}`, exam, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Update exam ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Supprime un examen
   * @param id ID de l'examen
   * @returns Résultat de la suppression
   */
  static async deleteExam(id: string) {
    try {
      const response = await axios.delete(`${API_URL}/exams/${id}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Delete exam ${id} error:`, error);
      throw error;
    }
  }

  /**
   * Change le statut d'un examen
   * @param id ID de l'examen
   * @param status Nouveau statut
   * @returns Examen mis à jour
   */
  static async changeExamStatus(id: string, status: ExamStatus) {
    try {
      const response = await axios.patch(`${API_URL}/exams/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Change exam ${id} status error:`, error);
      throw error;
    }
  }

  /**
   * Assigne des correcteurs à un examen
   * @param examId ID de l'examen
   * @param teacherIds IDs des enseignants
   * @returns Résultat de l'assignation
   */
  static async assignGraders(examId: string, teacherIds: string[]) {
    try {
      const response = await axios.post(`${API_URL}/exams/${examId}/graders`, { teacherIds }, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Assign graders to exam ${examId} error:`, error);
      throw error;
    }
  }

  /**
   * Récupère les examens à venir
   * @param limit Nombre d'examens à récupérer
   * @returns Liste des examens à venir
   */
  static async getUpcomingExams(limit = 5) {
    try {
      const response = await axios.get(`${API_URL}/exams/upcoming`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` },
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get upcoming exams error:', error);
      throw error;
    }
  }

  /**
   * Récupère les examens par type
   * @param type Type d'examen
   * @returns Liste des examens du type spécifié
   */
  static async getExamsByType(type: ExamType) {
    try {
      const response = await axios.get(`${API_URL}/exams/type/${type}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get exams by type ${type} error:`, error);
      throw error;
    }
  }

  /**
   * Récupère les examens par classe
   * @param classId ID de la classe
   * @returns Liste des examens pour la classe spécifiée
   */
  static async getExamsByClass(classId: string) {
    try {
      const response = await axios.get(`${API_URL}/exams/class/${classId}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get exams by class ${classId} error:`, error);
      throw error;
    }
  }

  /**
   * Récupère les examens par matière
   * @param subjectId ID de la matière
   * @returns Liste des examens pour la matière spécifiée
   */
  static async getExamsBySubject(subjectId: string) {
    try {
      const response = await axios.get(`${API_URL}/exams/subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get exams by subject ${subjectId} error:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'un examen
   * @param examId ID de l'examen
   * @returns Statistiques de l'examen
   */
  static async getExamStatistics(examId: string) {
    try {
      const response = await axios.get(`${API_URL}/exams/${examId}/statistics`, {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Get exam ${examId} statistics error:`, error);
      throw error;
    }
  }
}
