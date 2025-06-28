/**
 * Tests pour le service des abonnements
 * @jest
 */

import { subscriptionService } from '../../services/subscription/subscriptionService';
import { api } from '../../services/api/client';
import { Subscription, Plan } from '../../types/subscription';

// Mock du client API
jest.mock('../../services/api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

describe('Subscription Service', () => {
  // Données de test
  const mockSubscription: Subscription = {
    id: '1',
    tenant_id: 'school-1',
    plan_id: 'plan-1',
    fedapay_transaction_id: 'transaction-1',
    status: 'active',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const mockPlan: Plan = {
    id: 'plan-1',
    name: 'Plan Standard',
    description: 'Plan standard pour les écoles',
    price: 50000,
    currency: 'XOF',
    duration_days: 365,
    features: {
      max_students: 500,
      max_teachers: 50,
      modules: ['attendance', 'grades', 'finance'],
      support_level: 'standard',
      storage_gb: 10
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('getSubscriptionById() récupère un abonnement par son ID', async () => {
    // Mock de la réponse API
    (api.get as jest.Mock).mockResolvedValue({ data: mockSubscription });

    // Appel de la méthode
    const result = await subscriptionService.getSubscriptionById('1');

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/subscriptions/1');
    expect(result).toEqual(mockSubscription);
  });

  test('getActiveSubscription() récupère l\'abonnement actif d\'un tenant', async () => {
    // Mock de la réponse API
    (api.get as jest.Mock).mockResolvedValue({ data: mockSubscription });

    // Appel de la méthode
    const result = await subscriptionService.getActiveSubscription('school-1');

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/tenants/school-1/active-subscription');
    expect(result).toEqual(mockSubscription);
  });

  test('createSubscription() crée un nouvel abonnement', async () => {
    // Données pour la création
    const subscriptionData = {
      tenant_id: 'school-1',
      plan_id: 'plan-1',
      fedapay_transaction_id: 'transaction-1'
    };

    // Mock de la réponse API
    (api.post as jest.Mock).mockResolvedValue({ data: mockSubscription });

    // Appel de la méthode
    const result = await subscriptionService.createSubscription(subscriptionData);

    // Vérifications
    expect(api.post).toHaveBeenCalledWith('/subscriptions', subscriptionData);
    expect(result).toEqual(mockSubscription);
  });

  test('updateSubscriptionStatus() met à jour le statut d\'un abonnement', async () => {
    // Nouveau statut
    const newStatus = 'expired' as const;

    // Mock de la réponse API
    const updatedSubscription = { ...mockSubscription, status: newStatus };
    (api.put as jest.Mock).mockResolvedValue({ data: updatedSubscription });

    // Appel de la méthode
    const result = await subscriptionService.updateSubscriptionStatus('1', newStatus);

    // Vérifications
    expect(api.put).toHaveBeenCalledWith('/subscriptions/1/status', { status: newStatus });
    expect(result).toEqual(expect.objectContaining({
      id: '1',
      status: 'expired'
    }));
  });

  test('listSubscriptionsByTenant() récupère la liste des abonnements d\'un tenant', async () => {
    // Mock de la réponse API
    const mockResponse = {
      data: [mockSubscription],
      total: 1,
      page: 1,
      limit: 10,
      message: 'Subscriptions retrieved successfully'
    };
    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    // Appel de la méthode
    const result = await subscriptionService.listSubscriptionsByTenant('school-1', 1, 10);

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/tenants/school-1/subscriptions', {
      params: {
        page: '1',
        limit: '10'
      }
    });
    expect(result).toEqual(mockResponse);
  });

  test('getPlanById() récupère un plan par son ID', async () => {
    // Mock de la réponse API
    (api.get as jest.Mock).mockResolvedValue({ data: mockPlan });

    // Appel de la méthode
    const result = await subscriptionService.getPlanById('plan-1');

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/plans/plan-1');
    expect(result).toEqual(mockPlan);
  });

  test('listPlans() récupère la liste des plans disponibles', async () => {
    // Mock de la réponse API
    const mockResponse = {
      data: [mockPlan],
      total: 1,
      message: 'Plans retrieved successfully'
    };
    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    // Appel de la méthode
    const result = await subscriptionService.listPlans();

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/plans');
    expect(result).toEqual([mockPlan]);
  });

  test('createFedaPayTransaction() crée une transaction FedaPay', async () => {
    // Mock de la réponse API
    const transactionResponse = {
      data: {
        transaction_id: 'transaction-1',
        payment_url: 'https://fedapay.com/payment/transaction-1'
      },
      message: 'Transaction created successfully'
    };
    (api.post as jest.Mock).mockResolvedValue(transactionResponse);

    // Appel de la méthode
    const result = await subscriptionService.createFedaPayTransaction('plan-1', 'school-1');

    // Vérifications
    expect(api.post).toHaveBeenCalledWith(
      '/payments/create-transaction',
      { plan_id: 'plan-1', tenant_id: 'school-1' }
    );
    expect(result).toEqual({
      transaction_id: 'transaction-1',
      payment_url: 'https://fedapay.com/payment/transaction-1'
    });
  });

  test('checkTransactionStatus() vérifie le statut d\'une transaction FedaPay', async () => {
    // Mock de la réponse API
    const statusResponse = {
      data: { status: 'approved' },
      message: 'Transaction is approved'
    };
    (api.get as jest.Mock).mockResolvedValue(statusResponse);

    // Appel de la méthode
    const result = await subscriptionService.checkTransactionStatus('transaction-1');

    // Vérifications
    expect(api.get).toHaveBeenCalledWith('/payments/check-transaction/transaction-1');
    expect(result).toEqual({
      status: 'approved',
      message: 'Transaction is approved'
    });
  });
});
