import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceMaterialModule } from '../finance-material.module';
import { RoleAdministrationComponent } from './role-administration.component';

const routes: Routes = [{ path: '', component: RoleAdministrationComponent }];

@NgModule({
  declarations: [RoleAdministrationComponent],
  imports: [CommonModule, FinanceMaterialModule, RouterModule.forChild(routes)]
})
export class RoleAdministrationModule { }
