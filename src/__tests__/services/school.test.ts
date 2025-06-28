/**
 * Tests pour le service des écoles
 * @jest
 */

import { schoolService } from '../../services/school/schoolService';
import { api } from '../../services/api/client';
import { School } from '../../types/school';

// Mock du client API
jest.mock('../../services/api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

describe('School Service', () => {
  // Données de test
  const mockSchool: School = {
    id: '1',
    name: 'École Test',
    subdomain: 'ecole-test',
    status: 'active',
    subscription_plan_id: 'plan-1',
    payment_status: 'completed',
    kyc_status: 'verified',
    settings: {
      logo: 'logo.png',
      theme: 'light',
      language: 'fr'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('getSchoolById() récupère une école par son ID', async () => {
    // Mock de la réponse API
    (api.get as jest.Mock).mockResolvedValue({ data: mockSchool });

    // Appel de la méthode
    const result = await schoolService.getSchoolById('1');

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/schools/1');
    expect(result).toEqual(mockSchool);
  });

  test('getSchoolBySubdomain() récupère une école par son sous-domaine', async () => {
    // Mock de la réponse API
    (api.get as jest.Mock).mockResolvedValue({ data: mockSchool });

    // Appel de la méthode
    const result = await schoolService.getSchoolBySubdomain('ecole-test');

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/schools/subdomain/ecole-test');
    expect(result).toEqual(mockSchool);
  });

  test('createSchool() crée une nouvelle école', async () => {
    // Données pour la création
    const schoolData = {
      name: 'Nouvelle École',
      subdomain: 'nouvelle-ecole',
      type: 'primary',
      address: '123 Rue Principale'
    };

    // Mock de la réponse API
    (api.post as jest.Mock).mockResolvedValue({ data: { ...mockSchool, ...schoolData } });

    // Appel de la méthode
    const result = await schoolService.createSchool(schoolData);

    // Vérifications
    expect(api.post).toHaveBeenCalledWith('/schools', schoolData);
    expect(result).toEqual(expect.objectContaining({
      name: 'Nouvelle École',
      subdomain: 'nouvelle-ecole'
    }));
  });

  test('updateSchool() met à jour une école existante', async () => {
    // Données pour la mise à jour
    const updateData = {
      name: 'École Mise à Jour',
      status: 'active' as const
    };

    // Mock de la réponse API
    (api.put as jest.Mock).mockResolvedValue({ data: { ...mockSchool, ...updateData } });

    // Appel de la méthode
    const result = await schoolService.updateSchool('1', updateData);

    // Vérifications
    expect(api.put).toHaveBeenCalledWith('/schools/1', updateData);
    expect(result).toEqual(expect.objectContaining({
      id: '1',
      name: 'École Mise à Jour',
      status: 'active'
    }));
  });

  test('updateSchoolStatus() met à jour le statut d\'une école', async () => {
    // Nouveau statut
    const newStatus = 'suspended' as const;

    // Mock de la réponse API
    (api.put as jest.Mock).mockResolvedValue({ 
      data: { ...mockSchool, status: newStatus } 
    });

    // Appel de la méthode
    const result = await schoolService.updateSchoolStatus('1', newStatus);

    // Vérifications
    expect(api.put).toHaveBeenCalledWith('/schools/1/status', { status: newStatus });
    expect(result).toEqual(expect.objectContaining({
      id: '1',
      status: 'suspended'
    }));
  });

  test('updateKycStatus() met à jour le statut KYC d\'une école', async () => {
    // Nouveau statut KYC
    const newKycStatus = 'verified' as const;

    // Mock de la réponse API
    (api.put as jest.Mock).mockResolvedValue({ 
      data: { ...mockSchool, kyc_status: newKycStatus } 
    });

    // Appel de la méthode
    const result = await schoolService.updateKycStatus('1', newKycStatus);

    // Vérifications
    expect(api.put).toHaveBeenCalledWith('/schools/1/kyc-status', { kyc_status: newKycStatus });
    expect(result).toEqual(expect.objectContaining({
      id: '1',
      kyc_status: 'verified'
    }));
  });

  test('listSchools() récupère la liste des écoles', async () => {
    // Mock de la réponse API
    const mockResponse = {
      data: [mockSchool],
      total: 1,
      page: 1,
      limit: 10,
      message: 'Schools retrieved successfully'
    };
    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    // Appel de la méthode
    const result = await schoolService.listSchools(1, 10);

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/schools', {
      params: {
        page: '1',
        limit: '10'
      }
    });
    expect(result).toEqual(mockResponse);
  });
});
