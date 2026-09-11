import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpApiService } from './api.service';
import { JwtService } from './jwt.service';
import { SubjectService } from './subjectService';
import { APIData, APIData1, APIData2 } from 'src/app/dashboard/service/service.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpApi: HttpApiService,
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    private subjectService: SubjectService,
  ) { }

  refreshFunction() {
    const token = this.jwtService.getToken();
    if (token && token !== 'undefined') {
      return this.getSession().subscribe({
        error: () => this.clearLocalStorage()
      });
    }
    this.clearLocalStorage();
    return this.router.navigate(['/login']);
  }

  setAuth(user: any) {
    this.subjectService.setIsAuthenticated(true);
    this.subjectService.setCurrentUser(user);
    if (user?.token) {
      this.jwtService.saveToken(user.token);
    }
  }

  clearLocalStorage() {
    this.subjectService.setIsAuthenticated(false);
    this.jwtService.destroyToken();
    this.router.navigate(['/login']);
  }

  authSession(obj: { userName: string; password: string }) {
    return this.httpApi.post('/api/authSession', obj);
  }

  getSession(): Observable<any> {
    const token = this.jwtService.getToken();
    return this.httpApi.post('/api/getSession', token).pipe(
      tap(response => {
        if (response?.status === true) {
          this.setAuth(response);
        } else {
          this.clearLocalStorage();
        }
      }),
      catchError(err => {
        this.clearLocalStorage();
        return of({ status: false, message: 'Session expired' });
      })
    );
  }

  createUser(formData: FormData) {
    return this.httpApi.postMultipart('/api/createUser', formData);
  }

  updateUserProfile(editDetails: any) {
    return this.httpApi.post('/api/updateUserProfile', editDetails);
  }

  checkCurrentPassword(currentPwd: any) {
    return this.httpApi.post('/api/checkCurrentPassword', currentPwd);
  }

  changePassword(changePwd: any) {
    return this.httpApi.post('/api/changePassword', changePwd);
  }

  addCustomer(payload: any) {
    return this.httpApi.post('/api/addCustomer', payload);
  }

  getCustomerDetailsById(payload: any) {
    return this.httpApi.post('/api/getCustomerDetailsById', payload);
  }

  updateCustomer(payload: any) {
    return this.httpApi.post('/api/updateCustomer', payload);
  }

  deleteCustomer(payload: any) {
    return this.httpApi.post('/api/deleteCustomer', payload);
  }

  getAllCustomerList(payload: any) {
    return this.httpApi.post('/api/getAllCustomerList', payload);
  }

  sendSmsToMobileNumber() {
    return this.httpApi.post('/api/sendSmsToMobileNumber');
  }

  sendMail(to?: string, subject?: string, text?: string) {
    let params = new HttpParams();
    if (to) {
      params = params.set('to', to);
    }
    if (subject) {
      params = params.set('subject', subject);
    }
    if (text) {
      params = params.set('text', text);
    }
    return this.httpApi.post('/api/sendMail?' + params.toString());
  }

  uploadImage(formData: FormData) {
    return this.httpApi.postMultipart('/api/uploadImage', formData);
  }

  getCapcha() {
    return this.httpApi.post('/api/getCapcha');
  }

  /** Client-side converter (backend demo endpoint removed). */
  rgbToHexColor(rgbValue: number[]) {
    const hex = '#' + (rgbValue || []).map(value => {
      const clamped = Math.max(0, Math.min(255, Number(value) || 0));
      return clamped.toString(16).padStart(2, '0').toUpperCase();
    }).join('');
    return of(hex);
  }

  getChartDetails(clientId: number | string, type: number | string) {
    return this.httpApi.post(`/api/getChartDetails/${clientId}/${type}`);
  }

  getNavigationMenu(userGroupId: number | string) {
    return this.httpApi.get(`/api/getNavigationMenu/${userGroupId}`);
  }

  getUsergroupList() {
    return this.httpApi.get('/api/getUsergroupList');
  }

  logout(payload: any) {
    return this.httpApi.post('/api/logout', payload);
  }

  fileUpload(formData: FormData) {
    return this.httpApi.postMultipart('/api/uploadImage', formData);
  }

  getUploadedFileDetails(userAccountId: number) {
    return this.httpApi.post('/api/getUploadedFileDetails', userAccountId);
  }

  deleteFileDetails(payload: any) {
    return this.httpApi.post('/api/deleteFileDetails', payload);
  }

  getPaymentList(payload: any) {
    return this.httpApi.post('/api/getPaymentList', payload);
  }

  getPaymentListByCustomerId(customerId: number) {
    return this.httpApi.get(`/api/getPaymentListByCustomerId/${customerId}`);
  }

  changePaymentStatus(payload: any) {
    return this.httpApi.post('/api/changePaymentStatus', payload);
  }

  getUserById(userAccountId: number) {
    return this.httpApi.get(`/api/users/${userAccountId}`);
  }

  updateUser(payload: any) {
    return this.httpApi.post('/api/updateUser', payload);
  }

  deleteUser(payload: any) {
    return this.httpApi.post('/api/deleteUser', payload);
  }

  getPaymentById(paymentId: number) {
    return this.httpApi.get(`/api/payments/${paymentId}`);
  }

  updatePayment(payload: any) {
    return this.httpApi.post('/api/updatePayment', payload);
  }

  deletePayment(payload: any) {
    return this.httpApi.post('/api/deletePayment', payload);
  }

  createUserGroup(payload: any) {
    return this.httpApi.post('/api/createUserGroup', payload);
  }

  updateUserGroup(payload: any) {
    return this.httpApi.post('/api/updateUserGroup', payload);
  }

  deleteUserGroup(payload: any) {
    return this.httpApi.post('/api/deleteUserGroup', payload);
  }

  getUserGroupById(userGroupId: number) {
    return this.httpApi.get(`/api/userGroups/${userGroupId}`);
  }

  getCountrys() {
    return this.http.get<APIData>('https://countriesnow.space/api/v0.1/countries/positions');
  }

  getStates() {
    return this.http.get<APIData1>('https://countriesnow.space/api/v0.1/countries/states/q?country=India');
  }

  getCities(o: object) {
    return this.http.post<APIData2>('https://countriesnow.space/api/v0.1/countries/state/cities', o);
  }
}
