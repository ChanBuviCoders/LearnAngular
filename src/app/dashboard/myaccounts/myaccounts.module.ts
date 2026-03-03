import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyaccountsRoutingModule } from './myaccounts-routing.module';
import { MyaccountsComponent } from './myaccounts.component';
import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { MiniStatementComponent } from './mini-statement/mini-statement.component';
import { MPassbookComponent } from './m-passbook/m-passbook.component';
import { ViewDownloadStatementComponent } from './view-download-statement/view-download-statement.component';
import { EStatementSubscriptionComponent } from './e-statement-subscription/e-statement-subscription.component';
// ng2-charts ChartsModule not compatible with Angular 19 - charts replaced with placeholder. Use ng2-charts v6+ or another chart lib.
@NgModule({
  declarations: [
    MyaccountsComponent,
    AccountSummaryComponent,
    MiniStatementComponent,
    MPassbookComponent,
    ViewDownloadStatementComponent,
    EStatementSubscriptionComponent
  ],
  imports: [
    CommonModule,
    MyaccountsRoutingModule
  ],
  providers:[]
})
export class MyaccountsModule { }
