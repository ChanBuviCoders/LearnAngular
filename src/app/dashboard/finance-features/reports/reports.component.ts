import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReportFilters, ReportResult, ReportType } from '../../../models/financial.models';
import { ReportsApiService } from '../../../shared/services/financial-domain-api.service';

@Component({
  standalone: false,
  selector: 'app-financial-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  loading = false;
  result?: ReportResult;
  readonly form = this.fb.group({ reportType: ['active-loans' as ReportType], from: [''], to: [''], customerId: [null as number | null], loanType: [''], chitId: [null as number | null], collectorId: [null as number | null], status: [''] });
  readonly reportGroups = [
    { label: 'Loans', items: this.options([['Customer loans', 'customer-loans'], ['Active loans', 'active-loans'], ['Completed loans', 'completed-loans'], ['Outstanding loans', 'outstanding-loans'], ['Overdue loans', 'overdue-loans'], ['Outstanding balance', 'outstanding-balance']]) },
    { label: 'Collections', items: this.options([['Daily collections', 'daily-collections'], ['Weekly collections', 'weekly-collections'], ['Monthly collections', 'monthly-collections'], ['Date range collections', 'date-range-collections'], ['Collector collections', 'collector-collections'], ['Principal collection', 'principal-collection'], ['Interest collection', 'interest-collection'], ['Customer statement', 'customer-statement']]) },
    { label: 'Chits', items: this.options([['Active chits', 'active-chits'], ['Member chits', 'member-chits'], ['Pending chit payments', 'pending-chit-payments'], ['Chit history', 'chit-history'], ['Monthly chit collection', 'monthly-chit-collection']]) }
  ];
  constructor(private readonly fb: FormBuilder, private readonly api: ReportsApiService, private readonly toast: ToastrService) { }
  private options(values: [string, string][]): { label: string; value: ReportType }[] { return values.map(([label, value]) => ({ label, value: value as ReportType })); }
  private request(): { type: ReportType; filters: ReportFilters } { const { reportType, ...filters } = this.form.getRawValue(); return { type: reportType ?? 'active-loans', filters: filters as ReportFilters }; }
  run(): void { const request = this.request(); this.loading = true; this.api.run(request.type, request.filters).subscribe({ next: r => { this.result = r.data; this.loading = false; }, error: e => { this.loading = false; this.toast.error(e.error?.message || 'Unable to run report'); } }); }
  download(): void { const request = this.request(); this.api.downloadCsv(request.type, request.filters).subscribe({ next: blob => { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${request.type}-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url); }, error: () => this.toast.error('Unable to download CSV') }); }
  reset(): void { this.form.reset({ reportType: 'active-loans' }); this.result = undefined; }
  heading(value: string): string { return value.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()); }
}
