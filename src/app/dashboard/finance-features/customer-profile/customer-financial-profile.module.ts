import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FinanceMaterialModule } from '../finance-material.module';
import { CustomerFinancialProfileComponent } from './customer-financial-profile.component';

const routes: Routes = [{ path: '', component: CustomerFinancialProfileComponent }];
@NgModule({
  declarations: [CustomerFinancialProfileComponent],
  imports: [CommonModule, ReactiveFormsModule, FinanceMaterialModule, RouterModule.forChild(routes)]
})
export class CustomerFinancialProfileModule { }
