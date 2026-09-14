import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { AuditEntry, AuditFilters } from '../../../models/financial.models';
import { AuditApiService } from '../../../shared/services/financial-domain-api.service';

@Component({
  standalone:false,
  selector:'app-audit-history',
  template:`
  <section class="feature-page"><header><h2>Audit History</h2><p>Trace financial and administrative changes by user, entity, or transaction.</p></header>
    <mat-card><mat-card-content><form [formGroup]="form" class="filters" (ngSubmit)="search(0)">
      <mat-form-field appearance="outline"><mat-label>From</mat-label><input matInput type="date" formControlName="from"></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>To</mat-label><input matInput type="date" formControlName="to"></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>User</mat-label><input matInput formControlName="actor"></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Action</mat-label><input matInput formControlName="action"></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Entity type</mat-label><input matInput formControlName="entityType"></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Entity ID</mat-label><input matInput formControlName="entityId"></mat-form-field>
      <div><button mat-flat-button color="primary">Search</button><button mat-button type="button" (click)="clear()">Clear</button></div>
    </form></mat-card-content></mat-card>
    <mat-card class="results"><mat-card-content><div class="table-wrap">
      <table mat-table [dataSource]="entries" multiTemplateDataRows>
        <ng-container matColumnDef="occurredAt"><th mat-header-cell *matHeaderCellDef>Date/time</th><td mat-cell *matCellDef="let r">{{r.occurredAt|date:'medium'}}</td></ng-container>
        <ng-container matColumnDef="actor"><th mat-header-cell *matHeaderCellDef>User</th><td mat-cell *matCellDef="let r">{{r.actorName}}<small>{{r.actorRole}}</small></td></ng-container>
        <ng-container matColumnDef="action"><th mat-header-cell *matHeaderCellDef>Action</th><td mat-cell *matCellDef="let r">{{r.action}}</td></ng-container>
        <ng-container matColumnDef="entity"><th mat-header-cell *matHeaderCellDef>Entity</th><td mat-cell *matCellDef="let r">{{r.entityType}} #{{r.entityId}}</td></ng-container>
        <ng-container matColumnDef="reference"><th mat-header-cell *matHeaderCellDef>Reference</th><td mat-cell *matCellDef="let r">{{r.transactionReference||'-'}}</td></ng-container>
        <ng-container matColumnDef="summary"><th mat-header-cell *matHeaderCellDef>Summary</th><td mat-cell *matCellDef="let r">{{r.summary}}</td></ng-container>
        <ng-container matColumnDef="expand"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r"><button mat-icon-button (click)="expanded=expanded===r?undefined:r; $event.stopPropagation()"><mat-icon>{{expanded===r?'expand_less':'expand_more'}}</mat-icon></button></td></ng-container>
        <ng-container matColumnDef="detail"><td mat-cell *matCellDef="let r" [attr.colspan]="columns.length"><div class="detail" [class.open]="expanded===r"><div><b>Before</b><pre>{{r.beforeValue|json}}</pre></div><div><b>After</b><pre>{{r.afterValue|json}}</pre></div></div></td></ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr><tr mat-row *matRowDef="let row;columns:columns" (click)="expanded=expanded===row?undefined:row"></tr><tr mat-row *matRowDef="let row;columns:['detail']" class="detail-row"></tr>
      </table></div>
      <p class="empty" *ngIf="!loading&&!entries.length">No audit events found.</p>
      <mat-paginator [length]="total" [pageIndex]="page" [pageSize]="size" [pageSizeOptions]="[10,25,50]" (page)="pageChanged($event)"></mat-paginator>
    </mat-card-content></mat-card>
  </section>`,
  styles:[`.feature-page{padding:24px;max-width:1500px;margin:auto}h2{margin:0}header p,.empty{color:#667}.filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:10px;align-items:center}.results{margin-top:18px}.table-wrap{overflow:auto}table{width:100%;min-width:1000px}td small{display:block;color:#777}.detail-row{height:0}.detail{display:grid;grid-template-columns:1fr 1fr;gap:18px;overflow:hidden;max-height:0}.detail.open{max-height:400px;padding:15px}.detail pre{white-space:pre-wrap;background:#f6f8fa;padding:10px}.empty{text-align:center;padding:30px}`]
})
export class AuditHistoryComponent implements OnInit{
  entries:AuditEntry[]=[];expanded?:AuditEntry;loading=false;total=0;page=0;size=25;
  readonly columns=['occurredAt','actor','action','entity','reference','summary','expand'];
  readonly form=this.fb.group({from:[''],to:[''],actor:[''],action:[''],entityType:[''],entityId:['']});
  constructor(private readonly fb:FormBuilder,private readonly api:AuditApiService){}
  ngOnInit():void{this.search();}
  search(page=this.page):void{this.loading=true;const filters={...this.form.getRawValue(),page,size:this.size} as AuditFilters;this.api.search(filters).subscribe({next:r=>{this.entries=r.data?.content??[];this.total=r.data?.totalElements??0;this.page=r.data?.number??page;this.loading=false;},error:()=>{this.entries=[];this.loading=false;}});}
  pageChanged(event:PageEvent):void{this.size=event.pageSize;this.search(event.pageIndex);}
  clear():void{this.form.reset();this.search(0);}
}
