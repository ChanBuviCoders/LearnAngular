import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { Customer, CustomerInput } from '../../../models/financial.models';
import { FinanceDialogService } from '../../../shared/services/finance-dialog.service';
import { FinancialApiService } from '../../../shared/services/financial-api.service';

@Component({
  standalone: false,
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit {
  readonly columns = ['customerCode', 'name', 'mobileNumber', 'city', 'status', 'actions'];
  private readonly avatarColors = ['#f4b400', '#4285f4', '#ea4335', '#34a853', '#7b1fa2', '#00838f'];
  customers: Customer[] = [];
  editingId?: number;
  loading = false;
  showForm = false;
  search = '';
  page = 0;
  size = 25;
  total = 0;

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', Validators.maxLength(100)],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
    alternateMobileNumber: ['', Validators.pattern(/^[0-9]{10,15}$/)],
    email: ['', Validators.email],
    gender: [''],
    dateOfBirth: [''],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    state: [''],
    postalCode: [''],
    identificationType: [''],
    identificationNumber: [''],
    status: ['ACTIVE', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: FinancialApiService,
    private readonly dialogs: FinanceDialogService,
    private readonly toast: ToastrService) { }

  ngOnInit(): void {
    this.load();
  }

  avatarColor(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
  }

  load(search = this.search, page = this.page): void {
    this.search = search;
    this.page = page;
    this.loading = true;
    this.api.getCustomersPage(search, page, this.size).subscribe({
      next: response => {
        this.customers = response.data?.content ?? [];
        this.total = response.data?.totalElements ?? 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Unable to load customers');
      }
    });
  }

  pageChanged(event: PageEvent): void {
    this.size = event.pageSize;
    this.load(this.search, event.pageIndex);
  }

  newCustomer(): void {
    this.editingId = undefined;
    this.form.reset({ status: 'ACTIVE' });
    this.showForm = true;
  }

  edit(customer: Customer): void {
    this.editingId = customer.id;
    this.form.patchValue(customer);
    this.showForm = true;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const input = this.form.getRawValue() as CustomerInput;
    const request = this.editingId
      ? this.api.updateCustomer(this.editingId, input)
      : this.api.createCustomer(input);
    request.subscribe({
      next: response => {
        this.toast.success(response.message || 'Customer saved');
        this.showForm = false;
        this.load();
      },
      error: error => this.toast.error(error.error?.message || 'Unable to save customer')
    });
  }

  deactivate(customer: Customer): void {
    this.dialogs.confirm({
      title: 'Deactivate customer',
      message: `Deactivate ${customer.firstName} ${customer.lastName ?? ''}? Active loans will still belong to this customer.`,
      confirmLabel: 'Deactivate',
      danger: true
    }).subscribe(() => {
      this.api.deactivateCustomer(customer.id).subscribe({
        next: response => {
          this.toast.success(response.message || 'Customer deactivated');
          this.load();
        },
        error: error => this.toast.error(error.error?.message || 'Unable to deactivate customer')
      });
    });
  }
}
