/**
 * Tests d'intégration pour le processus de vérification KYC
 * @module __tests__/integration/kycFlow
 */

import request from 'supertest';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import app from '../../server';
import { School } from '../../models/School';
import { User } from '../../models/User';
import { SchoolStatus, UserRole, KYCStatus, DocumentType } from '../../types/common';
import { generateToken } from '../../services/auth/tokenService';

describe('KYC Flow Integration Tests', () => {
  let school: any;
  let promoter: any;
  let adminUser: any;
  let promoterToken: string;
  let adminToken: string;
  
  // Créer des fichiers de test temporaires pour les uploads
  const testFilesDir = path.join(__dirname, '../mocks/files');
  const idCardPath = path.join(testFilesDir, 'id_card_test.jpg');
  const schoolAuthPath = path.join(testFilesDir, 'school_auth_test.pdf');
  const addressProofPath = path.join(testFilesDir, 'address_proof_test.jpg');
  const schoolPhotoPath = path.join(testFilesDir, 'school_photo_test.jpg');

  beforeAll(async () => {
    // Connexion à la base de données de test
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/academiahub_test');
    
    // Créer le répertoire pour les fichiers de test s'il n'existe pas
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }
    
    // Créer des fichiers de test pour les uploads
    if (!fs.existsSync(idCardPath)) {
      fs.writeFileSync(idCardPath, 'Mock ID Card Content');
    }
    if (!fs.existsSync(schoolAuthPath)) {
      fs.writeFileSync(schoolAuthPath, 'Mock School Authorization Content');
    }
    if (!fs.existsSync(addressProofPath)) {
      fs.writeFileSync(addressProofPath, 'Mock Address Proof Content');
    }
    if (!fs.existsSync(schoolPhotoPath)) {
      fs.writeFileSync(schoolPhotoPath, 'Mock School Photo Content');
    }
    
    // Créer une école de test
    school = await School.create({
      name: 'École KYC Test',
      subdomain: 'kyc-test-' + Date.now(),
      status: SchoolStatus.PENDING_KYC,
      kyc_status: KYCStatus.NOT_SUBMITTED,
      payment_status: 'completed',
      settings: {
        logo_url: 'https://example.com/logo.png',
        theme_color: '#00FF00'
      }
    });
    
    // Créer un promoteur pour l'école
    promoter = await User.create({
      email: `kyc-promoter-${Date.now()}@test.com`,
      first_name: 'John',
      last_name: 'Doe',
      password: 'password123',
      role: UserRole.PROMOTER,
      tenant_id: school.id
    });
    
    // Créer un administrateur système
    adminUser = await User.create({
      email: `admin-${Date.now()}@academiahub.com`,
      first_name: 'Admin',
      last_name: 'System',
      password: 'adminpass123',
      role: UserRole.SYSTEM_ADMIN
    });
    
    // Générer des tokens d'authentification
    promoterToken = generateToken(promoter.id, school.id);
    adminToken = generateToken(adminUser.id);
  });

  afterAll(async () => {
    // Nettoyer les fichiers de test
    try {
      fs.unlinkSync(idCardPath);
      fs.unlinkSync(schoolAuthPath);
      fs.unlinkSync(addressProofPath);
      fs.unlinkSync(schoolPhotoPath);
    } catch (err) {
      console.error('Erreur lors du nettoyage des fichiers de test:', err);
    }
    
    // Nettoyer la base de données
    await School.deleteMany({});
    await User.deleteMany({});
    
    // Fermer la connexion à la base de données
    await mongoose.connection.close();
  });

  describe('Step 1: Get KYC Status', () => {
    it('should get initial KYC status', async () => {
      const response = await request(app)
        .get('/api/kyc/status')
        .set('Authorization', `Bearer ${promoterToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.kyc_info).toBeDefined();
      expect(response.body.kyc_info.status).toBe(KYCStatus.NOT_SUBMITTED);
    });
  });

  describe('Step 2: Submit KYC Documents', () => {
    it('should upload and submit KYC documents', async () => {
      const response = await request(app)
        .post('/api/kyc/upload')
        .set('Authorization', `Bearer ${promoterToken}`)
        .attach('idCard', idCardPath)
        .attach('schoolAuthorization', schoolAuthPath)
        .attach('proofOfAddress', addressProofPath)
        .attach('schoolPhotos', schoolPhotoPath)
        .field('description', 'Documents KYC pour École KYC Test')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Documents soumis avec succès');
      
      // Vérifier que le statut KYC a été mis à jour
      const updatedSchool = await School.findById(school.id);
      expect(updatedSchool?.kyc_status).toBe(KYCStatus.PENDING);
      expect(updatedSchool?.kyc_submitted_at).toBeDefined();
    });
  });

  describe('Step 3: Check KYC Status After Submission', () => {
    it('should show pending KYC status after submission', async () => {
      const response = await request(app)
        .get('/api/kyc/status')
        .set('Authorization', `Bearer ${promoterToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.kyc_info.status).toBe(KYCStatus.PENDING);
      expect(response.body.kyc_info.documents).toBeDefined();
      expect(response.body.kyc_info.documents.length).toBeGreaterThan(0);
    });
  });

  describe('Step 4: Admin Reviews KYC Documents', () => {
    it('should allow admin to download KYC document', async () => {
      // D'abord, récupérer la liste des documents
      const statusResponse = await request(app)
        .get(`/api/kyc/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      const documentId = statusResponse.body.kyc_info.documents[0].id;
      
      // Télécharger le document
      const response = await request(app)
        .get(`/api/kyc/documents/${documentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.document).toBeDefined();
      expect(response.body.document.id).toBe(documentId);
    });

    it('should allow admin to approve KYC verification', async () => {
      const response = await request(app)
        .post(`/api/kyc/approve/${school.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          approval_notes: 'Documents vérifiés et approuvés'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Vérification KYC approuvée');
      
      // Vérifier que le statut KYC et le statut de l'école ont été mis à jour
      const updatedSchool = await School.findById(school.id);
      expect(updatedSchool?.kyc_status).toBe(KYCStatus.VERIFIED);
      expect(updatedSchool?.status).toBe(SchoolStatus.ACTIVE);
      expect(updatedSchool?.kyc_verified_at).toBeDefined();
    });
  });

  describe('Step 5: Check KYC Status After Approval', () => {
    it('should show verified KYC status after approval', async () => {
      const response = await request(app)
        .get('/api/kyc/status')
        .set('Authorization', `Bearer ${promoterToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.kyc_info.status).toBe(KYCStatus.VERIFIED);
    });
  });

  describe('Alternative Flow: KYC Rejection', () => {
    let rejectionSchool: any;
    let rejectionPromoter: any;
    let rejectionToken: string;

    beforeAll(async () => {
      // Créer une autre école de test pour le scénario de rejet
      rejectionSchool = await School.create({
        name: 'École KYC Rejet',
        subdomain: 'kyc-reject-' + Date.now(),
        status: SchoolStatus.PENDING_KYC,
        kyc_status: KYCStatus.PENDING,
        kyc_submitted_at: new Date(),
        payment_status: 'completed'
      });
      
      // Créer un promoteur pour cette école
      rejectionPromoter = await User.create({
        email: `kyc-reject-${Date.now()}@test.com`,
        first_name: 'Jane',
        last_name: 'Smith',
        password: 'password123',
        role: UserRole.PROMOTER,
        tenant_id: rejectionSchool.id
      });
      
      // Générer un token d'authentification
      rejectionToken = generateToken(rejectionPromoter.id, rejectionSchool.id);
      
      // Simuler la soumission de documents KYC
      await rejectionSchool.saveKYCDocuments([
        { type: DocumentType.ID_CARD, file: 'path/to/id_card.jpg' },
        { type: DocumentType.SCHOOL_AUTHORIZATION, file: 'path/to/auth.pdf' },
        { type: DocumentType.ADDRESS_PROOF, file: 'path/to/address.jpg' },
        { type: DocumentType.SCHOOL_PHOTOS, file: 'path/to/photo.jpg' }
      ]);
    });

    it('should allow admin to reject KYC verification', async () => {
      const response = await request(app)
        .post(`/api/kyc/reject/${rejectionSchool.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          rejection_reason: 'Documents incomplets ou illisibles'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Vérification KYC rejetée');
      
      // Vérifier que le statut KYC a été mis à jour
      const updatedSchool = await School.findById(rejectionSchool.id);
      expect(updatedSchool?.kyc_status).toBe(KYCStatus.REJECTED);
      expect(updatedSchool?.kyc_rejection_reason).toBe('Documents incomplets ou illisibles');
    });

    it('should show rejected KYC status after rejection', async () => {
      const response = await request(app)
        .get('/api/kyc/status')
        .set('Authorization', `Bearer ${rejectionToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.kyc_info.status).toBe(KYCStatus.REJECTED);
      expect(response.body.kyc_info.rejection_reason).toBe('Documents incomplets ou illisibles');
    });
  });
});
