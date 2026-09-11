import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { directivesModules } from '../directives/directives.modules';
import { SafeUrlPipe } from '../pipes/SafeUrlPipe';

@NgModule({
  declarations: [
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    directivesModules,
    CarouselModule.forRoot(),
    SafeUrlPipe
  ],
  providers:[DatePipe ]
})
export class ProfileModule { }
