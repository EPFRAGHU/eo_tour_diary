import React, { useState } from 'react';
import {
  Search,
  Printer,
  FileSpreadsheet,
  FileText,
  Eye,
  Edit,
  KeyRound,
  Lock,
  UserCheck,
  UserX,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Upload,
  CheckSquare,
  Shield,
  Columns
} from 'lucide-react';
import { ExtendedUserProfile, UserRole, UserStatus } from '@/types';
import { isProtectedSuperAdmin } from '@/lib/securityUtils';
import { getDefaultOfficeName } from '@/lib/officeConfig';

interface UserTableProps {
  users: ExtendedUserProfile[];
  onViewUser: (user: ExtendedUserProfile) => void;
  onEditUser: (user: ExtendedUserProfile) => void;
  onResetPassword: (user: ExtendedUserProfile) => void;
  onToggleStatus: (user: ExtendedUserProfile, targetStatus: UserStatus) => void;
  onDeleteUser: (user: ExtendedUserProfile) => void;
  onViewLoginHistory: (user: ExtendedUserProfile) => void;
  onViewActivity: (user: ExtendedUserProfile) => void;
  onBulkStatusChange: (userIds: string[], status: UserStatus) => void;
  onBulkDelete: (userIds: string[]) => void;
  onImportUsers: (parsedUsers: Partial<ExtendedUserProfile>[]) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onViewUser,
  onEditUser,
  onResetPassword,
  onToggleStatus,
  onDeleteUser,
  onViewLoginHistory,
  onViewActivity,
  onBulkStatusChange,
  onBulkDelete,
  onImportUsers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [officeFilter, setOfficeFilter] = useState<string>('ALL');

  const [sortField, setSortField] = useState<keyof ExtendedUserProfile>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Column Visibility Controls
  const [visibleColumns, setVisibleColumns] = useState({
    photo: true,
    empId: true,
    name: true,
    designation: true,
    office: true,
    district: true,
    mobile: true,
    email: true,
    username: true,
    role: true,
    status: true,
    lastLogin: true,
    createdDate: true,
    createdBy: true,
  });

  const [showColumnToggle, setShowColumnToggle] = useState(false);

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.officialEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.mobile && u.mobile.includes(searchTerm));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesOffice = officeFilter === 'ALL' || u.office === officeFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesOffice;
  });

  // Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valA = String(a[sortField] || '').toLowerCase();
    const valB = String(b[sortField] || '').toLowerCase();
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / pageSize) || 1;
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(paginatedUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((item) => item !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const handleSort = (field: keyof ExtendedUserProfile) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Employee ID',
      'EPFO Number',
      'Name',
      'Designation',
      'Office',
      'District',
      'Mobile',
      'Official Email',
      'Username',
      'Role',
      'Status',
      'Last Login',
      'Created Date',
      'Created By',
    ];

    const rows = sortedUsers.map((u) => [
      `"${u.employeeId}"`,
      `"${u.epfoEmpNumber || ''}"`,
      `"${u.name}"`,
      `"${u.designation}"`,
      `"${u.office}"`,
      `"${u.district}"`,
      `"${u.mobile}"`,
      `"${u.officialEmail}"`,
      `"${u.username}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${u.lastLogin || ''}"`,
      `"${u.createdDate}"`,
      `"${u.createdBy}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `epfo_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  // CSV Import Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter((l) => l.trim() !== '');
      if (lines.length <= 1) return;

      const imported: Partial<ExtendedUserProfile>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (cols.length >= 3) {
          imported.push({
            employeeId: cols[0] || `EMP-IMP-${Date.now()}-${i}`,
            name: cols[1] || 'Imported Officer',
            officialEmail: cols[2] || `user${i}@epfindia.gov.in`,
            username: cols[3] || `user${i}`,
            designation: cols[4] || 'Enforcement Officer (EO/AO)',
            role: (cols[5] as UserRole) || 'ENFORCEMENT_OFFICER',
            office: cols[6] || 'Regional Office Bhubaneswar',
            district: cols[7] || 'Khurda',
            mobile: cols[8] || '+91 94370 00000',
            status: 'ACTIVE',
          });
        }
      }

      if (imported.length > 0) {
        onImportUsers(imported);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter & Export Controls Toolbar */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Global Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Employee ID, Name, Email, Username, Mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="REGIONAL_PF_COMMISSIONER">Regional PF Commissioner</option>
              <option value="ASSISTANT_PF_COMMISSIONER">Assistant PF Commissioner</option>
              <option value="ENFORCEMENT_OFFICER">Enforcement Officer</option>
              <option value="ACCOUNTS_OFFICER">Accounts Officer</option>
              <option value="AUDITOR">Auditor</option>
              <option value="READ_ONLY">Read Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="LOCKED">Locked</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="RETIRED">Retired</option>
              <option value="TRANSFERRED">Transferred</option>
            </select>
          </div>

          {/* Office Filter */}
          <div>
            <select
              value={officeFilter}
              onChange={(e) => setOfficeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
            >
              <option value="ALL">All Regional Offices</option>
              <option value={getDefaultOfficeName()}>{getDefaultOfficeName()}</option>
              <option value="Regional Office Bhubaneswar">RO Bhubaneswar</option>
              <option value="District Office Cuttack">DO Cuttack</option>
              <option value="Regional Office Rourkela">RO Rourkela</option>
              <option value="Headquarters New Delhi">HQ New Delhi</option>
            </select>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <Columns className="w-3.5 h-3.5 text-epfo-navy dark:text-epfo-accent" />
              <span>Columns</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>Excel / CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-blue-500" />
              <span>Print View</span>
            </button>

            <label className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-purple-500" />
              <span>Import CSV</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="text-xs text-muted-foreground font-semibold">
            Total Users: <strong className="text-foreground">{sortedUsers.length}</strong>
          </div>
        </div>

        {/* Column Toggle Options Box */}
        {showColumnToggle && (
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs">
            {Object.keys(visibleColumns).map((col) => (
              <label key={col} className="flex items-center gap-1.5 capitalize cursor-pointer">
                <input
                  type="checkbox"
                  checked={(visibleColumns as any)[col]}
                  onChange={(e) =>
                    setVisibleColumns({ ...visibleColumns, [col]: e.target.checked })
                  }
                  className="rounded border-input text-epfo-navy"
                />
                <span>{col.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Bulk Operations Selection Bar */}
      {selectedUserIds.length > 0 && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-epfo-navy to-epfo-dark text-white flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckSquare className="w-4 h-4 text-epfo-accent" />
            <span>{selectedUserIds.length} users selected for bulk administration</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <button
              onClick={() => onBulkStatusChange(selectedUserIds, 'ACTIVE')}
              className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg transition-colors border border-emerald-500/40"
            >
              Activate Selected
            </button>
            <button
              onClick={() => onBulkStatusChange(selectedUserIds, 'INACTIVE')}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg transition-colors border border-amber-500/40"
            >
              Deactivate Selected
            </button>
            <button
              onClick={() => onBulkDelete(selectedUserIds)}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors border border-red-500/40 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Main User Data Table */}
      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/60 font-bold border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider sticky top-0 backdrop-blur-md">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedUsers.length > 0 && selectedUserIds.length === paginatedUsers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-input text-epfo-navy"
                  />
                </th>

                {visibleColumns.photo && <th className="p-3.5 w-12 text-center">Photo</th>}

                {visibleColumns.empId && (
                  <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('employeeId')}>
                    Emp ID
                  </th>
                )}

                {visibleColumns.name && (
                  <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('name')}>
                    Officer Name
                  </th>
                )}

                {visibleColumns.designation && <th className="p-3.5">Designation</th>}

                {visibleColumns.office && <th className="p-3.5">Office</th>}

                {visibleColumns.district && <th className="p-3.5">District</th>}

                {visibleColumns.mobile && <th className="p-3.5">Mobile Number</th>}

                {visibleColumns.email && <th className="p-3.5">Official Email</th>}

                {visibleColumns.username && <th className="p-3.5">Username</th>}

                {visibleColumns.role && <th className="p-3.5">Role</th>}

                {visibleColumns.status && <th className="p-3.5">Status</th>}

                {visibleColumns.lastLogin && <th className="p-3.5">Last Login</th>}

                <th className="p-3.5 text-right w-24">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-8 text-center text-muted-foreground">
                    No users matching the filter criteria found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isSuperAdmin = isProtectedSuperAdmin(user);
                  const isSelected = selectedUserIds.includes(user.id);

                  return (
                    <tr key={user.id} className={`hover:bg-muted/40 transition-colors ${isSelected ? 'bg-epfo-navy/5' : ''}`}>
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          disabled={isSuperAdmin}
                          checked={isSelected}
                          onChange={() => handleSelectOne(user.id)}
                          className="rounded border-input text-epfo-navy disabled:opacity-30"
                        />
                      </td>

                      {visibleColumns.photo && (
                        <td className="p-3.5 text-center">
                          <img
                            src={user.avatarUrl || user.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                            alt={user.name}
                            className="w-8 h-8 rounded-full border border-border object-cover mx-auto"
                          />
                        </td>
                      )}

                      {visibleColumns.empId && (
                        <td className="p-3.5 font-mono font-bold text-epfo-navy dark:text-epfo-accent">
                          {user.employeeId}
                        </td>
                      )}

                      {visibleColumns.name && (
                        <td className="p-3.5 font-bold text-foreground">
                          <div className="flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isSuperAdmin && (
                              <span title="Super Admin Account (Protected)">
                                <Shield className="w-3.5 h-3.5 text-epfo-accent fill-epfo-accent" />
                              </span>
                            )}
                          </div>
                        </td>
                      )}

                      {visibleColumns.designation && <td className="p-3.5 text-muted-foreground">{user.designation}</td>}

                      {visibleColumns.office && <td className="p-3.5 font-medium">{user.office}</td>}

                      {visibleColumns.district && <td className="p-3.5">{user.district}</td>}

                      {visibleColumns.mobile && <td className="p-3.5 font-mono">{user.mobile}</td>}

                      {visibleColumns.email && (
                        <td className="p-3.5 font-mono text-epfo-accent truncate max-w-[160px]" title={user.officialEmail}>
                          {user.officialEmail}
                        </td>
                      )}

                      {visibleColumns.username && <td className="p-3.5 font-mono">{user.username}</td>}

                      {visibleColumns.role && (
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-epfo-navy/10 text-epfo-navy dark:bg-epfo-accent/20 dark:text-epfo-accent">
                            {user.role}
                          </span>
                        </td>
                      )}

                      {visibleColumns.status && (
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                            user.status === 'LOCKED' ? 'bg-red-500/10 text-red-500' :
                            user.status === 'SUSPENDED' ? 'bg-amber-500/10 text-amber-600' :
                            'bg-slate-500/10 text-slate-500'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                      )}

                      {visibleColumns.lastLogin && (
                        <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                      )}

                      {/* Row Action Trigger Menu */}
                      <td className="p-3.5 text-right relative">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewUser(user)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="View User Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onEditUser(user)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Edit User"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onResetPassword(user)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Password & Security"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                          </button>

                          <button
                            onClick={() => setOpenActionMenuId(openActionMenuId === user.id ? null : user.id)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Dropdown Action Popup */}
                        {openActionMenuId === user.id && (
                          <div
                            className="absolute right-3 top-10 z-40 w-48 bg-card border border-border rounded-xl shadow-xl p-1 text-xs space-y-0.5 text-left animate-in fade-in duration-100"
                            onClick={() => setOpenActionMenuId(null)}
                          >
                            <button
                              onClick={() => onViewActivity(user)}
                              className="w-full px-3 py-1.5 rounded-lg hover:bg-muted flex items-center gap-2 font-medium"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-500" />
                              <span>View Activity Log</span>
                            </button>

                            <button
                              onClick={() => onViewLoginHistory(user)}
                              className="w-full px-3 py-1.5 rounded-lg hover:bg-muted flex items-center gap-2 font-medium"
                            >
                              <Lock className="w-3.5 h-3.5 text-purple-500" />
                              <span>View Login Security</span>
                            </button>

                            {user.status === 'ACTIVE' ? (
                              <button
                                disabled={isSuperAdmin}
                                onClick={() => onToggleStatus(user, 'INACTIVE')}
                                className="w-full px-3 py-1.5 rounded-lg hover:bg-muted text-amber-600 dark:text-amber-400 flex items-center gap-2 font-medium disabled:opacity-40"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Deactivate User</span>
                              </button>
                            ) : (
                              <button
                                disabled={isSuperAdmin}
                                onClick={() => onToggleStatus(user, 'ACTIVE')}
                                className="w-full px-3 py-1.5 rounded-lg hover:bg-muted text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-medium disabled:opacity-40"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Activate User</span>
                              </button>
                            )}

                            <button
                              disabled={isSuperAdmin}
                              onClick={() => onDeleteUser(user)}
                              className="w-full px-3 py-1.5 rounded-lg hover:bg-red-500/10 text-red-500 flex items-center gap-2 font-medium disabled:opacity-40"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Record</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="p-3.5 border-t border-border bg-muted/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-input bg-card focus:ring-1 focus:ring-epfo-navy outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-3 font-semibold">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
