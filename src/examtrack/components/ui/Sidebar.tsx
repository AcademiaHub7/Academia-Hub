import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  GraduationCap, 
  Users, 
  School, 
  BarChart3, 
  FileText, 
  MessageSquare,
  Settings,
  Mail,
  Plus,
  Library,
  HelpCircle
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Tableau de Bord',
    icon: <Home className="w-5 h-5" />,
    path: '/dashboard',
    roles: ['super_admin', 'patronat_admin', 'school_admin', 'teacher'],
  },
  {
    id: 'schools',
    label: 'Gestion des Écoles',
    icon: <School className="w-5 h-5" />,
    path: '/schools',
    roles: ['super_admin', 'patronat_admin'],
  },
  {
    id: 'exams',
    label: 'Gestion des Examens',
    icon: <BookOpen className="w-5 h-5" />,
    path: '/exams',
    roles: ['super_admin', 'patronat_admin', 'school_admin', 'teacher'],
  },
  {
    id: 'grades',
    label: 'Saisie des Notes',
    icon: <GraduationCap className="w-5 h-5" />,
    path: '/grades',
    roles: ['school_admin', 'teacher'],
  },
  {
    id: 'results',
    label: 'Résultats',
    icon: <FileText className="w-5 h-5" />,
    path: '/results',
    roles: ['super_admin', 'patronat_admin', 'school_admin', 'teacher', 'student', 'parent'],
  },
  {
    id: 'messaging',
    label: 'Messagerie',
    icon: <Mail className="w-5 h-5" />,
    path: '/messaging',
    roles: ['super_admin', 'patronat_admin', 'school_admin'],
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: <Users className="w-5 h-5" />,
    path: '/users',
    roles: ['super_admin', 'patronat_admin', 'school_admin'],
  },
  {
    id: 'analytics',
    label: 'Analyses & Rapports',
    icon: <BarChart3 className="w-5 h-5" />,
    path: '/analytics',
    roles: ['super_admin', 'patronat_admin', 'school_admin'],
  },
  {
    id: 'library',
    label: 'Bibliothèque',
    icon: <Library className="w-5 h-5" />,
    path: '/library',
    roles: ['super_admin', 'patronat_admin', 'school_admin', 'teacher', 'student'],
  },
  {
    id: 'forum',
    label: 'Forum',
    icon: <MessageSquare className="w-5 h-5" />,
    path: '/forum',
    roles: ['super_admin', 'patronat_admin', 'school_admin', 'teacher'],
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: <Settings className="w-5 h-5" />,
    path: '/settings',
    roles: ['super_admin', 'patronat_admin', 'school_admin'],
  },
];

export const Sidebar: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const navigate = useNavigate();
  const [showCreateSchoolModal, setShowCreateSchoolModal] = useState(false);

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role || '')
  );

  const handleCreateSchool = () => {
    setShowCreateSchoolModal(true);
  };

  const handleCreateExam = () => {
    navigate('/exams?action=create');
  };

  const handleGradeEntry = () => {
    navigate('/grades');
  };

  const handleNewMessage = () => {
    navigate('/messaging?action=compose');
  };

  const handleViewLibrary = () => {
    navigate('/library');
  };

  const handleViewForum = () => {
    navigate('/forum');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  const handleViewHelp = () => {
    window.open('mailto:support@educmaster-hub.com', '_blank');
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {/* Tenant Info Card */}
        <div className="bg-primary-color/5 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-primary-color text-sm mb-1">
            {tenant?.type === 'patronat' ? 'Patronat Régional' : 'École Privée'}
          </h3>
          <p className="text-sm text-gray-600 truncate">{tenant?.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            Année Scolaire: {tenant?.settings.academicYear}
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-color text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Actions Rapides
          </h4>
          <div className="space-y-2">
            {user?.role === 'patronat_admin' && (
              <button 
                onClick={handleCreateSchool}
                className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Créer une École</span>
              </button>
            )}
            {(user?.role === 'school_admin' || user?.role === 'patronat_admin') && (
              <button 
                onClick={handleCreateExam}
                className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel Examen</span>
              </button>
            )}
            {user?.role === 'teacher' && (
              <button 
                onClick={handleGradeEntry}
                className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors flex items-center space-x-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Saisir Notes</span>
              </button>
            )}
            {(user?.role === 'patronat_admin' || user?.role === 'school_admin') && (
              <button 
                onClick={handleNewMessage}
                className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Nouveau Message</span>
              </button>
            )}
            <button 
              onClick={handleViewLibrary}
              className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Library className="w-4 h-4" />
              <span>Bibliothèque</span>
            </button>
            <button 
              onClick={handleViewForum}
              className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Forum</span>
            </button>
            <button 
              onClick={handleViewAnalytics}
              className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button 
            onClick={handleViewHelp}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Aide & Support</span>
          </button>
        </div>
      </div>

      {/* Create School Modal */}
      {showCreateSchoolModal && (
        <CreateSchoolModal onClose={() => setShowCreateSchoolModal(false)} />
      )}
    </aside>
  );
};

// Modal pour créer une école
const CreateSchoolModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    directorName: '',
    studentCapacity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler la création d'école
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Création école:', formData);
    alert('École créée avec succès !');
    setIsSubmitting(false);
    onClose();
  };

  const generateSchoolCode = () => {
    const name = formData.name.toUpperCase();
    const words = name.split(' ');
    let code = '';
    
    if (words.length >= 2) {
      code = words[0].substring(0, 2) + words[1].substring(0, 2);
    } else {
      code = name.substring(0, 4);
    }
    
    code += Math.floor(Math.random() * 100).toString().padStart(2, '0');
    setFormData({...formData, code});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Nouvelle École</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'école *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              placeholder="Ex: École Sainte Marie"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code école *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                placeholder="Ex: ESM001"
              />
              <button
                type="button"
                onClick={generateSchoolCode}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Générer
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Directeur *
            </label>
            <input
              type="text"
              required
              value={formData.directorName}
              onChange={(e) => setFormData({...formData, directorName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              placeholder="Nom du directeur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              placeholder="Adresse complète"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                placeholder="+229 XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                placeholder="contact@ecole.edu.bj"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacité d'élèves *
            </label>
            <input
              type="number"
              required
              min="50"
              max="5000"
              value={formData.studentCapacity}
              onChange={(e) => setFormData({...formData, studentCapacity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              placeholder="Ex: 800"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>{isSubmitting ? 'Création...' : 'Créer l\'École'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};