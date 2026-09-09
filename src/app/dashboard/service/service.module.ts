import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ServiceComponent } from './service.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { directivesModules } from 'src/app/directives/directives.modules';


@NgModule({
  declarations: [
    ServiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    ServiceRoutingModule,
    TabsModule,
    ModalModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    directivesModules
  ],
  providers:[BsModalService,DatePipe]
})
export class ServiceModule { }
