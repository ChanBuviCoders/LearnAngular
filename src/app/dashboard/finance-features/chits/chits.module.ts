import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FinanceMaterialModule } from '../finance-material.module';
import { ChitsComponent } from './chits.component';

const routes: Routes = [{ path: '', component: ChitsComponent }];

@NgModule({
  declarations: [ChitsComponent],
  imports: [CommonModule, ReactiveFormsModule, FinanceMaterialModule, RouterModule.forChild(routes)]
})
export class ChitsModule { }
