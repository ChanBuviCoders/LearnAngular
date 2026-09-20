import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChitContribution, ChitMember, ChitRound, ChitScheme, ChitSchemeInput, Customer } from '../../../models/financial.models';
import { ChitApiService } from '../../../shared/services/financial-domain-api.service';
import { FinancialApiService } from '../../../shared/services/financial-api.service';

@Component({
  standalone: false,
  selector: 'app-chits',
  templateUrl: './chits.component.html',
  styleUrls: ['./chits.component.css']
})
export class ChitsComponent implements OnInit {
  schemes: ChitScheme[] = []; customers: Customer[] = []; members: ChitMember[] = []; rounds: ChitRound[] = []; contributions: ChitContribution[] = [];
  selected?: ChitScheme; selectedRound?: ChitRound; loading = false; showSchemeForm = false; statusFilter = '';
  readonly memberColumns = ['name', 'paid', 'pending', 'status'];
  readonly contributionColumns = ['member', 'due', 'paid', 'status'];
  readonly schemeForm = this.fb.group({ name: ['', Validators.required], chitAmount: [null as number | null, [Validators.required, Validators.min(1)]], memberCount: [null as number | null, [Validators.required, Validators.min(2)]], monthlyContribution: [null as number | null, [Validators.required, Validators.min(1)]], durationMonths: [null as number | null, [Validators.required, Validators.min(1)]], startDate: [null as Date | null, Validators.required], status: ['DRAFT' as const, Validators.required] });
  readonly memberForm = this.fb.group({ customerId: [null as number | null, Validators.required], joinedDate: [this.today(), Validators.required] });
  readonly roundForm = this.fb.group({ collectionDate: [this.today(), Validators.required] });
  readonly contributionForm = this.fb.group({ memberId: [null as number | null, Validators.required], paidAmount: [null as number | null, [Validators.required, Validators.min(1)]], paymentMode: ['CASH', Validators.required], transactionReference: [''] });
  readonly winnerForm = this.fb.group({ winnerMemberId: [null as number | null, Validators.required], bidAmount: [null as number | null, Validators.required], deductionAmount: [0, Validators.min(0)] });
  readonly payoutForm = this.fb.group({ payoutAmount: [null as number | null, [Validators.required, Validators.min(1)]], payoutDate: [this.today(), Validators.required], transactionReference: ['', Validators.required] });

  constructor(private readonly fb: FormBuilder, private readonly api: ChitApiService, private readonly financeApi: FinancialApiService, private readonly toast: ToastrService) { }
  ngOnInit(): void { this.loadSchemes(); this.financeApi.getCustomers().subscribe({ next: r => this.customers = r.data ?? [] }); }
  private today(): string { return new Date().toISOString().slice(0, 10); }
  private valid(form: { invalid: boolean; markAllAsTouched(): void }): boolean { if (form.invalid) { form.markAllAsTouched(); return false; } return true; }
  loadSchemes(): void { this.loading = true; this.api.getSchemes(this.statusFilter || undefined).subscribe({ next: r => { this.schemes = r.data ?? []; this.loading = false; }, error: () => { this.loading = false; this.toast.error('Unable to load chit schemes'); } }); }
  selectScheme(scheme: ChitScheme): void { this.selected = scheme; this.api.getMembers(scheme.id).subscribe({ next: r => this.members = r.data ?? [], error: () => this.toast.error('Unable to load members') }); this.api.getRounds(scheme.id).subscribe({ next: r => this.rounds = r.data ?? [], error: () => this.toast.error('Unable to load rounds') }); }
  createScheme(): void { if (!this.valid(this.schemeForm)) return; const raw = this.schemeForm.getRawValue(); const input = { ...raw, startDate: (raw.startDate as Date).toISOString().slice(0, 10) } as ChitSchemeInput; this.api.createScheme(input).subscribe({ next: r => { this.toast.success(r.message || 'Scheme created'); this.showSchemeForm = false; this.schemeForm.reset({ status: 'DRAFT' }); this.loadSchemes(); }, error: e => this.toast.error(e.error?.message || 'Unable to create scheme') }); }
  addMember(): void { if (!this.selected || !this.valid(this.memberForm)) return; this.api.addMember(this.selected.id, this.memberForm.getRawValue() as { customerId: number; joinedDate: string }).subscribe({ next: r => { this.toast.success(r.message || 'Member added'); this.selectScheme(this.selected!); }, error: e => this.toast.error(e.error?.message || 'Unable to add member') }); }
  createRound(): void { if (!this.selected || !this.valid(this.roundForm)) return; this.api.createRound(this.selected.id, this.roundForm.getRawValue() as { collectionDate: string }).subscribe({ next: r => { this.toast.success(r.message || 'Round opened'); this.selectScheme(this.selected!); }, error: e => this.toast.error(e.error?.message || 'Unable to create round') }); }
  selectRound(round: ChitRound): void { this.selectedRound = round; this.api.getContributions(round.id).subscribe({ next: r => this.contributions = r.data ?? [], error: () => this.toast.error('Unable to load contributions') }); }
  recordContribution(round: ChitRound): void { if (!this.valid(this.contributionForm)) return; this.api.recordContribution(round.id, this.contributionForm.getRawValue()).subscribe({ next: r => { this.toast.success(r.message || 'Contribution recorded'); this.contributionForm.reset({ paymentMode: 'CASH' }); this.selectRound(round); }, error: e => this.toast.error(e.error?.message || 'Unable to record contribution') }); }
  saveWinner(round: ChitRound): void { if (!this.valid(this.winnerForm)) return; this.api.recordWinner(round.id, this.winnerForm.getRawValue()).subscribe({ next: r => { this.toast.success(r.message || 'Winner saved'); if (this.selected) this.selectScheme(this.selected); }, error: e => this.toast.error(e.error?.message || 'Unable to save winner') }); }
  savePayout(round: ChitRound): void { if (!this.valid(this.payoutForm)) return; this.api.recordPayout(round.id, this.payoutForm.getRawValue()).subscribe({ next: r => { this.toast.success(r.message || 'Payout recorded'); if (this.selected) this.selectScheme(this.selected); }, error: e => this.toast.error(e.error?.message || 'Unable to record payout') }); }
}
