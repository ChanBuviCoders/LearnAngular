import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReportFilters, ReportResult, ReportType } from '../../../models/financial.models';
import { ReportsApiService } from '../../../shared/services/financial-domain-api.service';

@Component({
  standalone: false,
  selector: 'app-financial-reports',
  template: `
  <section class="feature-page">
    <header><div><h2>Reports</h2><p>Filter operational and financial data, then export it as CSV.</p></div>
      <button mat-flat-button color="primary" [disabled]="loading" (click)="download()"><mat-icon>download</mat-icon> Download CSV</button>
    </header>
    <mat-card><mat-card-content>
      <form [formGroup]="form" class="filters" (ngSubmit)="run()">
        <mat-form-field appearance="outline"><mat-label>Report</mat-label><mat-select formControlName="reportType"><mat-optgroup *ngFor="let group of reportGroups" [label]="group.label"><mat-option *ngFor="let item of group.items" [value]="item.value">{{item.label}}</mat-option></mat-optgroup></mat-select></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>From</mat-label><input matInput type="date" formControlName="from"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>To</mat-label><input matInput type="date" formControlName="to"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Customer ID</mat-label><input matInput type="number" formControlName="customerId"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Loan type</mat-label><mat-select formControlName="loanType"><mat-option value="">All</mat-option><mat-option value="DAILY">Daily</mat-option><mat-option value="WEEKLY">Weekly</mat-option><mat-option value="MONTHLY">Monthly</mat-option></mat-select></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Chit ID</mat-label><input matInput type="number" formControlName="chitId"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Collector ID</mat-label><input matInput type="number" formControlName="collectorId"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Status</mat-label><input matInput formControlName="status"></mat-form-field>
        <div><button mat-flat-button color="primary" type="submit" [disabled]="loading">Run report</button><button mat-button type="button" (click)="reset()">Clear</button></div>
      </form>
    </mat-card-content></mat-card>
    <mat-card class="results"><mat-card-content>
      <div class="loading" *ngIf="loading"><mat-spinner diameter="34"></mat-spinner></div>
      <div class="table-wrap" *ngIf="result && !loading">
        <table mat-table [dataSource]="result.rows">
          <ng-container *ngFor="let column of result.columns" [matColumnDef]="column"><th mat-header-cell *matHeaderCellDef>{{heading(column)}}</th><td mat-cell *matCellDef="let row">{{row[column]}}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="result.columns"></tr><tr mat-row *matRowDef="let row;columns:result.columns"></tr>
        </table><p>{{result.totalRows | number}} row(s)</p>
      </div>
      <p class="empty" *ngIf="!result && !loading">Select filters and run a report.</p>
    </mat-card-content></mat-card>
  </section>`,
  styles: [`
    .feature-page{padding:24px;max-width:1500px;margin:auto}header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}h2{margin:0}header p,.empty{color:#667}.filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;align-items:center}.results{margin-top:18px}.table-wrap{overflow:auto}table{width:100%;min-width:800px}.loading{display:flex;justify-content:center;padding:50px}.empty{text-align:center;padding:50px}
  `]
})
export class ReportsComponent {
  loading = false;
  result?: ReportResult;
  readonly form = this.fb.group({ reportType: ['active-loans' as ReportType], from: [''], to: [''], customerId: [null as number | null], loanType: [''], chitId: [null as number | null], collectorId: [null as number | null], status: [''] });
  readonly reportGroups = [
    { label: 'Loans', items: this.options([['Customer loans','customer-loans'],['Active loans','active-loans'],['Completed loans','completed-loans'],['Outstanding loans','outstanding-loans'],['Overdue loans','overdue-loans'],['Outstanding balance','outstanding-balance']]) },
    { label: 'Collections', items: this.options([['Daily collections','daily-collections'],['Weekly collections','weekly-collections'],['Monthly collections','monthly-collections'],['Date range collections','date-range-collections'],['Collector collections','collector-collections'],['Principal collection','principal-collection'],['Interest collection','interest-collection'],['Customer statement','customer-statement']]) },
    { label: 'Chits', items: this.options([['Active chits','active-chits'],['Member chits','member-chits'],['Pending chit payments','pending-chit-payments'],['Chit history','chit-history'],['Monthly chit collection','monthly-chit-collection']]) }
  ];
  constructor(private readonly fb: FormBuilder, private readonly api: ReportsApiService, private readonly toast: ToastrService) {}
  private options(values: [string, string][]): {label:string;value:ReportType}[] { return values.map(([label,value]) => ({label,value:value as ReportType})); }
  private request(): {type: ReportType; filters: ReportFilters} { const {reportType, ...filters} = this.form.getRawValue(); return { type: reportType ?? 'active-loans', filters: filters as ReportFilters }; }
  run(): void { const request = this.request(); this.loading = true; this.api.run(request.type, request.filters).subscribe({ next:r => { this.result=r.data; this.loading=false; }, error:e => { this.loading=false; this.toast.error(e.error?.message || 'Unable to run report'); } }); }
  download(): void { const request=this.request(); this.api.downloadCsv(request.type,request.filters).subscribe({ next:blob => { const url=URL.createObjectURL(blob); const anchor=document.createElement('a'); anchor.href=url; anchor.download=`${request.type}-${new Date().toISOString().slice(0,10)}.csv`; anchor.click(); URL.revokeObjectURL(url); }, error:() => this.toast.error('Unable to download CSV') }); }
  reset(): void { this.form.reset({reportType:'active-loans'}); this.result=undefined; }
  heading(value:string): string { return value.replace(/([A-Z])/g,' $1').replace(/_/g,' ').replace(/^./,c=>c.toUpperCase()); }
}
