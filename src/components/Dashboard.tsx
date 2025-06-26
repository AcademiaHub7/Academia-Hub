import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';
import Overview from './dashboard/Overview';
import Students from './dashboard/Students';
import Finance from './dashboard/Finance';
import Planning from './dashboard/Planning';
import Examinations from './dashboard/Examinations';
import Communication from './dashboard/Communication';
import Settings from './dashboard/Settings';
import Analytics from './dashboard/Analytics';
import Library from './dashboard/Library';
import Laboratory from './dashboard/Laboratory';
import Transport from './dashboard/Transport';
import Cafeteria from './dashboard/Cafeteria';
import Health from './dashboard/Health';
import HR from './dashboard/HR';
import PayrollManagement from './dashboard/PayrollManagement';
import QHSE from './dashboard/QHSE';
import EduCast from './dashboard/EduCast';
import Boutique from './dashboard/Boutique';

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
            <Route path="/qhse" element={<QHSE />} />
            <Route path="/educast" element={<EduCast />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;