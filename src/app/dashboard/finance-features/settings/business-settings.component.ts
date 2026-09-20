import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BusinessSettings } from '../../../models/financial.models';
import { SettingsApiService } from '../../../shared/services/financial-domain-api.service';

@Component({
  standalone: false,
  selector: 'app-business-settings',
  templateUrl: './business-settings.component.html',
  styleUrls: ['./business-settings.component.css']
})
export class BusinessSettingsComponent implements OnInit {
  saving = false;
  readonly form = this.fb.nonNullable.group({
    defaultCurrency: ['INR', Validators.required], timezone: ['Asia/Kolkata', Validators.required],
    dailyInterestRate: [0, [Validators.required, Validators.min(0)]], weeklyInterestRate: [0, [Validators.required, Validators.min(0)]],
    monthlyInterestRate: [0, [Validators.required, Validators.min(0)]], gracePeriodDays: [0, [Validators.required, Validators.min(0)]],
    defaultLoanDuration: [12, [Validators.required, Validators.min(1)]], defaultChitAmount: [100000, [Validators.required, Validators.min(1)]],
    defaultChitMembers: [20, [Validators.required, Validators.min(2)]], receiptPrefix: ['RCT', Validators.required]
  });
  constructor(private readonly fb: FormBuilder, private readonly api: SettingsApiService, private readonly toast: ToastrService) { }
  ngOnInit(): void { this.load(); }
  load(): void { this.api.get().subscribe({ next: r => this.form.patchValue(r.data), error: () => this.toast.error('Unable to load settings') }); }
  save(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.saving = true; this.api.update(this.form.getRawValue() as BusinessSettings).subscribe({ next: r => { this.form.patchValue(r.data); this.saving = false; this.form.markAsPristine(); this.toast.success(r.message || 'Settings saved'); }, error: e => { this.saving = false; this.toast.error(e.error?.message || 'Unable to save settings'); } }); }
}
