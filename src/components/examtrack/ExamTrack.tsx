import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, FileText, BarChart2, 
  Users, Settings as SettingsIcon, Menu, X, ChevronRight, GraduationCap 
} from 'lucide-react';

// Import des composants
import Dashboard from './components/Dashboard';
import ExamManagement from './components/ExamManagement';
import GradeManagement from './components/GradeManagement';
import DocumentManagement from './components/DocumentManagement';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

const ExamTrack: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname.includes(path);
  };

  const navItems = [
    { name: 'Tableau de bord', path: '/examtrack', icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
    { name: 'Examens', path: '/examtrack/exams', icon: <GraduationCap className="h-5 w-5 mr-3" /> },
    { name: 'Notes', path: '/examtrack/grades', icon: <BookOpen className="h-5 w-5 mr-3" /> },
    { name: 'Documents', path: '/examtrack/documents', icon: <FileText className="h-5 w-5 mr-3" /> },
    { name: 'Analytiques', path: '/examtrack/analytics', icon: <BarChart2 className="h-5 w-5 mr-3" /> },
    { name: 'Utilisateurs', path: '/examtrack/users', icon: <Users className="h-5 w-5 mr-3" /> },
    { name: 'Paramètres', path: '/examtrack/settings', icon: <SettingsIcon className="h-5 w-5 mr-3" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-lg md:relative md:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">ExamTrack</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label="Fermer le menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-md ${
                isActivePath(item.path)
                  ? 'text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {item.icon}
              {item.name}
              {isActivePath(item.path) && <ChevronRight className="h-4 w-4 ml-auto" />}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex justify-end">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative">
                  <button 
                    className="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm font-medium"
                    aria-label="Accéder à mon profil"
                  >
                    Mon Profil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/exams" element={<ExamManagement />} />
              <Route path="/grades" element={<GradeManagement />} />
              <Route path="/documents" element={<DocumentManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/users" element={
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-lg font-medium">Gestion des Utilisateurs</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Ce module est en cours de développement.</p>
                </div>
              } />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/examtrack" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamTrack;
