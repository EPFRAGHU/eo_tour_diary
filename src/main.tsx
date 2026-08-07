import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AppRoutes } from '@/routes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider defaultTheme="system">
        <AppRoutes />
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>
);
