import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BusinessSettings } from '../../../models/financial.models';
import { SettingsApiService } from '../../../shared/services/financial-domain-api.service';

@Component({
  standalone: false,
  selector: 'app-business-settings',
  template: `
  <section class="feature-page"><header><h2>Business Settings</h2><p>Configure financial defaults used when creating new products and schedules.</p></header>
    <mat-card><mat-card-content>
      <form [formGroup]="form" (ngSubmit)="save()">
        <h3>Organisation</h3><div class="grid">
          <mat-form-field appearance="outline"><mat-label>Currency</mat-label><mat-select formControlName="defaultCurrency"><mat-option value="INR">INR — Indian Rupee</mat-option></mat-select></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Timezone</mat-label><input matInput formControlName="timezone"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Receipt prefix</mat-label><input matInput formControlName="receiptPrefix"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Grace period (days)</mat-label><input matInput type="number" formControlName="gracePeriodDays"></mat-form-field>
        </div>
        <h3>Loan defaults</h3><div class="grid">
          <mat-form-field appearance="outline"><mat-label>Daily interest %</mat-label><input matInput type="number" step="0.01" formControlName="dailyInterestRate"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Weekly interest %</mat-label><input matInput type="number" step="0.01" formControlName="weeklyInterestRate"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Monthly interest %</mat-label><input matInput type="number" step="0.01" formControlName="monthlyInterestRate"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Default duration</mat-label><input matInput type="number" formControlName="defaultLoanDuration"></mat-form-field>
        </div>
        <h3>Chit defaults</h3><div class="grid">
          <mat-form-field appearance="outline"><mat-label>Default amount</mat-label><input matInput type="number" formControlName="defaultChitAmount"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Default members</mat-label><input matInput type="number" formControlName="defaultChitMembers"></mat-form-field>
        </div>
        <div class="actions"><button mat-stroked-button type="button" (click)="load()">Discard changes</button><button mat-flat-button color="primary" type="submit" [disabled]="saving">{{saving?'Saving…':'Save settings'}}</button></div>
      </form>
    </mat-card-content></mat-card>
  </section>`,
  styles:[`.feature-page{padding:24px;max-width:1100px;margin:auto}h2{margin:0}header p{color:#667}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}h3{margin-top:20px;color:#086496;border-bottom:1px solid #ddd;padding-bottom:8px}.actions{display:flex;justify-content:flex-end;gap:12px;margin-top:20px}`]
})
export class BusinessSettingsComponent implements OnInit {
  saving=false;
  readonly form=this.fb.nonNullable.group({
    defaultCurrency:['INR',Validators.required],timezone:['Asia/Kolkata',Validators.required],
    dailyInterestRate:[0,[Validators.required,Validators.min(0)]],weeklyInterestRate:[0,[Validators.required,Validators.min(0)]],
    monthlyInterestRate:[0,[Validators.required,Validators.min(0)]],gracePeriodDays:[0,[Validators.required,Validators.min(0)]],
    defaultLoanDuration:[12,[Validators.required,Validators.min(1)]],defaultChitAmount:[100000,[Validators.required,Validators.min(1)]],
    defaultChitMembers:[20,[Validators.required,Validators.min(2)]],receiptPrefix:['RCT',Validators.required]
  });
  constructor(private readonly fb:FormBuilder,private readonly api:SettingsApiService,private readonly toast:ToastrService){}
  ngOnInit():void{this.load();}
  load():void{this.api.get().subscribe({next:r=>this.form.patchValue(r.data),error:()=>this.toast.error('Unable to load settings')});}
  save():void{if(this.form.invalid){this.form.markAllAsTouched();return;}this.saving=true;this.api.update(this.form.getRawValue() as BusinessSettings).subscribe({next:r=>{this.form.patchValue(r.data);this.saving=false;this.form.markAsPristine();this.toast.success(r.message||'Settings saved');},error:e=>{this.saving=false;this.toast.error(e.error?.message||'Unable to save settings');}});}
}
