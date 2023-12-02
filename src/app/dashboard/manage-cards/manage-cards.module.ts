import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCardsRoutingModule } from './manage-cards-routing.module';
import { ManageCardsComponent } from './manage-cards.component';


@NgModule({
  declarations: [
    ManageCardsComponent
  ],
  imports: [
    CommonModule,
    ManageCardsRoutingModule
  ]
})
export class ManageCardsModule { }
