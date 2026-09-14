import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import {
  FINANCE_REPORT_ROLES,
  FINANCE_SETTINGS_ROLES,
  FINANCE_STAFF_ROLES,
  financeRolesGuard
} from '../shared/services/role-access.service';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'financial-dashboard', pathMatch: 'full' },
      { path: 'myAct', loadChildren: () => import('./myaccounts/myaccounts.module').then(m => m.MyaccountsModule) },
      { path: 'fundTrs', loadChildren: () => import('./fundtransfer/fundtransfer.module').then(m => m.FundtransferModule) },
      { path: 'e-deposit', loadChildren: () => import('./e-deposit/e-deposit.module').then(m => m.EDepositModule) },
      { path: 'billpayment', loadChildren: () => import('./billpayment/billpayment.module').then(m => m.BillpaymentModule) },
      { path: 'topup-recharge', loadChildren: () => import('./topup-recharge/topup-recharge.module').then(m => m.TopupRechargeModule) },
      { path: 'manageCards', loadChildren: () => import('./manage-cards/manage-cards.module').then(m => m.ManageCardsModule) },
      { path: 'services', loadChildren: () => import('./service/service.module').then(m => m.ServiceModule) },
      { path: 'requests', loadChildren: () => import('./request/request.module').then(m => m.RequestModule) },
      {
        path: 'finance',
        loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule),
        canActivate: [financeRolesGuard],
        data: { roles: FINANCE_STAFF_ROLES }
      },
      {
        path: 'financial-dashboard',
        loadChildren: () => import('./finance-features/financial-dashboard/financial-dashboard.module').then(m => m.FinancialDashboardModule),
        canActivate: [financeRolesGuard],
        data: { roles: FINANCE_STAFF_ROLES }
      },
      {
        path: 'chits',
        loadChildren: () => import('./finance-features/chits/chits.module').then(m => m.ChitsModule),
        canActivate: [financeRolesGuard],
        data: { roles: FINANCE_STAFF_ROLES }
      },
      {
        path: 'reports',
        loadChildren: () => import('./finance-features/reports/reports.module').then(m => m.ReportsModule),
        canActivate: [financeRolesGuard],
        data: { roles: FINANCE_REPORT_ROLES }
      },
      {
        path: 'customer-profile',
        loadChildren: () => import('./finance-features/customer-profile/customer-financial-profile.module').then(m => m.CustomerFinancialProfileModule),
        canActivate: [financeRolesGuard],
        data: { roles: FINANCE_STAFF_ROLES }
      },
      {
        path: 'settings',
        loadChildren: () => import('./finance-features/settings/business-settings.module').then(m => m.BusinessSettingsModule),
        canActivate: [financeRolesGuard],
        data: { roles: FINANCE_SETTINGS_ROLES }
      },
      {
        path: 'audit',
        loadChildren: () => import('./finance-features/audit/audit-history.module').then(m => m.AuditHistoryModule),
        canActivate: [financeRolesGuard],
        data: { roles: FINANCE_SETTINGS_ROLES }
      },
      {
        path: 'user-roles',
        loadChildren: () => import('./finance-features/role-administration/role-administration.module').then(m => m.RoleAdministrationModule),
        canActivate: [financeRolesGuard],
        data: { adminOnly: true }
      },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
