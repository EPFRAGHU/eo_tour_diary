import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from '@/App';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { AccessDenied } from '@/pages/auth/AccessDenied';
import { NotFound } from '@/pages/NotFound';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Protected Application Shell Route */}
        <Route
          path="/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'APFC', 'EO', 'EO_AO', 'VIEWER']}>
              <App />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
