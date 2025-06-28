/**
 * Mock du client API pour les tests
 */

// Création d'un mock du client API
export const api = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Réinitialisation des mocks
export const resetApiMocks = () => {
  api.get.mockReset();
  api.post.mockReset();
  api.put.mockReset();
  api.delete.mockReset();
};
