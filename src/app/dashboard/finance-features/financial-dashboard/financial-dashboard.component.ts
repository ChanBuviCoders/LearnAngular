import { Component, OnInit } from '@angular/core';
import { DashboardKpis } from '../../../models/financial.models';
import { DashboardApiService } from '../../../shared/services/financial-domain-api.service';

interface KpiCard {
  label: string;
  key: keyof DashboardKpis;
  icon: string;
  currency: boolean;
}

@Component({
  standalone: false,
  selector: 'app-financial-dashboard',
  template: `
    <section class="feature-page">
      <header><div><h2>Financial Dashboard</h2><p>Current portfolio and collection position.</p></div>
        <button mat-stroked-button (click)="load()"><mat-icon>refresh</mat-icon> Refresh</button>
      </header>
      <div class="loading" *ngIf="loading"><mat-spinner diameter="36"></mat-spinner></div>
      <div class="kpi-grid" *ngIf="!loading">
        <mat-card *ngFor="let card of cards">
          <mat-card-content>
            <mat-icon>{{ card.icon }}</mat-icon>
            <div><span>{{ card.label }}</span>
              <strong *ngIf="card.currency">{{ value(card.key) | currency:'INR':'symbol':'1.0-0' }}</strong>
              <strong *ngIf="!card.currency">{{ value(card.key) | number }}</strong>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      <p class="error" *ngIf="error">{{ error }}</p>
    </section>`,
  styles: [`
    .feature-page{padding:24px;max-width:1400px;margin:auto} header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
    h2{margin:0} header p,.error{color:#666}.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
    mat-card-content{display:flex!important;align-items:center;gap:16px;padding:20px!important}mat-card mat-icon{background:#e8f4fa;color:#086496;border-radius:50%;padding:12px;width:48px;height:48px;font-size:24px}
    span{display:block;color:#606b75;font-size:13px}strong{display:block;font-size:22px;margin-top:5px}.loading{display:flex;justify-content:center;padding:60px}.error{color:#b3261e;text-align:center}
  `]
})
export class FinancialDashboardComponent implements OnInit {
  data?: DashboardKpis;
  loading = false;
  error = '';
  readonly cards: KpiCard[] = [
    { label: 'Total customers', key: 'totalCustomers', icon: 'groups', currency: false },
    { label: 'Active customers', key: 'activeCustomers', icon: 'person_check', currency: false },
    { label: 'Active loans', key: 'activeLoans', icon: 'account_balance', currency: false },
    { label: 'Total loan amount', key: 'totalLoanAmount', icon: 'payments', currency: true },
    { label: 'Total collected', key: 'totalAmountCollected', icon: 'savings', currency: true },
    { label: 'Principal collected', key: 'totalPrincipalCollected', icon: 'price_check', currency: true },
    { label: 'Interest collected', key: 'totalInterestCollected', icon: 'percent', currency: true },
    { label: 'Outstanding', key: 'totalOutstandingAmount', icon: 'pending_actions', currency: true },
    { label: "Today's collection", key: 'todayCollection', icon: 'today', currency: true },
    { label: "Today's pending", key: 'todayPendingCollection', icon: 'event_busy', currency: true },
    { label: 'Daily collection', key: 'dailyCollection', icon: 'calendar_view_day', currency: true },
    { label: 'Weekly collection', key: 'weeklyCollection', icon: 'date_range', currency: true },
    { label: 'Monthly collection', key: 'monthlyCollection', icon: 'calendar_month', currency: true },
    { label: 'Active chits', key: 'activeChits', icon: 'diversity_3', currency: false },
    { label: 'Chit collection', key: 'totalChitCollection', icon: 'group_work', currency: true },
    { label: 'Pending chit payments', key: 'pendingChitPayments', icon: 'warning', currency: true }
  ];

  constructor(private readonly api: DashboardApiService) {}
  ngOnInit(): void { this.load(); }
  value(key: keyof DashboardKpis): number { return this.data?.[key] ?? 0; }
  load(): void {
    this.loading = true; this.error = '';
    this.api.getKpis().subscribe({
      next: response => { this.data = response.data; this.loading = false; },
      error: () => { this.error = 'Unable to load dashboard data.'; this.loading = false; }
    });
  }
}
