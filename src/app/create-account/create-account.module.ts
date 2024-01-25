import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CreateAccountRoutingModule } from './create-account-routing.module';
import { CreateAccountComponent } from './create-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { directivesModules } from '../directives/directives.modules';


@NgModule({
  declarations: [
    CreateAccountComponent,
  ],
  imports: [
    CommonModule,
    CreateAccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    directivesModules
  ],
  providers:[DatePipe]
})
export class CreateAccountModule { }
