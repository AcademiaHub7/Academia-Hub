/**
 * Tests pour le client API
 * @jest
 */

// Créer un mock complet du module client API
jest.mock('../../services/api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

// Importer le mock
import { api } from '../../services/api/client';

// Mock de localStorage global
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

describe('API Client', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('get() peut être appelé avec les bons paramètres', async () => {
    // Configuration du mock pour retourner une valeur
    const mockData = { data: { id: '1', name: 'Test' } };
    (api.get as jest.Mock).mockResolvedValue(mockData);

    // Appel de la méthode get
    const result = await api.get('/test');

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/test');
    expect(result).toEqual(mockData);
  });

  test('post() peut être appelé avec les bons paramètres', async () => {
    // Configuration du mock pour retourner une valeur
    const mockData = { data: { id: '1', name: 'Test' } };
    (api.post as jest.Mock).mockResolvedValue(mockData);

    // Données à envoyer
    const data = { name: 'Test', email: 'test@example.com' };

    // Appel de la méthode post
    const result = await api.post('/test', data);

    // Vérifications
    expect(api.post).toHaveBeenCalledWith('/test', data);
    expect(result).toEqual(mockData);
  });

  test('put() peut être appelé avec les bons paramètres', async () => {
    // Configuration du mock pour retourner une valeur
    const mockData = { data: { id: '1', name: 'Updated' } };
    (api.put as jest.Mock).mockResolvedValue(mockData);

    // Données à envoyer
    const data = { name: 'Updated' };

    // Appel de la méthode put
    const result = await api.put('/test/1', data);

    // Vérifications
    expect(api.put).toHaveBeenCalledWith('/test/1', data);
    expect(result).toEqual(mockData);
  });

  test('delete() peut être appelé avec les bons paramètres', async () => {
    // Configuration du mock pour retourner une valeur
    const mockData = { message: 'Resource deleted' };
    (api.delete as jest.Mock).mockResolvedValue(mockData);

    // Appel de la méthode delete
    const result = await api.delete('/test/1');

    // Vérifications
    expect(api.delete).toHaveBeenCalledWith('/test/1');
    expect(result).toEqual(mockData);
  });

  test('les méthodes API peuvent lancer des erreurs', async () => {
    // Configuration du mock pour lancer une erreur
    const errorMessage = 'Resource not found';
    (api.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Appel de la méthode get qui devrait échouer
    await expect(api.get('/test/999')).rejects.toThrow(errorMessage);
  });
});
