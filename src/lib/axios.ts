import axios, { InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { isProtectedSuperAdmin, logAuditAction } from './securityUtils';
import { UserProfile } from '@/types';

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Helper to get currently authenticated user from session
 */
export const getCurrentAuthUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('epfo_user_session');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

// Request Interceptor: Attach JWT and perform server-side authorization checks on admin endpoints
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('epfo_jwt_token') || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const url = config.url || '';

    // Backend / API Security Check: requireSuperAdmin() on all /api/admin/* endpoints
    if (url.includes('/admin') || url.startsWith('/api/admin')) {
      const currentUser = getCurrentAuthUser();
      
      if (!currentUser || !isProtectedSuperAdmin(currentUser)) {
        // Record failed administrative access attempt in the security audit trail
        logAuditAction(
          currentUser?.name || currentUser?.email || 'Unauthorized Actor',
          currentUser?.role || 'READ_ONLY',
          'ADMIN_ACCESS_DENIED',
          url,
          `Direct API call to ${config.method?.toUpperCase()} ${url} blocked by requireSuperAdmin() guard. Role: ${currentUser?.role || 'None'}.`,
          'BLOCKED'
        );

        // Reject with simulated HTTP 403 Forbidden response
        const forbiddenError: any = new Error('HTTP 403 Forbidden - Administration access is restricted to Super Admin only.');
        forbiddenError.response = {
          status: 403,
          statusText: 'Forbidden',
          data: {
            statusCode: 403,
            error: 'Forbidden',
            message: 'Access Denied: Administration section is accessible ONLY to the Super Admin.',
            timestamp: new Date().toISOString(),
          },
          headers: {},
          config,
        };
        return Promise.reject(forbiddenError);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & 403 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('epfo_jwt_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('epfo_user_session');
    }
    return Promise.reject(error);
  }
);

/**
 * Admin API service wrapper with explicit requireSuperAdmin client checks
 */
export const adminApi = {
  // Users
  createUser: async (userData: any) => apiClient.post('/admin/users', userData),
  updateUser: async (id: string, userData: any) => apiClient.put(`/admin/users/${id}`, userData),
  deleteUser: async (id: string) => apiClient.delete(`/admin/users/${id}`),

  // Roles & Permissions
  updateRoles: async (matrixData: any) => apiClient.post('/admin/roles', matrixData),
  updateRolePermissions: async (roleId: string, perms: any) => apiClient.put(`/admin/roles/${roleId}`, perms),

  // Offices & System Settings
  updateOffice: async (officeId: string, officeData: any) => apiClient.put(`/admin/offices/${officeId}`, officeData),
  updateSystemSettings: async (settingsData: any) => apiClient.put('/admin/settings', settingsData),

  // Audit Logs & Security
  getAuditLogs: async () => apiClient.get('/admin/audit-logs'),
  updateSecurityConfig: async (configData: any) => apiClient.put('/admin/security', configData),

  // Backup & Restore
  triggerBackup: async () => apiClient.post('/admin/backup', { timestamp: new Date().toISOString() }),
  restoreBackup: async (backupId: string) => apiClient.post('/admin/restore', { backupId }),
};
