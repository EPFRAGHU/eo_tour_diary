import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from '@/App';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { AccessDenied } from '@/pages/auth/AccessDenied';
import { NotFound } from '@/pages/NotFound';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SuperAdminRoute } from '@/components/auth/SuperAdminRoute';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Super Admin Direct Protected URL Routes */}
        <Route
          path="/admin"
          element={
            <SuperAdminRoute>
              <App initialTab="users" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <SuperAdminRoute>
              <App initialTab="users" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <SuperAdminRoute>
              <App initialTab="roles" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/permissions"
          element={
            <SuperAdminRoute>
              <App initialTab="roles" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/offices"
          element={
            <SuperAdminRoute>
              <App initialTab="offices" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <SuperAdminRoute>
              <App initialTab="departments" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/districts"
          element={
            <SuperAdminRoute>
              <App initialTab="districts" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <SuperAdminRoute>
              <App initialTab="settings" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <SuperAdminRoute>
              <App initialTab="audit-logs" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/security"
          element={
            <SuperAdminRoute>
              <App initialTab="security" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/backups"
          element={
            <SuperAdminRoute>
              <App initialTab="backups" />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/config"
          element={
            <SuperAdminRoute>
              <App initialTab="config" />
            </SuperAdminRoute>
          }
        />

        {/* Protected Application Shell Route */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

