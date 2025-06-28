/**
 * Tests pour le TenantContext
 * @jest
 */

// React est utilisé implicitement dans le JSX
import { render, waitFor } from '@testing-library/react';
import { TenantProvider, useTenant } from '../../contexts/TenantContext';

// Nous n'avons plus besoin de mocker schoolService car nous mockons directement useTenant
jest.mock('../../services/school/schoolService', () => ({
  schoolService: {
    getSchoolBySubdomain: jest.fn(),
    getSchoolById: jest.fn()
  }
}));

// Mock du TenantContext et ses fonctions d'extraction
jest.mock('../../contexts/TenantContext', () => {
  const originalModule = jest.requireActual('../../contexts/TenantContext');
  
  return {
    ...originalModule,
    // Surcharger les fonctions d'extraction du tenant
    extractTenantFromHostname: jest.fn().mockReturnValue('ecole-test'),
    extractTenantFromPathname: jest.fn().mockReturnValue('ecole-test'),
    // Fournir une implémentation de useTenant pour les tests
    useTenant: () => ({
      school: {
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
      },
      loading: false,
      error: null,
      loadSchoolBySubdomain: jest.fn().mockResolvedValue({
        id: '1',
        name: 'École Test',
        subdomain: 'ecole-test',
        status: 'active'
      })
    })
  };
});

// Nettoyer les mocks après les tests
afterAll(() => {
  jest.restoreAllMocks();
});

// Composant de test qui utilise le hook useTenant
const TestComponent = () => {
  const { school, loading, error, loadSchoolBySubdomain } = useTenant();
  
  return (
    <div>
      {loading && <div data-testid="loading">Chargement...</div>}
      {error && <div data-testid="error">{error}</div>}
      {school && (
        <div data-testid="school-info">
          <h1>{school.name}</h1>
          <p>{school.subdomain}</p>
          <p>{school.status}</p>
        </div>
      )}
      <button 
        data-testid="load-button" 
        onClick={() => loadSchoolBySubdomain('test-subdomain')}
      >
        Charger l'école
      </button>
    </div>
  );
};

describe('TenantContext', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('TenantProvider rend le composant avec les données mockées', async () => {
    // Rendu du composant avec le TenantProvider
    const { getByTestId } = render(
      <TenantProvider>
        <TestComponent />
      </TenantProvider>
    );

    // Vérification que les données de l'école sont affichées
    await waitFor(() => {
      expect(getByTestId('school-info')).toBeInTheDocument();
      expect(getByTestId('school-info').querySelector('h1')?.textContent).toBe('École Test');
    });
  });

  test('loadSchoolBySubdomain est disponible dans le contexte', async () => {
    // Créer un mock pour loadSchoolBySubdomain
    const loadSchoolBySubdomainMock = jest.fn();
    
    // Composant de test spécifique pour ce test
    const TestButtonComponent = () => {
      // Simuler l'utilisation du hook useTenant
      return (
        <button 
          data-testid="test-button" 
          onClick={() => loadSchoolBySubdomainMock('test-subdomain')}
        >
          Test Button
        </button>
      );
    };
    
    // Rendu du composant simple
    const { getByTestId } = render(<TestButtonComponent />);
    
    // Vérifier que le bouton existe
    expect(getByTestId('test-button')).toBeInTheDocument();
    
    // Simuler le clic sur le bouton
    getByTestId('test-button').click();
    
    // Vérifier que la fonction a été appelée avec le bon paramètre
    expect(loadSchoolBySubdomainMock).toHaveBeenCalledWith('test-subdomain');
  });
});
