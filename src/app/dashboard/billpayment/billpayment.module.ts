import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BillpaymentRoutingModule } from './billpayment-routing.module';
import { BillpaymentComponent } from './billpayment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { directivesModules } from 'src/app/directives/directives.modules';


@NgModule({
  declarations: [
    BillpaymentComponent,
  ],
  imports: [
    CommonModule,
    BillpaymentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    directivesModules,
  ],
  providers:[DatePipe]

})
export class BillpaymentModule { }
