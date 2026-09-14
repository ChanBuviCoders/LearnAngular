import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChitContribution, ChitMember, ChitRound, ChitScheme, ChitSchemeInput, Customer } from '../../../models/financial.models';
import { ChitApiService } from '../../../shared/services/financial-domain-api.service';
import { FinancialApiService } from '../../../shared/services/financial-api.service';

@Component({
  standalone: false,
  selector: 'app-chits',
  template: `
  <section class="feature-page">
    <header><div><h2>Running Chits</h2><p>Create schemes and manage every round through payout.</p></div>
      <button mat-flat-button color="primary" (click)="showSchemeForm = !showSchemeForm"><mat-icon>add</mat-icon> New scheme</button>
    </header>
    <mat-card *ngIf="showSchemeForm" class="editor"><mat-card-content>
      <form [formGroup]="schemeForm" class="form-grid" (ngSubmit)="createScheme()">
        <mat-form-field appearance="outline"><mat-label>Scheme name</mat-label><input matInput formControlName="name"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Chit amount</mat-label><input matInput type="number" formControlName="chitAmount"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Members</mat-label><input matInput type="number" formControlName="memberCount"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Monthly contribution</mat-label><input matInput type="number" formControlName="monthlyContribution"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Duration (months)</mat-label><input matInput type="number" formControlName="durationMonths"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Start date</mat-label><input matInput [matDatepicker]="startPicker" formControlName="startDate"><mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle><mat-datepicker #startPicker></mat-datepicker></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select formControlName="status"><mat-option value="DRAFT">Draft</mat-option><mat-option value="ACTIVE">Active</mat-option></mat-select></mat-form-field>
        <div class="actions"><button mat-button type="button" (click)="showSchemeForm=false">Cancel</button><button mat-flat-button color="primary" type="submit">Create scheme</button></div>
      </form>
    </mat-card-content></mat-card>

    <div class="workspace">
      <mat-card class="schemes"><mat-card-header><mat-card-title>Schemes</mat-card-title></mat-card-header><mat-card-content>
        <mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select [(value)]="statusFilter" (selectionChange)="loadSchemes()"><mat-option value="">All</mat-option><mat-option value="ACTIVE">Active</mat-option><mat-option value="DRAFT">Draft</mat-option><mat-option value="COMPLETED">Completed</mat-option></mat-select></mat-form-field>
        <button class="scheme" *ngFor="let item of schemes" [class.selected]="item.id === selected?.id" (click)="selectScheme(item)">
          <strong>{{item.name}}</strong><span>{{item.chitCode}}</span><span>{{item.chitAmount | currency:'INR':'symbol':'1.0-0'}} · Round {{item.currentRound}}/{{item.durationMonths}}</span>
        </button>
        <p *ngIf="!loading && !schemes.length">No schemes found.</p>
      </mat-card-content></mat-card>

      <mat-card class="detail"><mat-card-content *ngIf="selected; else chooseScheme">
        <div class="summary"><div><span>Amount</span><b>{{selected.chitAmount | currency:'INR':'symbol':'1.0-0'}}</b></div><div><span>Contribution</span><b>{{selected.monthlyContribution | currency:'INR':'symbol':'1.0-0'}}</b></div><div><span>Members</span><b>{{members.length}} / {{selected.memberCount}}</b></div><div><span>Status</span><b>{{selected.status}}</b></div></div>
        <mat-tab-group>
          <mat-tab label="Members"><div class="tab-body">
            <form [formGroup]="memberForm" class="inline-form" (ngSubmit)="addMember()">
              <mat-form-field appearance="outline"><mat-label>Customer</mat-label><mat-select formControlName="customerId"><mat-option *ngFor="let customer of customers" [value]="customer.id">{{customer.customerCode}} — {{customer.firstName}} {{customer.lastName}}</mat-option></mat-select></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Joined date</mat-label><input matInput type="date" formControlName="joinedDate"></mat-form-field>
              <button mat-flat-button color="primary" type="submit">Add member</button>
            </form>
            <table mat-table [dataSource]="members"><ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Member</th><td mat-cell *matCellDef="let r">{{r.customerName}}</td></ng-container><ng-container matColumnDef="paid"><th mat-header-cell *matHeaderCellDef>Paid</th><td mat-cell *matCellDef="let r">{{r.amountPaid | currency:'INR'}}</td></ng-container><ng-container matColumnDef="pending"><th mat-header-cell *matHeaderCellDef>Pending</th><td mat-cell *matCellDef="let r">{{r.amountPending | currency:'INR'}}</td></ng-container><ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r">{{r.status}}</td></ng-container><tr mat-header-row *matHeaderRowDef="memberColumns"></tr><tr mat-row *matRowDef="let row; columns:memberColumns"></tr></table>
          </div></mat-tab>
          <mat-tab label="Rounds & history"><div class="tab-body">
            <form [formGroup]="roundForm" class="inline-form" (ngSubmit)="createRound()"><mat-form-field appearance="outline"><mat-label>Collection date</mat-label><input matInput type="date" formControlName="collectionDate"></mat-form-field><button mat-flat-button color="primary" type="submit">Open next round</button></form>
            <mat-accordion><mat-expansion-panel *ngFor="let round of rounds" (opened)="selectRound(round)">
              <mat-expansion-panel-header><mat-panel-title>Round {{round.roundNumber}} · {{round.collectionDate | date}}</mat-panel-title><mat-panel-description>{{round.totalCollected | currency:'INR'}} collected · {{round.status}}</mat-panel-description></mat-expansion-panel-header>
              <div class="round-actions">
                <form [formGroup]="contributionForm" (ngSubmit)="recordContribution(round)">
                  <mat-form-field appearance="outline"><mat-label>Member</mat-label><mat-select formControlName="memberId"><mat-option *ngFor="let m of members" [value]="m.id">{{m.customerName}}</mat-option></mat-select></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput type="number" formControlName="paidAmount"></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Payment mode</mat-label><mat-select formControlName="paymentMode"><mat-option value="CASH">Cash</mat-option><mat-option value="UPI">UPI</mat-option><mat-option value="BANK_TRANSFER">Bank transfer</mat-option></mat-select></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Reference</mat-label><input matInput formControlName="transactionReference"></mat-form-field><button mat-stroked-button color="primary">Record contribution</button>
                </form>
                <form [formGroup]="winnerForm" (ngSubmit)="saveWinner(round)">
                  <mat-form-field appearance="outline"><mat-label>Winner</mat-label><mat-select formControlName="winnerMemberId"><mat-option *ngFor="let m of members" [value]="m.id">{{m.customerName}}</mat-option></mat-select></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Bid amount</mat-label><input matInput type="number" formControlName="bidAmount"></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Deductions</mat-label><input matInput type="number" formControlName="deductionAmount"></mat-form-field><button mat-stroked-button color="primary">Save winner</button>
                </form>
                <form [formGroup]="payoutForm" (ngSubmit)="savePayout(round)">
                  <mat-form-field appearance="outline"><mat-label>Payout amount</mat-label><input matInput type="number" formControlName="payoutAmount"></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Payout date</mat-label><input matInput type="date" formControlName="payoutDate"></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Reference</mat-label><input matInput formControlName="transactionReference"></mat-form-field><button mat-stroked-button color="primary">Record payout</button>
                </form>
              </div>
              <table mat-table [dataSource]="round.id === selectedRound?.id ? contributions : []"><ng-container matColumnDef="member"><th mat-header-cell *matHeaderCellDef>Member</th><td mat-cell *matCellDef="let r">{{r.memberName}}</td></ng-container><ng-container matColumnDef="due"><th mat-header-cell *matHeaderCellDef>Due</th><td mat-cell *matCellDef="let r">{{r.dueAmount | currency:'INR'}}</td></ng-container><ng-container matColumnDef="paid"><th mat-header-cell *matHeaderCellDef>Paid</th><td mat-cell *matCellDef="let r">{{r.paidAmount | currency:'INR'}}</td></ng-container><ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r">{{r.status}}</td></ng-container><tr mat-header-row *matHeaderRowDef="contributionColumns"></tr><tr mat-row *matRowDef="let row;columns:contributionColumns"></tr></table>
            </mat-expansion-panel></mat-accordion>
          </div></mat-tab>
        </mat-tab-group>
      </mat-card-content><ng-template #chooseScheme><mat-card-content class="empty">Select a scheme to manage its members and rounds.</mat-card-content></ng-template></mat-card>
    </div>
  </section>`,
  styles: [`
    .feature-page{padding:24px;max-width:1500px;margin:auto}header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}h2{margin:0}header p,.scheme span,.empty{color:#667}
    .editor{margin-bottom:18px}.form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}.actions{display:flex;justify-content:flex-end;align-items:center}.workspace{display:grid;grid-template-columns:280px 1fr;gap:18px}
    .schemes mat-form-field{width:100%}.scheme{display:flex;width:100%;flex-direction:column;align-items:flex-start;text-align:left;border:0;border-left:4px solid transparent;background:#f6f8fa;padding:12px;margin:8px 0;cursor:pointer}.scheme.selected{border-left-color:#086496;background:#e8f4fa}.scheme span{font-size:12px;margin-top:3px}
    .summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px}.summary div{padding:12px;background:#f6f8fa}.summary span{display:block;color:#667;font-size:12px}.tab-body{padding:18px 2px}.inline-form,.round-actions form{display:flex;gap:10px;align-items:center;flex-wrap:wrap}table{width:100%}.round-actions form{border-bottom:1px solid #eee;padding:8px 0}.empty{text-align:center;padding:80px 10px!important}
    @media(max-width:850px){.workspace{grid-template-columns:1fr}.summary{grid-template-columns:repeat(2,1fr)}}
  `]
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

  constructor(private readonly fb: FormBuilder, private readonly api: ChitApiService, private readonly financeApi: FinancialApiService, private readonly toast: ToastrService) {}
  ngOnInit(): void { this.loadSchemes(); this.financeApi.getCustomers().subscribe({ next: r => this.customers = r.data ?? [] }); }
  private today(): string { return new Date().toISOString().slice(0, 10); }
  private valid(form: { invalid: boolean; markAllAsTouched(): void }): boolean { if (form.invalid) { form.markAllAsTouched(); return false; } return true; }
  loadSchemes(): void { this.loading = true; this.api.getSchemes(this.statusFilter || undefined).subscribe({ next: r => { this.schemes = r.data ?? []; this.loading = false; }, error: () => { this.loading = false; this.toast.error('Unable to load chit schemes'); } }); }
  selectScheme(scheme: ChitScheme): void { this.selected = scheme; this.api.getMembers(scheme.id).subscribe({ next: r => this.members = r.data ?? [], error: () => this.toast.error('Unable to load members') }); this.api.getRounds(scheme.id).subscribe({ next: r => this.rounds = r.data ?? [], error: () => this.toast.error('Unable to load rounds') }); }
  createScheme(): void { if (!this.valid(this.schemeForm)) return; const raw = this.schemeForm.getRawValue(); const input = { ...raw, startDate: (raw.startDate as Date).toISOString().slice(0, 10) } as ChitSchemeInput; this.api.createScheme(input).subscribe({ next: r => { this.toast.success(r.message || 'Scheme created'); this.showSchemeForm = false; this.schemeForm.reset({ status: 'DRAFT' }); this.loadSchemes(); }, error: e => this.toast.error(e.error?.message || 'Unable to create scheme') }); }
  addMember(): void { if (!this.selected || !this.valid(this.memberForm)) return; this.api.addMember(this.selected.id, this.memberForm.getRawValue() as {customerId:number;joinedDate:string}).subscribe({ next: r => { this.toast.success(r.message || 'Member added'); this.selectScheme(this.selected!); }, error: e => this.toast.error(e.error?.message || 'Unable to add member') }); }
  createRound(): void { if (!this.selected || !this.valid(this.roundForm)) return; this.api.createRound(this.selected.id, this.roundForm.getRawValue() as {collectionDate:string}).subscribe({ next: r => { this.toast.success(r.message || 'Round opened'); this.selectScheme(this.selected!); }, error: e => this.toast.error(e.error?.message || 'Unable to create round') }); }
  selectRound(round: ChitRound): void { this.selectedRound = round; this.api.getContributions(round.id).subscribe({ next: r => this.contributions = r.data ?? [], error: () => this.toast.error('Unable to load contributions') }); }
  recordContribution(round: ChitRound): void { if (!this.valid(this.contributionForm)) return; this.api.recordContribution(round.id, this.contributionForm.getRawValue()).subscribe({ next: r => { this.toast.success(r.message || 'Contribution recorded'); this.contributionForm.reset({ paymentMode:'CASH' }); this.selectRound(round); }, error: e => this.toast.error(e.error?.message || 'Unable to record contribution') }); }
  saveWinner(round: ChitRound): void { if (!this.valid(this.winnerForm)) return; this.api.recordWinner(round.id, this.winnerForm.getRawValue()).subscribe({ next: r => { this.toast.success(r.message || 'Winner saved'); if (this.selected) this.selectScheme(this.selected); }, error: e => this.toast.error(e.error?.message || 'Unable to save winner') }); }
  savePayout(round: ChitRound): void { if (!this.valid(this.payoutForm)) return; this.api.recordPayout(round.id, this.payoutForm.getRawValue()).subscribe({ next: r => { this.toast.success(r.message || 'Payout recorded'); if (this.selected) this.selectScheme(this.selected); }, error: e => this.toast.error(e.error?.message || 'Unable to record payout') }); }
}
