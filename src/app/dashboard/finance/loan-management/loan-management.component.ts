import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { Customer, Loan, LoanProduct, LoanSchedule } from '../../../models/financial.models';
import { FinanceDialogService } from '../../../shared/services/finance-dialog.service';
import { FinancialApiService } from '../../../shared/services/financial-api.service';
import { RoleAccessService } from '../../../shared/services/role-access.service';

@Component({
  standalone: false,
  selector: 'app-loan-management',
  templateUrl: './loan-management.component.html',
  styleUrls: ['./loan-management.component.css']
})
export class LoanManagementComponent implements OnInit {
  readonly columns = ['loanNumber', 'customer', 'frequency', 'principal', 'outstanding', 'status', 'actions'];
  readonly scheduleColumns = ['installmentNumber', 'dueDate', 'principalDue', 'interestDue', 'totalDue', 'paidAmount', 'status'];
  loans: Loan[] = [];
  customers: Customer[] = [];
  products: LoanProduct[] = [];
  schedule: LoanSchedule[] = [];
  selectedLoan?: Loan;
  showForm = false;
  page = 0;
  size = 25;
  total = 0;

  readonly form = this.fb.group({
    customerId: [null as number | null, Validators.required],
    loanProductId: [null as number | null, Validators.required],
    principalAmount: [null as number | null, [Validators.required, Validators.min(1)]],
    interestRate: [null as number | null, [Validators.required, Validators.min(0)]],
    termCount: [null as number | null, [Validators.required, Validators.min(1)]],
    collectionAmount: [null as number | null, Validators.min(0.01)],
    startDate: [new Date().toISOString().slice(0, 10), Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: FinancialApiService,
    readonly access: RoleAccessService,
    private readonly dialogs: FinanceDialogService,
    private readonly toast: ToastrService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    forkJoin({
      customers: this.api.getCustomers(),
      products: this.api.getLoanProducts(),
      loans: this.api.getLoansPage(undefined, undefined, this.page, this.size)
    }).subscribe({
      next: result => {
        this.customers = result.customers.data ?? [];
        this.products = result.products.data ?? [];
        this.loans = result.loans.data?.content ?? [];
        this.total = result.loans.data?.totalElements ?? 0;
      },
      error: () => this.toast.error('Unable to load loan data')
    });
  }

  pageChanged(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.load();
  }

  newLoan(): void {
    this.form.reset({ startDate: new Date().toISOString().slice(0, 10) });
    this.showForm = true;
  }

  productChanged(productId: number): void {
    const product = this.products.find(item => item.id === productId);
    if (!product) return;
    this.form.patchValue({
      interestRate: product.defaultInterestRate,
      termCount: product.defaultTermCount
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.api.createLoan(this.form.getRawValue()).subscribe({
      next: response => {
        this.toast.success(response.message || 'Loan created');
        this.showForm = false;
        this.load();
      },
      error: error => this.toast.error(error.error?.message || 'Unable to create loan')
    });
  }

  approve(loan: Loan): void {
    this.api.approveLoan(loan.id).subscribe({
      next: () => {
        this.toast.success('Loan approved');
        this.load();
      },
      error: error => this.toast.error(error.error?.message || 'Unable to approve loan')
    });
  }

  activate(loan: Loan): void {
    this.api.activateLoan(loan.id).subscribe({
      next: () => {
        this.toast.success('Loan activated and schedule generated');
        this.load();
      },
      error: error => this.toast.error(error.error?.message || 'Unable to activate loan')
    });
  }

  viewSchedule(loan: Loan): void {
    this.selectedLoan = loan;
    this.api.getLoanSchedule(loan.id).subscribe({
      next: response => this.schedule = response.data ?? [],
      error: () => this.toast.error('Unable to load repayment schedule')
    });
  }

  cancel(loan: Loan): void {
    this.dialogs.confirm({
      title: 'Cancel loan',
      message: `Cancel ${loan.loanNumber}? This cannot be used for collections afterwards.`,
      confirmLabel: 'Cancel loan',
      requireReason: true,
      danger: true
    }).subscribe(reason => {
      this.api.cancelLoan(loan.id, reason).subscribe({
        next: response => {
          this.toast.success(response.message || 'Loan cancelled');
          this.load();
        },
        error: error => this.toast.error(error.error?.message || 'Unable to cancel loan')
      });
    });
  }

  close(loan: Loan): void {
    this.dialogs.confirm({
      title: 'Close loan',
      message: `Close completed loan ${loan.loanNumber}?`,
      confirmLabel: 'Close loan',
      requireReason: true
    }).subscribe(reason => {
      this.api.closeLoan(loan.id, reason).subscribe({
        next: response => {
          this.toast.success(response.message || 'Loan closed');
          this.load();
        },
        error: error => this.toast.error(error.error?.message || 'Unable to close loan')
      });
    });
  }

  scanOverdue(): void {
    this.dialogs.confirm({
      title: 'Mark overdue loans',
      message: 'Scan unpaid instalments past the grace period and mark those loans overdue?',
      confirmLabel: 'Mark overdue'
    }).subscribe(() => {
      this.api.markOverdue().subscribe({
        next: response => {
          this.toast.success(response.message || `${response.data ?? 0} loan(s) marked overdue`);
          this.load();
        },
        error: error => this.toast.error(error.error?.message || 'Unable to scan overdue loans')
      });
    });
  }
}
