import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FundtransferRoutingModule } from './fundtransfer-routing.module';
import { FundtransferComponent } from './fundtransfer.component';
import { DxDataGridModule, DxTemplateModule, DxTooltipModule } from 'devextreme-angular';

import { ModalModule ,BsModalService} from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    DxTooltipModule,
    DxTemplateModule,
    DxDataGridModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    directivesModules
  ],
  providers:[BsModalService,DatePipe]
})
export class FundtransferModule { }
