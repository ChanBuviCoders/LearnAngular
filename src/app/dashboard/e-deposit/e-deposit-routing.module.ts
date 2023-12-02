import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EDepositComponent } from './e-deposit.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { RgbToHexComponent } from './rgb-to-hex/rgb-to-hex.component';

const routes:
  Routes = [
            { path: '', component: EDepositComponent,
              children:[
                { path:'',redirectTo:"file-upload" ,pathMatch:"full"},
                { path: 'file-upload', component: FileUploadComponent },
                { path: 'rgbToHex', component: RgbToHexComponent },
              ] },
            

          ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EDepositRoutingModule { }
