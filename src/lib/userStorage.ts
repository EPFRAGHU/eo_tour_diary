import { ExtendedUserProfile, UserRole, UserStatus, RolePermissionsMap, PermissionModule, PermissionAction, UserActivityLogItem, UserSessionItem } from '@/types';
import { SUPER_ADMIN_EMAIL } from './securityUtils';
import { getDefaultOfficeName } from './officeConfig';

const USERS_STORAGE_KEY = 'epfo_user_management_list';
const RBAC_STORAGE_KEY = 'epfo_user_rbac_permissions';
const SESSIONS_STORAGE_KEY = 'epfo_user_sessions_list';
const AUDIT_LOGS_STORAGE_KEY = 'epfo_user_activity_logs';

export const DEFAULT_SUPER_ADMIN: ExtendedUserProfile = {
  id: 'usr-super-admin-1',
  employeeId: 'EMP-9001',
  epfoEmpNumber: 'EPFO/HQ/SUPER/001',
  name: 'Shri Raghunatha Maharana',
  username: 'raghunatha.admin',
  email: SUPER_ADMIN_EMAIL,
  officialEmail: SUPER_ADMIN_EMAIL,
  personalEmail: 'raghunatha.maharana@gmail.com',
  designation: 'Super Administrator / Additional Central PF Commissioner',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
  office: getDefaultOfficeName(),
  region: 'Odisha Zone',
  district: 'Cuttack',
  officeRegion: getDefaultOfficeName(),
  pfStaffId: 'PF-CTC-001',
  mobile: '+91 94370 12345',
  altMobile: '+91 98610 98765',
  gender: 'Male',
  dob: '1978-05-14',
  joiningDate: '2004-07-15',
  reportingOfficer: 'Central PF Commissioner',
  isMfaEnabled: true,
  failedLoginCount: 0,
  lastLogin: new Date().toISOString(),
  createdDate: '2024-01-01',
  createdBy: 'SYSTEM_BOOTSTRAP',
  notes: 'Primary Super Admin account. Immutable system permissions.',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
};

export const DEFAULT_USERS: ExtendedUserProfile[] = [
  DEFAULT_SUPER_ADMIN,
  {
    id: 'usr-apfc-2',
    employeeId: 'EMP-4082',
    epfoEmpNumber: 'EPFO/BBS/APFC/4082',
    name: 'Smt. Ananya Patnaik',
    username: 'apatnaik.apfc',
    email: 'ananya.patnaik@epfindia.gov.in',
    officialEmail: 'ananya.patnaik@epfindia.gov.in',
    personalEmail: 'ananya.patnaik@gmail.com',
    designation: 'Assistant Provident Fund Commissioner (APFC)',
    role: 'ASSISTANT_PF_COMMISSIONER',
    status: 'ACTIVE',
    office: 'Regional Office Bhubaneswar',
    region: 'Odisha Zone',
    district: 'Khurda',
    officeRegion: 'RO Bhubaneswar',
    pfStaffId: 'PF-BBS-042',
    mobile: '+91 98611 22334',
    gender: 'Female',
    dob: '1985-09-20',
    joiningDate: '2012-03-10',
    reportingOfficer: 'Shri Raghunatha Maharana',
    isMfaEnabled: false,
    failedLoginCount: 0,
    lastLogin: '2026-08-07T18:30:00Z',
    createdDate: '2025-02-10',
    createdBy: SUPER_ADMIN_EMAIL,
    notes: 'In-charge of Field Compliance & Audit Approval.',
  },
  {
    id: 'usr-eo-3',
    employeeId: 'EMP-6120',
    epfoEmpNumber: 'EPFO/CTC/EO/6120',
    name: 'Shri Soumya Ranjan Das',
    username: 'srdas.eo',
    email: 'soumya.das@epfindia.gov.in',
    officialEmail: 'soumya.das@epfindia.gov.in',
    personalEmail: 'soumya.das@yahoo.com',
    designation: 'Enforcement Officer (EO/AO)',
    role: 'ENFORCEMENT_OFFICER',
    status: 'ACTIVE',
    office: 'District Office Cuttack',
    region: 'Odisha Zone',
    district: 'Cuttack',
    officeRegion: 'DO Cuttack',
    pfStaffId: 'PF-CTC-108',
    mobile: '+91 94371 88990',
    gender: 'Male',
    dob: '1990-11-05',
    joiningDate: '2018-08-01',
    reportingOfficer: 'Smt. Ananya Patnaik',
    isMfaEnabled: false,
    failedLoginCount: 0,
    lastLogin: '2026-08-07T14:15:00Z',
    createdDate: '2025-04-12',
    createdBy: SUPER_ADMIN_EMAIL,
    notes: 'Handles Steel & Mining Establishments in Jajpur & Cuttack.',
  },
  {
    id: 'usr-auditor-4',
    employeeId: 'EMP-7890',
    epfoEmpNumber: 'EPFO/HQ/AUD/7890',
    name: 'Sri Rajesh Kumar Panda',
    username: 'rkpanda.audit',
    email: 'rajesh.panda@cag.gov.in',
    officialEmail: 'rajesh.panda@cag.gov.in',
    personalEmail: 'rkpanda@gmail.com',
    designation: 'Senior Auditor (C&AG Observer)',
    role: 'AUDITOR',
    status: 'ACTIVE',
    office: 'Regional Office Bhubaneswar',
    region: 'Odisha Zone',
    district: 'Khurda',
    officeRegion: 'RO Bhubaneswar',
    pfStaffId: 'CAG-EPF-990',
    mobile: '+91 97760 55443',
    gender: 'Male',
    dob: '1982-03-12',
    joiningDate: '2020-01-15',
    reportingOfficer: 'Shri Raghunatha Maharana',
    isMfaEnabled: true,
    failedLoginCount: 0,
    lastLogin: '2026-08-06T11:00:00Z',
    createdDate: '2025-06-01',
    createdBy: SUPER_ADMIN_EMAIL,
    notes: 'Read-only access for annual field audit compliance review.',
  },
  {
    id: 'usr-deo-5',
    employeeId: 'EMP-3310',
    epfoEmpNumber: 'EPFO/CTC/DEO/3310',
    name: 'Shri Biswajit Mohanty',
    username: 'bmohanty.deo',
    email: 'deo.cuttack@epfindia.gov.in',
    officialEmail: 'deo.cuttack@epfindia.gov.in',
    personalEmail: 'biswajit.deo@gmail.com',
    designation: 'Data Entry Operator (DEO Gr. B)',
    role: 'DATA_ENTRY_OPERATOR',
    status: 'ACTIVE',
    office: 'District Office Cuttack',
    region: 'Odisha Zone',
    district: 'Cuttack',
    officeRegion: 'DO Cuttack',
    pfStaffId: 'DEO-CTC-22',
    mobile: '+91 94372 33445',
    gender: 'Male',
    dob: '1995-04-18',
    joiningDate: '2021-11-01',
    reportingOfficer: 'Shri Soumya Ranjan Das',
    isMfaEnabled: false,
    failedLoginCount: 0,
    lastLogin: '2026-08-07T09:30:00Z',
    createdDate: '2025-07-15',
    createdBy: SUPER_ADMIN_EMAIL,
    notes: 'Performs establishment data entry and inspection document uploads.',
  },
  {
    id: 'usr-viewer-6',
    employeeId: 'EMP-1109',
    epfoEmpNumber: 'EPFO/HQ/VIEW/1109',
    name: 'Smt. Madhusmita Jena',
    username: 'mjena.viewer',
    email: 'viewer.field@epfindia.gov.in',
    officialEmail: 'viewer.field@epfindia.gov.in',
    personalEmail: 'mjena.view@gmail.com',
    designation: 'Field Inspection Observer / Read Only User',
    role: 'READ_ONLY',
    status: 'ACTIVE',
    office: 'Regional Office Bhubaneswar',
    region: 'Odisha Zone',
    district: 'Khurda',
    officeRegion: 'RO Bhubaneswar',
    pfStaffId: 'VIEW-HQ-88',
    mobile: '+91 98613 44556',
    gender: 'Female',
    dob: '1992-07-25',
    joiningDate: '2022-04-10',
    reportingOfficer: 'Smt. Ananya Patnaik',
    isMfaEnabled: false,
    failedLoginCount: 0,
    lastLogin: '2026-08-05T16:00:00Z',
    createdDate: '2025-08-01',
    createdBy: SUPER_ADMIN_EMAIL,
    notes: 'Read-only observer role for tour reports and compliance status.',
  },
];

export const ALL_PERMISSION_MODULES: PermissionModule[] = [
  'Dashboard',
  'Tour Diary',
  'Establishments',
  'Documents',
  'Reports',
  'Analytics',
  'User Management',
  'Audit Logs',
  'Settings',
];

export const ALL_PERMISSION_ACTIONS: PermissionAction[] = [
  'View',
  'Create',
  'Edit',
  'Delete',
  'Approve',
  'Export',
  'Upload',
  'Download',
  'Print',
  'Assign',
  'Configure',
];

export const DEFAULT_RBAC_MATRIX: RolePermissionsMap = {
  SUPER_ADMIN: ALL_PERMISSION_MODULES.reduce((acc, mod) => {
    acc[mod] = [...ALL_PERMISSION_ACTIONS];
    return acc;
  }, {} as Record<PermissionModule, PermissionAction[]>),

  REGIONAL_PF_COMMISSIONER: {
    Dashboard: ['View', 'Export', 'Print'],
    'Tour Diary': ['View', 'Approve', 'Export', 'Print'],
    Establishments: ['View', 'Export'],
    Documents: ['View', 'Download', 'Export'],
    Reports: ['View', 'Export', 'Print'],
    Analytics: ['View', 'Export'],
    'User Management': ['View', 'Assign'],
    'Audit Logs': ['View', 'Export'],
    Settings: ['View'],
  },

  ADDITIONAL_CENTRAL_PF_COMMISSIONER: {
    Dashboard: ['View', 'Export', 'Print'],
    'Tour Diary': ['View', 'Approve', 'Export', 'Print'],
    Establishments: ['View', 'Export'],
    Documents: ['View', 'Download', 'Export'],
    Reports: ['View', 'Export', 'Print'],
    Analytics: ['View', 'Export'],
    'User Management': ['View', 'Assign'],
    'Audit Logs': ['View', 'Export'],
    Settings: ['View'],
  },

  ASSISTANT_PF_COMMISSIONER: {
    Dashboard: ['View', 'Export', 'Print'],
    'Tour Diary': ['View', 'Create', 'Edit', 'Approve', 'Export', 'Print'],
    Establishments: ['View', 'Create', 'Edit', 'Export'],
    Documents: ['View', 'Upload', 'Download', 'Export'],
    Reports: ['View', 'Export', 'Print'],
    Analytics: ['View', 'Export'],
    'User Management': ['View'],
    'Audit Logs': ['View'],
    Settings: ['View'],
  },

  ENFORCEMENT_OFFICER: {
    Dashboard: ['View', 'Export', 'Print'],
    'Tour Diary': ['View', 'Create', 'Edit', 'Export', 'Print', 'Upload'],
    Establishments: ['View', 'Create', 'Edit', 'Export'],
    Documents: ['View', 'Upload', 'Download', 'Export'],
    Reports: ['View', 'Export', 'Print'],
    Analytics: ['View', 'Export'],
    'User Management': [],
    'Audit Logs': [],
    Settings: ['View'],
  },

  ACCOUNTS_OFFICER: {
    Dashboard: ['View', 'Export', 'Print'],
    'Tour Diary': ['View', 'Export', 'Print'],
    Establishments: ['View', 'Export'],
    Documents: ['View', 'Upload', 'Download', 'Export'],
    Reports: ['View', 'Export', 'Print'],
    Analytics: ['View', 'Export'],
    'User Management': [],
    'Audit Logs': [],
    Settings: ['View'],
  },

  SECTION_SUPERVISOR: {
    Dashboard: ['View'],
    'Tour Diary': ['View', 'Create', 'Edit'],
    Establishments: ['View', 'Create', 'Edit'],
    Documents: ['View', 'Upload', 'Download'],
    Reports: ['View', 'Export'],
    Analytics: ['View'],
    'User Management': [],
    'Audit Logs': [],
    Settings: ['View'],
  },

  DATA_ENTRY_OPERATOR: {
    Dashboard: ['View'],
    'Tour Diary': ['View', 'Create', 'Edit'],
    Establishments: ['View', 'Create', 'Edit'],
    Documents: ['View', 'Upload'],
    Reports: ['View'],
    Analytics: [],
    'User Management': [],
    'Audit Logs': [],
    Settings: [],
  },

  READ_ONLY: {
    Dashboard: ['View'],
    'Tour Diary': ['View', 'Print'],
    Establishments: ['View'],
    Documents: ['View', 'Download'],
    Reports: ['View', 'Print'],
    Analytics: ['View'],
    'User Management': [],
    'Audit Logs': [],
    Settings: [],
  },

  AUDITOR: {
    Dashboard: ['View', 'Export', 'Print'],
    'Tour Diary': ['View', 'Export', 'Print'],
    Establishments: ['View', 'Export'],
    Documents: ['View', 'Download', 'Export'],
    Reports: ['View', 'Export', 'Print'],
    Analytics: ['View', 'Export'],
    'User Management': ['View'],
    'Audit Logs': ['View', 'Export'],
    Settings: ['View'],
  },

  ADMIN: ALL_PERMISSION_MODULES.reduce((acc, mod) => {
    acc[mod] = [...ALL_PERMISSION_ACTIONS];
    return acc;
  }, {} as Record<PermissionModule, PermissionAction[]>),

  APFC: {
    Dashboard: ['View', 'Export', 'Print'],
    'Tour Diary': ['View', 'Create', 'Edit', 'Approve', 'Export', 'Print'],
    Establishments: ['View', 'Create', 'Edit', 'Export'],
    Documents: ['View', 'Upload', 'Download', 'Export'],
    Reports: ['View', 'Export', 'Print'],
    Analytics: ['View', 'Export'],
    'User Management': ['View'],
    'Audit Logs': ['View'],
    Settings: ['View'],
  },

  EO: {
    Dashboard: ['View', 'Export', 'Print'],
    'Tour Diary': ['View', 'Create', 'Edit', 'Export', 'Print', 'Upload'],
    Establishments: ['View', 'Create', 'Edit', 'Export'],
    Documents: ['View', 'Upload', 'Download', 'Export'],
    Reports: ['View', 'Export', 'Print'],
    Analytics: ['View', 'Export'],
    'User Management': [],
    'Audit Logs': [],
    Settings: ['View'],
  },

  EO_AO: {
    Dashboard: ['View', 'Export', 'Print'],
    'Tour Diary': ['View', 'Create', 'Edit', 'Export', 'Print', 'Upload'],
    Establishments: ['View', 'Create', 'Edit', 'Export'],
    Documents: ['View', 'Upload', 'Download', 'Export'],
    Reports: ['View', 'Export', 'Print'],
    Analytics: ['View', 'Export'],
    'User Management': [],
    'Audit Logs': [],
    Settings: ['View'],
  },

  VIEWER: {
    Dashboard: ['View'],
    'Tour Diary': ['View'],
    Establishments: ['View'],
    Documents: ['View'],
    Reports: ['View'],
    Analytics: ['View'],
    'User Management': [],
    'Audit Logs': [],
    Settings: [],
  },
};

/**
 * Storage Helpers
 */
export const getUsersFromStorage = (): ExtendedUserProfile[] => {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    const list: ExtendedUserProfile[] = JSON.parse(raw);
    // Ensure Super Admin exists & remains protected
    const adminIdx = list.findIndex(u => u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
    if (adminIdx === -1) {
      list.unshift(DEFAULT_SUPER_ADMIN);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    } else {
      list[adminIdx] = {
        ...list[adminIdx],
        email: SUPER_ADMIN_EMAIL,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      };
    }
    return list;
  } catch (e) {
    return DEFAULT_USERS;
  }
};

export const saveUsersToStorage = (users: ExtendedUserProfile[]): void => {
  if (typeof window === 'undefined') return;
  // Enforce Super Admin Immutability in saved array
  const cleaned = users.map(u => {
    if (u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return {
        ...u,
        email: SUPER_ADMIN_EMAIL,
        role: 'SUPER_ADMIN' as UserRole,
        status: 'ACTIVE' as UserStatus,
      };
    }
    return u;
  });
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cleaned));
};

export const getRBACMatrixFromStorage = (): RolePermissionsMap => {
  if (typeof window === 'undefined') return DEFAULT_RBAC_MATRIX;
  const raw = localStorage.getItem(RBAC_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(RBAC_STORAGE_KEY, JSON.stringify(DEFAULT_RBAC_MATRIX));
    return DEFAULT_RBAC_MATRIX;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_RBAC_MATRIX;
  }
};

export const saveRBACMatrixToStorage = (matrix: RolePermissionsMap): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RBAC_STORAGE_KEY, JSON.stringify(matrix));
};

export const getSessionsFromStorage = (): UserSessionItem[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
  if (!raw) {
    const sample: UserSessionItem[] = [
      {
        id: 'sess-101',
        userId: DEFAULT_SUPER_ADMIN.id,
        userEmail: SUPER_ADMIN_EMAIL,
        device: 'Desktop Workstation',
        browser: 'Chrome 122.0',
        os: 'Windows 11 Enterprise',
        ipAddress: '192.168.1.153',
        location: 'Bhubaneswar, India',
        sessionDuration: '2h 15m',
        lastActive: new Date().toISOString(),
        isActive: true,
      },
      {
        id: 'sess-102',
        userId: 'usr-eo-3',
        userEmail: 'soumya.das@epfindia.gov.in',
        device: 'Samsung Galaxy Tab S9',
        browser: 'Mobile Safari 17.2',
        os: 'Android 14',
        ipAddress: '10.24.110.45',
        location: 'Cuttack, India',
        sessionDuration: '45m',
        lastActive: '2026-08-07T14:15:00Z',
        isActive: true,
      },
    ];
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sample));
    return sample;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const saveSessionsToStorage = (sessions: UserSessionItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
};

export const getUserActivityLogsFromStorage = (): UserActivityLogItem[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
  if (!raw) {
    const sample: UserActivityLogItem[] = [
      {
        id: 'act-1',
        userId: DEFAULT_SUPER_ADMIN.id,
        userEmail: SUPER_ADMIN_EMAIL,
        timestamp: new Date().toISOString(),
        performedBy: SUPER_ADMIN_EMAIL,
        action: 'SUPER_ADMIN_SESSION_INIT',
        module: 'SYSTEM',
        ipAddress: '192.168.1.153',
        device: 'Chrome 122 (Windows 11)',
        remarks: 'Super Admin logged in with unrestricted security clearance.',
        success: true,
      },
    ];
    localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(sample));
    return sample;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const logUserActivity = (log: Omit<UserActivityLogItem, 'id' | 'timestamp'>): void => {
  const existing = getUserActivityLogsFromStorage();
  const item: UserActivityLogItem = {
    ...log,
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  };
  const updated = [item, ...existing.slice(0, 499)];
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updated));
  }
};
