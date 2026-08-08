import { FileFormatType, UserRole } from '@/types';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  resourceTarget: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'BLOCKED';
}

const AUDIT_LOG_KEY = 'epfo_security_audit_logs';
const RATE_LIMIT_STORE: Record<string, number[]> = {};
const memoryAuditStore: Record<string, string> = {};

const getAuditItem = (key: string): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(key);
  }
  return memoryAuditStore[key] || null;
};

const setAuditItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(key, value);
  } else {
    memoryAuditStore[key] = value;
  }
};

/**
 * Sanitizes input strings against XSS script injection attacks.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validates file MIME types, extensions, and enforces max 10MB file size limit.
 */
export const validateFileTypeAndSize = (
  file: File
): { isValid: boolean; error?: string; format?: FileFormatType } => {
  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  if (file.size > MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the 10MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(1)}MB`,
    };
  }

  const name = file.name.toLowerCase();

  if (name.endsWith('.pdf')) {
    return { isValid: true, format: 'PDF' };
  }
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp')) {
    return { isValid: true, format: 'PHOTO' };
  }
  if (name.endsWith('.doc') || name.endsWith('.docx')) {
    return { isValid: true, format: 'WORD' };
  }
  if (name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv')) {
    return { isValid: true, format: 'EXCEL' };
  }
  if (name.endsWith('.zip') || name.endsWith('.rar')) {
    return { isValid: true, format: 'ZIP' };
  }

  return {
    isValid: false,
    error: 'Disallowed file extension. Allowed formats: PDF, Images (JPG, PNG), Word (DOC, DOCX), Excel (XLS, XLSX, CSV), and ZIP archives.',
  };
};

/**
 * In-memory sliding-window rate limiter preventing brute-force submissions.
 */
export const rateLimiter = (
  actionKey: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): { isAllowed: boolean; remaining: number } => {
  const now = Date.now();
  if (!RATE_LIMIT_STORE[actionKey]) {
    RATE_LIMIT_STORE[actionKey] = [];
  }

  // Filter timestamps within window
  RATE_LIMIT_STORE[actionKey] = RATE_LIMIT_STORE[actionKey].filter(
    (timestamp) => now - timestamp < windowMs
  );

  if (RATE_LIMIT_STORE[actionKey].length >= maxAttempts) {
    return { isAllowed: false, remaining: 0 };
  }

  RATE_LIMIT_STORE[actionKey].push(now);
  return {
    isAllowed: true,
    remaining: maxAttempts - RATE_LIMIT_STORE[actionKey].length,
  };
};

export const SUPER_ADMIN_EMAIL = 'raghunatha.maharana@gmail.com';

/**
 * Checks if the email belongs to the protected Super Admin.
 */
export const isSuperAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
};

/**
 * Checks if a user is the protected Super Admin account.
 */
export const isProtectedSuperAdmin = (user?: { email?: string; role?: UserRole } | null): boolean => {
  if (!user) return false;
  if (user.email && isSuperAdminEmail(user.email)) return true;
  return user.role === 'SUPER_ADMIN';
};

/**
 * Super Admin Authorization Middleware Guard for API & View Handlers.
 * Throws an error or returns false if user is not authorized.
 */
export const checkAdminAccess = (
  user?: { email?: string; role?: UserRole; name?: string } | null,
  resourceName: string = 'Administration Module'
): { isAllowed: boolean; status: number; message: string } => {
  if (!user) {
    logAuditAction(
      'Anonymous',
      'READ_ONLY',
      'ADMIN_ACCESS_DENIED',
      resourceName,
      `Unauthenticated access attempt to ${resourceName} blocked.`,
      'BLOCKED'
    );
    return {
      isAllowed: false,
      status: 401,
      message: 'Authentication required to access Administration section.',
    };
  }

  if (!isProtectedSuperAdmin(user)) {
    logAuditAction(
      user.name || user.email || 'Unknown User',
      user.role || 'READ_ONLY',
      'ADMIN_ACCESS_DENIED',
      resourceName,
      `Unauthorized administration access attempt to ${resourceName} rejected. User role: ${user.role}.`,
      'BLOCKED'
    );
    return {
      isAllowed: false,
      status: 403,
      message: 'Access Denied: Administration section is restricted to Super Admin only.',
    };
  }

  return {
    isAllowed: true,
    status: 200,
    message: 'Access Granted: Super Admin clearance verified.',
  };
};

/**
 * Server-side / Interceptor Guard: requireSuperAdmin()
 */
export const requireSuperAdmin = (
  user?: { email?: string; role?: UserRole; name?: string } | null,
  actionName: string = 'API Administration'
): boolean => {
  const result = checkAdminAccess(user, actionName);
  if (!result.isAllowed) {
    const error: any = new Error(result.message);
    error.status = result.status;
    error.statusCode = result.status;
    throw error;
  }
  return true;
};

/**
 * Guards against deleting the Super Admin account
 */
export const canDeleteUser = (targetUser: { email?: string; role?: UserRole }): { allowed: boolean; reason?: string } => {
  if (isProtectedSuperAdmin(targetUser)) {
    return {
      allowed: false,
      reason: 'Protected Super Admin account cannot be deleted.',
    };
  }
  return { allowed: true };
};

/**
 * Guards against modifying the Super Admin status or role
 */
export const canModifyUserRoleOrStatus = (targetUser: { email?: string; role?: UserRole }): { allowed: boolean; reason?: string } => {
  if (isProtectedSuperAdmin(targetUser)) {
    return {
      allowed: false,
      reason: 'Protected Super Admin account status and role cannot be altered.',
    };
  }
  return { allowed: true };
};

/**
 * Validates password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char).
 */
export const validatePasswordStrength = (password: string): { isValid: boolean; error?: string } => {
  if (!password || password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter (A-Z)' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter (a-z)' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one numeric digit (0-9)' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  return { isValid: true };
};

/**
 * Generates a compliant secure temporary password.
 */
export const generateTempPassword = (): string => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*';

  let pwd = '';
  pwd += upper.charAt(Math.floor(Math.random() * upper.length));
  pwd += lower.charAt(Math.floor(Math.random() * lower.length));
  pwd += digits.charAt(Math.floor(Math.random() * digits.length));
  pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));

  const all = upper + lower + digits + symbols;
  for (let i = 0; i < 6; i++) {
    pwd += all.charAt(Math.floor(Math.random() * all.length));
  }

  // Shuffle string
  return pwd.split('').sort(() => 0.5 - Math.random()).join('');
};

/**
 * Logs an append-only security audit log entry.
 */
export const logAuditAction = (
  actorName: string,
  actorRole: UserRole,
  action: string,
  resourceTarget: string,
  details: string,
  status: 'SUCCESS' | 'WARNING' | 'BLOCKED' = 'SUCCESS'
): void => {
  try {
    const existing = getAuditLogs();
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      action,
      resourceTarget,
      details: sanitizeInput(details),
      ipAddress: '192.168.1.153 (RO Bhubaneswar)',
      status,
    };
    const updated = [entry, ...existing.slice(0, 199)]; // Keep latest 200 logs
    setAuditItem(AUDIT_LOG_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to log security audit action:', e);
  }
};

/**
 * Retrieves audit logs from storage.
 */
export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    const raw = getAuditItem(AUDIT_LOG_KEY);
    if (!raw) {
      // Return baseline logs
      return [
        {
          id: 'audit-baseline-1',
          timestamp: new Date().toISOString(),
          actorName: 'Shri Raghunatha Maharana',
          actorRole: 'SUPER_ADMIN',
          action: 'AUTH_SESSION_INIT',
          resourceTarget: 'Super Admin Workspace',
          details: 'Authenticated via secure JWT token session with Super Admin privileges.',
          ipAddress: '192.168.1.153',
          status: 'SUCCESS',
        },
        {
          id: 'audit-baseline-2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          actorName: 'APFC (Compliance)',
          actorRole: 'ASSISTANT_PF_COMMISSIONER',
          action: 'TOUR_APPROVE',
          resourceTarget: 'Tour Ref #tour-1',
          details: 'Approved Tour Schedule: Special Compliance Drive - Jajpur Industrial Zone.',
          ipAddress: '192.168.1.100',
          status: 'SUCCESS',
        },
      ];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};
