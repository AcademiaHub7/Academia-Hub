import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Check, ArrowLeft, CreditCard, Shield, Star, Phone, Globe } from 'lucide-react';
import PaymentModal from './modals/PaymentModal';

const Subscription: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'fedapay' | 'kkiapay'>('fedapay');
  const navigate = useNavigate();

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      period: 'mois',
      description: 'Parfait pour les petites écoles',
      maxStudents: '100 élèves',
      features: [
        'Gestion des élèves et notes',
        'Modules de base',
        'Support email',
        'Sauvegarde quotidienne',
        'Rapports de base'
      ],
      popular: false,
      color: 'from-gray-600 to-gray-700'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      period: 'mois',
      description: 'Pour les établissements moyens',
      maxStudents: '500 élèves',
      features: [
        'Tous les modules inclus',
        'IA intégrée avancée',
        'Support prioritaire',
        'Analytics avancés',
        'Multi-utilisateurs illimités',
        'API complète',
        'Formation incluse'
      ],
      popular: true,
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 149,
      period: 'mois',
      description: 'Pour les grandes institutions',
      maxStudents: 'Élèves illimités',
      features: [
        'Personnalisation complète',
        'IA avancée + prédictions',
        'Support 24/7 dédié',
        'SLA garantie 99.9%',
        'Formation sur site',
        'Multi-établissements',
        'Intégrations personnalisées',
        'Gestionnaire de compte dédié'
      ],
      popular: false,
      color: 'from-purple-600 to-pink-600'
    }
  ];

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Ouvrir la modal de paiement
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error('Payment initialization failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Redirection vers le dashboard après un paiement réussi
    navigate('/dashboard');
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/register" 
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour à l'inscription
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30"></div>
              <GraduationCap className="relative w-16 h-16 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Choisissez votre plan d'abonnement
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sélectionnez le plan qui correspond le mieux aux besoins de votre établissement. 
            Vous pourrez modifier votre abonnement à tout moment.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Plans Selection */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                    selectedPlan === plan.id 
                      ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900 scale-105' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Recommandé
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{plan.price}€</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">/{plan.period}</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-2">{plan.maxStudents}</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={`w-full py-3 px-4 rounded-xl font-semibold text-center transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? `bg-gradient-to-r ${plan.color} text-white shadow-lg`
                        : 'border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}>
                      {selectedPlan === plan.id ? 'Plan sélectionné' : 'Sélectionner'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Résumé de commande</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedPlanData?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPlanData?.description}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{selectedPlanData?.maxStudents}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{selectedPlanData?.price}€</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">/{selectedPlanData?.period}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedPlanData?.price}€</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">TVA (20%)</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{Math.round((selectedPlanData?.price || 0) * 0.2)}€</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-gray-900 dark:text-gray-100">{Math.round((selectedPlanData?.price || 0) * 1.2)}€</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                  Paiement sécurisé
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                  Mobile Money: MTN, Moov, Orange
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CreditCard className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400" />
                  Cartes: Visa, Mastercard
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setPaymentMethod('fedapay');
                    handlePayment();
                  }}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Payer avec FedaPay
                </button>
                
                <button
                  onClick={() => {
                    setPaymentMethod('kkiapay');
                    handlePayment();
                  }}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Payer avec KKiaPay
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
                En procédant au paiement, vous acceptez nos conditions d'utilisation. 
                Vous pouvez annuler votre abonnement à tout moment.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Déjà utilisé par plus de 500 établissements en Afrique</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-600">ÉCOLE★★★</div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-600">LYCÉE+</div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-600">UNIVERSITÉ</div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentCancel}
        onSuccess={handlePaymentSuccess}
        amount={Math.round((selectedPlanData?.price || 0) * 1.2)}
        planName={selectedPlanData?.name || ''}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default Subscription;