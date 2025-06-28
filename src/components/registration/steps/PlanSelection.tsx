/**
 * Étape de sélection du plan d'abonnement
 * @module components/registration/steps/PlanSelection
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RegistrationSession } from '../../../types/registration';
import { registrationService } from '../../../services/registration/registrationService';

interface PlanSelectionProps {
  sessionData: RegistrationSession | null;
  updateSessionData: (updates: Partial<RegistrationSession>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validationErrors: Record<string, string>;
  setValidationErrors: (errors: Record<string, string>) => void;
  saveSession: () => Promise<void>;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: string[];
  recommended?: boolean;
  description: string;
}

/**
 * Composant de sélection du plan d'abonnement (30 secondes)
 */
const PlanSelection: React.FC<PlanSelectionProps> = ({
  sessionData,
  updateSessionData,
  goToNextStep,
  goToPreviousStep,
  validationErrors,
  setValidationErrors,
  saveSession
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(sessionData?.plan?.id || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Charger les plans disponibles
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const availablePlans = await registrationService.getAvailablePlans();
        setPlans(availablePlans);
        
        // Si un plan est déjà sélectionné dans la session, le conserver
        if (sessionData?.plan?.id && availablePlans.some(plan => plan.id === sessionData.plan?.id)) {
          setSelectedPlanId(sessionData.plan.id);
        } else if (availablePlans.length > 0) {
          // Sinon, sélectionner le plan recommandé ou le premier plan
          const recommendedPlan = availablePlans.find(plan => plan.recommended);
          setSelectedPlanId(recommendedPlan?.id || availablePlans[0].id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des plans:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlans();
  }, [sessionData?.plan?.id]);
  
  // Sélectionner un plan
  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
    
    // Effacer les erreurs de validation
    if (validationErrors.plan) {
      setValidationErrors({
        ...validationErrors,
        plan: ''
      });
    }
  };
  
  // Soumettre le plan sélectionné
  const handleSubmit = async () => {
    if (!selectedPlanId) {
      setValidationErrors({
        ...validationErrors,
        plan: 'Veuillez sélectionner un plan'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
      
      if (selectedPlan) {
        // Mettre à jour les données de session
        updateSessionData({
          plan: {
            id: selectedPlan.id,
            name: selectedPlan.name,
            price: selectedPlan.price,
            currency: selectedPlan.currency,
            billingCycle: selectedPlan.billingCycle
          }
        });
        
        // Sauvegarder la session
        await saveSession();
        
        // Passer à l'étape suivante
        goToNextStep();
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du plan:', error);
      setValidationErrors({
        ...validationErrors,
        plan: 'Une erreur est survenue lors de la sélection du plan'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Formater le prix
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Formater le cycle de facturation
  const formatBillingCycle = (cycle: string) => {
    switch (cycle) {
      case 'monthly':
        return '/mois';
      case 'quarterly':
        return '/trimestre';
      case 'yearly':
        return '/an';
      default:
        return '';
    }
  };
  
  return (
    <motion.div 
      className="plan-selection-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Choisissez votre plan</h2>
      <p className="step-description">
        Sélectionnez le plan qui correspond le mieux aux besoins de votre établissement.
        <br />
        <span className="time-estimate">Temps estimé: 30 secondes</span>
      </p>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Chargement...</span>
          </div>
          <p>Chargement des plans disponibles...</p>
        </div>
      ) : (
        <>
          <div className="plans-grid">
            {plans.map((plan) => (
              <motion.div 
                key={plan.id}
                className={`plan-card ${selectedPlanId === plan.id ? 'selected' : ''} ${plan.recommended ? 'recommended' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {plan.recommended && (
                  <div className="recommended-badge">Recommandé</div>
                )}
                
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{formatPrice(plan.price, plan.currency)}</span>
                    <span className="billing-cycle">{formatBillingCycle(plan.billingCycle)}</span>
                  </div>
                </div>
                
                <div className="plan-description">
                  {plan.description}
                </div>
                
                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check-circle"></i> {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="plan-select">
                  <button 
                    type="button"
                    className={`btn ${selectedPlanId === plan.id ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {selectedPlanId === plan.id ? (
                      <>
                        <i className="fas fa-check mr-2"></i> Sélectionné
                      </>
                    ) : (
                      'Sélectionner'
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {validationErrors.plan && (
            <div className="alert alert-danger mt-3">
              {validationErrors.plan}
            </div>
          )}
          
          <div className="navigation-buttons">
            <button 
              className="btn btn-outline-secondary"
              onClick={goToPreviousStep}
              disabled={isSubmitting}
            >
              <i className="fas fa-arrow-left mr-2"></i> Étape précédente
            </button>
            
            <button 
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!selectedPlanId || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                  Traitement...
                </>
              ) : (
                <>Continuer vers le paiement <i className="fas fa-arrow-right ml-2"></i></>
              )}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default PlanSelection;
