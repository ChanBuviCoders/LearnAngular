import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopupRechargeComponent } from './topup-recharge.component';

const routes: Routes = [{ path: '', component: TopupRechargeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopupRechargeRoutingModule { }
