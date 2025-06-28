/**
 * Routes pour les paiements
 * @module routes/api/paymentRoutes
 */

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import PaymentController from '../../controllers/PaymentController';

// Import des types et middlewares d'authentification
import { authenticateJWT, requireTenant } from '../../middleware/auth';

// Utiliser les types définis dans auth.ts
import '../../middleware/auth';

const router = express.Router();

// Utiliser les middlewares d'authentification définis dans auth.ts

// Wrapper pour gérer les erreurs asynchrones
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};

/**
 * @route POST /api/payment/transactions
 * @desc Crée une nouvelle transaction pour un paiement
 */
router.post('/transactions', 
  authenticateJWT as express.RequestHandler, 
  requireTenant as express.RequestHandler, 
  asyncHandler((req, res) => PaymentController.generatePaymentUrl(req, res)) as express.RequestHandler
);

/**
 * @route POST /api/payment/callback
 * @desc Gestion du callback de paiement
 */
router.post('/callback', 
  asyncHandler((req, res) => PaymentController.handlePaymentCallback(req, res)) as express.RequestHandler
);

/**
 * @route GET /api/payment/transactions/:transaction_id/status
 * @desc Vérifie le statut d'une transaction
 */
router.get('/transactions/:transaction_id/status', 
  authenticateJWT as express.RequestHandler, 
  asyncHandler((req, res) => PaymentController.checkPaymentStatus(req, res)) as express.RequestHandler
);

/**
 * @route GET /api/payment/transactions/history
 * @desc Récupère l'historique des transactions
 */
router.get('/transactions/history', 
  authenticateJWT as express.RequestHandler, 
  requireTenant as express.RequestHandler, 
  asyncHandler((req, res) => PaymentController.getPaymentHistory(req, res)) as express.RequestHandler
);

/**
 * @route GET /api/payment/transactions/:transaction_id
 * @desc Récupère les détails d'une transaction
 */
router.get('/transactions/:transaction_id', 
  authenticateJWT as express.RequestHandler, 
  asyncHandler((req, res) => PaymentController.checkPaymentStatus(req, res)) as express.RequestHandler
);

/**
 * @route POST /api/payment/transactions/:transaction_id/invoice
 * @desc Génère une facture pour une transaction
 */
router.post('/transactions/:transaction_id/invoice', 
  authenticateJWT as express.RequestHandler, 
  asyncHandler((req, res) => PaymentController.generateInvoice(req, res)) as express.RequestHandler
);

export default router;
