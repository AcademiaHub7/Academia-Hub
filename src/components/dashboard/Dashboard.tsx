import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Overview from './Overview';
import Students from './Students';
import Finance from './Finance';
import Planning from './Planning';
import Examinations from './Examinations';
import Communication from './Communication';
import Settings from './Settings';
import Analytics from './Analytics';
import Library from './Library';
import Laboratory from './Laboratory';
import Transport from './Transport';
import Cafeteria from './Cafeteria';
import Health from './Health';
import HR from './HR';
import PayrollManagement from './PayrollManagement';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/students" element={<Students />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/payroll" element={<PayrollManagement />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/examinations" element={<Examinations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/library" element={<Library />} />
            <Route path="/laboratory" element={<Laboratory />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/cafeteria" element={<Cafeteria />} />
            <Route path="/health" element={<Health />} />
            <Route path="/hr" element={<HR />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;