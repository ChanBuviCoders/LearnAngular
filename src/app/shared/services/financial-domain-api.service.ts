import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse, AuditEntry, AuditFilters, BusinessSettings, ChitContribution,
  ChitMember, ChitRound, ChitScheme, ChitSchemeInput, CustomerFinancialProfile,
  DashboardKpis, FinanceAttachment, FinanceRole, FinanceUser, PagedResult,
  ReportFilters, ReportResult, ReportType, StaffMember
} from '../../models/financial.models';
import { HttpApiService } from './api.service';

const BASE = '/api/v2';

function paramsFrom(values: object): HttpParams {
  let params = new HttpParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  });
  return params;
}

@Injectable({ providedIn: 'root' })
export class ChitApiService {
  constructor(private readonly api: HttpApiService) {}

  getSchemes(status?: string): Observable<ApiResponse<ChitScheme[]>> {
    return this.api.get(`${BASE}/chits`, paramsFrom({ status }));
  }

  createScheme(input: ChitSchemeInput): Observable<ApiResponse<ChitScheme>> {
    return this.api.post(`${BASE}/chits`, input);
  }

  getMembers(chitId: number): Observable<ApiResponse<ChitMember[]>> {
    return this.api.get(`${BASE}/chits/${chitId}/members`);
  }

  addMember(chitId: number, input: { customerId: number; joinedDate: string }): Observable<ApiResponse<ChitMember>> {
    return this.api.post(`${BASE}/chits/${chitId}/members`, input);
  }

  getRounds(chitId: number): Observable<ApiResponse<ChitRound[]>> {
    return this.api.get(`${BASE}/chits/${chitId}/rounds`);
  }

  createRound(chitId: number, input: { collectionDate: string }): Observable<ApiResponse<ChitRound>> {
    return this.api.post(`${BASE}/chits/${chitId}/rounds`, input);
  }

  getContributions(roundId: number): Observable<ApiResponse<ChitContribution[]>> {
    return this.api.get(`${BASE}/chit-rounds/${roundId}/contributions`);
  }

  recordContribution(roundId: number, input: object): Observable<ApiResponse<ChitContribution>> {
    return this.api.post(`${BASE}/chit-rounds/${roundId}/contributions`, input);
  }

  recordWinner(roundId: number, input: object): Observable<ApiResponse<ChitRound>> {
    return this.api.post(`${BASE}/chit-rounds/${roundId}/winner`, input);
  }

  recordPayout(roundId: number, input: object): Observable<ApiResponse<ChitRound>> {
    return this.api.post(`${BASE}/chit-rounds/${roundId}/payout`, input);
  }
}

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  constructor(private readonly api: HttpApiService) {}
  getKpis(): Observable<ApiResponse<DashboardKpis>> {
    return this.api.get(`${BASE}/dashboard`);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportsApiService {
  constructor(private readonly api: HttpApiService) {}
  run(type: ReportType, filters: ReportFilters): Observable<ApiResponse<ReportResult>> {
    return this.api.get(`${BASE}/reports/${type}`, paramsFrom(filters));
  }
  downloadCsv(type: ReportType, filters: ReportFilters): Observable<Blob> {
    return this.api.getBlob(`${BASE}/reports/${type}`, paramsFrom({ ...filters, format: 'csv' }));
  }
}

@Injectable({ providedIn: 'root' })
export class CustomerProfileApiService {
  constructor(private readonly api: HttpApiService) {}
  get(customerId: number): Observable<ApiResponse<CustomerFinancialProfile>> {
    return this.api.get(`${BASE}/customers/${customerId}/financial-profile`);
  }
}

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  constructor(private readonly api: HttpApiService) {}
  get(): Observable<ApiResponse<BusinessSettings>> {
    return this.api.get(`${BASE}/settings`);
  }
  update(input: BusinessSettings): Observable<ApiResponse<BusinessSettings>> {
    return this.api.put(`${BASE}/settings`, input);
  }
}

@Injectable({ providedIn: 'root' })
export class AuditApiService {
  constructor(private readonly api: HttpApiService) {}
  search(filters: AuditFilters): Observable<ApiResponse<PagedResult<AuditEntry>>> {
    return this.api.get(`${BASE}/audit`, paramsFrom(filters));
  }
}

@Injectable({ providedIn: 'root' })
export class RoleAdministrationApiService {
  constructor(private readonly api: HttpApiService) {}

  getUsers(): Observable<ApiResponse<FinanceUser[]>> {
    return this.api.get(`${BASE}/admin/users`);
  }

  getRoles(): Observable<ApiResponse<FinanceRole[]>> {
    return this.api.get(`${BASE}/admin/roles`);
  }

  assignRoles(userId: number, roleIds: number[]): Observable<ApiResponse<FinanceUser>> {
    return this.api.put(`${BASE}/admin/users/${userId}/roles`, { roleIds });
  }

  setStatus(userId: number, active: boolean): Observable<ApiResponse<FinanceUser>> {
    return this.api.patch(`${BASE}/admin/users/${userId}/status`, { active });
  }
}

@Injectable({ providedIn: 'root' })
export class StaffApiService {
  constructor(private readonly api: HttpApiService) {}
  list(): Observable<ApiResponse<StaffMember[]>> {
    return this.api.get(`${BASE}/staff`);
  }
}

@Injectable({ providedIn: 'root' })
export class AttachmentApiService {
  constructor(private readonly api: HttpApiService) {}
  list(entityType: string, entityId: string): Observable<ApiResponse<FinanceAttachment[]>> {
    return this.api.get(`${BASE}/attachments`, paramsFrom({ entityType, entityId }));
  }
  upload(entityType: string, entityId: string, file: File): Observable<ApiResponse<FinanceAttachment>> {
    const body = new FormData();
    body.append('file', file);
    return this.api.postMultipart(`${BASE}/attachments/${entityType}/${entityId}`, body);
  }
}
