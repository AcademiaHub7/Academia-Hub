/**
 * Tests unitaires pour le trait TenantAware
 * @module __tests__/traits/TenantAware
 */

import { TenantAware, TenantAwareModel } from '../../traits/TenantAware';

// Mock du localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock de window.location
const mockLocation = {
  hostname: 'ecole-test.academiahub.com',
  href: 'https://ecole-test.academiahub.com/dashboard',
  toString: () => 'https://ecole-test.academiahub.com/dashboard'
};

// Sauvegarde des propriétés originales pour restauration
const originalHostname = window.location.hostname;
const originalHref = window.location.href;

// Application des mocks
Object.defineProperty(window.location, 'hostname', {
  configurable: true,
  value: mockLocation.hostname
});

Object.defineProperty(window.location, 'href', {
  configurable: true,
  value: mockLocation.href
});

describe('TenantAware Trait', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  afterAll(() => {
    // Restaurer window.location
    Object.defineProperty(window.location, 'hostname', {
      configurable: true,
      value: originalHostname
    });
    
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      value: originalHref
    });
  });

  describe('getCurrentTenantId', () => {
    it('should return tenant ID from localStorage', () => {
      localStorageMock.setItem('current_tenant_id', 'school-123');
      
      const tenantId = TenantAware.getCurrentTenantId();
      
      expect(tenantId).toBe('school-123');
    });

    it('should return null if no tenant ID is set', () => {
      localStorageMock.clear();
      const tenantId = TenantAware.getCurrentTenantId();
      
      expect(tenantId).toBeNull();
    });
  });

  describe('setCurrentTenantId', () => {
    it('should set current tenant ID in localStorage', () => {
      TenantAware.setCurrentTenantId('school-123');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('current_tenant_id', 'school-123');
    });
  });

  describe('clearCurrentTenantId', () => {
    it('should remove current tenant ID from localStorage', () => {
      TenantAware.clearCurrentTenantId();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('current_tenant_id');
    });
  });

  describe('getCurrentSubdomain', () => {
    it('should extract subdomain from hostname', () => {
      // Modifier temporairement hostname pour le test
      Object.defineProperty(window.location, 'hostname', {
        configurable: true,
        value: 'ecole-test.academiahub.com'
      });
      
      const subdomain = TenantAware.getCurrentSubdomain();
      
      expect(subdomain).toBe('ecole-test');
      
      // Restaurer la valeur originale
      Object.defineProperty(window.location, 'hostname', {
        configurable: true,
        value: originalHostname
      });
    });

    it('should return null for top-level domain', () => {
      // Modifier temporairement hostname pour le test
      Object.defineProperty(window.location, 'hostname', {
        configurable: true,
        value: 'academiahub.com'
      });
      
      const subdomain = TenantAware.getCurrentSubdomain();
      
      expect(subdomain).toBeNull();
      
      // Restaurer la valeur originale
      Object.defineProperty(window.location, 'hostname', {
        configurable: true,
        value: originalHostname
      });
    });

    it('should return null for www subdomain', () => {
      // Modifier temporairement hostname pour le test
      Object.defineProperty(window.location, 'hostname', {
        configurable: true,
        value: 'www.academiahub.com'
      });
      
      const subdomain = TenantAware.getCurrentSubdomain();
      
      expect(subdomain).toBeNull();
      
      // Restaurer la valeur originale
      Object.defineProperty(window.location, 'hostname', {
        configurable: true,
        value: originalHostname
      });
    });

    it('should return null for localhost', () => {
      // Modifier temporairement hostname pour le test
      Object.defineProperty(window.location, 'hostname', {
        configurable: true,
        value: 'localhost'
      });
      
      const subdomain = TenantAware.getCurrentSubdomain();
      
      expect(subdomain).toBeNull();
      
      // Restaurer la valeur originale
      Object.defineProperty(window.location, 'hostname', {
        configurable: true,
        value: originalHostname
      });
    });
  });

  describe('belongsToTenant', () => {
    it('should check if entity belongs to tenant', () => {
      const tenantId = 'school-123';
      const entity: TenantAwareModel = { tenant_id: 'school-123' };
      const result = TenantAware.belongsToTenant(entity, tenantId);
      
      expect(result).toBe(true);
    });

    it('should return false if entity does not belong to tenant', () => {
      const tenantId = 'school-123';
      const entity: TenantAwareModel = { tenant_id: 'school-456' };
      const result = TenantAware.belongsToTenant(entity, tenantId);
      
      expect(result).toBe(false);
    });

    it('should return false if tenantId is null or undefined', () => {
      const entity: TenantAwareModel = { tenant_id: 'school-123' };
      
      // Test avec tenantId null
      expect(TenantAware.belongsToTenant(entity, null as unknown as string)).toBe(false);
      
      // Test avec tenantId undefined
      expect(TenantAware.belongsToTenant(entity, undefined as unknown as string)).toBe(false);
    });

    it('should return false if entity has no tenant_id', () => {
      const tenantId = 'school-123';
      // Utilisation de unknown comme type intermédiaire pour éviter l'erreur de conversion
      const entity = { tenant_id: undefined } as unknown as TenantAwareModel;
      const result = TenantAware.belongsToTenant(entity, tenantId);
      
      expect(result).toBe(false);
    });
  });

  describe('filterByTenant', () => {
    it('should filter array by tenant ID', () => {
      const tenantId = 'school-123';
      
      const entities: TenantAwareModel[] = [
        { tenant_id: 'school-123' },
        { tenant_id: 'school-456' },
        { tenant_id: 'school-123' }
      ];
      
      const filtered = TenantAware.filterByTenant(entities, tenantId);
      
      expect(filtered).toHaveLength(2);
      expect(filtered[0].tenant_id).toBe('school-123');
      expect(filtered[1].tenant_id).toBe('school-123');
    });

    it('should return empty array if no entities match tenant ID', () => {
      const tenantId = 'school-123';
      
      const entities: TenantAwareModel[] = [
        { tenant_id: 'school-456' },
        { tenant_id: 'school-789' }
      ];
      
      const filtered = TenantAware.filterByTenant(entities, tenantId);
      
      expect(filtered).toHaveLength(0);
    });

    it('should return empty array if tenantId is null or undefined', () => {
      const entities: TenantAwareModel[] = [
        { tenant_id: 'school-123' },
        { tenant_id: 'school-456' }
      ];
      
      // Test avec tenantId null
      expect(TenantAware.filterByTenant(entities, null as unknown as string)).toHaveLength(0);
      
      // Test avec tenantId undefined
      expect(TenantAware.filterByTenant(entities, undefined as unknown as string)).toHaveLength(0);
    });
  });

  describe('withTenantId', () => {
    it('should add current tenant ID to object', () => {
      localStorageMock.setItem('current_tenant_id', 'school-123');
      
      const obj = { name: 'Test Object' };
      const result = TenantAware.withTenantId(obj);
      
      expect(result).toEqual({
        name: 'Test Object',
        tenant_id: 'school-123'
      });
    });

    it('should not modify object if no current tenant ID is set', () => {
      localStorageMock.clear();
      
      const obj = { name: 'Test Object' };
      const result = TenantAware.withTenantId(obj);
      
      expect(result).toEqual({ name: 'Test Object' });
    });

    it('should not override existing tenant_id', () => {
      localStorageMock.setItem('current_tenant_id', 'school-123');
      
      const obj = { name: 'Test Object', tenant_id: 'school-456' };
      const result = TenantAware.withTenantId(obj);
      
      expect(result).toEqual({
        name: 'Test Object',
        tenant_id: 'school-456'
      });
    });
  });
});
