import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SubjectService } from './subjectService';

export const FINANCE_STAFF_ROLES = [
  'ROLE_VIEWER', 'ROLE_COLLECTOR', 'ROLE_ACCOUNTANT', 'ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_USER_1'
];
export const FINANCE_REPORT_ROLES = [
  'ROLE_VIEWER', 'ROLE_ACCOUNTANT', 'ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_USER_1'
];
export const FINANCE_SETTINGS_ROLES = [
  'ROLE_ACCOUNTANT', 'ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_USER_1'
];
export const FINANCE_ADMIN_ROLES = ['ROLE_ADMIN', 'ROLE_USER_1'];

@Injectable({ providedIn: 'root' })
export class RoleAccessService {
  constructor(private readonly subject: SubjectService) {}

  authorities(): string[] {
    const user = this.subject.currentUser as { authorities?: string[]; userGroupId?: number } | undefined;
    const fromSession = user?.authorities ?? [];
    if (fromSession.length) {
      return fromSession;
    }
    return user?.userGroupId === 1 ? ['ROLE_USER_1'] : ['ROLE_VIEWER'];
  }

  hasAny(...roles: string[]): boolean {
    const current = this.authorities();
    return roles.some(role => current.includes(role));
  }

  canSee(item: { roles?: string[]; adminOnly?: boolean }): boolean {
    if (item.adminOnly) {
      return this.hasAny(...FINANCE_ADMIN_ROLES);
    }
    if (!item.roles?.length) {
      return true;
    }
    return this.hasAny(...item.roles);
  }

  canWriteCollections(): boolean {
    return this.hasAny('ROLE_COLLECTOR', 'ROLE_ACCOUNTANT', 'ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_USER_1');
  }

  canManageLoans(): boolean {
    return this.hasAny('ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_USER_1');
  }

  canConfigure(): boolean {
    return this.hasAny('ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_USER_1');
  }
}

export const financeRolesGuard: CanActivateFn = (route) => {
  const access = inject(RoleAccessService);
  const router = inject(Router);
  if (access.canSee({ roles: route.data['roles'], adminOnly: route.data['adminOnly'] })) {
    return true;
  }
  router.navigate(['/dashboard/financial-dashboard']);
  return false;
};
