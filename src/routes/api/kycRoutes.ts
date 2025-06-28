/**
 * Routes API pour la gestion des vérifications KYC
 * @module routes/api/kycRoutes
 */

import express from 'express';
import KYCController from '../../controllers/KYCController';
import { authenticateJWT, requireTenant, requireSystemAdmin } from '../../middleware/auth';
import multer from 'multer';

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kyc');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepter uniquement les images et PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Seuls les images et PDFs sont acceptés.'));
    }
  }
});

const router = express.Router();

/**
 * @route GET /api/kyc/status
 * @desc Récupère le statut KYC actuel
 * @access Privé
 */
router.get('/status', authenticateJWT, requireTenant, KYCController.getKYCInfo);

/**
 * @route POST /api/kyc/upload
 * @desc Soumet les documents KYC pour vérification
 * @access Privé
 */
router.post('/upload', 
  authenticateJWT, 
  requireTenant, 
  upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'schoolAuthorization', maxCount: 1 },
    { name: 'proofOfAddress', maxCount: 1 },
    { name: 'schoolPhotos', maxCount: 5 },
    { name: 'additionalDocuments', maxCount: 3 }
  ]),
  KYCController.submitKYCDocuments
);

/**
 * @route GET /api/kyc/history
 * @desc Récupère l'historique des soumissions KYC
 * @access Privé
 */
router.get('/history', authenticateJWT, requireTenant, KYCController.getKYCInfo);

/**
 * @route GET /api/kyc/documents/:document_id
 * @desc Télécharge un document KYC spécifique
 * @access Privé
 */
router.get('/documents/:document_id', authenticateJWT, requireTenant, KYCController.downloadKYCDocument);

/**
 * Routes administratives (réservées aux administrateurs système)
 */

/**
 * @route POST /api/kyc/approve/:school_id
 * @desc Approuve la vérification KYC d'une école
 * @access Admin
 */
router.post('/approve/:school_id', authenticateJWT, requireSystemAdmin, KYCController.approveKYC);

/**
 * @route POST /api/kyc/reject/:school_id
 * @desc Rejette la vérification KYC d'une école
 * @access Admin
 */
router.post('/reject/:school_id', authenticateJWT, requireSystemAdmin, KYCController.rejectKYC);

export default router;
