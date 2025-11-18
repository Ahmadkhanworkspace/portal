export type UserRole = 'Admin' | 'Supervisor' | 'User';

export interface Permissions {
  canManageUsers: boolean;
  canManageForms: boolean;
  canManageIPs: boolean;
  canViewSubmissions: boolean;
  canManageRequests: boolean;
  canDeleteForms: boolean;
  canEditForms: boolean;
  canCreateForms: boolean;
}

export function getPermissions(role: UserRole): Permissions {
  switch (role) {
    case 'Admin':
      return {
        canManageUsers: true,
        canManageForms: true,
        canManageIPs: true,
        canViewSubmissions: true,
        canManageRequests: true,
        canDeleteForms: true,
        canEditForms: true,
        canCreateForms: true,
      };
    case 'Supervisor':
      return {
        canManageUsers: false,
        canManageForms: true,
        canManageIPs: false,
        canViewSubmissions: true,
        canManageRequests: true,
        canDeleteForms: false,
        canEditForms: true,
        canCreateForms: true,
      };
    case 'User':
      return {
        canManageUsers: false,
        canManageForms: false,
        canManageIPs: false,
        canViewSubmissions: false,
        canManageRequests: false,
        canDeleteForms: false,
        canEditForms: false,
        canCreateForms: false,
      };
    default:
      return {
        canManageUsers: false,
        canManageForms: false,
        canManageIPs: false,
        canViewSubmissions: false,
        canManageRequests: false,
        canDeleteForms: false,
        canEditForms: false,
        canCreateForms: false,
      };
  }
}

export function requirePermission(
  userRole: UserRole | undefined,
  permission: keyof Permissions
): boolean {
  if (!userRole) return false;
  const permissions = getPermissions(userRole);
  return permissions[permission];
}

