import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { CollectionFrequency, CollectionTransaction, Loan, StaffMember } from '../../../models/financial.models';
import { StaffApiService } from '../../../shared/services/financial-domain-api.service';
import { FinanceDialogService } from '../../../shared/services/finance-dialog.service';
import { FinancialApiService } from '../../../shared/services/financial-api.service';
import { RoleAccessService } from '../../../shared/services/role-access.service';

@Component({
  standalone: false,
  selector: 'app-collection-management',
  templateUrl: './collection-management.component.html',
  styleUrls: ['./collection-management.component.css']
})
export class CollectionManagementComponent implements OnInit {
  readonly columns = [
    'transactionReference', 'collectionDate', 'loan', 'paidAmount',
    'principalAmount', 'interestAmount', 'paymentMode', 'status', 'actions'
  ];
  loans: Loan[] = [];
  collections: CollectionTransaction[] = [];
  staff: StaffMember[] = [];
  showForm = false;
  lockedFrequency?: CollectionFrequency;
  page = 0;
  size = 25;
  total = 0;

  readonly form = this.fb.group({
    loanId: [null as number | null, Validators.required],
    scheduleId: [null as number | null],
    collectionDate: [new Date().toISOString().slice(0, 10), Validators.required],
    paidAmount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    allocation: ['REGULAR', Validators.required],
    paymentMode: ['CASH', Validators.required],
    transactionReference: [''],
    collectorId: [null as number | null],
    remarks: ['']
  });

  readonly filters = this.fb.group({
    from: [new Date().toISOString().slice(0, 10)],
    to: [new Date().toISOString().slice(0, 10)],
    frequency: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: FinancialApiService,
    private readonly staffApi: StaffApiService,
    private readonly route: ActivatedRoute,
    readonly access: RoleAccessService,
    private readonly dialogs: FinanceDialogService,
    private readonly toast: ToastrService) {}

  get pageTitle(): string {
    switch (this.lockedFrequency) {
      case 'DAILY': return 'Daily Collection';
      case 'WEEKLY': return 'Weekly Collection';
      case 'MONTHLY': return 'Monthly Collection';
      default: return 'Collection Management';
    }
  }

  get pageSubtitle(): string {
    switch (this.lockedFrequency) {
      case 'DAILY': return 'Post principal-only daily loan payments.';
      case 'WEEKLY': return 'Post weekly instalments with interest.';
      case 'MONTHLY': return 'Post monthly interest or principal-reduction payments.';
      default: return 'Post daily, weekly, and monthly loan payments.';
    }
  }

  get monthlyMode(): boolean {
    return this.lockedFrequency === 'MONTHLY';
  }

  ngOnInit(): void {
    const frequency = this.route.snapshot.data['frequency'] as CollectionFrequency | undefined;
    this.lockedFrequency = frequency;
    if (frequency) {
      this.filters.patchValue({ frequency });
    }
    this.api.getLoans().subscribe({
      next: response => this.loans = (response.data ?? []).filter(loan => {
        const collectable = ['ACTIVE', 'PARTIALLY_PAID', 'OVERDUE'].includes(loan.status);
        return collectable && (!frequency || loan.collectionFrequency === frequency);
      }),
      error: () => this.toast.error('Unable to load active loans')
    });
    this.staffApi.list().subscribe({
      next: response => this.staff = response.data ?? [],
      error: () => this.staff = []
    });
    this.load();
  }

  load(page = this.page): void {
    this.page = page;
    const filters = {
      ...this.filters.getRawValue(),
      frequency: this.lockedFrequency || this.filters.value.frequency,
      page: this.page,
      size: this.size
    };
    this.api.getCollections(filters).subscribe({
      next: response => {
        this.collections = response.data?.content ?? [];
        this.total = response.data?.totalElements ?? 0;
      },
      error: () => this.toast.error('Unable to load collections')
    });
  }

  applyFilters(): void {
    this.load(0);
  }

  pageChanged(event: PageEvent): void {
    this.size = event.pageSize;
    this.load(event.pageIndex);
  }

  newCollection(): void {
    this.form.reset({
      collectionDate: new Date().toISOString().slice(0, 10),
      allocation: this.monthlyMode ? 'REGULAR' : 'REGULAR',
      paymentMode: 'CASH'
    });
    this.showForm = true;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    this.dialogs.confirm({
      title: 'Post collection',
      message: `Post ${payload.paidAmount} for the selected loan? This creates a financial transaction.`,
      confirmLabel: 'Post payment'
    }).subscribe(() => {
      this.api.postCollection(payload).subscribe({
        next: response => {
          this.toast.success(response.message || 'Collection posted');
          this.showForm = false;
          this.load(0);
          if (response.data) {
            this.printReceipt(response.data);
          }
        },
        error: error => this.toast.error(error.error?.message || 'Unable to post collection')
      });
    });
  }

  reverse(transaction: CollectionTransaction): void {
    this.dialogs.confirm({
      title: 'Reverse collection',
      message: `Reverse ${transaction.transactionReference}? Outstanding balances will be restored.`,
      confirmLabel: 'Reverse',
      requireReason: true,
      danger: true
    }).subscribe(reason => {
      this.api.reverseCollection(transaction.id, reason).subscribe({
        next: response => {
          this.toast.success(response.message || 'Collection reversed');
          this.load();
        },
        error: error => this.toast.error(error.error?.message || 'Unable to reverse collection')
      });
    });
  }

  printReceipt(transaction: CollectionTransaction): void {
    const loan = this.loans.find(item => item.id === transaction.loanId);
    const popup = window.open('', '_blank', 'width=480,height=640');
    if (!popup) {
      return;
    }
    popup.document.write(`<!doctype html><html><head><title>Receipt ${transaction.transactionReference}</title>
      <style>body{font-family:Arial,sans-serif;padding:24px}h1{font-size:18px}table{width:100%}td{padding:4px 0}</style></head><body>
      <h1>Collection receipt</h1>
      <table>
        <tr><td>Reference</td><td>${transaction.transactionReference}</td></tr>
        <tr><td>Date</td><td>${transaction.collectionDate}</td></tr>
        <tr><td>Loan</td><td>${loan?.loanNumber || transaction.loanId}</td></tr>
        <tr><td>Paid</td><td>${transaction.paidAmount}</td></tr>
        <tr><td>Principal</td><td>${transaction.principalAmount}</td></tr>
        <tr><td>Interest</td><td>${transaction.interestAmount}</td></tr>
        <tr><td>Mode</td><td>${transaction.paymentMode}</td></tr>
      </table>
      <p>Om Sri Vinayaka Chits and Finance</p>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`);
    popup.document.close();
  }
}
