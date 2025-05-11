// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import { ShipProvider } from './contexts/ShipContext';
import { ComponentsProvider } from './contexts/ComponentsContext';
import { InspectionProvider } from './contexts/InspectionContext'; // Import the InspectionContext
import { EngineerProvider } from './contexts/EngineerContext'; // Import the EngineerContext

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin-dashboard/AdminDashboard';
import InspectorDashboard from './pages/inspector-dashboard/InspectorDashboard';
import EngineerDashboard from './pages/engineer-dashboard/EngineerDashboard';

import JobCalendar from './components/Calendar/JobCalendar';
import ShipCalendarView from './components/Calendar/ShipCalendarView';
import ComponentCalendarView from './components/Calendar/ComponentCalendarView';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<div>Unauthorized</div>} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={['Admin', 'Inspector', 'Engineer']}>
            {user?.role === 'Admin' ? (
              <AdminDashboard />
            ) : user?.role === 'Inspector' ? (
              <InspectorDashboard />
            ) : (
              <EngineerDashboard />
            )}
          </ProtectedRoute>
        }
      />

      {/* Optional: Direct calendar access routes */}
      <Route
        path="/calendar"
        element={
          <ProtectedRoute roles={['Admin', 'Inspector', 'Engineer']}>
            <JobCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ship-calendar"
        element={
          <ProtectedRoute roles={['Admin', 'Inspector', 'Engineer']}>
            <ShipCalendarView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/component-calendar"
        element={
          <ProtectedRoute roles={['Admin', 'Inspector', 'Engineer']}>
            <ComponentCalendarView />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <ShipProvider>
          <ComponentsProvider>
            <InspectionProvider> {/* Wrap the app with InspectionProvider */}
              <EngineerProvider> {/* Wrap the app with EngineerProvider */}
                <Router>
                  <AppRoutes />
                </Router>
              </EngineerProvider>
            </InspectionProvider>
          </ComponentsProvider>
        </ShipProvider>
      </JobProvider>
    </AuthProvider>
  );
}

export default App;
