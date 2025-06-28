import axios from 'axios';
import { User, UserRole } from '../types';

const API_URL = '/api/examtrack';

/**
 * Service d'authentification pour ExamTrack
 */
export class AuthService {
  /**
   * Connecte un utilisateur
   * @param email Email de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   * @returns Informations de l'utilisateur et token JWT
   */
  static async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('examtrack_token', response.data.token);
        localStorage.setItem('examtrack_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  static logout() {
    localStorage.removeItem('examtrack_token');
    localStorage.removeItem('examtrack_user');
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   * @returns Utilisateur connecté ou null
   */
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('examtrack_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns true si l'utilisateur est connecté
   */
  static isLoggedIn(): boolean {
    return !!localStorage.getItem('examtrack_token');
  }

  /**
   * Récupère le token JWT
   * @returns Token JWT ou null
   */
  static getToken(): string | null {
    return localStorage.getItem('examtrack_token');
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param role Rôle à vérifier
   * @returns true si l'utilisateur a le rôle spécifié
   */
  static hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === role;
  }

  /**
   * Vérifie si l'utilisateur est un administrateur (super admin ou admin école)
   * @returns true si l'utilisateur est un administrateur
   */
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user !== null && (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.SCHOOL_ADMIN);
  }

  /**
   * Vérifie si l'utilisateur est un enseignant
   * @returns true si l'utilisateur est un enseignant
   */
  static isTeacher(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === UserRole.TEACHER;
  }

  /**
   * Vérifie si l'utilisateur est un étudiant
   * @returns true si l'utilisateur est un étudiant
   */
  static isStudent(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === UserRole.STUDENT;
  }

  /**
   * Demande de réinitialisation de mot de passe
   * @param email Email de l'utilisateur
   */
  static async requestPasswordReset(email: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password-request`, { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Réinitialise le mot de passe
   * @param token Token de réinitialisation
   * @param newPassword Nouveau mot de passe
   */
  static async resetPassword(token: string, newPassword: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Récupère l'historique des connexions
   */
  static async getLoginHistory() {
    try {
      const response = await axios.get(`${API_URL}/auth/login-history`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Login history error:', error);
      throw error;
    }
  }
}
