import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EDepositRoutingModule } from './e-deposit-routing.module';
import { EDepositComponent } from './e-deposit.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { RgbToHexComponent } from './rgb-to-hex/rgb-to-hex.component';
import { FormsModule } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { SafeUrlPipe } from 'src/app/pipes/SafeUrlPipe';


@NgModule({
  declarations: [
    EDepositComponent,
    FileUploadComponent,
    RgbToHexComponent,
  ],
  imports: [
    CommonModule,
    EDepositRoutingModule,
    FormsModule,
    ModalModule,
    SafeUrlPipe
  ],
  providers:[BsModalService],
})
export class EDepositModule { }
