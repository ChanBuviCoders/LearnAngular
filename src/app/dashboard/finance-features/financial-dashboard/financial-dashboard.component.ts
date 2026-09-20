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
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.css']
})
export class FinancialDashboardComponent implements OnInit {
  data?: DashboardKpis;
  loading = false;
  error = '';
  private readonly avatarColors = ['#f4b400', '#4285f4', '#ea4335', '#34a853', '#7b1fa2', '#00838f'];
  readonly cards: KpiCard[] = [
    { label: 'Total customers', key: 'totalCustomers', icon: 'groups', currency: false },
    { label: 'Active customers', key: 'activeCustomers', icon: 'how_to_reg', currency: false },
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

  constructor(private readonly api: DashboardApiService) { }
  ngOnInit(): void { this.load(); }
  value(key: keyof DashboardKpis): number { return this.data?.[key] ?? 0; }
  avatarColor(index: number): string { return this.avatarColors[index % this.avatarColors.length]; }
  load(): void {
    this.loading = true; this.error = '';
    this.api.getKpis().subscribe({
      next: response => { this.data = response.data; this.loading = false; },
      error: () => { this.error = 'Unable to load dashboard data.'; this.loading = false; }
    });
  }
}
