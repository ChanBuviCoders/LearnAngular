import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Customer, CustomerFinancialProfile, FinanceAttachment } from '../../../models/financial.models';
import { AttachmentApiService, CustomerProfileApiService } from '../../../shared/services/financial-domain-api.service';
import { FinancialApiService } from '../../../shared/services/financial-api.service';
import { RoleAccessService } from '../../../shared/services/role-access.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: false,
  selector: 'app-customer-financial-profile',
  templateUrl: './customer-financial-profile.component.html',
  styleUrls: ['./customer-financial-profile.component.css']
})
export class CustomerFinancialProfileComponent implements OnInit {
  customers: Customer[] = []; profile?: CustomerFinancialProfile; attachments: FinanceAttachment[] = []; loading = false;
  readonly form = this.fb.group({ customerId: [null as number | null, Validators.required] });
  readonly loanColumns = ['number', 'product', 'principal', 'outstanding', 'status']; readonly chitColumns = ['code', 'amount', 'contribution', 'round'];
  readonly historyColumns = ['roundNumber', 'collectionDate', 'totalCollected', 'winnerName', 'status'];
  readonly attachmentColumns = ['fileName', 'uploadedBy', 'uploadedAt', 'link'];
  readonly metrics: { label: string; key: keyof CustomerFinancialProfile }[] = [{ label: 'Total borrowed', key: 'totalBorrowedAmount' }, { label: 'Principal paid', key: 'totalPrincipalPaid' }, { label: 'Interest paid', key: 'totalInterestPaid' }, { label: 'Outstanding principal', key: 'outstandingPrincipal' }, { label: 'Monthly chit contributions', key: 'monthlyContributions' }, { label: 'Pending contributions', key: 'pendingContributions' }];
  constructor(
    private readonly fb: FormBuilder,
    private readonly customersApi: FinancialApiService,
    private readonly api: CustomerProfileApiService,
    private readonly attachmentsApi: AttachmentApiService,
    readonly access: RoleAccessService,
    private readonly toast: ToastrService) { }
  ngOnInit(): void { this.customersApi.getCustomers().subscribe({ next: r => this.customers = r.data ?? [] }); }
  metric(key: keyof CustomerFinancialProfile): number { const value = this.profile?.[key]; return typeof value === 'number' ? value : 0; }
  load(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const customerId = this.form.controls.customerId.value!;
    this.loading = true;
    this.api.get(customerId).subscribe({
      next: r => { this.profile = r.data; this.loading = false; this.loadAttachments(customerId); },
      error: () => this.loading = false
    });
  }
  loadAttachments(customerId: number): void {
    this.attachmentsApi.list('CUSTOMER', String(customerId)).subscribe({
      next: r => this.attachments = r.data ?? [],
      error: () => this.attachments = []
    });
  }
  upload(event: Event): void {
    const customerId = this.form.controls.customerId.value;
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!customerId || !file) return;
    this.attachmentsApi.upload('CUSTOMER', String(customerId), file).subscribe({
      next: r => { this.toast.success(r.message || 'Document uploaded'); this.loadAttachments(customerId); },
      error: e => this.toast.error(e.error?.message || 'Unable to upload document')
    });
    (event.target as HTMLInputElement).value = '';
  }
}
