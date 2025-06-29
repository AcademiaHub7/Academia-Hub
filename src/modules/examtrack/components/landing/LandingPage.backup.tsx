import React from 'react';
import { Link } from 'react-router-dom';
import { 
  School, 
  Users, 
  Search, 
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
  Clock,
  TrendingUp,
  Globe,
  ChevronDown,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-color via-green-700 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-primary-color to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-color to-blue-600 bg-clip-text text-transparent">
                  EducMaster Academia Hub
                </h1>
                <p className="text-sm text-gray-600">
                  Plateforme de Gestion des Examens - Écoles Privées du Bénin
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                to="/examtrack/results-search" 
                className="group relative px-3 py-2 text-gray-700 hover:text-primary-color font-medium transition-colors duration-300"
              >
                <span className="relative">
                  Consulter Résultats
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-color group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link 
                to="/about" 
                className="group relative px-3 py-2 text-gray-600 hover:text-primary-color transition-colors duration-300"
              >
                <span className="relative">
                  À propos
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-color group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link 
                to="/examtrack/patronat/login" 
                className="px-4 py-2 bg-gradient-to-r from-primary-color to-blue-600 text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Espace Client</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="text-sm font-medium text-white">✨ Plateforme Officielle - Version 2.0</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Gestion Scolaire <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Simplifiée</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-green-100 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              La plateforme tout-en-un pour gérer les examens, les notes et les résultats des écoles privées du Bénin.
              <span className="block mt-2 text-green-200 text-lg">Conforme aux normes EducMaster.bj</span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link 
                to="/examtrack/patronat/register" 
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Commencer maintenant</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/examtrack/results-search" 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Consulter les résultats</span>
              </Link>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 text-green-100/80 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-full">
                <Shield className="w-4 h-4 text-green-300" />
                <span>Sécurité maximale</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-full">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>Rapide & Fiable</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-full">
                <Globe className="w-4 h-4 text-blue-300" />
                <span>Accessible partout</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {[
              { value: "200+", label: "Écoles", icon: <School className="w-6 h-6 text-yellow-400" /> },
              { value: "50K+", label: "Élèves", icon: <Users className="w-6 h-6 text-blue-400" /> },
              { value: "99.9%", label: "Disponibilité", icon: <Clock className="w-6 h-6 text-green-400" /> },
              { value: "24/7", label: "Support", icon: <TrendingUp className="w-6 h-6 text-purple-400" /> },
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-green-100/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <button className="animate-bounce text-white/60 hover:text-white transition-colors">
              <ChevronDown className="w-8 h-8 mx-auto" />
              <span className="block text-xs mt-1">Découvrir plus</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Espaces d'Accès */}
      <section id="espaces" className="relative py-20 bg-gradient-to-b from-transparent to-white/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,transparent,white,transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block mb-3 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-yellow-300 text-sm font-medium rounded-full border border-white/10">
              Accès Rapide
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Choisissez Votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Espace</span>
            </h2>
            <p className="text-xl text-green-100/80 max-w-2xl mx-auto">
              Accédez à un espace personnalisé conçu spécifiquement pour vos besoins
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Espace Patronat */}
          <motion.div 
            className="group bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col"
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="relative h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Espace Patronat
                </h3>
                <p className="text-gray-600 mb-6">
                  Gestion régionale des écoles privées et supervision des examens
                </p>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                {[
                  "Gestion des écoles affiliées",
                  "Supervision des examens",
                  "Analytics régionales",
                  "Rapports consolidés",
                  "Suivi des performances",
                  "Tableaux de bord personnalisés"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mt-auto">
                <Link
                  to="/examtrack/patronat/login"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <span>Se Connecter</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/examtrack/patronat/register"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-blue-100 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300"
                >
                  <span>Créer un Compte</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Espace École */}
          <motion.div 
            className="group bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col transform scale-105 z-10"
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full z-10">
                Populaire
              </div>
              <div className="h-2 bg-gradient-to-r from-primary-color to-green-600"></div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-color to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <School className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Espace École
                </h3>
                <p className="text-gray-600 mb-6">
                  Gestion complète de votre établissement scolaire
                </p>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                {[
                  "Création et gestion d'examens",
                  "Saisie et validation des notes",
                  "Gestion des élèves et classes",
                  "Publication des résultats",
                  "Bulletins personnalisés",
                  "Communication parents-école"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mt-auto">
                <Link
                  to="/examtrack/school/login"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-primary-color to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <span>Se Connecter</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-xs text-center text-gray-500 px-4">
                  Identifiants fournis par votre patronat régional
                </div>
              </div>
            </div>
          </motion.div>

          {/* Espace Consultation */}
          <motion.div 
            className="group bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:border-orange-400/30 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col"
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="relative h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Consultation Résultats
                </h3>
                <p className="text-gray-600 mb-6">
                  Accès aux résultats en temps réel pour élèves et parents
                </p>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                {[
                  "Recherche par matricule ou nom",
                  "Bulletins en ligne détaillés",
                  "Historique complet des notes",
                  "Téléchargement PDF des relevés",
                  "Notifications des nouveaux résultats",
                  "Comparaison avec la classe"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mt-auto">
                <Link
                  to="/examtrack/results-search"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <span>Consulter les résultats</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-xs text-center text-gray-500">
                  Accès sécurisé avec matricule élève
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/10 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Pourquoi Choisir <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Academia Hub</span> ?
            </h2>
            <p className="text-xl text-green-100/80 max-w-3xl mx-auto">
              Une plateforme complète pour la gestion scolaire, conçue pour répondre à tous vos besoins éducatifs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-white" />,
                title: "Sécurisé",
                description: "Données chiffrées et isolation complète entre les établissements"
              },
              {
                icon: <FileText className="w-8 h-8 text-white" />,
                title: "Conforme",
                description: "Interface et fonctionnalités adaptées aux exigences éducatives"
              },
              {
                icon: <Zap className="w-8 h-8 text-white" />,
                title: "Performant",
                description: "Plateforme rapide et fiable pour tous vos besoins éducatifs"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-yellow-400/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-color to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-green-100/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-green-100 mb-2">
              © 2024 EducMaster Academia Hub. Tous droits réservés.
            </p>
            <p className="text-sm text-green-200">
              Plateforme officielle pour les écoles privées du Bénin
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};