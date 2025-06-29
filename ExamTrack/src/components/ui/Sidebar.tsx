import React from 'react';
import { useAuthStore } from '../../stores/authStore';
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
  Mail
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
    icon: <FileText className="w-5 h-5" />,
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

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role || '')
  );

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
              <button className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors">
                Créer une École
              </button>
            )}
            {(user?.role === 'school_admin' || user?.role === 'patronat_admin') && (
              <button className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors">
                Nouvel Examen
              </button>
            )}
            {user?.role === 'teacher' && (
              <button className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors">
                Saisir Notes
              </button>
            )}
            {(user?.role === 'patronat_admin' || user?.role === 'school_admin') && (
              <button className="w-full text-left px-3 py-2 text-sm text-primary-color hover:bg-primary-color/5 rounded-lg transition-colors">
                Nouveau Message
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};