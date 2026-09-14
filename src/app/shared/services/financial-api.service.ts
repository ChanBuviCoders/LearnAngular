import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiResponse,
  CollectionTransaction,
  Customer,
  CustomerInput,
  Loan,
  LoanProduct,
  LoanSchedule,
  PagedResult
} from '../../models/financial.models';
import { HttpApiService } from './api.service';

const PICKER_SIZE = 200;

@Injectable({ providedIn: 'root' })
export class FinancialApiService {
  private readonly base = '/api/v2';

  constructor(private readonly api: HttpApiService) {}

  getCustomers(search = ''): Observable<ApiResponse<Customer[]>> {
    return this.getCustomersPage(search, 0, PICKER_SIZE).pipe(
      map(response => unwrapPage<Customer>(response))
    );
  }

  getCustomersPage(search = '', page = 0, size = 25): Observable<ApiResponse<PagedResult<Customer>>> {
    return this.api.get(`${this.base}/customers`, pageParams({ search, page, size }));
  }

  getCustomer(id: number): Observable<ApiResponse<Customer>> {
    return this.api.get(`${this.base}/customers/${id}`);
  }

  createCustomer(input: CustomerInput): Observable<ApiResponse<Customer>> {
    return this.api.post(`${this.base}/customers`, input);
  }

  updateCustomer(id: number, input: CustomerInput): Observable<ApiResponse<Customer>> {
    return this.api.put(`${this.base}/customers/${id}`, input);
  }

  deactivateCustomer(id: number): Observable<ApiResponse<void>> {
    return this.api.delete(`${this.base}/customers/${id}`);
  }

  getLoanProducts(): Observable<ApiResponse<LoanProduct[]>> {
    return this.api.get(`${this.base}/loan-products`, pageParams({ page: 0, size: PICKER_SIZE })).pipe(
      map(response => unwrapPage<LoanProduct>(response))
    );
  }

  createLoanProduct(input: Partial<LoanProduct>): Observable<ApiResponse<LoanProduct>> {
    return this.api.post(`${this.base}/loan-products`, input);
  }

  getLoans(status?: string, customerId?: number): Observable<ApiResponse<Loan[]>> {
    return this.getLoansPage(status, customerId, 0, PICKER_SIZE).pipe(
      map(response => unwrapPage<Loan>(response))
    );
  }

  getLoansPage(status?: string, customerId?: number, page = 0, size = 25): Observable<ApiResponse<PagedResult<Loan>>> {
    return this.api.get(`${this.base}/loans`, pageParams({ status, customerId, page, size }));
  }

  getLoan(id: number): Observable<ApiResponse<Loan>> {
    return this.api.get(`${this.base}/loans/${id}`);
  }

  createLoan(input: unknown): Observable<ApiResponse<Loan>> {
    return this.api.post(`${this.base}/loans`, input);
  }

  approveLoan(id: number): Observable<ApiResponse<Loan>> {
    return this.api.post(`${this.base}/loans/${id}/approve`);
  }

  activateLoan(id: number): Observable<ApiResponse<Loan>> {
    return this.api.post(`${this.base}/loans/${id}/activate`);
  }

  cancelLoan(id: number, reason?: string): Observable<ApiResponse<Loan>> {
    return this.api.post(`${this.base}/loans/${id}/cancel`, { reason });
  }

  closeLoan(id: number, reason?: string): Observable<ApiResponse<Loan>> {
    return this.api.post(`${this.base}/loans/${id}/close`, { reason });
  }

  markOverdue(): Observable<ApiResponse<number>> {
    return this.api.post(`${this.base}/loans/overdue-scan`);
  }

  updateLoanProduct(id: number, input: Partial<LoanProduct>): Observable<ApiResponse<LoanProduct>> {
    return this.api.put(`${this.base}/loan-products/${id}`, input);
  }

  getLoanSchedule(id: number): Observable<ApiResponse<LoanSchedule[]>> {
    return this.api.get(`${this.base}/loans/${id}/schedule`);
  }

  getCollections(filters: {
    from?: string;
    to?: string;
    frequency?: string;
    customerId?: number;
    collectorId?: number;
    page?: number;
    size?: number;
  }): Observable<ApiResponse<PagedResult<CollectionTransaction>>> {
    return this.api.get(`${this.base}/collections`, pageParams({
      ...filters,
      page: filters.page ?? 0,
      size: filters.size ?? 25
    }));
  }

  postCollection(input: unknown): Observable<ApiResponse<CollectionTransaction>> {
    return this.api.post(`${this.base}/collections`, input);
  }

  reverseCollection(id: number, reason: string): Observable<ApiResponse<CollectionTransaction>> {
    return this.api.post(`${this.base}/collections/${id}/reverse`, { reason });
  }
}

function pageParams(values: Record<string, string | number | null | undefined>): HttpParams {
  let params = new HttpParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  });
  return params;
}

function unwrapPage<T>(response: ApiResponse<T[] | PagedResult<T>>): ApiResponse<T[]> {
  const data = Array.isArray(response.data) ? response.data : response.data?.content ?? [];
  return { ...response, data };
}
