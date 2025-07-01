import React from 'react';
import { Link } from 'react-router-dom';
import { 
  School, 
  Search, 
  BookOpen,
  Shield,
  Award,
  ArrowRight,
  CheckCircle,
  Plus
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-color to-green-700">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-color rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">EM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-color">
                  EducMaster Academia Hub
                </h1>
                <p className="text-sm text-gray-600">
                  Plateforme de Gestion des Examens - Écoles Privées du Bénin
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/examtrack/results" 
                className="text-primary-color hover:text-green-700 font-medium"
              >
                Consulter Résultats
              </Link>
              <Link 
                to="/examtrack/about" 
                className="text-gray-600 hover:text-gray-800"
              >
                À propos
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              EducMaster Academia Hub
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Plateforme officielle de gestion des examens pour les écoles privées du Bénin
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span>Conforme EducMaster.bj</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span>Multi-tenant sécurisé</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Espaces d'Accès */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Choisissez Votre Espace
          </h2>
          <p className="text-green-100 text-lg">
            Accédez à votre espace dédié selon votre profil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Espace Patronat */}
          <div className="bg-white rounded-xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Espace Patronat
              </h3>
              <p className="text-gray-600 mb-6">
                Gestion régionale des écoles privées et supervision des examens
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Gestion des écoles affiliées</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Supervision des examens</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Analytics régionales</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Rapports consolidés</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/examtrack/patronat/login"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <span>Se Connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/examtrack/patronat/register"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Créer un Compte</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Espace École */}
          <div className="bg-white rounded-xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-color rounded-full flex items-center justify-center mx-auto mb-6">
                <School className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Espace École
              </h3>
              <p className="text-gray-600 mb-6">
                Gestion des examens et des résultats de votre établissement
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Création d'examens</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Saisie des notes</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Gestion des élèves</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Publication des résultats</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/examtrack/school/login"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span>Se Connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-gray-500">
                  Identifiants fournis par votre patronat régional
                </p>
              </div>
            </div>
          </div>

          {/* Espace Consultation */}
          <div className="bg-white rounded-xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Consultation Résultats
              </h3>
              <p className="text-gray-600 mb-6">
                Consultez les résultats d'examens en ligne (élèves et parents)
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Recherche par matricule</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Bulletins en ligne</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Historique des notes</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Téléchargement PDF</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/examtrack/results"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <span>Consulter Résultats</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-gray-500">
                  Accès libre avec matricule élève
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pourquoi Choisir EducMaster Academia Hub ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Sécurisé</h3>
              <p className="text-green-100">
                Données chiffrées et isolation complète entre les établissements
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Conforme</h3>
              <p className="text-green-100">
                Interface et fonctionnalités identiques à EducMaster.bj officiel
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Performant</h3>
              <p className="text-green-100">
                Plateforme rapide et fiable pour tous vos besoins éducatifs
              </p>
            </div>
          </div>
        </div>
      </div>

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