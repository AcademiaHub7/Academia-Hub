/// <reference types="cypress" />

/**
 * Tests end-to-end pour le flux de vérification KYC
 * @module cypress/e2e/kyc-flow
 */

describe('Processus de vérification KYC', () => {
  // Données de test
  const userEmail = `promoter-${Date.now()}@test.com`;
  const userPassword = 'Password123!';
  const mockToken = 'mock-jwt-token-123';
  
  beforeEach(() => {
    // Intercepter les appels API pour les simuler
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        token: mockToken,
        user: {
          id: 'user-123',
          email: userEmail,
          first_name: 'John',
          last_name: 'Doe',
          role: 'PROMOTER',
          tenant_id: 'school-123'
        }
      }
    }).as('login');
    
    cy.intercept('GET', '/api/kyc/status', {
      statusCode: 200,
      body: {
        success: true,
        kyc_info: {
          status: 'NOT_SUBMITTED',
          documents: []
        }
      }
    }).as('kycStatus');
    
    cy.intercept('POST', '/api/kyc/upload', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Documents soumis avec succès'
      }
    }).as('uploadDocuments');
    
    // Visiter la page de connexion
    cy.visit('/login');
  });
  
  it('devrait permettre de soumettre des documents KYC', () => {
    // Se connecter
    cy.get('[data-testid="email"]').type(userEmail);
    cy.get('[data-testid="password"]').type(userPassword);
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@login');
    
    // Accéder à la page KYC
    cy.visit('/kyc');
    cy.wait('@kycStatus');
    
    // Vérifier que la page KYC s'affiche correctement
    cy.contains('Vérification KYC').should('be.visible');
    cy.contains('Soumettre vos documents').should('be.visible');
    
    // Télécharger les documents
    cy.get('[data-testid="id-card-upload"]').attachFile('id_card.jpg');
    cy.get('[data-testid="school-auth-upload"]').attachFile('school_auth.pdf');
    cy.get('[data-testid="address-proof-upload"]').attachFile('address_proof.jpg');
    cy.get('[data-testid="school-photo-upload"]').attachFile('school_photo.jpg');
    
    // Ajouter une description
    cy.get('[data-testid="kyc-description"]').type('Documents pour vérification KYC de mon école');
    
    // Soumettre les documents
    cy.get('[data-testid="submit-kyc"]').click();
    cy.wait('@uploadDocuments');
    
    // Vérifier le message de succès
    cy.contains('Documents soumis avec succès').should('be.visible');
    
    // Intercepter le nouveau statut KYC après soumission
    cy.intercept('GET', '/api/kyc/status', {
      statusCode: 200,
      body: {
        success: true,
        kyc_info: {
          status: 'PENDING',
          submitted_at: new Date().toISOString(),
          documents: [
            { id: 'doc-1', type: 'ID_CARD', name: 'id_card.jpg' },
            { id: 'doc-2', type: 'SCHOOL_AUTHORIZATION', name: 'school_auth.pdf' },
            { id: 'doc-3', type: 'ADDRESS_PROOF', name: 'address_proof.jpg' },
            { id: 'doc-4', type: 'SCHOOL_PHOTOS', name: 'school_photo.jpg' }
          ]
        }
      }
    }).as('updatedKycStatus');
    
    // Rafraîchir la page pour voir le nouveau statut
    cy.reload();
    cy.wait('@updatedKycStatus');
    
    // Vérifier que le statut a changé
    cy.contains('En attente de vérification').should('be.visible');
    cy.contains('Documents soumis le').should('be.visible');
  });
  
  it('devrait afficher le statut KYC vérifié', () => {
    // Intercepter le statut KYC pour simuler un statut vérifié
    cy.intercept('GET', '/api/kyc/status', {
      statusCode: 200,
      body: {
        success: true,
        kyc_info: {
          status: 'VERIFIED',
          submitted_at: '2023-01-01T12:00:00Z',
          verified_at: '2023-01-02T14:30:00Z',
          documents: [
            { id: 'doc-1', type: 'ID_CARD', name: 'id_card.jpg' },
            { id: 'doc-2', type: 'SCHOOL_AUTHORIZATION', name: 'school_auth.pdf' },
            { id: 'doc-3', type: 'ADDRESS_PROOF', name: 'address_proof.jpg' },
            { id: 'doc-4', type: 'SCHOOL_PHOTOS', name: 'school_photo.jpg' }
          ]
        }
      }
    }).as('verifiedKycStatus');
    
    // Se connecter
    cy.get('[data-testid="email"]').type(userEmail);
    cy.get('[data-testid="password"]').type(userPassword);
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@login');
    
    // Accéder à la page KYC
    cy.visit('/kyc');
    cy.wait('@verifiedKycStatus');
    
    // Vérifier que le statut vérifié s'affiche correctement
    cy.contains('Vérification KYC').should('be.visible');
    cy.contains('Vérification approuvée').should('be.visible');
    cy.contains('Documents vérifiés le').should('be.visible');
    cy.contains('Votre école est maintenant active').should('be.visible');
    
    // Vérifier que les documents sont listés
    cy.contains('Pièce d\'identité').should('be.visible');
    cy.contains('Autorisation d\'établissement').should('be.visible');
    cy.contains('Justificatif d\'adresse').should('be.visible');
    cy.contains('Photos de l\'école').should('be.visible');
  });
  
  it('devrait afficher le statut KYC rejeté et permettre une nouvelle soumission', () => {
    // Intercepter le statut KYC pour simuler un statut rejeté
    cy.intercept('GET', '/api/kyc/status', {
      statusCode: 200,
      body: {
        success: true,
        kyc_info: {
          status: 'REJECTED',
          submitted_at: '2023-01-01T12:00:00Z',
          rejected_at: '2023-01-02T14:30:00Z',
          rejection_reason: 'Documents incomplets ou illisibles',
          documents: [
            { id: 'doc-1', type: 'ID_CARD', name: 'id_card.jpg' },
            { id: 'doc-2', type: 'SCHOOL_AUTHORIZATION', name: 'school_auth.pdf' }
          ]
        }
      }
    }).as('rejectedKycStatus');
    
    // Se connecter
    cy.get('[data-testid="email"]').type(userEmail);
    cy.get('[data-testid="password"]').type(userPassword);
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@login');
    
    // Accéder à la page KYC
    cy.visit('/kyc');
    cy.wait('@rejectedKycStatus');
    
    // Vérifier que le statut rejeté s'affiche correctement
    cy.contains('Vérification KYC').should('be.visible');
    cy.contains('Vérification rejetée').should('be.visible');
    cy.contains('Raison du rejet').should('be.visible');
    cy.contains('Documents incomplets ou illisibles').should('be.visible');
    
    // Vérifier que le bouton de nouvelle soumission est disponible
    cy.contains('Soumettre à nouveau').should('be.visible');
    
    // Cliquer pour soumettre à nouveau
    cy.contains('Soumettre à nouveau').click();
    
    // Vérifier que le formulaire de soumission est affiché
    cy.contains('Soumettre vos documents').should('be.visible');
    
    // Télécharger les documents à nouveau
    cy.fixture('id_card.jpg', 'base64').then(fileContent => {
      cy.get('[data-testid="id-card-upload"]').attachFile({
        fileContent,
        fileName: 'id_card_new.jpg',
        mimeType: 'image/jpeg'
      });
    });
    
    cy.fixture('school_auth.pdf', 'base64').then(fileContent => {
      cy.get('[data-testid="school-auth-upload"]').attachFile({
        fileContent,
        fileName: 'school_auth_new.pdf',
        mimeType: 'application/pdf'
      });
    });
    
    cy.fixture('address_proof.jpg', 'base64').then(fileContent => {
      cy.get('[data-testid="address-proof-upload"]').attachFile({
        fileContent,
        fileName: 'address_proof_new.jpg',
        mimeType: 'image/jpeg'
      });
    });
    
    cy.fixture('school_photo.jpg', 'base64').then(fileContent => {
      cy.get('[data-testid="school-photo-upload"]').attachFile({
        fileContent,
        fileName: 'school_photo_new.jpg',
        mimeType: 'image/jpeg'
      });
    });
    
    // Ajouter une description
    cy.get('[data-testid="kyc-description"]').type('Documents améliorés pour vérification KYC');
    
    // Soumettre les documents
    cy.get('[data-testid="submit-kyc"]').click();
    cy.wait('@uploadDocuments');
    
    // Vérifier le message de succès
    cy.contains('Documents soumis avec succès').should('be.visible');
  });
  
  it('devrait permettre à l\'administrateur de vérifier les documents KYC', () => {
    // Intercepter la connexion admin
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        token: 'admin-token-123',
        user: {
          id: 'admin-123',
          email: 'admin@academiahub.com',
          first_name: 'Admin',
          last_name: 'System',
          role: 'SYSTEM_ADMIN'
        }
      }
    }).as('adminLogin');
    
    // Intercepter la liste des écoles en attente de vérification KYC
    cy.intercept('GET', '/api/admin/schools/pending-kyc', {
      statusCode: 200,
      body: {
        success: true,
        schools: [
          {
            id: 'school-123',
            name: 'École Test',
            subdomain: 'ecole-test',
            kyc_status: 'PENDING',
            kyc_submitted_at: '2023-01-01T12:00:00Z'
          }
        ]
      }
    }).as('pendingKycSchools');
    
    // Intercepter les détails KYC d'une école
    cy.intercept('GET', '/api/admin/schools/*/kyc', {
      statusCode: 200,
      body: {
        success: true,
        kyc_info: {
          status: 'PENDING',
          submitted_at: '2023-01-01T12:00:00Z',
          documents: [
            { id: 'doc-1', type: 'ID_CARD', name: 'id_card.jpg', url: '/api/kyc/documents/doc-1' },
            { id: 'doc-2', type: 'SCHOOL_AUTHORIZATION', name: 'school_auth.pdf', url: '/api/kyc/documents/doc-2' },
            { id: 'doc-3', type: 'ADDRESS_PROOF', name: 'address_proof.jpg', url: '/api/kyc/documents/doc-3' },
            { id: 'doc-4', type: 'SCHOOL_PHOTOS', name: 'school_photo.jpg', url: '/api/kyc/documents/doc-4' }
          ]
        }
      }
    }).as('schoolKycDetails');
    
    // Intercepter l'approbation KYC
    cy.intercept('POST', '/api/kyc/approve/*', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Vérification KYC approuvée avec succès'
      }
    }).as('approveKyc');
    
    // Se connecter en tant qu'administrateur
    cy.get('[data-testid="email"]').type('admin@academiahub.com');
    cy.get('[data-testid="password"]').type('AdminPass123!');
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@adminLogin');
    
    // Accéder au tableau de bord admin
    cy.visit('/admin/dashboard');
    
    // Accéder à la section KYC
    cy.contains('Vérifications KYC').click();
    cy.wait('@pendingKycSchools');
    
    // Vérifier que la liste des écoles en attente s'affiche
    cy.contains('École Test').should('be.visible');
    cy.contains('En attente').should('be.visible');
    
    // Cliquer pour voir les détails
    cy.contains('École Test').parent().find('[data-testid="view-kyc"]').click();
    cy.wait('@schoolKycDetails');
    
    // Vérifier que les documents sont affichés
    cy.contains('Documents KYC - École Test').should('be.visible');
    cy.contains('Pièce d\'identité').should('be.visible');
    cy.contains('Autorisation d\'établissement').should('be.visible');
    cy.contains('Justificatif d\'adresse').should('be.visible');
    cy.contains('Photos de l\'école').should('be.visible');
    
    // Simuler la visualisation des documents
    cy.get('[data-testid="view-document-doc-1"]').click();
    cy.get('[data-testid="document-viewer"]').should('be.visible');
    cy.get('[data-testid="close-viewer"]').click();
    
    // Approuver la vérification KYC
    cy.get('[data-testid="approval-notes"]').type('Documents vérifiés et approuvés');
    cy.get('[data-testid="approve-kyc"]').click();
    cy.wait('@approveKyc');
    
    // Vérifier le message de succès
    cy.contains('Vérification KYC approuvée avec succès').should('be.visible');
    
    // Vérifier que l'école n'apparaît plus dans la liste des écoles en attente
    cy.contains('Retour à la liste').click();
    cy.contains('Aucune école en attente de vérification KYC').should('be.visible');
  });
});
