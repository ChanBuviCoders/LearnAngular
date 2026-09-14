import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FINANCE_SETTINGS_ROLES, FINANCE_STAFF_ROLES, financeRolesGuard } from '../../shared/services/role-access.service';
import { CollectionManagementComponent } from './collection-management/collection-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { LoanManagementComponent } from './loan-management/loan-management.component';
import { LoanProductManagementComponent } from './loan-products/loan-product-management.component';

const routes: Routes = [
  { path: 'customers', component: CustomerManagementComponent, canActivate: [financeRolesGuard], data: { roles: FINANCE_STAFF_ROLES } },
  { path: 'loans', component: LoanManagementComponent, canActivate: [financeRolesGuard], data: { roles: FINANCE_STAFF_ROLES } },
  { path: 'loan-products', component: LoanProductManagementComponent, canActivate: [financeRolesGuard], data: { roles: FINANCE_SETTINGS_ROLES } },
  { path: 'collections', component: CollectionManagementComponent, canActivate: [financeRolesGuard], data: { roles: FINANCE_STAFF_ROLES } },
  { path: 'collections/daily', component: CollectionManagementComponent, canActivate: [financeRolesGuard], data: { frequency: 'DAILY', roles: FINANCE_STAFF_ROLES } },
  { path: 'collections/weekly', component: CollectionManagementComponent, canActivate: [financeRolesGuard], data: { frequency: 'WEEKLY', roles: FINANCE_STAFF_ROLES } },
  { path: 'collections/monthly', component: CollectionManagementComponent, canActivate: [financeRolesGuard], data: { frequency: 'MONTHLY', roles: FINANCE_STAFF_ROLES } },
  { path: '', redirectTo: 'customers', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule {}
