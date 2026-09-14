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
  template: `
  <section class="feature-page">
    <header><div><h2>Customer Financial Profile</h2><p>A consolidated view of loans, chits, payments, and balances.</p></div></header>
    <mat-card><mat-card-content><form [formGroup]="form" class="lookup" (ngSubmit)="load()">
      <mat-form-field appearance="outline"><mat-label>Customer</mat-label><mat-select formControlName="customerId"><mat-option *ngFor="let c of customers" [value]="c.id">{{c.customerCode}} — {{c.firstName}} {{c.lastName}} · {{c.mobileNumber}}</mat-option></mat-select></mat-form-field>
      <button mat-flat-button color="primary" type="submit">View profile</button>
    </form></mat-card-content></mat-card>
    <div class="loading" *ngIf="loading"><mat-spinner diameter="36"></mat-spinner></div>
    <ng-container *ngIf="profile && !loading">
      <mat-card class="identity"><mat-card-content><mat-icon>account_circle</mat-icon><div><h3>{{profile.customer.firstName}} {{profile.customer.lastName}}</h3><p>{{profile.customer.customerCode}} · {{profile.customer.mobileNumber}} · {{profile.customer.status}}</p><p>{{profile.customer.addressLine1}} {{profile.customer.city}} {{profile.customer.state}}</p></div></mat-card-content></mat-card>
      <div class="metrics"><mat-card *ngFor="let item of metrics"><mat-card-content><span>{{item.label}}</span><strong>{{metric(item.key) | currency:'INR':'symbol':'1.0-0'}}</strong></mat-card-content></mat-card></div>
      <mat-tab-group>
        <mat-tab label="Active loans ({{profile.activeLoans.length}})"><ng-container *ngTemplateOutlet="loans;context:{$implicit:profile.activeLoans}"></ng-container></mat-tab>
        <mat-tab label="Completed loans ({{profile.completedLoans.length}})"><ng-container *ngTemplateOutlet="loans;context:{$implicit:profile.completedLoans}"></ng-container></mat-tab>
        <mat-tab label="Active chits ({{profile.activeChits.length}})"><ng-container *ngTemplateOutlet="chits;context:{$implicit:profile.activeChits}"></ng-container></mat-tab>
        <mat-tab label="Completed chits ({{profile.completedChits.length}})"><ng-container *ngTemplateOutlet="chits;context:{$implicit:profile.completedChits}"></ng-container></mat-tab>
        <mat-tab label="Chit history ({{(profile.chitHistory || []).length}})">
          <div class="table-wrap">
            <table mat-table [dataSource]="profile.chitHistory || []">
              <ng-container matColumnDef="roundNumber"><th mat-header-cell *matHeaderCellDef>Round</th><td mat-cell *matCellDef="let r">{{r.roundNumber}}</td></ng-container>
              <ng-container matColumnDef="collectionDate"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let r">{{r.collectionDate | date}}</td></ng-container>
              <ng-container matColumnDef="totalCollected"><th mat-header-cell *matHeaderCellDef>Collected</th><td mat-cell *matCellDef="let r">{{r.totalCollected | currency:'INR'}}</td></ng-container>
              <ng-container matColumnDef="winnerName"><th mat-header-cell *matHeaderCellDef>Winner</th><td mat-cell *matCellDef="let r">{{r.winnerName || '-'}}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r">{{r.status}}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="historyColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: historyColumns"></tr>
            </table>
            <p class="empty" *ngIf="!(profile.chitHistory || []).length">No chit history for this customer.</p>
          </div>
        </mat-tab>
        <mat-tab label="Documents ({{attachments.length}})">
          <div class="docs">
            <label class="upload" *ngIf="access.canWriteCollections()">
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" (change)="upload($event)">
              Upload document
            </label>
            <div class="table-wrap">
              <table mat-table [dataSource]="attachments">
                <ng-container matColumnDef="fileName"><th mat-header-cell *matHeaderCellDef>File</th><td mat-cell *matCellDef="let r">{{r.fileName}}</td></ng-container>
                <ng-container matColumnDef="uploadedBy"><th mat-header-cell *matHeaderCellDef>Uploaded by</th><td mat-cell *matCellDef="let r">{{r.uploadedBy}}</td></ng-container>
                <ng-container matColumnDef="uploadedAt"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let r">{{r.uploadedAt | date:'short'}}</td></ng-container>
                <ng-container matColumnDef="link"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r"><a *ngIf="r.downloadUrl" [href]="r.downloadUrl" target="_blank" rel="noopener">Open</a></td></ng-container>
                <tr mat-header-row *matHeaderRowDef="attachmentColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: attachmentColumns"></tr>
              </table>
              <p class="empty" *ngIf="attachments.length === 0">No documents attached.</p>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </ng-container>
    <ng-template #loans let-data><div class="table-wrap"><table mat-table [dataSource]="data"><ng-container matColumnDef="number"><th mat-header-cell *matHeaderCellDef>Loan</th><td mat-cell *matCellDef="let r">{{r.loanNumber}}</td></ng-container><ng-container matColumnDef="product"><th mat-header-cell *matHeaderCellDef>Product</th><td mat-cell *matCellDef="let r">{{r.productName}}</td></ng-container><ng-container matColumnDef="principal"><th mat-header-cell *matHeaderCellDef>Principal</th><td mat-cell *matCellDef="let r">{{r.principalAmount | currency:'INR'}}</td></ng-container><ng-container matColumnDef="outstanding"><th mat-header-cell *matHeaderCellDef>Outstanding</th><td mat-cell *matCellDef="let r">{{r.outstandingPrincipal | currency:'INR'}}</td></ng-container><ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r">{{r.status}}</td></ng-container><tr mat-header-row *matHeaderRowDef="loanColumns"></tr><tr mat-row *matRowDef="let row;columns:loanColumns"></tr></table></div></ng-template>
    <ng-template #chits let-data><div class="table-wrap"><table mat-table [dataSource]="data"><ng-container matColumnDef="code"><th mat-header-cell *matHeaderCellDef>Chit</th><td mat-cell *matCellDef="let r">{{r.chitCode}} · {{r.name}}</td></ng-container><ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Amount</th><td mat-cell *matCellDef="let r">{{r.chitAmount | currency:'INR'}}</td></ng-container><ng-container matColumnDef="contribution"><th mat-header-cell *matHeaderCellDef>Contribution</th><td mat-cell *matCellDef="let r">{{r.monthlyContribution | currency:'INR'}}</td></ng-container><ng-container matColumnDef="round"><th mat-header-cell *matHeaderCellDef>Round</th><td mat-cell *matCellDef="let r">{{r.currentRound}}/{{r.durationMonths}}</td></ng-container><tr mat-header-row *matHeaderRowDef="chitColumns"></tr><tr mat-row *matRowDef="let row;columns:chitColumns"></tr></table></div></ng-template>
  </section>`,
  styles: [`
    .feature-page{padding:24px;max-width:1400px;margin:auto}h2{margin:0}header p,.empty{color:#667}.lookup{display:flex;gap:14px;align-items:center}.lookup mat-form-field{flex:1}.loading{display:flex;justify-content:center;padding:60px}.identity{margin:18px 0}.identity mat-card-content{display:flex!important;gap:15px;align-items:center}.identity mat-icon{font-size:52px;width:52px;height:52px;color:#086496}.identity h3,.identity p{margin:3px}.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:12px;margin-bottom:18px}.metrics span{display:block;color:#667;font-size:12px}.metrics strong{font-size:20px}.table-wrap{overflow:auto;padding:16px 0}table{width:100%;min-width:650px}.docs{padding:16px 0}.upload{display:inline-flex;margin-bottom:12px;padding:8px 14px;background:#086496;color:#fff;border-radius:4px;cursor:pointer}.upload input{display:none}
  `]
})
export class CustomerFinancialProfileComponent implements OnInit {
  customers: Customer[] = []; profile?: CustomerFinancialProfile; attachments: FinanceAttachment[] = []; loading = false;
  readonly form = this.fb.group({customerId:[null as number|null,Validators.required]});
  readonly loanColumns=['number','product','principal','outstanding','status']; readonly chitColumns=['code','amount','contribution','round'];
  readonly historyColumns=['roundNumber','collectionDate','totalCollected','winnerName','status'];
  readonly attachmentColumns=['fileName','uploadedBy','uploadedAt','link'];
  readonly metrics: {label:string;key:keyof CustomerFinancialProfile}[]=[{label:'Total borrowed',key:'totalBorrowedAmount'},{label:'Principal paid',key:'totalPrincipalPaid'},{label:'Interest paid',key:'totalInterestPaid'},{label:'Outstanding principal',key:'outstandingPrincipal'},{label:'Monthly chit contributions',key:'monthlyContributions'},{label:'Pending contributions',key:'pendingContributions'}];
  constructor(
    private readonly fb:FormBuilder,
    private readonly customersApi:FinancialApiService,
    private readonly api:CustomerProfileApiService,
    private readonly attachmentsApi:AttachmentApiService,
    readonly access: RoleAccessService,
    private readonly toast: ToastrService){}
  ngOnInit():void{this.customersApi.getCustomers().subscribe({next:r=>this.customers=r.data??[]});}
  metric(key:keyof CustomerFinancialProfile):number{const value=this.profile?.[key];return typeof value==='number'?value:0;}
  load():void{
    if(this.form.invalid){this.form.markAllAsTouched();return;}
    const customerId = this.form.controls.customerId.value!;
    this.loading=true;
    this.api.get(customerId).subscribe({
      next:r=>{this.profile=r.data;this.loading=false;this.loadAttachments(customerId);},
      error:()=>this.loading=false
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
