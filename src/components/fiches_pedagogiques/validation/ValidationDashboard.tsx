import React, { useState, useEffect } from 'react';
import { FileText, Clock, User, CheckCircle, AlertCircle, MessageSquare, BarChart2 } from 'lucide-react';

interface FicheValidation {
  id: string;
  titre: string;
  matiere: string;
  classe: string;
  auteur: string;
  dateSoumission: string;
  statut: 'en_attente' | 'en_cours' | 'corrigee' | 'validée' | 'rejetée';
  corrections: Correction[];
  messages: Message[];
}

interface Correction {
  id: string;
  section: string;
  contenu: string;
  type: 'erreur' | 'suggestion' | 'recommandation';
  date: string;
}

interface Message {
  id: string;
  auteur: string;
  contenu: string;
  date: string;
}

interface ValidationDashboardProps {
  fiche: FicheValidation;
  onCorrection: (correction: Correction) => void;
  onMessage: (message: Message) => void;
  onUpdateStatus: (statut: string) => void;
}

const ValidationDashboard: React.FC<ValidationDashboardProps> = ({
  fiche,
  onCorrection,
  onMessage,
  onUpdateStatus
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Statistiques par enseignant
  const stats = {
    total: 50,
    en_attente: 15,
    en_cours: 10,
    corrigees: 20,
    validées: 5,
    rejetées: 2
  };

  // Historique des échanges
  const history = fiche.messages.map((msg, index) => (
    <div key={index} className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {msg.auteur}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(msg.date).toLocaleDateString('fr-FR')}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{msg.contenu}</p>
    </div>
  ));

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            <FileText className="w-5 h-5 inline-block mr-2" />
            Validation de la fiche : {fiche.titre}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span>{fiche.auteur}</span>
            <Clock className="w-4 h-4" />
            <span>{new Date(fiche.dateSoumission).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
          getStatutColor(fiche.statut)
        }`}>
          {fiche.statut}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {key.replace('_', ' ')}
            </h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Sections de la fiche
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Objectifs', 'Compétences', 'Déroulement', 'Évaluation'].map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`p-4 rounded-lg border transition-colors duration-200 ${
                selectedSection === section
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{section}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {fiche.corrections.filter(c => c.section === section).length} corrections
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interface de correction */}
      {selectedSection && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Correction de la section : {selectedSection}
          </h4>
          <div className="space-y-4">
            {/* Bouton de correction */}
            <button
              onClick={() => setShowCorrectionModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Ajouter une correction
            </button>

            {/* Bouton de message */}
            <button
              onClick={() => setShowMessageModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Envoyer un message
            </button>

            {/* Liste des corrections */}
            {fiche.corrections
              .filter(c => c.section === selectedSection)
              .map((correction, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`w-4 h-4 ${
                      correction.type === 'erreur' ? 'text-red-500' :
                      correction.type === 'suggestion' ? 'text-blue-500' :
                      'text-green-500'
                    }`}>
                      •
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {correction.type}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(correction.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{correction.contenu}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => onUpdateStatus('en_cours')}
          className="px-4 py-2 bg-yellow-600 dark:bg-yellow-700 text-white rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-800"
        >
          En cours
        </button>
        <button
          onClick={() => onUpdateStatus('corrigee')}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          Corrigée
        </button>
        <button
          onClick={() => onUpdateStatus('validée')}
          className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
        >
          Validée
        </button>
        <button
          onClick={() => onUpdateStatus('rejetée')}
          className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800"
        >
          Rejetée
        </button>
      </div>

      {/* Modal de correction */}
      {showCorrectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Ajouter une correction
              </h2>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type de correction
                  </label>
                  <select
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="erreur">Erreur</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="recommandation">Recommandation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contenu de la correction
                  </label>
                  <textarea
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
                    placeholder="Description détaillée de la correction..."
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowCorrectionModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      // Logique de sauvegarde
                      setShowCorrectionModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de message */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Envoyer un message
              </h2>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
                    placeholder="Votre message..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      // Logique d'envoi du message
                      setShowMessageModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatutColor = (statut: string) => {
  switch (statut) {
    case 'en_attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'en_cours':
      return 'bg-blue-100 text-blue-800';
    case 'corrigee':
      return 'bg-orange-100 text-orange-800';
    case 'validée':
      return 'bg-green-100 text-green-800';
    case 'rejetée':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default ValidationDashboard;
