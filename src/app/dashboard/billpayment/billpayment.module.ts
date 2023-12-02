import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillpaymentRoutingModule } from './billpayment-routing.module';
import { BillpaymentComponent } from './billpayment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BillpaymentComponent
  ],
  imports: [
    CommonModule,
    BillpaymentRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BillpaymentModule { }
