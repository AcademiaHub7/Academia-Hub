import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { User, Lock, Eye, EyeOff, ArrowLeft, School } from 'lucide-react';

export const SchoolLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Pour les écoles, on utilise le username au lieu de l'email
      await login(username, password);
      // Rediriger vers le tableau de bord de l'école après une connexion réussie
      navigate('/examtrack/school/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleDemoLogin = () => {
    setUsername('admin@sainte-marie.edu.bj');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-color to-green-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <div className="mb-6">
          <Link 
            to="/examtrack" 
            className="inline-flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
            <School className="w-8 h-8 text-primary-color" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Espace École
          </h1>
          <p className="text-green-100">
            Connexion pour les établissements scolaires privés
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion École</h2>
            <p className="text-gray-600">Accédez à votre espace de gestion scolaire</p>
          </div>

          {/* Demo Login */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 mb-3 text-center">
              <strong>Démonstration :</strong> Cliquez pour tester avec un compte école
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors"
            >
              École Sainte Marie (Démo)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Identifiant École
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent transition-colors"
                  placeholder="Identifiant fourni par votre patronat"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de Passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-color focus:ring-primary-color border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-color hover:text-green-700">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-color hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" />
                  <span className="ml-2">Connexion en cours...</span>
                </>
              ) : (
                'Se Connecter'
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Besoin d'aide ?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Vos identifiants sont fournis par votre patronat régional</li>
              <li>• En cas de problème, contactez votre patronat</li>
              <li>• Support technique : support@educmaster-hub.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};