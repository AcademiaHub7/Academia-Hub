/**
 * Tests pour le service des utilisateurs
 * @jest
 */

import { userService } from '../../services/user/userService';
import { api } from '../../services/api/client';
import { User } from '../../types/user';

// Mock du client API
jest.mock('../../services/api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

describe('User Service', () => {
  // Données de test
  const mockUser: User = {
    id: '1',
    tenant_id: 'school-1',
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+22997123456',
    role: 'teacher',
    status: 'active',
    kyc_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('getUserById() récupère un utilisateur par son ID', async () => {
    // Mock de la réponse API
    (api.get as jest.Mock).mockResolvedValue({ data: mockUser });

    // Appel de la méthode
    const result = await userService.getUserById('1');

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/users/1');
    expect(result).toEqual(mockUser);
  });

  test('getUserByEmail() récupère un utilisateur par son email', async () => {
    // Mock de la réponse API
    (api.get as jest.Mock).mockResolvedValue({ data: mockUser });

    // Appel de la méthode
    const result = await userService.getUserByEmail('user@example.com');

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/users/email/user@example.com');
    expect(result).toEqual(mockUser);
  });

  test('createUser() crée un nouvel utilisateur', async () => {
    // Données pour la création
    const userData = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '+22997654321',
      role: 'student' as const,
      tenant_id: 'school-1'
    };

    // Mock de la réponse API
    const newUser = { ...mockUser, ...userData, id: '2', password: undefined };
    (api.post as jest.Mock).mockResolvedValue({ data: newUser });

    // Appel de la méthode
    const result = await userService.createUser(userData);

    // Vérifications
    expect(api.post).toHaveBeenCalledWith('/users', userData);
    expect(result).toEqual(expect.objectContaining({
      id: '2',
      email: 'jane@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'student'
    }));
  });

  test('updateUser() met à jour un utilisateur existant', async () => {
    // Données pour la mise à jour
    const updateData = {
      first_name: 'John Updated',
      phone: '+22998765432'
    };

    // Mock de la réponse API
    (api.put as jest.Mock).mockResolvedValue({ data: { ...mockUser, ...updateData } });

    // Appel de la méthode
    const result = await userService.updateUser('1', updateData);

    // Vérifications
    expect(api.put).toHaveBeenCalledWith('/users/1', updateData);
    expect(result).toEqual(expect.objectContaining({
      id: '1',
      first_name: 'John Updated',
      phone: '+22998765432'
    }));
  });

  test('updateUserStatus() met à jour le statut d\'un utilisateur', async () => {
    // Nouveau statut
    const newStatus = 'suspended' as const;

    // Mock de la réponse API
    (api.put as jest.Mock).mockResolvedValue({ 
      data: { ...mockUser, status: newStatus } 
    });

    // Appel de la méthode
    const result = await userService.updateUserStatus('1', newStatus);

    // Vérifications
    expect(api.put).toHaveBeenCalledWith('/users/1/status', { status: newStatus });
    expect(result).toEqual(expect.objectContaining({
      id: '1',
      status: 'suspended'
    }));
  });

  test('updateKycStatus() met à jour le statut KYC d\'un utilisateur', async () => {
    // Nouveau statut KYC
    const kycVerified = true;

    // Mock de la réponse API
    (api.put as jest.Mock).mockResolvedValue({ 
      data: { ...mockUser, kyc_verified: kycVerified } 
    });

    // Appel de la méthode
    const result = await userService.updateKycStatus('1', kycVerified);

    // Vérifications
    expect(api.put).toHaveBeenCalledWith('/users/1/kyc-status', { kyc_verified: kycVerified });
    expect(result).toEqual(expect.objectContaining({
      id: '1',
      kyc_verified: true
    }));
  });

  test('listUsersByTenant() récupère la liste des utilisateurs d\'un tenant', async () => {
    // Mock de la réponse API
    const mockResponse = {
      data: [mockUser],
      total: 1,
      page: 1,
      limit: 10,
      message: 'Users retrieved successfully'
    };
    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    // Appel de la méthode
    const result = await userService.listUsersByTenant('school-1', 1, 10);

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/tenants/school-1/users', {
      params: {
        page: '1',
        limit: '10'
      }
    });
    expect(result).toEqual(mockResponse);
  });

  test('listUsersByTenant() avec filtre de rôle', async () => {
    // Mock de la réponse API
    const mockResponse = {
      data: [mockUser],
      total: 1,
      page: 1,
      limit: 10,
      message: 'Users retrieved successfully'
    };
    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    // Appel de la méthode avec filtre de rôle
    const result = await userService.listUsersByTenant('school-1', 1, 10, 'teacher');

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/tenants/school-1/users', {
      params: {
        page: '1',
        limit: '10',
        role: 'teacher'
      }
    });
    expect(result).toEqual(mockResponse);
  });

  test('deleteUser() supprime un utilisateur', async () => {
    // Mock de la réponse API
    const mockResponse = { message: 'User deleted successfully' };
    (api.delete as jest.Mock).mockResolvedValue(mockResponse);

    // Appel de la méthode
    const result = await userService.deleteUser('1');

    // Vérifications
    expect(api.delete).toHaveBeenCalledWith('/users/1');
    expect(result).toEqual(mockResponse);
  });
});
