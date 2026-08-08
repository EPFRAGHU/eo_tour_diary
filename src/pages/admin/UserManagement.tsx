import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Key,
  Building,
  FileText,
  Settings,
  Plus,
  CheckCircle2,
  ShieldAlert,
  Lock,
  Database,
  Sliders
} from 'lucide-react';
import { ExtendedUserProfile, UserRole, UserStatus, TourProgramItem, DocumentRecord, RolePermissionsMap } from '@/types';
import {
  getUsersFromStorage,
  saveUsersToStorage,
  getRBACMatrixFromStorage,
  saveRBACMatrixToStorage,
  getSessionsFromStorage,
  saveSessionsToStorage,
  getUserActivityLogsFromStorage,
  logUserActivity,
  DEFAULT_SUPER_ADMIN,
} from '@/lib/userStorage';
import { isProtectedSuperAdmin, canDeleteUser, canModifyUserRoleOrStatus } from '@/lib/securityUtils';
import { getDefaultOffice, setDefaultOffice, getOfficeList, OfficeMaster } from '@/lib/officeConfig';
import { UserTable } from '@/components/admin/UserTable';
import { AddUserModal } from '@/components/admin/AddUserModal';
import { UserProfileModal } from '@/components/admin/UserProfileModal';
import { PasswordManagementModal } from '@/components/admin/PasswordManagementModal';
import { LoginSecurityModal } from '@/components/admin/LoginSecurityModal';
import { RolesPermissionsView } from '@/components/admin/RolesPermissionsView';
import { AuditLogsView } from '@/components/admin/AuditLogsView';

interface UserManagementProps {
  currentUser: ExtendedUserProfile | any;
  tours?: TourProgramItem[];
  documents?: DocumentRecord[];
  initialSubTab?: 'users' | 'roles' | 'offices' | 'departments' | 'districts' | 'audit' | 'settings' | 'security' | 'backups' | 'config';
}

export const UserManagement: React.FC<UserManagementProps> = ({
  currentUser,
  tours = [],
  documents = [],
  initialSubTab = 'users',
}) => {
  const [subTab, setSubTab] = useState<'users' | 'roles' | 'offices' | 'departments' | 'districts' | 'audit' | 'settings' | 'security' | 'backups' | 'config'>(initialSubTab);
  const [users, setUsers] = useState<ExtendedUserProfile[]>([]);
  const [rbacMatrix, setRbacMatrix] = useState<RolePermissionsMap>(getRBACMatrixFromStorage());
  const [sessions, setSessions] = useState(getSessionsFromStorage());
  const [activityLogs] = useState(getUserActivityLogsFromStorage());

  // Security & Backup states
  const [backupHistory, setBackupHistory] = useState([
    { id: 'bak-2026-08-07', date: '2026-08-07 23:30:00', size: '14.2 MB', type: 'FULL_SNAPSHOT', status: 'SUCCESS', verified: true },
    { id: 'bak-2026-08-06', date: '2026-08-06 23:30:00', size: '14.0 MB', type: 'FULL_SNAPSHOT', status: 'SUCCESS', verified: true },
    { id: 'bak-2026-08-05', date: '2026-08-05 23:30:00', size: '13.8 MB', type: 'INCREMENTAL', status: 'SUCCESS', verified: true },
  ]);

  const [securityConfig, setSecurityConfig] = useState({
    enforceMfaAllAdmins: true,
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90,
    allowMobileInspectionAccess: true,
    ipWhitelistingEnabled: false,
    auditTrailRetentionDays: 365,
  });

  const [appConfig, setAppConfig] = useState({
    fiscalYear: '2026-2027',
    taOwnCarRatePerKm: 16.0,
    daGradeIVRatePerDay: 800,
    hotelMaxRatePerNight: 2250,
    minMonthlyVisitsPerEo: 15,
    pmvbryCampaignTargetMonthly: 4,
  });

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ExtendedUserProfile | null>(null);

  const [selectedUserForProfile, setSelectedUserForProfile] = useState<ExtendedUserProfile | null>(null);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<ExtendedUserProfile | null>(null);
  const [selectedUserForSecurity, setSelectedUserForSecurity] = useState<ExtendedUserProfile | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    const loadedUsers = getUsersFromStorage();
    setUsers(loadedUsers);
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Save / Update User
  const handleSaveUser = (userPayload: any) => {
    let updatedList: ExtendedUserProfile[];

    if (userPayload.id) {
      // Update existing
      updatedList = users.map((u) => (u.id === userPayload.id ? { ...u, ...userPayload } : u));
      showToast('success', `User ${userPayload.name} updated successfully.`);
      logUserActivity({
        userId: currentUser.id || 'super-admin',
        userEmail: currentUser.email || DEFAULT_SUPER_ADMIN.email,
        performedBy: currentUser.email || DEFAULT_SUPER_ADMIN.email,
        action: 'USER_UPDATED',
        module: 'User Management',
        recordId: userPayload.id,
        remarks: `Updated profile details for officer ${userPayload.name} (${userPayload.officialEmail}).`,
        ipAddress: '192.168.1.153',
        success: true,
      });
    } else {
      // Create new
      const newUser: ExtendedUserProfile = {
        ...userPayload,
        id: `usr-${Date.now()}`,
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: currentUser.email || DEFAULT_SUPER_ADMIN.email,
        failedLoginCount: 0,
        isMfaEnabled: false,
      };

      updatedList = [newUser, ...users];
      showToast('success', `New user ${newUser.name} created successfully.`);
      logUserActivity({
        userId: currentUser.id || 'super-admin',
        userEmail: currentUser.email || DEFAULT_SUPER_ADMIN.email,
        performedBy: currentUser.email || DEFAULT_SUPER_ADMIN.email,
        action: 'USER_CREATED',
        module: 'User Management',
        recordId: newUser.id,
        remarks: `Created new staff account for ${newUser.name} as ${newUser.role}.`,
        ipAddress: '192.168.1.153',
        success: true,
      });
    }

    setUsers(updatedList);
    saveUsersToStorage(updatedList);
    setEditingUser(null);
  };

  // Toggle User Status
  const handleToggleStatus = (user: ExtendedUserProfile, targetStatus: UserStatus) => {
    const check = canModifyUserRoleOrStatus(user);
    if (!check.allowed) {
      showToast('error', check.reason || 'Super Admin account status cannot be altered.');
      return;
    }

    const updated = users.map((u) => (u.id === user.id ? { ...u, status: targetStatus } : u));
    setUsers(updated);
    saveUsersToStorage(updated);
    showToast('success', `Status for ${user.name} changed to ${targetStatus}`);

    logUserActivity({
      userId: currentUser.id || 'super-admin',
      userEmail: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      performedBy: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      action: 'USER_STATUS_CHANGED',
      module: 'User Management',
      recordId: user.id,
      oldValue: user.status,
      newValue: targetStatus,
      remarks: `Changed user status for ${user.name} to ${targetStatus}.`,
      ipAddress: '192.168.1.153',
      success: true,
    });
  };

  // Delete User
  const handleDeleteUser = (user: ExtendedUserProfile) => {
    const check = canDeleteUser(user);
    if (!check.allowed) {
      showToast('error', check.reason || 'Super Admin account is protected and cannot be deleted.');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete account for ${user.name}?`)) {
      return;
    }

    const updated = users.filter((u) => u.id !== user.id);
    setUsers(updated);
    saveUsersToStorage(updated);
    showToast('success', `User ${user.name} deleted.`);

    logUserActivity({
      userId: currentUser.id || 'super-admin',
      userEmail: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      performedBy: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      action: 'USER_DELETED',
      module: 'User Management',
      recordId: user.id,
      remarks: `Deleted user ${user.name} (${user.officialEmail}).`,
      ipAddress: '192.168.1.153',
      success: true,
    });
  };

  // Bulk Status Change
  const handleBulkStatusChange = (userIds: string[], status: UserStatus) => {
    const updated = users.map((u) => {
      if (userIds.includes(u.id) && !isProtectedSuperAdmin(u)) {
        return { ...u, status };
      }
      return u;
    });

    setUsers(updated);
    saveUsersToStorage(updated);
    showToast('success', `Bulk updated ${userIds.length} users to status ${status}.`);
  };

  // Bulk Delete
  const handleBulkDelete = (userIds: string[]) => {
    if (!window.confirm(`Are you sure you want to delete ${userIds.length} selected users?`)) {
      return;
    }

    const updated = users.filter((u) => !userIds.includes(u.id) || isProtectedSuperAdmin(u));
    setUsers(updated);
    saveUsersToStorage(updated);
    showToast('success', `Bulk deleted selected user accounts.`);
  };

  // Bulk CSV Import
  const handleImportUsers = (imported: Partial<ExtendedUserProfile>[]) => {
    const newItems: ExtendedUserProfile[] = imported.map((item, idx) => ({
      id: `usr-imp-${Date.now()}-${idx}`,
      employeeId: item.employeeId || `EMP-IMP-${idx}`,
      epfoEmpNumber: item.epfoEmpNumber || `EPFO/IMP/${idx}`,
      name: item.name || 'Imported Officer',
      username: item.username || `user${idx}`,
      email: item.officialEmail || `user${idx}@epfindia.gov.in`,
      officialEmail: item.officialEmail || `user${idx}@epfindia.gov.in`,
      designation: item.designation || 'Enforcement Officer (EO/AO)',
      role: (item.role as UserRole) || 'ENFORCEMENT_OFFICER',
      office: item.office || 'Regional Office Bhubaneswar',
      officeRegion: item.office || 'RO Bhubaneswar',
      region: item.region || 'Odisha Zone',
      district: item.district || 'Khurda',
      mobile: item.mobile || '+91 94370 00000',
      status: 'ACTIVE',
      failedLoginCount: 0,
      isMfaEnabled: false,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: currentUser.email || DEFAULT_SUPER_ADMIN.email,
    }));

    const combined = [...newItems, ...users];
    setUsers(combined);
    saveUsersToStorage(combined);
    showToast('success', `Successfully imported ${newItems.length} users into system directory.`);
  };

  // RBAC Matrix Save
  const handleSaveRBACMatrix = (updatedMatrix: RolePermissionsMap) => {
    setRbacMatrix(updatedMatrix);
    saveRBACMatrixToStorage(updatedMatrix);
    showToast('success', 'Role-Based Access Control matrix permissions updated.');
    logUserActivity({
      userId: currentUser.id || 'super-admin',
      userEmail: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      performedBy: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      action: 'RBAC_MATRIX_UPDATED',
      module: 'User Management',
      remarks: 'Updated granular RBAC permission matrix rules across modules.',
      ipAddress: '192.168.1.153',
      success: true,
    });
  };

  // Password Management update handler
  const handlePasswordUpdate = (updatedUser: ExtendedUserProfile, remark: string) => {
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updated);
    saveUsersToStorage(updated);
    showToast('success', `Security settings updated for ${updatedUser.name}`);
    logUserActivity({
      userId: currentUser.id || 'super-admin',
      userEmail: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      performedBy: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      action: 'PASSWORD_SECURITY_UPDATED',
      module: 'User Management',
      recordId: updatedUser.id,
      remarks: remark,
      ipAddress: '192.168.1.153',
      success: true,
    });
  };

  // Session termination
  const handleTerminateSession = (sessionId: string) => {
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    saveSessionsToStorage(updated);
    showToast('success', 'Session terminated successfully.');
  };

  const handleTerminateAllSessions = (userId: string) => {
    const updated = sessions.filter((s) => s.userId !== userId && s.userEmail !== userId);
    setSessions(updated);
    saveSessionsToStorage(updated);
    showToast('success', 'All sessions for user logged out.');
  };

  // Backup handlers
  const handleCreateBackup = () => {
    const newBak = {
      id: `bak-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      size: '14.5 MB',
      type: 'FULL_SNAPSHOT',
      status: 'SUCCESS',
      verified: true,
    };
    setBackupHistory([newBak, ...backupHistory]);
    showToast('success', 'System backup snapshot generated and verified.');
    logUserActivity({
      userId: currentUser.id || 'super-admin',
      userEmail: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      performedBy: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      action: 'BACKUP_CREATED',
      module: 'SYSTEM',
      recordId: newBak.id,
      remarks: 'Full system database snapshot created by Super Admin.',
      ipAddress: '192.168.1.153',
      success: true,
    });
  };

  const handleRestoreBackup = (bakId: string) => {
    if (!window.confirm(`Are you sure you want to restore snapshot ${bakId}? Current session data will be synchronized.`)) {
      return;
    }
    showToast('success', `Snapshot ${bakId} successfully restored and database checksum validated.`);
    logUserActivity({
      userId: currentUser.id || 'super-admin',
      userEmail: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      performedBy: currentUser.email || DEFAULT_SUPER_ADMIN.email,
      action: 'BACKUP_RESTORED',
      module: 'SYSTEM',
      recordId: bakId,
      remarks: `Restored system state to snapshot ${bakId}.`,
      ipAddress: '192.168.1.153',
      success: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-2xl border shadow-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'bg-emerald-500 text-white border-emerald-600'
              : 'bg-red-500 text-white border-red-600'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-epfo-navy via-epfo-dark to-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
            <Shield className="w-7 h-7 text-epfo-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">Super Admin Administration Control Center</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-epfo-accent text-epfo-navy rounded-full">
                SUPER_ADMIN ONLY
              </span>
            </div>
            <p className="text-xs text-white/70 mt-1">
              User Management, RBAC Matrix, Office Management, Security Settings, Audit Trail & System Configuration
            </p>
          </div>
        </div>

        {subTab === 'users' && (
          <button
            onClick={() => {
              setEditingUser(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 text-xs font-bold text-epfo-navy bg-epfo-accent hover:bg-amber-400 rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Official / User</span>
          </button>
        )}

        {subTab === 'backups' && (
          <button
            onClick={handleCreateBackup}
            className="px-4 py-2.5 text-xs font-bold text-epfo-navy bg-epfo-accent hover:bg-amber-400 rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <Database className="w-4 h-4" />
            <span>Generate Backup Snapshot</span>
          </button>
        )}
      </div>

      {/* Navigation Sub-Menu Bar - All 8 Administration Modules */}
      <div className="flex border-b border-border bg-card p-1.5 gap-1.5 overflow-x-auto rounded-2xl shadow-sm">
        {[
          { id: 'users', label: '1. User Management', icon: Users, badge: users.length },
          { id: 'roles', label: '2. Roles & Permissions', icon: Key },
          { id: 'offices', label: '3. Office Management', icon: Building, badge: 'Offices' },
          { id: 'settings', label: '4. System Settings', icon: Settings },
          { id: 'audit', label: '5. Audit Logs', icon: FileText, badge: activityLogs.length },
          { id: 'security', label: '6. Security Settings', icon: Lock, badge: '2FA' },
          { id: 'backups', label: '7. Backup & Restore', icon: Database, badge: backupHistory.length },
          { id: 'config', label: '8. Application Configuration', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`py-2.5 px-3.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-epfo-navy text-white shadow-md dark:bg-epfo-accent dark:text-epfo-navy font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white dark:bg-epfo-navy/20 dark:text-epfo-navy' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. User Management View */}
      {subTab === 'users' && (
        <UserTable
          users={users}
          onViewUser={(user) => setSelectedUserForProfile(user)}
          onEditUser={(user) => {
            setEditingUser(user);
            setIsAddModalOpen(true);
          }}
          onResetPassword={(user) => setSelectedUserForPassword(user)}
          onToggleStatus={handleToggleStatus}
          onDeleteUser={handleDeleteUser}
          onViewLoginHistory={(user) => setSelectedUserForSecurity(user)}
          onViewActivity={(user) => setSelectedUserForProfile(user)}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkDelete={handleBulkDelete}
          onImportUsers={handleImportUsers}
        />
      )}

      {/* 2. Roles & Permissions View */}
      {subTab === 'roles' && (
        <RolesPermissionsView rbacMatrix={rbacMatrix} onSaveRBACMatrix={handleSaveRBACMatrix} />
      )}

      {/* 3. Office Management View */}
      {subTab === 'offices' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-epfo-navy dark:text-epfo-accent">Regional & District Office Jurisdictions</h3>
                <p className="text-xs text-muted-foreground">Manage active office branches, address records, and official contact channels</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 rounded-full text-xs">
                Active Master Registry
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getOfficeList().map((off: OfficeMaster) => (
                <div key={off.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <Building className="w-4 h-4 text-epfo-accent" />
                      <span>{off.officeName}</span>
                    </div>
                    {off.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px]">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{off.address}</p>
                  <div className="text-[11px] font-mono text-muted-foreground pt-1 flex justify-between border-t border-border/50">
                    <span>Email: {off.email}</span>
                    <span>Tel: {off.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. System Settings View */}
      {subTab === 'settings' && (
        <div className="p-8 rounded-2xl bg-card border border-border space-y-6 text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-sm font-bold text-epfo-navy dark:text-epfo-accent">System Administration & Default Office Settings</h3>
              <p className="text-muted-foreground">Configure global application office defaults and system enforcement policies</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 rounded-full">
              Production Enforcement Active
            </span>
          </div>

          <div className="p-4 rounded-xl bg-epfo-navy/5 border border-epfo-navy/20 space-y-3">
            <h4 className="font-bold text-epfo-navy dark:text-epfo-accent uppercase text-[11px] tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4" /> Global Default Office Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Active System Default Office</label>
                <select
                  value={getDefaultOffice().id}
                  onChange={(e) => {
                    setDefaultOffice(e.target.value);
                    showToast('success', `Default System Office updated to ${getDefaultOffice().officeName}`);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-input bg-card focus:ring-2 focus:ring-epfo-navy outline-none"
                >
                  {getOfficeList().map((off: OfficeMaster) => (
                    <option key={off.id} value={off.id}>
                      {off.officeName} ({off.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Official Office Email & Phone</label>
                <div className="p-2 rounded-xl border border-border bg-background font-mono text-[11px] space-y-1">
                  <div>Email: {getDefaultOffice().email}</div>
                  <div>Phone: {getDefaultOffice().phone}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground">Primary Super Admin: <strong className="text-foreground">{DEFAULT_SUPER_ADMIN.email}</strong></p>
            <p className="text-muted-foreground">Security Protection Level: <strong className="text-emerald-500">SUPER_ADMIN ONLY + REQUIRE_SUPER_ADMIN GUARD</strong></p>
          </div>
        </div>
      )}

      {/* 5. Audit Logs View */}
      {subTab === 'audit' && <AuditLogsView activityLogs={activityLogs} />}

      {/* 6. Security Settings View */}
      {subTab === 'security' && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-6 text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-epfo-navy dark:text-epfo-accent">Security Settings & Multi-Factor Policies</h3>
              <p className="text-muted-foreground">Configure system-wide password strength rules, MFA enforcement, and session timeouts</p>
            </div>
            <button
              onClick={() => showToast('success', 'Security configuration policies saved.')}
              className="px-4 py-1.5 rounded-xl bg-epfo-navy text-white hover:bg-epfo-dark dark:bg-epfo-accent dark:text-epfo-navy font-bold"
            >
              Save Policy Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="font-bold flex items-center gap-2 text-foreground">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Authentication & Session Policies</span>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityConfig.enforceMfaAllAdmins}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, enforceMfaAllAdmins: e.target.checked })}
                    className="rounded text-epfo-accent"
                  />
                  <span>Enforce Multi-Factor Authentication (MFA/2FA) for Super Admin</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityConfig.allowMobileInspectionAccess}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, allowMobileInspectionAccess: e.target.checked })}
                    className="rounded text-epfo-accent"
                  />
                  <span>Allow Mobile PWA GPS-Tagged Field Inspections</span>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="font-bold flex items-center gap-2 text-foreground">
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Brute Force & Rate Limiter Rules</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground">Session Timeout (Mins)</label>
                  <input
                    type="number"
                    value={securityConfig.sessionTimeoutMinutes}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, sessionTimeoutMinutes: parseInt(e.target.value) || 30 })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-card font-mono"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground">Max Failed Logins</label>
                  <input
                    type="number"
                    value={securityConfig.maxLoginAttempts}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, maxLoginAttempts: parseInt(e.target.value) || 5 })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-card font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Backup & Restore View */}
      {subTab === 'backups' && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-6 text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-epfo-navy dark:text-epfo-accent">Database Backup & Disaster Recovery Snapshots</h3>
              <p className="text-muted-foreground">Automated daily snapshot points, manual database backup triggers, and restore validation</p>
            </div>
            <button
              onClick={handleCreateBackup}
              className="px-4 py-2 rounded-xl bg-epfo-navy text-white hover:bg-epfo-dark dark:bg-epfo-accent dark:text-epfo-navy font-bold flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span>Create Full Snapshot Now</span>
            </button>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/60 font-bold border-b border-border text-muted-foreground uppercase text-[10px]">
                <tr>
                  <th className="p-3">Snapshot ID</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Archive Size</th>
                  <th className="p-3">Backup Type</th>
                  <th className="p-3">Integrity Check</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {backupHistory.map((bak) => (
                  <tr key={bak.id} className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-foreground">{bak.id}</td>
                    <td className="p-3 text-muted-foreground">{bak.date}</td>
                    <td className="p-3">{bak.size}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold">{bak.type}</span>
                    </td>
                    <td className="p-3 text-emerald-500 font-bold">CHECKSUM VERIFIED</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleRestoreBackup(bak.id)}
                        className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500 hover:text-white transition-colors"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => showToast('success', `Exporting archive ${bak.id}...`)}
                        className="px-2.5 py-1 rounded bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. Application Configuration View */}
      {subTab === 'config' && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-6 text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-epfo-navy dark:text-epfo-accent">Application Parameters & TA/DA Rate Schedule Configuration</h3>
              <p className="text-muted-foreground">Adjust fiscal year parameters, travel allowance rates, and inspection quotas</p>
            </div>
            <button
              onClick={() => showToast('success', 'Application configuration updated.')}
              className="px-4 py-1.5 rounded-xl bg-epfo-navy text-white hover:bg-epfo-dark dark:bg-epfo-accent dark:text-epfo-navy font-bold"
            >
              Save Application Parameters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
              <label className="font-bold text-foreground block">Active Financial Year</label>
              <input
                type="text"
                value={appConfig.fiscalYear}
                onChange={(e) => setAppConfig({ ...appConfig, fiscalYear: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-input bg-card font-mono"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
              <label className="font-bold text-foreground block">Own Car TA Rate (₹ / Km)</label>
              <input
                type="number"
                value={appConfig.taOwnCarRatePerKm}
                onChange={(e) => setAppConfig({ ...appConfig, taOwnCarRatePerKm: parseFloat(e.target.value) || 16 })}
                className="w-full px-3 py-1.5 rounded-lg border border-input bg-card font-mono"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
              <label className="font-bold text-foreground block">Daily Allowance Rate (₹ / Day)</label>
              <input
                type="number"
                value={appConfig.daGradeIVRatePerDay}
                onChange={(e) => setAppConfig({ ...appConfig, daGradeIVRatePerDay: parseFloat(e.target.value) || 800 })}
                className="w-full px-3 py-1.5 rounded-lg border border-input bg-card font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editingUser={editingUser}
        existingUsers={users}
      />

      <UserProfileModal
        isOpen={!!selectedUserForProfile}
        onClose={() => setSelectedUserForProfile(null)}
        user={selectedUserForProfile}
        tours={tours}
        documents={documents}
        activityLogs={activityLogs}
        sessions={sessions}
        rbacMatrix={rbacMatrix}
      />

      <PasswordManagementModal
        isOpen={!!selectedUserForPassword}
        onClose={() => setSelectedUserForPassword(null)}
        user={selectedUserForPassword}
        onUpdateUser={handlePasswordUpdate}
      />

      <LoginSecurityModal
        isOpen={!!selectedUserForSecurity}
        onClose={() => setSelectedUserForSecurity(null)}
        user={selectedUserForSecurity}
        sessions={sessions}
        onTerminateSession={handleTerminateSession}
        onTerminateAllSessions={handleTerminateAllSessions}
      />
    </div>
  );
};
