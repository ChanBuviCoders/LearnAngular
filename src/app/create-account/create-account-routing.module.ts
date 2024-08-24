import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './create-account.component';
import { canDeactivateGuard } from '../shared/services/canDeactivate/CanDeactivateGuard';

const routes: Routes = [{ path: '', component: CreateAccountComponent,canDeactivate:[canDeactivateGuard]},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateAccountRoutingModule { }
