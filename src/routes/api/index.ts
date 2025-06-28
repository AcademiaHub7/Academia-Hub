/**
 * Point d'entrée pour toutes les routes API
 * @module routes/api
 */

import express from 'express';
import paymentRoutes from './paymentRoutes';
import kycRoutes from './kycRoutes';
import registrationRoutes from './registrationRoutes';

const router = express.Router();

// Monter les différentes routes sur le routeur principal
router.use('/payment', paymentRoutes);
router.use('/kyc', kycRoutes);
router.use('/register', registrationRoutes);

export default router;
