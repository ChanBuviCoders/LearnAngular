import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EDepositRoutingModule } from './e-deposit-routing.module';
import { EDepositComponent } from './e-deposit.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { RgbToHexComponent } from './rgb-to-hex/rgb-to-hex.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EDepositComponent,
    FileUploadComponent,
    RgbToHexComponent
  ],
  imports: [
    CommonModule,
    EDepositRoutingModule,
    FormsModule
  ]
})
export class EDepositModule { }
