import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FundtransferRoutingModule } from './fundtransfer-routing.module';
import { FundtransferComponent } from './fundtransfer.component';
import { ModalModule ,BsModalService} from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { directivesModules } from 'src/app/directives/directives.modules';


@NgModule({
  declarations: [
    FundtransferComponent,
  ],
  imports: [
    CommonModule,
    FundtransferRoutingModule,
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
export class FundtransferModule { }
