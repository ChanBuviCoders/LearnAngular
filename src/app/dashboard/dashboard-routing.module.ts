import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes:
  Routes = [
    {
      path: '', component: DashboardComponent,
      children: [
        { path: '', redirectTo: "myAct",pathMatch:"full"},
        { path: 'myAct', loadChildren: () => import('./myaccounts/myaccounts.module').then(m => m.MyaccountsModule) },
        { path: 'fundTrs', loadChildren: () => import('./fundtransfer/fundtransfer.module').then(m => m.FundtransferModule) },
        { path: 'e-deposit', loadChildren: () => import('./e-deposit/e-deposit.module').then(m => m.EDepositModule) },
        { path: 'billpayment', loadChildren: () => import('./billpayment/billpayment.module').then(m => m.BillpaymentModule) },
        { path: 'topup-recharge', loadChildren: () => import('./topup-recharge/topup-recharge.module').then(m => m.TopupRechargeModule) },
        { path: 'manageCards', loadChildren: () => import('./manage-cards/manage-cards.module').then(m => m.ManageCardsModule) },
        { path: 'services', loadChildren: () => import('./service/service.module').then(m => m.ServiceModule) },
        { path: 'requests', loadChildren: () => import('./request/request.module').then(m => m.RequestModule) },
      ]
    },
  ]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
