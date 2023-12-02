import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopupRechargeRoutingModule } from './topup-recharge-routing.module';
import { TopupRechargeComponent } from './topup-recharge.component';


@NgModule({
  declarations: [
    TopupRechargeComponent
  ],
  imports: [
    CommonModule,
    TopupRechargeRoutingModule
  ]
})
export class TopupRechargeModule { }
