import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfirmReasonData, ConfirmReasonDialogComponent } from '../dialogs/confirm-reason-dialog.component';

@Injectable({ providedIn: 'root' })
export class FinanceDialogService {
  constructor(private readonly dialog: MatDialog) {}

  confirm(data: ConfirmReasonData): Observable<string> {
    return this.dialog.open(ConfirmReasonDialogComponent, {
      width: '420px',
      data,
      disableClose: true
    }).afterClosed().pipe(filter((value): value is string => value !== undefined));
  }
}
