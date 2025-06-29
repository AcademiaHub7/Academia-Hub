import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { User, Lock, Eye, EyeOff, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'superadmin' | 'patronat' | 'school'>('patronat');
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate email based on user type for demo
    const demoEmail = userType === 'superadmin' 
      ? 'superadmin@academia-hub.com'
      : userType === 'patronat'
      ? 'patronat@atlantique.edu.bj'
      : 'admin@sainte-marie.edu.bj';
    
    try {
      await login(demoEmail, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleDemoLogin = (type: 'superadmin' | 'patronat' | 'school') => {
    setUserType(type);
    setPassword('demo123');
    
    const demoEmail = type === 'superadmin' 
      ? 'superadmin@academia-hub.com'
      : type === 'patronat'
      ? 'patronat@atlantique.edu.bj'
      : 'admin@sainte-marie.edu.bj';
    
    setEmail(demoEmail);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-color to-green-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-color">EM</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            EducMaster Academia Hub
          </h1>
          <p className="text-green-100">
            Plateforme de Gestion des Examens - Écoles Privées
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
            <p className="text-gray-600">Accédez à votre espace de gestion</p>
          </div>

          {/* Demo Login Buttons */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3 text-center">Connexion rapide pour démonstration:</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('superadmin')}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Super Administrateur
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('patronat')}
                className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
              >
                Administrateur Patronat
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('school')}
                className="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors"
              >
                Administrateur École
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent transition-colors"
                  placeholder="votre.email@exemple.com"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-color hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous êtes un patronat régional ?{' '}
              <Link 
                to="/examtrack/patronat/register" 
                className="text-primary-color hover:text-green-700 font-medium flex items-center justify-center space-x-1 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Créer un compte patronat</span>
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Problème de connexion?{' '}
              <a href="#" className="text-primary-color hover:underline">
                Contacter le support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};