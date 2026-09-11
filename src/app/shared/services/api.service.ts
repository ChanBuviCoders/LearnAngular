import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Thin HTTP wrapper. Auth headers are attached by JwtAuthInterceptor.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  constructor(private http: HttpClient) { }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, {
      headers: this.jsonHeaders(),
      params
    });
  }

  post(path: string, body: unknown = {}): Observable<any> {
    return this.http.post(`${environment.api_url}${path}`, body, {
      headers: this.jsonHeaders()
    });
  }

  postMultipart(path: string, body: FormData): Observable<any> {
    return this.http.post(`${environment.api_url}${path}`, body);
  }

  private jsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }
}

/** @deprecated Use HttpApiService — kept for existing injections */
export { HttpApiService as httpService };
