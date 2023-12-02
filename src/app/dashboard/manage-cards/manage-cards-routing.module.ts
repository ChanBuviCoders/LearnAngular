import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCardsComponent } from './manage-cards.component';

const routes: Routes = [{ path: '', component: ManageCardsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCardsRoutingModule { }
