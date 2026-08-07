import React, { useState, useEffect } from 'react';
import { Shield, Users, Key, Building, MapPin, FileText, Settings, Plus, CheckCircle2, ShieldAlert } from 'lucide-react';
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
import { isProtectedSuperAdmin } from '@/lib/securityUtils';
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
}

export const UserManagement: React.FC<UserManagementProps> = ({
  currentUser,
  tours = [],
  documents = [],
}) => {
  const [subTab, setSubTab] = useState<'users' | 'roles' | 'departments' | 'districts' | 'audit' | 'settings'>('users');
  const [users, setUsers] = useState<ExtendedUserProfile[]>([]);
  const [rbacMatrix, setRbacMatrix] = useState<RolePermissionsMap>(getRBACMatrixFromStorage());
  const [sessions, setSessions] = useState(getSessionsFromStorage());
  const [activityLogs] = useState(getUserActivityLogsFromStorage());

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ExtendedUserProfile | null>(null);

  const [selectedUserForProfile, setSelectedUserForProfile] = useState<ExtendedUserProfile | null>(null);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<ExtendedUserProfile | null>(null);
  const [selectedUserForSecurity, setSelectedUserForSecurity] = useState<ExtendedUserProfile | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
    if (isProtectedSuperAdmin(user)) {
      showToast('error', 'Super Admin account status cannot be altered.');
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
    if (isProtectedSuperAdmin(user)) {
      showToast('error', 'Super Admin account is protected and cannot be deleted.');
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
              <h1 className="text-xl font-black tracking-tight">Super Admin User Management Portal</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-epfo-accent text-epfo-navy rounded-full">
                Phase 3.5 Ready
              </span>
            </div>
            <p className="text-xs text-white/70 mt-1">
              Centralized Employee Directory, RBAC Permissions Matrix, Login Security & Audit Trail Logs
            </p>
          </div>
        </div>

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
      </div>

      {/* Navigation Sub-Menu Bar */}
      <div className="flex border-b border-border bg-card p-1.5 gap-1.5 overflow-x-auto rounded-2xl shadow-sm">
        {[
          { id: 'users', label: 'Employee Directory', icon: Users, badge: users.length },
          { id: 'roles', label: 'Roles & RBAC Permissions', icon: Key },
          { id: 'departments', label: 'Departments', icon: Building, badge: '6' },
          { id: 'districts', label: 'Districts & Zones', icon: MapPin, badge: '14' },
          { id: 'audit', label: 'Audit Log Trail', icon: FileText, badge: activityLogs.length },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`py-2.5 px-4 text-xs font-semibold rounded-xl transition-all flex items-center gap-2.5 whitespace-nowrap ${
                isActive
                  ? 'bg-epfo-navy text-white shadow-md dark:bg-epfo-accent dark:text-epfo-navy font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
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

      {/* Sub-Tab View Rendering */}
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

      {subTab === 'roles' && (
        <RolesPermissionsView rbacMatrix={rbacMatrix} onSaveRBACMatrix={handleSaveRBACMatrix} />
      )}

      {subTab === 'departments' && (
        <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
          <h3 className="text-sm font-bold text-epfo-navy dark:text-epfo-accent">EPFO Organizational Department Directory</h3>
          <p className="text-xs text-muted-foreground">Configured Field Inspection & Compliance Divisions:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {['Compliance Audit Division', 'Section 7A Inquiry Cell', 'Damages & Recovery Wing (Sec 14B)', 'PMVBRY Campaigning Cell', 'Accounts & TA/DA Audit Wing', 'Administration & HR'].map((dept) => (
              <div key={dept} className="p-3.5 rounded-xl border border-border bg-muted/20 font-semibold flex items-center gap-2">
                <Building className="w-4 h-4 text-epfo-accent" />
                <span>{dept}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'districts' && (
        <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
          <h3 className="text-sm font-bold text-epfo-navy dark:text-epfo-accent">EPFO Jurisdiction Districts & Zones</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {['Khordha / BBS', 'Cuttack', 'Berhampur', 'Rourkela', 'Jajpur (Industrial)', 'Angul', 'Sambalpur', 'Mumbai Bandra East'].map((dist) => (
              <div key={dist} className="p-3.5 rounded-xl border border-border bg-muted/20 font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>{dist}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'audit' && <AuditLogsView activityLogs={activityLogs} />}

      {subTab === 'settings' && (
        <div className="p-8 rounded-2xl bg-card border border-border space-y-6 text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-sm font-bold text-epfo-navy dark:text-epfo-accent">System Administration & Default Office Master Settings</h3>
              <p className="text-muted-foreground">Configure global application office defaults and security policies</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 rounded-full">
              Production Enforcement Active
            </span>
          </div>

          <div className="p-4 rounded-xl bg-epfo-navy/5 border border-epfo-navy/20 space-y-3">
            <h4 className="font-bold text-epfo-navy dark:text-epfo-accent uppercase text-[11px] tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4" /> Global Default Office Configuration
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Updating the Default Office automatically updates headers, prefilled forms, user profiles, reports, and search filters throughout the application without requiring code changes.
            </p>
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
            <p className="text-muted-foreground">Super Admin Email: <strong className="text-foreground">raghunatha.maharana@gmail.com</strong></p>
            <p className="text-muted-foreground">System Security Level: <strong className="text-emerald-500">PRODUCTION ENFORCED (RBAC + XSS Sanitizer)</strong></p>
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
