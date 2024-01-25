import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JwtService } from './jwt.service';
import { catchError } from 'rxjs/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class httpService {

  constructor(  private http: HttpClient,private jwtService: JwtService ) {
    
   }
   
   normalPost(path: string, params: HttpParams = new HttpParams())
  { 
    return this.http.post(`${environment.api_url}${path}`, { headers: this.setHeaders() })
    .pipe(catchError(this.formatErrors)); 
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { headers: this.setHeaders() })
      .pipe(catchError(this.formatErrors));
  }
  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    ).pipe(catchError(this.formatErrors));
  }

  uploadpost(path: string, body: any): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      body,
      { headers: this.setSHeaders() }
    ).pipe(catchError(this.formatErrors));
  }
 
  getpost(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      body,
      { headers: this.setHeaders() }
    ).pipe(catchError(this.formatErrors));
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
    console.log('-----header------',headersConfig);
    return new HttpHeaders(headersConfig);
  }
  private setSHeaders(): HttpHeaders  {
    const headersConfig:any = {};
    if (this.jwtService.getToken()) {
      headersConfig['Authorization'] =this.jwtService.getToken();
    }
    return new HttpHeaders(headersConfig);
  }
  private formatErrors(error: any) {
    //  console.log("err",error)
     return Observable.throw(error.json());
  }

  testpost(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
    `${environment.api_url}${path}`,body,
    { headers: this.setHeaders() }).pipe(catchError(this.formatErrors))
    
}


postMultipartWithForm(path: string, body: any ): Observable<any> {
  return this.http.post(`${environment.api_url}${path}`,body,this.getFileDataHeader())
   .pipe(catchError(this.formatErrors))
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
