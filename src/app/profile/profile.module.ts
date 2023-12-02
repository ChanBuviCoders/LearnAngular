import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { OnlynumberDirective } from '../directives/onlynumber.directive';
import { directivesModules } from '../directives/directives.modules';
import { CarouselModule } from 'ngx-bootstrap/carousel';

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
    CarouselModule.forRoot()
  ],
  providers:[DatePipe ]
})
export class ProfileModule { }
