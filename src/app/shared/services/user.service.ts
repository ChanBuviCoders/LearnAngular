import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { httpService } from './api.service';
import { JwtService } from './jwt.service';
import { SubjectService } from './subjectService';
import { APIData, APIData1, APIData2 } from 'src/app/dashboard/service/service.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpService: httpService,
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private SubjectService: SubjectService,
  ) {

  }

  refreshFunction() {
    if (this.jwtService.getToken() != null && this.jwtService.getToken() != 'undefined' && this.jwtService.getToken() != undefined) {
      return this.getSession().subscribe()
    }
    else {
      this.clearLocalStorage()
      return this.router.navigate(['/login'])
    }
  }


  setAuth(user) {
    this.SubjectService.setIsAuthenticated(true);
    this.SubjectService.setCurrentUser(user)
    this.jwtService.saveToken(user.token)
  }

  clearLocalStorage() {
    this.SubjectService.setIsAuthenticated(false);
    this.jwtService.destroyToken()
    this.router.navigate(['/login'])
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
  getUsergroupList() {
    return this.httpService.get('/api/getUsergroupList')
  }
  logout(payload) {
    return this.httpService.post('/api/logout', payload);
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
  getPaymentList(formData) {
    return this.httpService.post('/api/getPaymentList', formData);
  }
  getPaymentListByCustomerId(customerId: number) {
    return this.httpService.get('/api/getPaymentListByCustomerId/' + customerId);
  }
  changePaymentStatus(formData) {
    return this.httpService.post('/api/changePaymentStatus', formData);
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

  getCountrys(){
    return this.http.get<APIData>("https://countriesnow.space/api/v0.1/countries/positions");
  }
  getStates(){
    return this.http.get<APIData1>("https://countriesnow.space/api/v0.1/countries/states/q?country=India");
  }
  getCities(o:object){
    return this.http.post<APIData2>("https://countriesnow.space/api/v0.1/countries/state/cities",o);
  }
}