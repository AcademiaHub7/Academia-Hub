import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X,
  Home,
  Users,
  Calculator,
  BookOpen,
  MessageSquare,
  Settings,
  GraduationCap,
  BarChart3,
  Calendar,
  FileText,
  Library,
  FlaskConical,
  Bus,
  UtensilsCrossed,
  Heart,
  UserCheck,
  Building,
  DollarSign,
  Shield,
  Video,
  ShoppingBag
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { theme } = useTheme();

  const menuItems = [
    { icon: Home, label: 'Tableau de bord', path: '/dashboard' },
    { icon: Calculator, label: 'Économat & Finance', path: '/dashboard/finance' },
    { icon: DollarSign, label: 'Gestion de la Paie', path: '/dashboard/payroll' },
    { icon: Users, label: 'Scolarité & Élèves', path: '/dashboard/students' },
    { icon: Building, label: 'Études & Planification', path: '/dashboard/planning' },
    { icon: BookOpen, label: 'Examens & Évaluation', path: '/dashboard/examinations' },
    { icon: BarChart3, label: 'Statistiques & Analytics', path: '/dashboard/analytics' },
    { icon: MessageSquare, label: 'Communication', path: '/dashboard/communication' },
    { icon: Library, label: 'Bibliothèque', path: '/dashboard/library' },
    { icon: FlaskConical, label: 'Laboratoire', path: '/dashboard/laboratory' },
    { icon: Bus, label: 'Transport', path: '/dashboard/transport' },
    { icon: UtensilsCrossed, label: 'Cantine', path: '/dashboard/cafeteria' },
    { icon: Heart, label: 'Infirmerie', path: '/dashboard/health' },
    { icon: UserCheck, label: 'Personnel & RH', path: '/dashboard/hr' },
    { icon: Shield, label: 'QHSE', path: '/dashboard/qhse' },
    { icon: Video, label: 'EduCast IA', path: '/dashboard/educast' },
    { icon: ShoppingBag, label: 'Boutique', path: '/dashboard/boutique' },
    { icon: Settings, label: 'Paramètres', path: '/dashboard/settings' }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-lg blur-sm opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <GraduationCap className="relative w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Academia Hub
              </span>
            </Link>
            
            <button 
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* School Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">École Exemple</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Plan Professional</p>
            <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full w-3/4"></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">375/500 élèves</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 text-sm
                    ${active 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 ${active ? 'text-white' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>Academia Hub v2.1.0</p>
              <p>© 2024 - Tous droits réservés</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;