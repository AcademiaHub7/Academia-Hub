import { 
  SchoolStatus, 
  PaymentStatus, 
  KycStatus 
} from '../../types/common';
import { School, SchoolSettings } from '../../types/school';

describe('School Model', () => {
  test('peut créer une école avec tous les champs requis', () => {
    const settings: SchoolSettings = {
      logo: 'https://example.com/logo.png',
      theme: 'light',
      language: 'fr'
    };
    
    const school: School = {
      id: '1',
      name: 'École Test',
      subdomain: 'ecole-test',
      status: SchoolStatus.ACTIVE,
      subscription_plan_id: 'plan-1',
      payment_status: PaymentStatus.COMPLETED,
      kyc_status: KycStatus.VERIFIED,
      settings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    expect(school).toBeDefined();
    expect(school.id).toBe('1');
    expect(school.name).toBe('École Test');
    expect(school.subdomain).toBe('ecole-test');
    expect(school.status).toBe(SchoolStatus.ACTIVE);
    expect(school.settings).toEqual(settings);
  });
  
  test('peut créer une école avec des champs minimaux', () => {
    const school: School = {
      id: '2',
      name: 'École Minimale',
      subdomain: 'ecole-minimale',
      status: SchoolStatus.PENDING_PAYMENT,
      subscription_plan_id: null,
      payment_status: PaymentStatus.PENDING,
      kyc_status: KycStatus.PENDING,
      settings: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    expect(school).toBeDefined();
    expect(school.id).toBe('2');
    expect(school.name).toBe('École Minimale');
    expect(school.status).toBe(SchoolStatus.PENDING_PAYMENT);
    expect(school.settings).toBeNull();
  });
  
  test('peut mettre à jour le statut d\'une école', async () => {
    const school: School = {
      id: '3',
      name: 'École Mise à Jour',
      subdomain: 'ecole-update',
      status: SchoolStatus.PENDING_KYC,
      subscription_plan_id: 'plan-1',
      payment_status: PaymentStatus.COMPLETED,
      kyc_status: KycStatus.PENDING,
      settings: {
        logo: 'logo.png',
        theme: 'dark',
        language: 'en'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Attendre un court instant pour garantir que la date est différente
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(100);
    
    // Mise à jour du statut
    const updatedSchool: School = {
      ...school,
      status: SchoolStatus.ACTIVE,
      kyc_status: KycStatus.VERIFIED,
      updated_at: new Date().toISOString()
    };
    
    expect(updatedSchool.status).toBe(SchoolStatus.ACTIVE);
    expect(updatedSchool.kyc_status).toBe(KycStatus.VERIFIED);
    expect(updatedSchool.id).toBe(school.id);
    expect(updatedSchool.name).toBe(school.name);
    expect(updatedSchool.created_at).toBe(school.created_at);
    expect(updatedSchool.updated_at).not.toBe(school.updated_at);
  });
});
