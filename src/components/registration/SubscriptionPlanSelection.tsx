/**
 * Composant de sélection de plan d'abonnement
 * @module components/registration/SubscriptionPlanSelection
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import registrationService from '../../services/registration/registrationService';

// Types
import { PlanFeatures } from '../../types/subscription';

// Extension de l'interface PlanFeatures pour inclure la propriété recommended
interface ExtendedPlanFeatures extends PlanFeatures {
  recommended?: boolean;
  // Propriétés requises de PlanFeatures
  max_students: number;
  max_teachers: number;
  video_storage_gb: number;
  custom_domain: boolean;
  advanced_analytics: boolean;
  modules?: string[];
  support_level?: 'basic' | 'standard' | 'premium';
}

// Interface pour les fonctionnalités du plan provenant de l'API
interface ApiPlanFeatures {
  max_students: number;
  max_teachers: number;
  video_storage_gb: number;
  custom_domain: boolean;
  advanced_analytics: boolean;
  modules?: string[];
  support_level?: 'basic' | 'standard' | 'premium';
  recommended?: boolean;
}

// Interface pour le plan provenant de l'API
interface ApiPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_days?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  billing_cycle?: string;
  features: ApiPlanFeatures;
}

// Interface pour le composant
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  // Propriétés transformées
  type: string;
  maxStudents: number;
  maxTeachers: number;
  durationDays: number; // Renommé de duration_days à durationDays
  isActive: boolean;   // Renommé de is_active à isActive
  createdAt: string;    // Renommé de created_at à createdAt
  updatedAt: string;    // Renommé de updated_at à updatedAt
  features: ExtendedPlanFeatures;
}

interface LocationState {
  registrationId: string;
  email: string;
}

/**
 * Composant de sélection de plan d'abonnement
 */
const SubscriptionPlanSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Récupérer l'ID d'inscription et l'email de l'état de navigation
  const locationState = location.state as LocationState | undefined;
  const registrationId = locationState?.registrationId || '';
  const email = locationState?.email || '';

  // Charger les plans d'abonnement
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        const plansData = await registrationService.listAvailablePlans();
        
        // Convertir les plans en format attendu par le composant
        const apiPlans = plansData as unknown as ApiPlan[];
        const formattedPlans: Plan[] = apiPlans.map(plan => {
          // Créer un objet features complet avec toutes les propriétés requises
          const features: ExtendedPlanFeatures = {
            max_students: plan.features.max_students || 0,
            max_teachers: plan.features.max_teachers || 0,
            video_storage_gb: plan.features.video_storage_gb || 0,
            custom_domain: plan.features.custom_domain || false,
            advanced_analytics: plan.features.advanced_analytics || false,
            modules: plan.features.modules || [],
            support_level: plan.features.support_level || 'basic',
            recommended: (plan.features as { recommended?: boolean }).recommended || false
          };
          
          // Créer l'objet plan avec les propriétés au format camelCase
          return {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: plan.price,
            currency: plan.currency,
            durationDays: ('duration_days' in plan ? plan.duration_days : 30) || 30, // Valeur par défaut de 30 jours
            isActive: plan.is_active !== undefined ? plan.is_active : true,
            createdAt: plan.created_at || new Date().toISOString(),
            updatedAt: plan.updated_at || new Date().toISOString(),
            type: plan.billing_cycle || 'monthly',
            maxStudents: plan.features.max_students || 0,
            maxTeachers: plan.features.max_teachers || 0,
            features
          };
        });
        
        setPlans(formattedPlans);
        
        // Sélectionner automatiquement le plan recommandé s'il existe
        const recommendedPlan = formattedPlans.find(plan => plan.features.recommended);
        if (recommendedPlan) {
          setSelectedPlan(recommendedPlan.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des plans:', error);
        setError('Impossible de charger les plans d\'abonnement. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  // Vérifier si les données nécessaires sont présentes
  useEffect(() => {
    if (!registrationId || !email) {
      setError('Informations d\'inscription manquantes. Veuillez recommencer le processus d\'inscription.');
    }
  }, [registrationId, email]);

  // Gérer la sélection d'un plan
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async () => {
    if (!selectedPlan) {
      setError('Veuillez sélectionner un plan d\'abonnement.');
      return;
    }

    if (!registrationId) {
      setError('Informations d\'inscription manquantes. Veuillez recommencer le processus d\'inscription.');
      return;
    }

    try {
      // Enregistrer le plan sélectionné
      const response = await fetch('/api/register/school/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          planId: selectedPlan
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de la sélection du plan');
      }

      // Rediriger vers la page de paiement
      navigate('/register/school/payment', { 
        state: { 
          registrationId,
          planId: selectedPlan,
          email
        } 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      setError(errorMessage);
    }
  };

  // Formater le prix
  const formatPrice = (price: number, type: string = 'monthly'): string => {
    const formattedPrice = new Intl.NumberFormat('fr-FR').format(price);
    
    switch (type) {
      case 'monthly':
        return `${formattedPrice} FCFA/mois`;
      case 'quarterly':
        return `${formattedPrice} FCFA/trimestre`;
      case 'yearly':
        return `${formattedPrice} FCFA/an`;
      default:
        return `${formattedPrice} FCFA`;
    }
  };

  // Rendu d'un plan d'abonnement
  const renderPlan = (plan: Plan) => {
    const isSelected = selectedPlan === plan.id;
    
    return (
      <div 
        key={plan.id}
        className={`subscription-plan-card ${isSelected ? 'selected' : ''} ${plan.features.recommended ? 'recommended' : ''}`}
        onClick={() => handlePlanSelect(plan.id)}
      >
        {plan.features.recommended && (
          <div className="recommended-badge">Recommandé</div>
        )}
        
        <div className="plan-header">
          <h3>{plan.name}</h3>
          <div className="plan-price">
            <span className="price">{formatPrice(plan.price, plan.type)}</span>
          </div>
        </div>
        
        <div className="plan-description">
          {plan.description}
        </div>
        
        <div className="plan-features">
          <div className="feature-item">
            <i className="fas fa-user-graduate"></i>
            <span>Jusqu'à {plan.maxStudents} élèves</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-chalkboard-teacher"></i>
            <span>Jusqu'à {plan.maxTeachers} enseignants</span>
          </div>
          
          <ul className="feature-list">
            {plan.features.modules?.map((module, index) => (
              <li key={index}>
                <i className="fas fa-check"></i>
                <span>{module}</span>
              </li>
            ))}
            <li>
              <i className="fas fa-check"></i>
              <span>{plan.features.video_storage_gb} Go de stockage vidéo</span>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <span>{plan.features.custom_domain ? 'Domaine personnalisé' : 'Sous-domaine académiahub'}</span>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <span>Support {plan.features.support_level}</span>
            </li>
          </ul>
        </div>
        
        <div className="plan-select">
          <button 
            className={`btn ${isSelected ? 'btn-success' : 'btn-outline-primary'}`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {isSelected ? 'Sélectionné' : 'Sélectionner'}
          </button>
        </div>
      </div>
    );
  };

  // Si les données d'inscription sont manquantes, afficher un message d'erreur
  if (!registrationId && !loading) {
    return (
      <div className="subscription-plan-container error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Informations d'inscription manquantes</h3>
          <p>Veuillez recommencer le processus d'inscription.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/register/school')}
          >
            Retour à l'inscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-plan-container">
      <div className="plan-selection-header">
        <h2>Choisissez votre plan d'abonnement</h2>
        <p>
          Sélectionnez le plan qui correspond le mieux aux besoins de votre établissement.
          Vous pourrez changer de plan ultérieurement si nécessaire.
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Chargement...</span>
          </div>
          <p>Chargement des plans d'abonnement...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button 
            className="btn btn-outline-primary"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      ) : (
        <>
          <div className="subscription-plans-grid">
            {plans.map(plan => renderPlan(plan))}
          </div>

          <div className="plan-selection-footer">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Retour
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!selectedPlan}
            >
              Continuer vers le paiement
            </button>
          </div>

          <div className="plan-info-box">
            <div className="info-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <div className="info-content">
              <p>
                Tous nos plans incluent une période d'essai de 14 jours. Vous ne serez pas facturé
                avant la fin de cette période et pourrez annuler à tout moment.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SubscriptionPlanSelection;
