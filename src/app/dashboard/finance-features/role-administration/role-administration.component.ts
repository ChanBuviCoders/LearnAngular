import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FinanceRole, FinanceUser } from '../../../models/financial.models';
import { RoleAdministrationApiService } from '../../../shared/services/financial-domain-api.service';

@Component({
  standalone: false,
  selector: 'app-role-administration',
  template: `
    <section class="feature-page">
      <header>
        <h2>User & Role Management</h2>
        <p>Assign financial permissions and control user access.</p>
      </header>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="users">
            <ng-container matColumnDef="user">
              <th mat-header-cell *matHeaderCellDef>User</th>
              <td mat-cell *matCellDef="let user">
                <strong>{{user.firstName}} {{user.lastName}}</strong>
                <small>{{user.userName}} · {{user.email || 'No email'}}</small>
              </td>
            </ng-container>
            <ng-container matColumnDef="roles">
              <th mat-header-cell *matHeaderCellDef>Roles</th>
              <td mat-cell *matCellDef="let user">
                <mat-form-field appearance="outline">
                  <mat-label>Assigned roles</mat-label>
                  <mat-select multiple [(value)]="selectedRoles[user.userId]">
                    <mat-option *ngFor="let role of roles" [value]="role.id">
                      {{role.roleName}}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </td>
            </ng-container>
            <ng-container matColumnDef="permissions">
              <th mat-header-cell *matHeaderCellDef>Effective permissions</th>
              <td mat-cell *matCellDef="let user">{{permissionSummary(user)}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let user">{{user.active ? 'Active' : 'Inactive'}}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let user">
                <button mat-flat-button color="primary" (click)="saveRoles(user)">Save roles</button>
                <button mat-button [color]="user.active ? 'warn' : 'primary'" (click)="setStatus(user)">
                  {{user.active ? 'Deactivate' : 'Activate'}}
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>
          <p class="empty" *ngIf="!loading && users.length === 0">No users found.</p>
        </mat-card-content>
      </mat-card>

      <mat-card class="role-reference">
        <mat-card-header><mat-card-title>Role permissions</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="role-grid">
            <div *ngFor="let role of roles">
              <strong>{{role.roleName}}</strong>
              <p>{{role.description}}</p>
              <small>{{role.permissions.join(', ') || 'No permissions'}}</small>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </section>`,
  styles: [`
    .feature-page{padding:24px;max-width:1500px;margin:auto}h2{margin:0}header p,.empty,td small{color:#667}
    table{width:100%}td strong,td small{display:block}td mat-form-field{width:240px;margin-top:14px}
    td button{margin-right:8px}.role-reference{margin-top:18px}.role-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
    .role-grid div{background:#f6f8fa;padding:14px;border-radius:6px}.role-grid p{margin:5px 0}.empty{text-align:center;padding:30px}
  `]
})
export class RoleAdministrationComponent implements OnInit {
  readonly columns = ['user', 'roles', 'permissions', 'status', 'actions'];
  users: FinanceUser[] = [];
  roles: FinanceRole[] = [];
  selectedRoles: Record<number, number[]> = {};
  loading = false;

  constructor(
    private readonly api: RoleAdministrationApiService,
    private readonly toast: ToastrService) {}

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
