import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceMaterialModule } from '../finance-material.module';
import { FinancialDashboardComponent } from './financial-dashboard.component';

const routes: Routes = [{ path: '', component: FinancialDashboardComponent }];

@NgModule({
  declarations: [FinancialDashboardComponent],
  imports: [CommonModule, FinanceMaterialModule, RouterModule.forChild(routes)]
})
export class FinancialDashboardModule {}
