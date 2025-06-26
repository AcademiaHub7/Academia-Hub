import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Mail,
  Phone,
  Bell,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { MessageModal } from '../modals';

const Communication: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [newMessage, setNewMessage] = useState('');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const communicationStats = [
    {
      title: 'Messages envoyés',
      value: '1,247',
      change: '+12%',
      icon: MessageSquare,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'SMS envoyés',
      value: '856',
      change: '+8%',
      icon: Phone,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Emails envoyés',
      value: '2,134',
      change: '+15%',
      icon: Mail,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Taux de lecture',
      value: '94.2%',
      change: '+2.1%',
      icon: CheckCircle,
      color: 'from-orange-600 to-orange-700'
    }
  ];

  const recentMessages = [
    {
      id: 1,
      type: 'sms',
      recipient: 'Parents 3ème A',
      subject: 'Réunion parents-professeurs',
      content: 'Rappel: Réunion parents-professeurs le 15/01 à 18h. Merci de confirmer votre présence.',
      sentAt: '2024-01-10 14:30',
      status: 'delivered',
      readRate: 89
    },
    {
      id: 2,
      type: 'email',
      recipient: 'Tous les parents',
      subject: 'Bulletin trimestriel disponible',
      content: 'Les bulletins du 1er trimestre sont disponibles sur votre espace parent.',
      sentAt: '2024-01-09 16:45',
      status: 'delivered',
      readRate: 76
    },
    {
      id: 3,
      type: 'notification',
      recipient: 'Parents Terminale S',
      subject: 'Orientation post-bac',
      content: 'Séance d\'information sur l\'orientation post-bac le 20/01 à 14h en salle polyvalente.',
      sentAt: '2024-01-08 10:15',
      status: 'pending',
      readRate: 0
    }
  ];

  const parentContacts = [
    {
      id: 1,
      parentName: 'Jean Dubois',
      studentName: 'Marie Dubois',
      class: '3ème A',
      phone: '06 12 34 56 78',
      email: 'jean.dubois@email.com',
      preferredContact: 'sms',
      lastContact: '2024-01-08'
    },
    {
      id: 2,
      parentName: 'Sophie Martin',
      studentName: 'Pierre Martin',
      class: '2nde B',
      phone: '06 98 76 54 32',
      email: 'sophie.martin@email.com',
      preferredContact: 'email',
      lastContact: '2024-01-05'
    },
    {
      id: 3,
      parentName: 'Michel Lambert',
      studentName: 'Sophie Lambert',
      class: '1ère C',
      phone: '06 77 88 99 00',
      email: 'michel.lambert@email.com',
      preferredContact: 'phone',
      lastContact: '2024-01-03'
    }
  ];

  const messageTemplates = [
    {
      id: 1,
      name: 'Absence élève',
      category: 'Absence',
      content: 'Bonjour, nous vous informons que votre enfant {student_name} est absent(e) aujourd\'hui. Merci de nous faire parvenir un justificatif.'
    },
    {
      id: 2,
      name: 'Rappel paiement',
      category: 'Finance',
      content: 'Rappel: Le paiement des frais de scolarité pour {student_name} est en attente. Montant: {amount}€. Merci de régulariser.'
    },
    {
      id: 3,
      name: 'Félicitations',
      category: 'Pédagogie',
      content: 'Félicitations ! {student_name} a obtenu d\'excellents résultats ce trimestre. Moyenne: {average}/20.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sms': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const handleOpenMessageModal = () => {
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = (messageData: any) => {
    console.log('Sending message:', messageData);
    // Ici, vous implémenteriez la logique d'envoi du message
    setIsMessageModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communication & Messagerie</h1>
          <p className="text-gray-600">Communication multi-canaux avec IA intégrée</p>
        </div>
        <button 
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          onClick={handleOpenMessageModal}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau message
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communicationStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Messages récents
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contacts parents
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Templates IA
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'compose'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Composer
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Messages envoyés récemment</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${
                          message.type === 'sms' ? 'bg-green-100 text-green-600' :
                          message.type === 'email' ? 'bg-blue-100 text-blue-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {getTypeIcon(message.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{message.subject}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                              {message.status === 'delivered' ? 'Envoyé' : 
                               message.status === 'pending' ? 'En attente' : 'Échec'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">À: {message.recipient}</p>
                          <p className="text-sm text-gray-700 mb-3">{message.content}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Envoyé le {message.sentAt}</span>
                            {message.status === 'delivered' && (
                              <span>Taux de lecture: {message.readRate}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Annuaire des parents</h3>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter contact
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Préférence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernier contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parentContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{contact.parentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{contact.studentName}</div>
                          <div className="text-sm text-gray-500">{contact.class}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{contact.phone}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            contact.preferredContact === 'sms' ? 'bg-green-100 text-green-800' :
                            contact.preferredContact === 'email' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {contact.preferredContact === 'sms' ? 'SMS' :
                             contact.preferredContact === 'email' ? 'Email' : 'Téléphone'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contact.lastContact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            onClick={handleOpenMessageModal}
                          >
                            Contacter
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Templates de messages IA</h3>
                <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer template
                </button>
              </div>

              <div className="grid gap-4">
                {messageTemplates.map((template) => (
                  <div key={template.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">{template.content}</p>
                        <div className="flex space-x-2">
                          <button 
                            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                            onClick={handleOpenMessageModal}
                          >
                            Utiliser
                          </button>
                          <button className="px-3 py-1 bg-white text-purple-600 border border-purple-300 rounded-lg text-sm hover:bg-purple-50">
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Suggestions */}
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Suggestions IA</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Optimisez vos envois: Les parents lisent plus les SMS entre 17h et 19h</li>
                      <li>• Template recommandé: "Félicitations" pour 12 élèves cette semaine</li>
                      <li>• Traduction automatique disponible en 15 langues</li>
                      <li>• Personnalisation IA: Adaptez le ton selon le profil des parents</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compose' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Composer un nouveau message</h3>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de message
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>SMS</option>
                      <option>Email</option>
                      <option>Notification push</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destinataires
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Tous les parents</option>
                      <option>Parents 3ème A</option>
                      <option>Parents 2nde B</option>
                      <option>Parents 1ère C</option>
                      <option>Sélection personnalisée</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objet
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Objet du message..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={6}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tapez votre message ici..."
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      onClick={handleOpenMessageModal}
                    >
                      <Send className="w-4 h-4 inline mr-2" />
                      Envoyer maintenant
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Programmer
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Aperçu du message</h4>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">À: Tous les parents</div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Objet du message</div>
                    <div className="text-sm text-gray-700">
                      {newMessage || "Votre message apparaîtra ici..."}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Destinataires estimés:</span>
                      <span className="font-medium">1,247 parents</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coût estimé:</span>
                      <span className="font-medium">€12.47</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taux de lecture prévu:</span>
                      <span className="font-medium text-green-600">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default Communication;