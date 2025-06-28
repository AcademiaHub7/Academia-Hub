/**
 * Tests end-to-end pour le flux d'inscription et paiement
 * @module cypress/e2e/registration-flow
 */

describe('Processus d\'inscription et paiement', () => {
  // Données de test
  const schoolName = 'École Test E2E';
  const subdomain = `ecole-test-${Date.now()}`;
  const email = `promoter-${Date.now()}@test.com`;
  
  beforeEach(() => {
    // Intercepter les appels API pour les simuler
    cy.intercept('POST', '/api/register/school/start', {
      statusCode: 200,
      body: {
        success: true,
        session_id: 'test-session-123'
      }
    }).as('startSession');
    
    cy.intercept('POST', '/api/register/school/check-subdomain', {
      statusCode: 200,
      body: {
        success: true,
        is_available: true
      }
    }).as('checkSubdomain');
    
    cy.intercept('POST', '/api/register/school/check-email', {
      statusCode: 200,
      body: {
        success: true,
        is_available: true
      }
    }).as('checkEmail');
    
    cy.intercept('POST', '/api/register/school', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Informations enregistrées avec succès'
      }
    }).as('submitInfo');
    
    cy.intercept('POST', '/api/register/school/plan', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Plan sélectionné avec succès'
      }
    }).as('selectPlan');
    
    cy.intercept('POST', '/api/payment/transactions', {
      statusCode: 200,
      body: {
        success: true,
        transaction_id: 'txn-test-123',
        payment_url: 'https://checkout.fedapay.com/txn-test-123'
      }
    }).as('generatePayment');
    
    cy.intercept('GET', '/api/register/school/*/payment-status*', {
      statusCode: 200,
      body: {
        success: true,
        status: 'completed'
      }
    }).as('checkPayment');
    
    cy.intercept('POST', '/api/register/school/finalize', {
      statusCode: 200,
      body: {
        success: true,
        school_id: 'school-123',
        promoter_id: 'user-123',
        next_step: 'kyc_verification'
      }
    }).as('finalizeRegistration');
    
    // Visiter la page d'accueil
    cy.visit('/');
  });
  
  it('Vérifie l\'inscription avec succès', () => {
    // Étape 1: Cliquer sur le bouton d'inscription
    cy.contains('Inscrire mon école').click();
    cy.url().should('include', '/register');
    cy.wait('@startSession');
    
    // Étape 2: Remplir le formulaire d'information de l'école
    cy.get('[data-testid="school-name"]').type(schoolName);
    cy.get('[data-testid="school-subdomain"]').type(subdomain);
    cy.wait('@checkSubdomain');
    cy.get('[data-testid="school-address"]').type('123 Rue de Test');
    cy.get('[data-testid="school-city"]').type('Ville Test');
    cy.get('[data-testid="school-country"]').select('Bénin');
    cy.get('[data-testid="school-phone"]').type('+22912345678');
    cy.get('[data-testid="school-email"]').type('contact@ecole-test.com');
    cy.get('[data-testid="school-website"]').type('https://ecole-test.com');
    
    // Étape 3: Remplir le formulaire d'information du promoteur
    cy.get('[data-testid="promoter-first-name"]').type('John');
    cy.get('[data-testid="promoter-last-name"]').type('Doe');
    cy.get('[data-testid="promoter-email"]').type(email);
    cy.wait('@checkEmail');
    cy.get('[data-testid="promoter-phone"]').type('+22987654321');
    
    // Soumettre le formulaire
    cy.get('[data-testid="submit-registration"]').click();
    cy.wait('@submitInfo');
    
    // Étape 4: Sélectionner un plan d'abonnement
    cy.url().should('include', '/subscription');
    cy.get('[data-testid="plan-basic"]').click();
    cy.get('[data-testid="select-plan"]').click();
    cy.wait('@selectPlan');
    
    // Étape 5: Passer au paiement
    cy.url().should('include', '/payment');
    cy.get('[data-testid="proceed-payment"]').click();
    cy.wait('@generatePayment');
    
    // Simuler le retour après paiement réussi
    cy.visit('/payment/success?transaction_id=txn-test-123&session_id=test-session-123');
    cy.wait('@checkPayment');
    cy.wait('@finalizeRegistration');
    
    // Vérifier la redirection vers la page KYC
    cy.url().should('include', '/kyc');
    cy.contains('Vérification KYC').should('be.visible');
    cy.contains('Félicitations').should('be.visible');
  });
  
  it('Vérifie que le sous-domaine est déjà utilisé', () => {
    // Intercepter la vérification de sous-domaine pour simuler un sous-domaine déjà pris
    cy.intercept('POST', '/api/register/school/check-subdomain', {
      statusCode: 200,
      body: {
        success: true,
        is_available: false
      }
    }).as('checkSubdomainTaken');
    
    // Commencer l'inscription
    cy.contains('Inscrire mon école').click();
    cy.url().should('include', '/register');
    
    // Entrer un sous-domaine déjà pris
    cy.get('[data-testid="school-name"]').type(schoolName);
    cy.get('[data-testid="school-subdomain"]').type('subdomain-pris');
    cy.wait('@checkSubdomainTaken');
    
    // Vérifier que le message d'erreur s'affiche
    cy.contains('Ce sous-domaine est déjà pris').should('be.visible');
    cy.get('[data-testid="submit-registration"]').should('be.disabled');
  });
  
  it('Vérifie que l\'email est déjà utilisé', () => {
    // Intercepter la vérification d'email pour simuler un email déjà utilisé
    cy.intercept('POST', '/api/register/school/check-email', {
      statusCode: 200,
      body: {
        success: true,
        is_available: false
      }
    }).as('checkEmailTaken');
    
    // Commencer l'inscription
    cy.contains('Inscrire mon école').click();
    cy.url().should('include', '/register');
    
    // Remplir le formulaire jusqu'à l'email
    cy.get('[data-testid="school-name"]').type(schoolName);
    cy.get('[data-testid="school-subdomain"]').type(subdomain);
    cy.get('[data-testid="school-address"]').type('123 Rue de Test');
    cy.get('[data-testid="school-city"]').type('Ville Test');
    cy.get('[data-testid="school-country"]').select('Bénin');
    cy.get('[data-testid="school-phone"]').type('+22912345678');
    cy.get('[data-testid="school-email"]').type('contact@ecole-test.com');
    cy.get('[data-testid="school-website"]').type('https://ecole-test.com');
    cy.get('[data-testid="promoter-first-name"]').type('John');
    cy.get('[data-testid="promoter-last-name"]').type('Doe');
    
    // Entrer un email déjà utilisé
    cy.get('[data-testid="promoter-email"]').type('email-pris@test.com');
    cy.wait('@checkEmailTaken');
    
    // Vérifier que le message d'erreur s'affiche
    cy.contains('Cet email est déjà utilisé').should('be.visible');
    cy.get('[data-testid="submit-registration"]').should('be.disabled');
  });
  
  it('Vérifie l\'échec de paiement', () => {
    // Intercepter la vérification de paiement pour simuler un échec
    cy.intercept('GET', '/api/register/school/*/payment-status*', {
      statusCode: 200,
      body: {
        success: true,
        status: 'failed'
      }
    }).as('checkPaymentFailed');
    
    // Parcourir le processus jusqu'au paiement
    cy.contains('Inscrire mon école').click();
    cy.get('[data-testid="school-name"]').type(schoolName);
    cy.get('[data-testid="school-subdomain"]').type(subdomain);
    cy.get('[data-testid="school-address"]').type('123 Rue de Test');
    cy.get('[data-testid="school-city"]').type('Ville Test');
    cy.get('[data-testid="school-country"]').select('Bénin');
    cy.get('[data-testid="school-phone"]').type('+22912345678');
    cy.get('[data-testid="school-email"]').type('contact@ecole-test.com');
    cy.get('[data-testid="school-website"]').type('https://ecole-test.com');
    cy.get('[data-testid="promoter-first-name"]').type('John');
    cy.get('[data-testid="promoter-last-name"]').type('Doe');
    cy.get('[data-testid="promoter-email"]').type(email);
    cy.get('[data-testid="promoter-phone"]').type('+22987654321');
    cy.get('[data-testid="submit-registration"]').click();
    cy.get('[data-testid="plan-basic"]').click();
    cy.get('[data-testid="select-plan"]').click();
    cy.get('[data-testid="proceed-payment"]').click();
    
    // Simuler le retour après échec de paiement
    cy.visit('/payment/success?transaction_id=txn-failed-123&session_id=test-session-123');
    cy.wait('@checkPaymentFailed');
    
    // Vérifier que le message d'erreur s'affiche
    cy.contains('Échec du paiement').should('be.visible');
    cy.contains('Réessayer').should('be.visible');
  });
});
