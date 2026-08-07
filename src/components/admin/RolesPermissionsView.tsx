import React, { useState } from 'react';
import { Shield, Check, Save, Info } from 'lucide-react';
import { UserRole, PermissionModule, PermissionAction, RolePermissionsMap } from '@/types';
import { ALL_PERMISSION_MODULES, ALL_PERMISSION_ACTIONS } from '@/lib/userStorage';

interface RolesPermissionsViewProps {
  rbacMatrix: RolePermissionsMap;
  onSaveRBACMatrix: (updatedMatrix: RolePermissionsMap) => void;
}

export const RolesPermissionsView: React.FC<RolesPermissionsViewProps> = ({
  rbacMatrix,
  onSaveRBACMatrix,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('ENFORCEMENT_OFFICER');
  const [matrixState, setMatrixState] = useState<RolePermissionsMap>(rbacMatrix);
  const [hasChanges, setHasChanges] = useState(false);

  const rolesList: { role: UserRole; label: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin' },
    { role: 'REGIONAL_PF_COMMISSIONER', label: 'Regional PF Commissioner' },
    { role: 'ADDITIONAL_CENTRAL_PF_COMMISSIONER', label: 'Additional Central PF Commissioner' },
    { role: 'ASSISTANT_PF_COMMISSIONER', label: 'Assistant PF Commissioner' },
    { role: 'ENFORCEMENT_OFFICER', label: 'Enforcement Officer' },
    { role: 'ACCOUNTS_OFFICER', label: 'Accounts Officer' },
    { role: 'SECTION_SUPERVISOR', label: 'Section Supervisor' },
    { role: 'DATA_ENTRY_OPERATOR', label: 'Data Entry Operator' },
    { role: 'READ_ONLY', label: 'Read Only' },
    { role: 'AUDITOR', label: 'Auditor' },
  ];

  const currentRolePermissions = matrixState[selectedRole] || {};

  const handleTogglePermission = (module: PermissionModule, action: PermissionAction) => {
    if (selectedRole === 'SUPER_ADMIN') return; // Super admin permissions are immutable

    const existingActions = currentRolePermissions[module] || [];
    const isGranted = existingActions.includes(action);

    let updatedActions: PermissionAction[];
    if (isGranted) {
      updatedActions = existingActions.filter((a) => a !== action);
    } else {
      updatedActions = [...existingActions, action];
    }

    const updatedRoleMap = {
      ...currentRolePermissions,
      [module]: updatedActions,
    };

    setMatrixState({
      ...matrixState,
      [selectedRole]: updatedRoleMap,
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSaveRBACMatrix(matrixState);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-epfo-navy text-white dark:bg-epfo-accent dark:text-epfo-navy">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-xs text-muted-foreground">Configure module permission matrix and granular action rules</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold text-white bg-epfo-navy hover:bg-epfo-dark dark:bg-epfo-accent dark:text-epfo-navy rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Permissions</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex border-b border-border bg-muted/30 p-2 gap-1.5 overflow-x-auto rounded-2xl">
        {rolesList.map((item) => (
          <button
            key={item.role}
            onClick={() => setSelectedRole(item.role)}
            className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              selectedRole === item.role
                ? 'bg-epfo-navy text-white shadow-md dark:bg-epfo-accent dark:text-epfo-navy font-bold'
                : 'text-muted-foreground hover:text-foreground hover:bg-card'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Permission Grid Matrix */}
      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
        <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between">
          <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider">
            Permission Matrix for: <span className="text-foreground">{rolesList.find((r) => r.role === selectedRole)?.label}</span>
          </h4>
          {selectedRole === 'SUPER_ADMIN' && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Super Admin retains unrestricted permissions
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/60 font-bold border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Module Name</th>
                {ALL_PERMISSION_ACTIONS.map((action) => (
                  <th key={action} className="p-3.5 text-center">
                    {action}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ALL_PERMISSION_MODULES.map((module) => {
                const actionsGranted = currentRolePermissions[module] || [];
                return (
                  <tr key={module} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">{module}</td>
                    {ALL_PERMISSION_ACTIONS.map((action) => {
                      const isChecked = actionsGranted.includes(action);
                      const isDisabled = selectedRole === 'SUPER_ADMIN';

                      return (
                        <td key={action} className="p-3.5 text-center">
                          <button
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleTogglePermission(module, action)}
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center mx-auto transition-all ${
                              isChecked
                                ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                                : 'border-input bg-background hover:border-epfo-navy'
                            } ${isDisabled && 'opacity-60 cursor-not-allowed'}`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
