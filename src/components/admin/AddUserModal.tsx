import React, { useState, useEffect } from 'react';
import { X, Shield, User, Mail, Building, CheckCircle2, AlertCircle } from 'lucide-react';
import { ExtendedUserProfile, UserRole, UserStatus } from '@/types';
import { isProtectedSuperAdmin, validatePasswordStrength } from '@/lib/securityUtils';
import { getDefaultOfficeName } from '@/lib/officeConfig';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<ExtendedUserProfile, 'id' | 'createdDate' | 'createdBy'> | ExtendedUserProfile) => void;
  editingUser?: ExtendedUserProfile | null;
  existingUsers: ExtendedUserProfile[];
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingUser,
  existingUsers,
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    epfoEmpNumber: '',
    name: '',
    username: '',
    officialEmail: '',
    personalEmail: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    altMobile: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '',
    joiningDate: '',
    designation: 'Enforcement Officer (EO/AO)',
    role: 'ENFORCEMENT_OFFICER' as UserRole,
    office: 'Regional Office Bhubaneswar',
    region: 'Odisha Zone',
    district: 'Khurda',
    status: 'ACTIVE' as UserStatus,
    reportingOfficer: 'Shri Raghunatha Maharana',
    notes: '',
    pfStaffId: '',
    photoUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingUser) {
      setFormData({
        employeeId: editingUser.employeeId || '',
        epfoEmpNumber: editingUser.epfoEmpNumber || '',
        name: editingUser.name || '',
        username: editingUser.username || '',
        officialEmail: editingUser.officialEmail || editingUser.email || '',
        personalEmail: editingUser.personalEmail || '',
        password: '',
        confirmPassword: '',
        mobile: editingUser.mobile || '',
        altMobile: editingUser.altMobile || '',
        gender: editingUser.gender || 'Male',
        dob: editingUser.dob || '',
        joiningDate: editingUser.joiningDate || '',
        designation: editingUser.designation || 'Enforcement Officer (EO/AO)',
        role: editingUser.role || 'ENFORCEMENT_OFFICER',
        office: editingUser.office || 'Regional Office Bhubaneswar',
        region: editingUser.region || 'Odisha Zone',
        district: editingUser.district || 'Khurda',
        status: editingUser.status || 'ACTIVE',
        reportingOfficer: editingUser.reportingOfficer || 'Shri Raghunatha Maharana',
        notes: editingUser.notes || '',
        pfStaffId: editingUser.pfStaffId || '',
        photoUrl: editingUser.avatarUrl || editingUser.photoUrl || '',
      });
    } else {
      setFormData({
        employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        epfoEmpNumber: `EPFO/BBS/EO/${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        username: '',
        officialEmail: '',
        personalEmail: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        altMobile: '',
        gender: 'Male',
        dob: '',
        joiningDate: new Date().toISOString().split('T')[0],
        designation: 'Enforcement Officer (EO/AO)',
        role: 'ENFORCEMENT_OFFICER',
        office: getDefaultOfficeName(),
        region: 'Odisha Zone',
        district: 'Cuttack',
        status: 'ACTIVE',
        reportingOfficer: 'Shri Raghunatha Maharana',
        notes: '',
        pfStaffId: `PF-BBS-${Math.floor(100 + Math.random() * 900)}`,
        photoUrl: '',
      });
    }
    setErrors({});
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const isEditingProtectedSuperAdmin = editingUser ? isProtectedSuperAdmin(editingUser) : false;

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.employeeId.trim()) errs.employeeId = 'Employee ID is required';
    if (!formData.officialEmail.trim()) {
      errs.officialEmail = 'Official Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      errs.officialEmail = 'Invalid email address format';
    }

    if (!formData.username.trim()) {
      errs.username = 'Username is required';
    }

    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile Number is required';
    }

    // Duplicate Checks
    const otherUsers = existingUsers.filter((u) => u.id !== editingUser?.id);

    if (otherUsers.some((u) => u.officialEmail.toLowerCase() === formData.officialEmail.toLowerCase())) {
      errs.officialEmail = 'Official email is already registered to another user';
    }

    if (otherUsers.some((u) => u.username.toLowerCase() === formData.username.toLowerCase())) {
      errs.username = 'Username is already taken';
    }

    if (otherUsers.some((u) => u.employeeId.toLowerCase() === formData.employeeId.toLowerCase())) {
      errs.employeeId = 'Employee ID already exists';
    }

    // Password validation for new user or password change
    if (!editingUser || formData.password) {
      if (!formData.password) {
        errs.password = 'Password is required for new users';
      } else {
        const passCheck = validatePasswordStrength(formData.password);
        if (!passCheck.isValid) {
          errs.password = passCheck.error || 'Password does not meet strength requirements';
        }
      }

      if (formData.password !== formData.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: any = {
      ...(editingUser ? editingUser : {}),
      employeeId: formData.employeeId,
      epfoEmpNumber: formData.epfoEmpNumber,
      name: formData.name,
      username: formData.username,
      email: formData.officialEmail,
      officialEmail: formData.officialEmail,
      personalEmail: formData.personalEmail,
      mobile: formData.mobile,
      altMobile: formData.altMobile,
      gender: formData.gender,
      dob: formData.dob,
      joiningDate: formData.joiningDate,
      designation: formData.designation,
      role: isEditingProtectedSuperAdmin ? 'SUPER_ADMIN' : formData.role,
      office: formData.office,
      officeRegion: formData.office,
      region: formData.region,
      district: formData.district,
      status: isEditingProtectedSuperAdmin ? 'ACTIVE' : formData.status,
      reportingOfficer: formData.reportingOfficer,
      notes: formData.notes,
      pfStaffId: formData.pfStaffId,
      avatarUrl: formData.photoUrl || editingUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      failedLoginCount: editingUser?.failedLoginCount || 0,
      isMfaEnabled: editingUser?.isMfaEnabled || false,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-epfo-navy to-epfo-dark text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10">
              <Shield className="w-5 h-5 text-epfo-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingUser ? `Edit User: ${editingUser.name}` : 'Add New User / Official'}
              </h2>
              <p className="text-xs text-white/70">
                {editingUser ? 'Update official details and assignment' : 'Register a new staff account in EPFO Tour Diary'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {isEditingProtectedSuperAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Super Admin Protection Active: Role and Status are locked to SUPER_ADMIN & ACTIVE.</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div>
            <h3 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal & Official Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shri Soumya Ranjan Das"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="EMP-6120"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
                {errors.employeeId && <p className="text-[11px] text-red-500 mt-1">{errors.employeeId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  EPFO Staff Reg Number
                </label>
                <input
                  type="text"
                  value={formData.epfoEmpNumber}
                  onChange={(e) => setFormData({ ...formData, epfoEmpNumber: e.target.value })}
                  placeholder="EPFO/CTC/EO/6120"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Account Credentials */}
          <div>
            <h3 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Contact Information & Login Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Official Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.officialEmail}
                  onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                  placeholder="name@epfindia.gov.in"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
                {errors.officialEmail && <p className="text-[11px] text-red-500 mt-1">{errors.officialEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. sdas.eo"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
                {errors.username && <p className="text-[11px] text-red-500 mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="+91 94370 00000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
                {errors.mobile && <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Personal Email
                </label>
                <input
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Alternate Mobile
                </label>
                <input
                  type="tel"
                  value={formData.altMobile}
                  onChange={(e) => setFormData({ ...formData, altMobile: e.target.value })}
                  placeholder="+91 98610 00000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              {(!editingUser || formData.password !== '') && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Password {!editingUser && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                    />
                    {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Confirm Password {!editingUser && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                    />
                    {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 3: Office, Role & Status Assignment */}
          <div>
            <h3 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" /> Office Posting, Designation & System Role
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  System Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  disabled={isEditingProtectedSuperAdmin}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none disabled:opacity-60"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="REGIONAL_PF_COMMISSIONER">Regional PF Commissioner (RPFC)</option>
                  <option value="ADDITIONAL_CENTRAL_PF_COMMISSIONER">Additional Central PF Commissioner (ACC)</option>
                  <option value="ASSISTANT_PF_COMMISSIONER">Assistant PF Commissioner (APFC)</option>
                  <option value="ENFORCEMENT_OFFICER">Enforcement Officer (EO/AO)</option>
                  <option value="ACCOUNTS_OFFICER">Accounts Officer (AO)</option>
                  <option value="SECTION_SUPERVISOR">Section Supervisor</option>
                  <option value="DATA_ENTRY_OPERATOR">Data Entry Operator</option>
                  <option value="READ_ONLY">Read Only</option>
                  <option value="AUDITOR">Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Designation Title
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Enforcement Officer (EO/AO)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Account Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  disabled={isEditingProtectedSuperAdmin}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none disabled:opacity-60"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="LOCKED">Locked</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="RETIRED">Retired</option>
                  <option value="TRANSFERRED">Transferred</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Assigned Regional Office
                </label>
                <select
                  value={formData.office}
                  onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                >
                  <option value={getDefaultOfficeName()}>{getDefaultOfficeName()}</option>
                  <option value="Regional Office Bhubaneswar">Regional Office Bhubaneswar</option>
                  <option value="District Office Cuttack">District Office Cuttack</option>
                  <option value="District Office Berhampur">District Office Berhampur</option>
                  <option value="Regional Office Rourkela">Regional Office Rourkela</option>
                  <option value="District Office Sambalpur">District Office Sambalpur</option>
                  <option value="District Office Balasore">District Office Balasore</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Region / Zone
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="Odisha Zone"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  District Posting
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Khurda / Cuttack / Jajpur"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Reporting Officer Name
                </label>
                <input
                  type="text"
                  value={formData.reportingOfficer}
                  onChange={(e) => setFormData({ ...formData, reportingOfficer: e.target.value })}
                  placeholder="Shri Raghunatha Maharana"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Administrative Remarks & Special Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Special posting instructions or clearance tags..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-epfo-navy hover:bg-epfo-dark dark:bg-epfo-accent dark:text-epfo-navy rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingUser ? 'Save User Changes' : 'Create Staff Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
