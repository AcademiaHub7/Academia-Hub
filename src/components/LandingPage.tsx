import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { 
  CheckCircle,
  ArrowRight,
  CreditCard,
  Gem
} from 'lucide-react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement de 5 secondes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  const plans = [
    {
      name: "Pack Quartz",
      price: "10.000",
      period: "/mois",
      description: "Parfait pour les petites écoles",
      features: [
        "Jusqu'à 100 élèves",
        "Modules de base",
        "Support email",
        "Sauvegarde quotidienne"
      ],
      popular: false
    },
    {
      name: "Pack Saphir",
      price: "20.000",
      period: "/mois",
      description: "Pour les établissements moyens",
      features: [
        "Jusqu'à 500 élèves",
        "Tous les modules",
        "IA intégrée",
        "Support prioritaire",
        "Analytics avancés",
        "Multi-utilisateurs"
      ],
      popular: true
    },
    {
      name: "Pack Diamant",
      price: "35.000",
      period: "/mois",
      description: "Pour les grandes institutions",
      features: [
        "Élèves illimités",
        "Personnalisation complète",
        "API dédiée",
        "Support 24/7",
        "Formation incluse",
        "SLA garantie",
        "Multi-établissements"
      ],
      popular: false
    }
  ];

  const landingPageClasses = [
    styles.landingPage,
    isLoading ? styles.loading : styles.loaded
  ].join(' ');

  return (
    <div className={landingPageClasses}>
      {/* Hero Section avec arrière-plan */}
      <div className={styles.heroBackground}>
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className={styles.overlay}></div>
        
        <div className="relative z-10">
          <Header />
          <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  <span className="block text-5xl md:text-7xl font-extrabold tracking-[-0.02em] text-white">Academia Hub</span>
                  <span className="block mt-2 text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 text-transparent bg-clip-text">
                    L'avenir de la gestion scolaire
                  </span>
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed tracking-normal drop-shadow-md">
                  Plateforme intelligente de gestion scolaire avec IA intégrée. 
                  Digitalisation complète pour tous niveaux d'éducation - de la maternelle à l'université.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    to="/register" 
                    className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Commencer maintenant
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="#demo" 
                    className="text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/30 hover:border-white hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    Voir la démo
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tarifs Transparents
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à la taille de votre établissement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-2xl shadow-xl ${
                  index === 0 ? 'border-2 border-gray-300 hover:-translate-y-2 hover:shadow-lg transition-all duration-300' :
                  index === 1 ? 'border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 transform hover:scale-[1.02] transition-all duration-300' :
                  index === 2 ? 'border-2 border-purple-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300' :
                  'bg-white hover:shadow-2xl transition-shadow'
                }`}
              >
                {index === 0 && (
                  <div className="absolute top-4 left-4">
                    <Gem className="h-12 w-12 text-gray-600" />
                  </div>
                )}
                {index === 1 && (
                  <div className="absolute top-4 left-4">
                    <Gem className="h-12 w-12 text-blue-600" />
                  </div>
                )}
                {index === 2 && (
                  <div className="absolute top-4 left-4">
                    <Gem className="h-12 w-12 text-purple-600" />
                  </div>
                )}
                
                {plan.popular && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Populaire
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    index === 0 ? 'text-gray-600' :
                    index === 1 ? 'text-blue-600' :
                    'text-purple-600'
                  }`}>{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className={`text-4xl font-bold ${
                      index === 0 ? 'text-gray-900' :
                      index === 1 ? 'text-blue-600' :
                      'text-purple-600'
                    }`}>{plan.price}</span>
                    <span className={`ml-1 text-xl font-semibold ${
                      index === 0 ? 'text-gray-600' :
                      index === 1 ? 'text-blue-600' :
                      'text-purple-600'
                    }`}>{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-4 pl-8">
                      <span className="w-4 h-4 bg-green-500 rounded-full" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-center">
                  <Link 
                    to="/subscription"
                    className={`inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold transition-colors duration-300 mb-6 ${
                      index === 0 ? 'bg-gray-600 text-white hover:bg-gray-700' :
                      index === 1 ? 'bg-blue-600 text-white hover:bg-blue-700' :
                      index === 2 ? 'bg-purple-600 text-white hover:bg-purple-700' :
                      'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Payer
                    <CreditCard className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="pt-0 pb-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Paiements Simplifiés
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Plusieurs options de paiement adaptées au contexte africain
            </p>
          </div>
          
          <div className="flex justify-center mb-12">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 p-8 rounded-2xl shadow-lg border border-green-200 dark:border-green-900/30 max-w-2xl w-full">
              <div className="flex items-center mb-6">
                <img 
                  src="/images/logoFedaPay.png" 
                  alt="FedaPay" 
                  className="w-10 h-10 mr-4 object-contain"
                  title="FedaPay"
                />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">FedaPay</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Solution de paiement mobile et carte bancaire intégrée, permettant des transactions sécurisées dans toute l'Afrique de l'Ouest.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                  <img 
                    src="/images/mtn-money.png" 
                    alt="MTN Mobile Money" 
                    className="h-8 object-contain"
                    title="MTN Mobile Money"
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                  <img 
                    src="/images/moov-money.png" 
                    alt="Moov Money" 
                    className="h-8 object-contain"
                    title="Moov Money"
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                  <img 
                    src="/images/celtiis-cash.png" 
                    alt="Celtiis Cash" 
                    className="h-8 object-contain"
                    title="Celtiis Cash"
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                  <img 
                    src="/images/visa.png" 
                    alt="Visa" 
                    className="h-8 object-contain"
                    title="Visa"
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                  <img 
                    src="/images/mastercard.png" 
                    alt="MasterCard" 
                    className="h-8 object-contain"
                    title="MasterCard"
                  />
                </div>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                Paiements sécurisés et instantanés
              </div>
            </div>
          </div>
        </div>
      </section>  

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Prêt à transformer votre établissement ?
          </h2>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Rejoignez des centaines d'établissements qui font confiance à Academia Hub 
            pour moderniser leur gestion scolaire.
          </p>
          <Link 
            to="/register"
            className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
          >
            Créer mon établissement
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;