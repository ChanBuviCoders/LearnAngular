import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FinanceMaterialModule } from '../finance-material.module';
import { ReportsComponent } from './reports.component';

const routes: Routes = [{ path: '', component: ReportsComponent }];
@NgModule({
  declarations: [ReportsComponent],
  imports: [CommonModule, ReactiveFormsModule, FinanceMaterialModule, RouterModule.forChild(routes)]
})
export class ReportsModule { }
