import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FinanceMaterialModule } from '../finance-material.module';
import { AuditHistoryComponent } from './audit-history.component';

const routes: Routes = [{ path: '', component: AuditHistoryComponent }];
@NgModule({
  declarations: [AuditHistoryComponent],
  imports: [CommonModule, ReactiveFormsModule, FinanceMaterialModule, RouterModule.forChild(routes)]
})
export class AuditHistoryModule {}
