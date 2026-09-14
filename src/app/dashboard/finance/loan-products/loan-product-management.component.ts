import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CollectionFrequency, InterestMethod, LoanProduct } from '../../../models/financial.models';
import { FinancialApiService } from '../../../shared/services/financial-api.service';
import { RoleAccessService } from '../../../shared/services/role-access.service';

@Component({
  standalone: false,
  selector: 'app-loan-product-management',
  template: `
  <section class="finance-page">
    <header class="page-header">
      <div>
        <h2>Loan Products</h2>
        <p>Configure daily, weekly, and monthly calculation defaults.</p>
      </div>
      <button mat-flat-button color="primary" *ngIf="access.canConfigure()" (click)="newProduct()">New product</button>
    </header>
    <mat-card *ngIf="showForm" class="editor">
      <mat-card-content>
        <form [formGroup]="form" class="form-grid" (ngSubmit)="save()">
          <mat-form-field appearance="outline"><mat-label>Product code</mat-label><input matInput formControlName="productCode"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="productName"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Frequency</mat-label>
            <mat-select formControlName="collectionFrequency" (selectionChange)="syncMethod($event.value)">
              <mat-option value="DAILY">Daily</mat-option>
              <mat-option value="WEEKLY">Weekly</mat-option>
              <mat-option value="MONTHLY">Monthly</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Interest method</mat-label>
            <mat-select formControlName="interestMethod">
              <mat-option value="UPFRONT">Upfront</mat-option>
              <mat-option value="FLAT">Flat</mat-option>
              <mat-option value="REDUCING_BALANCE">Reducing balance</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Default interest %</mat-label><input matInput type="number" step="0.01" formControlName="defaultInterestRate"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Default term count</mat-label><input matInput type="number" formControlName="defaultTermCount"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Minimum amount</mat-label><input matInput type="number" formControlName="minAmount"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Maximum amount</mat-label><input matInput type="number" formControlName="maxAmount"></mat-form-field>
          <div class="form-actions">
            <button mat-button type="button" (click)="showForm=false">Cancel</button>
            <button mat-flat-button color="primary" type="submit">Save product</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="products" class="full-width">
          <ng-container matColumnDef="productCode"><th mat-header-cell *matHeaderCellDef>Code</th><td mat-cell *matCellDef="let r">{{r.productCode}}</td></ng-container>
          <ng-container matColumnDef="productName"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let r">{{r.productName}}</td></ng-container>
          <ng-container matColumnDef="collectionFrequency"><th mat-header-cell *matHeaderCellDef>Frequency</th><td mat-cell *matCellDef="let r">{{r.collectionFrequency}}</td></ng-container>
          <ng-container matColumnDef="interestMethod"><th mat-header-cell *matHeaderCellDef>Method</th><td mat-cell *matCellDef="let r">{{r.interestMethod}}</td></ng-container>
          <ng-container matColumnDef="defaultInterestRate"><th mat-header-cell *matHeaderCellDef>Rate %</th><td mat-cell *matCellDef="let r">{{r.defaultInterestRate}}</td></ng-container>
          <ng-container matColumnDef="defaultTermCount"><th mat-header-cell *matHeaderCellDef>Terms</th><td mat-cell *matCellDef="let r">{{r.defaultTermCount}}</td></ng-container>
          <ng-container matColumnDef="active"><th mat-header-cell *matHeaderCellDef>Active</th><td mat-cell *matCellDef="let r">{{r.active ? 'Yes' : 'No'}}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r"><button mat-button *ngIf="access.canConfigure()" (click)="edit(r)">Edit</button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  </section>`,
  styleUrls: ['../customer-management/customer-management.component.css']
})
export class LoanProductManagementComponent implements OnInit {
  readonly columns = ['productCode', 'productName', 'collectionFrequency', 'interestMethod', 'defaultInterestRate', 'defaultTermCount', 'active', 'actions'];
  products: LoanProduct[] = [];
  showForm = false;
  editingId?: number;
  readonly form = this.fb.group({
    productCode: ['', Validators.required],
    productName: ['', Validators.required],
    collectionFrequency: ['DAILY' as CollectionFrequency, Validators.required],
    interestMethod: ['UPFRONT' as InterestMethod, Validators.required],
    defaultInterestRate: [0, [Validators.required, Validators.min(0)]],
    defaultTermCount: [1, [Validators.required, Validators.min(1)]],
    minAmount: [null as number | null],
    maxAmount: [null as number | null],
    active: [true]
  });

  constructor(private readonly fb: FormBuilder, private readonly api: FinancialApiService, readonly access: RoleAccessService, private readonly toast: ToastrService) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.api.getLoanProducts().subscribe({
      next: response => this.products = response.data ?? [],
      error: () => this.toast.error('Unable to load loan products')
    });
  }
  syncMethod(frequency: CollectionFrequency): void {
    const method: InterestMethod = frequency === 'DAILY' ? 'UPFRONT' : frequency === 'WEEKLY' ? 'FLAT' : 'REDUCING_BALANCE';
    this.form.patchValue({ interestMethod: method });
  }
  newProduct(): void {
    this.editingId = undefined;
    this.form.reset({ collectionFrequency: 'DAILY', interestMethod: 'UPFRONT', defaultInterestRate: 0, defaultTermCount: 1, active: true });
    this.showForm = true;
  }
  edit(product: LoanProduct): void {
    this.editingId = product.id;
    this.form.patchValue(product);
    this.showForm = true;
  }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const request = this.editingId
      ? this.api.updateLoanProduct(this.editingId, this.form.getRawValue())
      : this.api.createLoanProduct(this.form.getRawValue());
    request.subscribe({
      next: response => { this.toast.success(response.message || 'Product saved'); this.showForm = false; this.load(); },
      error: error => this.toast.error(error.error?.message || 'Unable to save product')
    });
  }
}
