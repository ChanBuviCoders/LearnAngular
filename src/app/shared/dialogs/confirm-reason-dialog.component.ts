import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmReasonData {
  title: string;
  message: string;
  confirmLabel?: string;
  requireReason?: boolean;
  danger?: boolean;
}

@Component({
  standalone: false,
  selector: 'app-confirm-reason-dialog',
  templateUrl: './confirm-reason-dialog.component.html',
  styleUrls: ['./confirm-reason-dialog.component.css']
})
export class ConfirmReasonDialogComponent {
  readonly reason = new FormControl('', this.data.requireReason ? Validators.required : []);

  constructor(
    readonly dialogRef: MatDialogRef<ConfirmReasonDialogComponent, string | undefined>,
    @Inject(MAT_DIALOG_DATA) readonly data: ConfirmReasonData) {}

  confirm(): void {
    if (this.data.requireReason) {
      if (this.reason.invalid) {
        this.reason.markAsTouched();
        return;
      }
      this.dialogRef.close(this.reason.value?.trim());
      return;
    }
    this.dialogRef.close('');
  }
}
