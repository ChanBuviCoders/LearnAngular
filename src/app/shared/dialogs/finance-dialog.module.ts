import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmReasonDialogComponent } from './confirm-reason-dialog.component';

@NgModule({
  declarations: [ConfirmReasonDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  exports: [MatDialogModule, ConfirmReasonDialogComponent]
})
export class FinanceDialogModule {}
