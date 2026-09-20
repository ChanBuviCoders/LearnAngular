import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CollectionFrequency, InterestMethod, LoanProduct } from '../../../models/financial.models';
import { FinancialApiService } from '../../../shared/services/financial-api.service';
import { RoleAccessService } from '../../../shared/services/role-access.service';

@Component({
  standalone: false,
  selector: 'app-loan-product-management',
  templateUrl: './loan-product-management.component.html',
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

  constructor(private readonly fb: FormBuilder, private readonly api: FinancialApiService, readonly access: RoleAccessService, private readonly toast: ToastrService) { }
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
    const raw = this.form.getRawValue();
    const payload: Partial<LoanProduct> = {
      ...raw,
      productCode: raw.productCode ?? undefined,
      productName: raw.productName ?? undefined,
      collectionFrequency: raw.collectionFrequency ?? undefined,
      interestMethod: raw.interestMethod ?? undefined,
      defaultInterestRate: raw.defaultInterestRate ?? undefined,
      defaultTermCount: raw.defaultTermCount ?? undefined,
      minAmount: raw.minAmount ?? undefined,
      maxAmount: raw.maxAmount ?? undefined,
      active: raw.active ?? undefined
    };
    const request = this.editingId
      ? this.api.updateLoanProduct(this.editingId, payload)
      : this.api.createLoanProduct(payload);
    request.subscribe({
      next: response => { this.toast.success(response.message || 'Product saved'); this.showForm = false; this.load(); },
      error: error => this.toast.error(error.error?.message || 'Unable to save product')
    });
  }
}
