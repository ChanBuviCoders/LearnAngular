import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

const MATERIAL = [
  MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatExpansionModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule,
  MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatTableModule,
  MatTabsModule
];

@NgModule({
  imports: MATERIAL,
  exports: MATERIAL
})
export class FinanceMaterialModule { }
