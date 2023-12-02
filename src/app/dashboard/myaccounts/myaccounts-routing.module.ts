import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyaccountsComponent } from './myaccounts.component';
import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { MiniStatementComponent } from './mini-statement/mini-statement.component';
import { MPassbookComponent } from './m-passbook/m-passbook.component';
import { ViewDownloadStatementComponent } from './view-download-statement/view-download-statement.component';
import { EStatementSubscriptionComponent } from './e-statement-subscription/e-statement-subscription.component';

const routes: 
    Routes = [
               { path: '', component: MyaccountsComponent,
                 children:[
                     { path: '', redirectTo:'account-summary',pathMatch:'full' },
                     { path: 'account-summary', component: AccountSummaryComponent },
                     { path: 'mini-statement', component: MiniStatementComponent },
                     { path: 'm-passbook', component: MPassbookComponent },
                     { path: 'view-download', component: ViewDownloadStatementComponent },
                     { path: 'e-statement', component: EStatementSubscriptionComponent },
                 ]
               }
             ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyaccountsRoutingModule { }
