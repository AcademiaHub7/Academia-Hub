/**
 * Serveur principal de l'application Academia Hub
 * @module server
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Charger les variables d'environnement
dotenv.config();

// Routes API
import paymentRoutes from './routes/api/paymentRoutes';
import kycRoutes from './routes/api/kycRoutes';
import registrationRoutes from './routes/api/registrationRoutes';
import userRoutes from './routes/api/userRoutes';
import schoolRoutes from './routes/api/schoolRoutes';
import subscriptionRoutes from './routes/api/subscriptionRoutes';

// Middleware
import { authenticateJWT, requireTenant } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de base
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Configurer les routes API
app.use('/api/payment', paymentRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/register', registrationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Route par défaut pour l'API
app.get('/api', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Academia Hub',
    version: '1.0.0'
  });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Servir l'application React en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/academiahub')
  .then(() => {
    console.log('Connexion à MongoDB établie avec succès');
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1);
  });

export default app;
