import React from 'react';
import { useRegistrationStore } from '../../../stores/registrationStore';
import { CheckCircle, Clock, AlertCircle, Mail, Phone } from 'lucide-react';

export const ReviewStep: React.FC = () => {
  const { currentRegistration } = useRegistrationStore();

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Inscription en Cours de Validation
        </h2>
        <p className="text-gray-600">
          Votre paiement a été effectué avec succès. Votre compte sera activé sous 24-48h après validation administrative.
        </p>
      </div>

      {/* Status Timeline */}
      <div className="mb-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="font-medium text-gray-900">Informations personnelles</h3>
              <p className="text-sm text-gray-600">Complétées et validées</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="font-medium text-gray-900">Informations organisation</h3>
              <p className="text-sm text-gray-600">Complétées et validées</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="font-medium text-gray-900">Plan d'abonnement</h3>
              <p className="text-sm text-gray-600">Sélectionné et payé</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="font-medium text-gray-900">Paiement</h3>
              <p className="text-sm text-gray-600">Effectué avec succès</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Clock className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="font-medium text-gray-900">Validation administrative</h3>
              <p className="text-sm text-gray-600">En cours d'examen par notre équipe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Récapitulatif de votre inscription</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Responsable</h4>
            <p className="text-sm text-gray-900">
              {currentRegistration?.personalInfo.firstName} {currentRegistration?.personalInfo.lastName}
            </p>
            <p className="text-sm text-gray-600">{currentRegistration?.personalInfo.position}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700">Organisation</h4>
            <p className="text-sm text-gray-900">{currentRegistration?.organizationInfo.name}</p>
            <p className="text-sm text-gray-600">Région: {currentRegistration?.organizationInfo.region}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700">Contact</h4>
            <p className="text-sm text-gray-900">{currentRegistration?.personalInfo.email}</p>
            <p className="text-sm text-gray-600">{currentRegistration?.personalInfo.phone}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700">Plan sélectionné</h4>
            <p className="text-sm text-gray-900">Plan Professional</p>
            <p className="text-sm text-gray-600">Facturation mensuelle</p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-green-50 rounded-lg p-6 mb-6">
        <h3 className="font-medium text-green-900 mb-3">Prochaines étapes</h3>
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-800 text-sm font-medium">
              1
            </div>
            <p className="text-sm text-green-700">
              Notre équipe examine votre dossier et vérifie les informations fournies (24-48h)
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-800 text-sm font-medium">
              2
            </div>
            <p className="text-sm text-green-700">
              Vous recevez une notification par email avec vos identifiants de connexion
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-800 text-sm font-medium">
              3
            </div>
            <p className="text-sm text-green-700">
              Votre compte patronat est activé et vous pouvez commencer à créer vos écoles
            </p>
          </div>
        </div>
      </div>

      {/* Simplified Process Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Processus Simplifié</h4>
            <p className="text-sm text-blue-700 mt-1">
              Nous avons simplifié le processus d'inscription ! Plus besoin de documents KYC complexes. 
              Une simple validation administrative suffit pour activer votre compte.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Besoin d'aide ?</h4>
            <p className="text-sm text-yellow-700 mt-1 mb-3">
              Notre équipe support est disponible pour répondre à vos questions pendant le processus de validation.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a
                href="mailto:support@educmaster-hub.com"
                className="flex items-center space-x-2 text-sm text-yellow-700 hover:text-yellow-900"
              >
                <Mail className="w-4 h-4" />
                <span>support@educmaster-hub.com</span>
              </a>
              <a
                href="tel:+22921234567"
                className="flex items-center space-x-2 text-sm text-yellow-700 hover:text-yellow-900"
              >
                <Phone className="w-4 h-4" />
                <span>+229 21 23 45 67</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};