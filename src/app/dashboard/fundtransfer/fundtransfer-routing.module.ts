import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundtransferComponent } from './fundtransfer.component';

const routes: Routes = [{ path: '', component: FundtransferComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundtransferRoutingModule { }
