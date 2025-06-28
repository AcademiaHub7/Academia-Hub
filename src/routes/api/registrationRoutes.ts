/**
 * Routes API pour le processus d'inscription des écoles
 * @module routes/api/registrationRoutes
 */

import express from 'express';
import SchoolRegistrationController from '../../controllers/SchoolRegistrationController';
import { validateRecaptcha } from '../../middleware/recaptcha';

const router = express.Router();

/**
 * @route POST /api/register/school/start
 * @desc Démarre une nouvelle session d'inscription
 * @access Public
 */
router.post('/school/start', SchoolRegistrationController.startRegistration);

/**
 * @route POST /api/register/school/check-subdomain
 * @desc Vérifie la disponibilité d'un sous-domaine
 * @access Public
 */
router.post('/school/check-subdomain', SchoolRegistrationController.checkSubdomainAvailability);

/**
 * @route POST /api/register/school/check-email
 * @desc Vérifie la disponibilité d'une adresse email
 * @access Public
 */
router.post('/school/check-email', SchoolRegistrationController.checkEmailAvailability);

/**
 * @route POST /api/register/school
 * @desc Soumet les informations du promoteur et de l'école
 * @access Public
 */
router.post('/school', validateRecaptcha, SchoolRegistrationController.submitPromoterAndSchoolInfo);

/**
 * @route POST /api/register/school/plan
 * @desc Sélectionne un plan d'abonnement
 * @access Public
 */
router.post('/school/plan', SchoolRegistrationController.selectSubscriptionPlan);

/**
 * @route GET /api/register/school/:registration_id/payment-status
 * @desc Vérifie le statut du paiement
 * @access Public
 */
router.get('/school/:registration_id/payment-status', SchoolRegistrationController.checkPaymentStatus);

/**
 * @route POST /api/register/school/finalize
 * @desc Crée l'école et le compte promoteur après paiement confirmé
 * @access Public
 */
router.post('/school/finalize', SchoolRegistrationController.createSchoolAfterPayment);

/**
 * @route POST /api/register/school/cancel
 * @desc Annule le processus d'inscription
 * @access Public
 */
router.post('/school/cancel', SchoolRegistrationController.cancelRegistration);

export default router;
