import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BillpaymentRoutingModule } from './billpayment-routing.module';
import { BillpaymentComponent } from './billpayment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxDataGridModule, DxTemplateModule, DxTooltipModule } from 'devextreme-angular';
import { OnlynumberDirective } from 'src/app/directives/onlynumber.directive';


@NgModule({
  declarations: [
    BillpaymentComponent,
  ],
  imports: [
    CommonModule,
    BillpaymentRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    DxTooltipModule,
    DxTemplateModule,
    DxDataGridModule,
  ],
  providers:[DatePipe]

})
export class BillpaymentModule { }
