import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FinanceMaterialModule } from '../finance-material.module';
import { BusinessSettingsComponent } from './business-settings.component';

const routes: Routes = [{ path: '', component: BusinessSettingsComponent }];
@NgModule({
  declarations: [BusinessSettingsComponent],
  imports: [CommonModule, ReactiveFormsModule, FinanceMaterialModule, RouterModule.forChild(routes)]
})
export class BusinessSettingsModule { }
