import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FinanceDialogModule } from '../../shared/dialogs/finance-dialog.module';
import { CollectionManagementComponent } from './collection-management/collection-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { LoanManagementComponent } from './loan-management/loan-management.component';
import { LoanProductManagementComponent } from './loan-products/loan-product-management.component';

@NgModule({
  declarations: [
    CustomerManagementComponent,
    LoanManagementComponent,
    LoanProductManagementComponent,
    CollectionManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FinanceRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    FinanceDialogModule
  ]
})
export class FinanceModule {}
