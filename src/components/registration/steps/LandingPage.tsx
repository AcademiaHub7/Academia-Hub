/**
 * Page d'accueil du processus d'inscription
 * @module components/registration/steps/LandingPage
 */

import React from 'react';
import { motion } from 'framer-motion';
import { RegistrationSession } from '../../../types';

interface LandingPageProps {
  sessionData: RegistrationSession | null;
  updateSessionData: (updates: Partial<RegistrationSession>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validationErrors: Record<string, string>;
  setValidationErrors: (errors: Record<string, string>) => void;
}

/**
 * Composant de la page d'accueil (0-5 secondes)
 */
const LandingPage: React.FC<LandingPageProps> = ({ goToNextStep }) => {
  return (
    <div className="landing-page">
      <motion.div 
        className="landing-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Bienvenue sur Academia Hub</h1>
        <h2>La plateforme de gestion complète pour votre établissement scolaire</h2>
        
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="feature-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h3>Gestion académique</h3>
            <p>Gérez facilement les inscriptions, les notes et les emplois du temps</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Suivi des performances</h3>
            <p>Analysez les résultats et le progrès de vos élèves</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Communication</h3>
            <p>Facilitez les échanges entre administration, enseignants et parents</p>
          </motion.div>
        </div>
        
        <div className="testimonial">
          <blockquote>
            "Academia Hub a transformé la gestion de notre établissement. Nous avons gagné un temps précieux et amélioré notre communication avec les parents."
          </blockquote>
          <cite>— Directeur, École Les Palmiers</cite>
        </div>
        
        <motion.div 
          className="cta-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <button 
            onClick={goToNextStep} 
            className="btn btn-primary btn-lg"
          >
            Commencer mon inscription
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
          
          <p className="time-estimate">Temps estimé: 15 minutes</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
