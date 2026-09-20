import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FinanceRole, FinanceUser } from '../../../models/financial.models';
import { RoleAdministrationApiService } from '../../../shared/services/financial-domain-api.service';

@Component({
  standalone: false,
  selector: 'app-role-administration',
  templateUrl: './role-administration.component.html',
  styleUrls: ['./role-administration.component.css']
})
export class RoleAdministrationComponent implements OnInit {
  readonly columns = ['user', 'roles', 'permissions', 'status', 'actions'];
  users: FinanceUser[] = [];
  roles: FinanceRole[] = [];
  selectedRoles: Record<number, number[]> = {};
  loading = false;

  constructor(
    private readonly api: RoleAdministrationApiService,
    private readonly toast: ToastrService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    forkJoin({ users: this.api.getUsers(), roles: this.api.getRoles() }).subscribe({
      next: result => {
        this.users = result.users.data ?? [];
        this.roles = result.roles.data ?? [];
        this.selectedRoles = Object.fromEntries(
          this.users.map(user => [user.userId, user.roles.map(role => role.id)])
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Unable to load user roles');
      }
    });
  }

  saveRoles(user: FinanceUser): void {
    this.api.assignRoles(user.userId, this.selectedRoles[user.userId] ?? []).subscribe({
      next: response => {
        this.toast.success(response.message || 'Roles updated');
        this.load();
      },
      error: error => this.toast.error(error.error?.message || 'Unable to update roles')
    });
  }

  setStatus(user: FinanceUser): void {
    this.api.setStatus(user.userId, !user.active).subscribe({
      next: response => {
        this.toast.success(response.message || 'User status updated');
        this.load();
      },
      error: error => this.toast.error(error.error?.message || 'Unable to update user status')
    });
  }

  permissionSummary(user: FinanceUser): string {
    const roleIds = new Set(this.selectedRoles[user.userId] ?? []);
    return [...new Set(
      this.roles
        .filter(role => roleIds.has(role.id))
        .flatMap(role => role.permissions.map(permission => permission.permissionCode))
    )].join(', ') || '-';
  }
}
