/**
 * Client API pour les requêtes HTTP
 * @module services/api/client
 */

// Importation des données simulées pour le mode développement
import { 
  mockSession, 
  mockPayment, 
  mockPaymentStatus, 
  logMockData, 
  simulateDelay,
  generateId 
} from './mockData';

/**
 * Options pour les requêtes API
 */
interface ApiOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

// Activer le mode simulé pour le développement
const USE_MOCK = true;

/**
 * Classe client pour les requêtes API
 */
class ApiClient {
  private baseUrl: string;

  /**
   * Crée une nouvelle instance du client API
   * @param baseUrl - URL de base de l'API
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Effectue une requête GET
   * @param endpoint - Point de terminaison de l'API
   * @param options - Options de la requête
   * @returns Promesse avec les données de la réponse
   */
  async get<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    // Si mode simulé activé
    if (USE_MOCK) {
      logMockData('GET', endpoint);
      await simulateDelay();
      
      // Retourner des données simulées selon l'endpoint
      if (endpoint.includes('/registration/session/')) {
        if (endpoint.includes('/payment-status/')) {
          return mockPaymentStatus as unknown as T;
        }
        return mockSession as unknown as T;
      }
      
      return {} as T;
    }
    
    // Sinon, faire une vraie requête API
    try {
      const url = this.buildUrl(endpoint, options.params);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(options.headers),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('Erreur API GET:', error);
      throw error;
    }
  }

  /**
   * Effectue une requête POST
   * @param endpoint - Point de terminaison de l'API
   * @param data - Données à envoyer
   * @param options - Options de la requête
   * @returns Promesse avec les données de la réponse
   */
  async post<T>(endpoint: string, data: unknown, options: ApiOptions = {}): Promise<T> {
    // Si mode simulé activé
    if (USE_MOCK) {
      logMockData('POST', endpoint, data);
      await simulateDelay();
      
      // Retourner des données simulées selon l'endpoint
      if (endpoint === '/registration/start-session') {
        return mockSession as unknown as T;
      }
      
      if (endpoint.includes('/step3')) {
        return mockPayment as unknown as T;
      }
      
      return { id: generateId() } as unknown as T;
    }
    
    // Sinon, faire une vraie requête API
    try {
      const url = this.buildUrl(endpoint, options.params);
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('Erreur API POST:', error);
      throw error;
    }
  }

  /**
   * Effectue une requête PUT
   * @param endpoint - Point de terminaison de l'API
   * @param data - Données à envoyer
   * @param options - Options de la requête
   * @returns Promesse avec les données de la réponse
   */
  async put<T>(endpoint: string, data: unknown, options: ApiOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(options.headers),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Effectue une requête DELETE
   * @param endpoint - Point de terminaison de l'API
   * @param options - Options de la requête
   * @returns Promesse avec les données de la réponse
   */
  async delete<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(options.headers),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Construit l'URL complète avec les paramètres
   * @param endpoint - Point de terminaison de l'API
   * @param params - Paramètres de requête
   * @returns URL complète
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  }

  /**
   * Récupère les en-têtes HTTP avec le token d'authentification
   * @param additionalHeaders - En-têtes supplémentaires
   * @returns En-têtes HTTP
   */
  private getHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Gère la réponse de l'API
   * @param response - Réponse de fetch
   * @returns Données de la réponse
   * @throws Erreur avec message d'erreur de l'API
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      const error = data.message || response.statusText;
      throw new Error(error);
    }

    return data;
  }
}

// URL de base de l'API
let API_URL = 'http://localhost:3000/api';

// En environnement de production/développement, utiliser les variables d'environnement Vite
if (typeof import.meta !== 'undefined' && import.meta.env) {
  API_URL = import.meta.env.VITE_API_URL || API_URL;
}

// Exporter une instance du client API
export const api = new ApiClient(API_URL);
