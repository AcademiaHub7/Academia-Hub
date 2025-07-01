import React, { useState, useEffect } from 'react';
import { useRegistrationStore } from '../../../stores/registrationStore';
import { SubscriptionPlan } from '../../../types';
import { Check, Star, Users, School, BarChart3 } from 'lucide-react';

export const PlanSelectionStep: React.FC = () => {
  const { subscriptionPlans, selectPlan, fetchSubscriptionPlans, isLoading } = useRegistrationStore();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchSubscriptionPlans();
  }, [fetchSubscriptionPlans]);

  const handlePlanSelection = async () => {
    if (selectedPlan) {
      await selectPlan(selectedPlan, billingCycle);
    }
  };

  const getDiscountedPrice = (plan: SubscriptionPlan, cycle: string) => {
    let multiplier = 1;
    let discount = 0;

    switch (cycle) {
      case 'quarterly':
        multiplier = 3;
        discount = 0.05; // 5% de réduction
        break;
      case 'yearly':
        multiplier = 12;
        discount = 0.15; // 15% de réduction
        break;
      default:
        multiplier = 1;
    }

    const basePrice = plan.price * multiplier;
    return Math.round(basePrice * (1 - discount));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choisissez Votre Plan d'Abonnement
        </h2>
        <p className="text-gray-600">
          Sélectionnez le plan qui correspond le mieux aux besoins de votre patronat régional.
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'monthly', label: 'Mensuel' },
              { key: 'quarterly', label: 'Trimestriel', badge: '5% off' },
              { key: 'yearly', label: 'Annuel', badge: '15% off' },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setBillingCycle(option.key as any)}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === option.key
                    ? 'bg-white text-primary-color shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
                {option.badge && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {option.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? 'border-primary-color bg-primary-color/5'
                : 'border-gray-200 hover:border-gray-300'
            } ${plan.isPopular ? 'ring-2 ring-primary-color' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-color text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Populaire
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary-color">
                  {formatPrice(getDiscountedPrice(plan, billingCycle))}
                </span>
                <span className="text-gray-600 text-sm">
                  /{billingCycle === 'monthly' ? 'mois' : billingCycle === 'quarterly' ? 'trimestre' : 'an'}
                </span>
                {billingCycle !== 'monthly' && (
                  <div className="text-sm text-green-600 mt-1">
                    Économisez {billingCycle === 'quarterly' ? '5%' : '15%'}
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <School className="w-4 h-4 mr-2" />
                  {plan.maxSchools === -1 ? 'Écoles illimitées' : `${plan.maxSchools} écoles max`}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {plan.maxStudents === -1 ? 'Élèves illimités' : `${plan.maxStudents.toLocaleString()} élèves max`}
                </div>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature.id} className="flex items-start text-sm">
                    <Check className={`w-4 h-4 mr-2 mt-0.5 ${
                      feature.included ? 'text-green-500' : 'text-gray-300'
                    }`} />
                    <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedPlan === plan.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-primary-color rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {selectedPlan && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Résumé de votre sélection</h4>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Plan {subscriptionPlans.find(p => p.id === selectedPlan)?.name} - 
              {billingCycle === 'monthly' ? ' Mensuel' : billingCycle === 'quarterly' ? ' Trimestriel' : ' Annuel'}
            </span>
            <span className="font-bold text-primary-color">
              {formatPrice(getDiscountedPrice(subscriptionPlans.find(p => p.id === selectedPlan)!, billingCycle))}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color transition-colors"
        >
          Retour
        </button>
        <button
          onClick={handlePlanSelection}
          disabled={!selectedPlan || isLoading}
          className="px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Traitement...' : 'Procéder au Paiement'}
        </button>
      </div>
    </div>
  );
};