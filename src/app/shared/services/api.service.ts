import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JwtService } from './jwt.service';
import { catchError } from 'rxjs/operators/catchError';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class httpService {

  constructor(  private http: HttpClient,private jwtService: JwtService ) {
    
   }
   
   normalPost(path: string, params: HttpParams = new HttpParams())
  { 
    return this.http.post(`${environment.api_url}${path}`, { headers: this.setHeaders() })
    ; 
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { headers: this.setHeaders() })
      ;
  }
  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    );
  }

  uploadpost(path: string, body: any): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      body,
      { headers: this.setSHeaders() }
    );
  }
 
  getpost(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      body,
      { headers: this.setHeaders() }
    );
  }



  ///set header
  private setHeaders(): HttpHeaders  {
    const headersConfig:any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (this.jwtService.getToken()) {
      headersConfig['Authorization'] =this.jwtService.getToken();
    }
    return new HttpHeaders(headersConfig);
  }
  private setSHeaders(): HttpHeaders  {
    const headersConfig:any = {};
    if (this.jwtService.getToken()) {
      headersConfig['Authorization'] =this.jwtService.getToken();
    }
    return new HttpHeaders(headersConfig);
  }

  testpost(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
    `${environment.api_url}${path}`,body,
    { headers: this.setHeaders() })
    
}


postMultipartWithForm(path: string, body: any ): Observable<any> {
  return this.http.post(`${environment.api_url}${path}`,body,this.getFileDataHeader())
   
}

  getFileDataHeader() {
   
    const _gettoken = new HttpHeaders()
      //.set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Accept','application/json')
      .set('Authorization', `${this.jwtService.getToken()}`);

    return { headers: _gettoken };
   }
}
