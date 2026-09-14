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
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
      <mat-form-field *ngIf="data.requireReason" appearance="outline" class="reason">
        <mat-label>Reason</mat-label>
        <textarea matInput rows="3" [formControl]="reason"></textarea>
        <mat-error>Reason is required</mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
      <button mat-flat-button type="button" [color]="data.danger ? 'warn' : 'primary'" (click)="confirm()">
        {{ data.confirmLabel || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`p{margin:0 0 12px;color:#445}.reason{width:100%;margin-top:8px}`]
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
