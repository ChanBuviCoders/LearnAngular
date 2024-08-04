import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { httpService } from './api.service'
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Getsession } from 'src/app/models/getsession.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Getsession:Getsession;
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private currentUserDetails = new BehaviorSubject<Getsession>({} as Getsession);
  public currentuserSubject = this.currentUserDetails.asObservable();

  constructor(
    private httpService: httpService,
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    private activateRoute: ActivatedRoute,
  ) {

  }

  refreshFunction() {

    console.log('------router url--------', this.activateRoute);
    if (this.jwtService.getToken() != null && this.jwtService.getToken() != 'undefined' && this.jwtService.getToken() != undefined) {
      return this.getSession().subscribe()
    }
    // else if () {
    //   this.clearLocalStorage()
    //   return this.router.navigate(['/login'])
    // }
    else {
      this.clearLocalStorage()
      return this.router.navigate(['/login'])
    }
  }


  setAuth(user) {
    this.isAuthenticatedSubject.next(true);
    this.currentUserDetails.next(user)
    this.jwtService.saveToken(user.token)
  }

  clearLocalStorage() {
    this.isAuthenticatedSubject.next(false);
    this.jwtService.destroyToken()
    this.router.navigate(['/login'])
  }


  springCreateUser(obj: any) {
    return this.httpService.get('/api/getAllUser').pipe(map(data => { return data; }));
  }

  authSession(obj) {
    return this.httpService.post('/api/authSession', obj)
  }

  getSession() {

    return this.httpService.testpost('/api/getSession', this.jwtService.getToken()).pipe(map(
      responce => {
        if (responce.status == true) {
          this.setAuth(responce)
        }
        return responce;
      },
      err => {
        this.clearLocalStorage();
        this.router.navigateByUrl("/login");
      }
    ));

  }

  createUser(obj: any) {
    return this.httpService.post('/api/createUser', obj).pipe(map(data => { return data; }));
  }
  saveLoginCred(obj: any) {
    return this.httpService.post('/api/saveLoginCred', obj).pipe(map(data => { return data; }));
  }

  getUserProfile() {
    return this.httpService.post('/api/getUserProfile').pipe(map(data => { return data; }));
  }
  updateUserProfile(editDetails) {
    return this.httpService.post('/api/updateUserProfile', editDetails).pipe(map(data => { return data; }));
  }

  checkCurrentPassword(CurrentPwd) {
    return this.httpService.post('/api/checkCurrentPassword', CurrentPwd).pipe(map(data => { return data; }));
  }

  changePassword(changePwd) {
    return this.httpService.post('/api/changePassword', changePwd).pipe(map(data => { return data; }));
  }

  addCustomer(payload) {
    return this.httpService.post('/api/addCustomer', payload).pipe(map(data => { return data; }));
  }

  getCustomerDetailsById(payload) {
    return this.httpService.post('/api/getCustomerDetailsById', payload).pipe(map(data => { return data; }));
  }

  updateCustomer(payload) {
    return this.httpService.post('/api/updateCustomer', payload).pipe(map(data => { return data; }));
  }

  deleteCustomer(payload) {
    return this.httpService.post('/api/deleteCustomer', payload).pipe(map(data => { return data; }));
  }

  getAllCustomerList(payload) {
    return this.httpService.post('/api/getAllCustomerList', payload).pipe(map(data => { return data; }));
  }

  sendSmsToMobileNumber() {
    return this.httpService.post('/api/sendSmsToMobileNumber').pipe(map(data => { return data; }));
  }

  sendMail() {
    return this.httpService.post('/api/sendMail').pipe(map(data => { return data; }));
  }

  uploadImage(formData) {
    return this.httpService.postMultipartWithForm('/api/uploadImage', formData);
  }
  rgbToHexColor(formData) {
    return this.httpService.post('/api/rgbToHexColor', formData);
  }

  getCapcha(formData) {
    return this.httpService.post('/api/getCapcha');
  }

  getChartDetails(clientId, type) {
    return this.httpService.post('/api/getChartDetails/' + clientId + '/' + type);
  }

  getNavigationMenu(userGroupId) {
    return this.httpService.get(`/api/getNavigationMenu/${userGroupId}`)
  }
  getUsergroupList(){
    return this.httpService.get('/api/getUsergroupList')
  }

  logout(payload) {
    return this.httpService.post('/api/logout', payload);
  }
  // =========================================================================================>
  post(obj: any) {
    return this.http.post("http://localhost:3000/signupDetails", obj).pipe(map(result => { return result }))
  }
  get() {
    return this.http.get("http://localhost:3000/signupDetails").pipe(map(data => { return data }))
  }
  update(obj: any) {
    return this.http.put("http://localhost:3000/signupDetails", obj).pipe(map(result => { return result }))
  }
  delete(obj: any) {
    return this.http.delete("http://localhost:3000/signupDetails", obj).pipe(map(result => { return result }))
  }

  processedLogAudit(data) {
    return this.httpService.postMultipartWithForm('/api/crctrl/generateCaseReview', data);
  }


  fileUpload(formData) {
    return this.httpService.postMultipartWithForm('/api/uploadImage', formData);
  }


  getUploadedFileDetails(formData) {
    return this.httpService.post('/api/getUploadedFileDetails', formData);
  }

  deleteFileDetails(formData) {
    return this.httpService.post('/api/deleteFileDetails', formData);
  }
}
