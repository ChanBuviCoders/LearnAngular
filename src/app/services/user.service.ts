import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ApiService} from './api.service'
import { map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router,ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   
  private isAuthenticatedSubject=new ReplaySubject <boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private currentUserDetails=new BehaviorSubject <any>(1);
  public currentuserSubject = this.currentUserDetails.asObservable();
  
  constructor(  
    private apiservice:ApiService,
    private http: HttpClient,
    private jwtService:JwtService,
    private router:Router,
    private ActivateRouter:ActivatedRoute) {
                  
   }

  refreshFunction()
  {   
       if(this.jwtService.getToken() )
       {
        return this.apiservice.testpost('/api/getSession',this.jwtService.getToken()).subscribe((data)=>{
          if(data.item)
          {
            this.setAuth(data)
            this.router.navigateByUrl("dashboard")
          }
          else{
            this.clearLocalStorage()
          }  
        },
         (err)=>{
          this.router.navigate(['/login'])
         }
        )
       }
       else{
        this.clearLocalStorage()
        return  this.router.navigate(['/login'])
       }
  } 

  setAuth(user)
  {
   this.isAuthenticatedSubject.next(true);
   this.currentUserDetails.next(user.item)
   this.jwtService.saveToken(user.token)
  //  window.sessionStorage.setItem("jwtToken",user.token)
  }

  clearLocalStorage()
  {
    this.isAuthenticatedSubject.next(false);
    this.jwtService.destroyToken()
    this.router.navigate(['/login'])
  }


  springCreateUser(obj:any)
  {
    return this.apiservice.get('/api/getAllUser').pipe(map(data=>{return data;}));
  }

  authSession(obj)
  {
    return this.apiservice.post('/api/authSession',obj).pipe(map(data=>{
      if(data.item)
      this.setAuth(data)
      return data;}));
  } 

  getSession(){
    if(this.jwtService.getToken())
    {  
      return this.apiservice.post('/api/getSession',this.jwtService.getToken()).pipe(map(data=>{
      if(data.item)
      this.setAuth(data.item)
      return data;}));
    }
    else{
      return this.router.navigateByUrl("/login")
    }
  }
  
  createUser(obj:any)
  {
    return this.apiservice.post('/api/createUser',obj).pipe(map(data=>{return data;}));
  }
  saveLoginCred(obj:any)
  {
    return this.apiservice.post('/api/saveLoginCred',obj).pipe(map(data=>{return data;}));
  } 
  
  getUserProfile()
  {
    return this.apiservice.post('/api/getUserProfile').pipe(map(data=>{return data;}));
  }
  updateUserProfile(editDetails)
  {
    return this.apiservice.post('/api/updateUserProfile',editDetails).pipe(map(data=>{return data;}));
  }

  checkCurrentPassword(CurrentPwd)
  {
    return this.apiservice.post('/api/checkCurrentPassword',CurrentPwd).pipe(map(data=>{return data;}));
  }

  changePassword(changePwd)
  {
    return this.apiservice.post('/api/changePassword',changePwd).pipe(map(data=>{return data;}));
  }
  
  addCustomer(payload)
  {
    return this.apiservice.post('/api/addCustomer',payload).pipe(map(data=>{return data;}));
  }
  
  getCustomerDetailsById(payload)
  {
    return this.apiservice.post('/api/getCustomerDetailsById',payload).pipe(map(data=>{return data;}));
  }
  
  updateCustomer(payload)
  {
    return this.apiservice.post('/api/updateCustomer',payload).pipe(map(data=>{return data;}));
  }
  
  deleteCustomer(payload)
  {
    return this.apiservice.post('/api/deleteCustomer',payload).pipe(map(data=>{return data;}));
  }
  
  getAllCustomerList(payload)
  {
    return this.apiservice.post('/api/getAllCustomerList',payload).pipe(map(data=>{return data;}));
  }

  sendSmsToMobileNumber()
  {
    return this.apiservice.post('/api/sendSmsToMobileNumber').pipe(map(data=>{return data;}));
  }
  
  sendMail()
  {
    return this.apiservice.post('/api/sendMail').pipe(map(data=>{return data;}));
  }

  uploadImage(formData)
  { 
    return this.apiservice.postMultipartWithForm('/api/uploadImage',formData);
  }
  rgbToHexColor(formData)
  {
    return this.apiservice.post('/api/rgbToHexColor',formData);
  }

  getCapcha(formData)
  {
    return this.apiservice.post('/api/getCapcha');
  }

  getChartDetails(clientId,type){
    return this.apiservice.post('/api/getChartDetails/'+clientId+'/'+type);
  }
// =========================================================================================>
  post(obj : any)
  {
    return this.http.post("http://localhost:3000/signupDetails", obj).pipe(map(result => {return result}))
  }
  get()
  {
    return this.http.get("http://localhost:3000/signupDetails").pipe(map(data => {return data}))
  }
  update(obj : any)
  {
    return this.http.put("http://localhost:3000/signupDetails", obj).pipe(map(result => {return result}))
  }
  delete(obj : any)
  {
    return this.http.delete("http://localhost:3000/signupDetails", obj).pipe(map(result => {return result}))
  }

  processedLogAudit(data){
    return this.apiservice.postMultipartWithForm('/api/crctrl/generateCaseReview',data);
  }
  
  
  fileUpload(formData)
  { 
    return this.apiservice.postMultipartWithForm('/api/uploadImage',formData);
  }

   
  getUploadedFileDetails(formData)
  { 
    return this.apiservice.post('/api/getUploadedFileDetails',formData);
  }

  deleteFileDetails(formData)
  { 
    return this.apiservice.post('/api/deleteFileDetails',formData);
  }
}
