import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Layout } from './ui/Layout';
import { LandingPage } from './landing/LandingPage';
import { PatronatLogin } from './auth/PatronatLogin';
import { SchoolLogin } from './auth/SchoolLogin';
import { LoginForm } from './auth/LoginForm';
import { RegistrationWizard } from './registration/RegistrationWizard';
import { PublicResultsSearch } from './results/PublicResultsSearch';
import { SuperAdminDashboard } from './dashboard/SuperAdminDashboard';
import { PatronatDashboard } from './dashboard/PatronatDashboard';
import { SchoolDashboard } from './dashboard/SchoolDashboard';
import { ExamList } from './exams/ExamList';
import { SchoolManagement } from './schools/SchoolManagement';
import { GradeEntry } from './grades/GradeEntry';
import { ResultsConsultation } from './results/ResultsConsultation';
import { UserManagement } from './users/UserManagement';
import { AnalyticsDashboard } from './analytics/AnalyticsDashboard';
import { DigitalLibrary } from './library/DigitalLibrary';
import { ForumDiscussion } from './forum/ForumDiscussion';
import { MessagingCenter } from './messaging/MessagingCenter';
import { Settings } from './settings/Settings';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />;
  } else if (user?.role === 'patronat_admin') {
    return <PatronatDashboard />;
  } else {
    return <SchoolDashboard />;
  }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles 
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user?.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const Router: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
        
        {/* Public Results Search */}
        <Route path="/results-search" element={<PublicResultsSearch />} />
        
        {/* Authentication Routes - Redirect to dashboard if already authenticated */}
        <Route 
          path="/patronat/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <PatronatLogin />} 
        />
        <Route 
          path="/patronat/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegistrationWizard />} 
        />
        <Route 
          path="/school/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SchoolLogin />} 
        />
        
        {/* Unified login route for both patronat and school */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/schools"
          element={
            <ProtectedRoute roles={['super_admin', 'patronat_admin']}>
              <Layout>
                <SchoolManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams"
          element={
            <ProtectedRoute roles={['super_admin', 'patronat_admin', 'school_admin', 'teacher']}>
              <Layout>
                <ExamList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/grades"
          element={
            <ProtectedRoute roles={['school_admin', 'teacher']}>
              <Layout>
                <GradeEntry />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Layout>
                <ResultsConsultation />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messaging"
          element={
            <ProtectedRoute roles={['super_admin', 'patronat_admin', 'school_admin']}>
              <Layout>
                <MessagingCenter />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['super_admin', 'patronat_admin', 'school_admin']}>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute roles={['super_admin', 'patronat_admin', 'school_admin']}>
              <Layout>
                <AnalyticsDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Layout>
                <DigitalLibrary />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute roles={['super_admin', 'patronat_admin', 'school_admin', 'teacher']}>
              <Layout>
                <ForumDiscussion />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={['super_admin', 'patronat_admin', 'school_admin']}>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};