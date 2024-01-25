import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/user.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as sql from 'mssql';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup
  constructor( private fb:FormBuilder,private jwtService:JwtService,private toastr:ToastrService,private router:Router,private userService:UserService,private responsive: BreakpointObserver) { 
    // window.history.forward(); 
  }

  ngOnInit(): void {

    this.loginForm=this.fb.group(
      {
        userId:['',Validators.required],
        password:['',Validators.required],
        capcha:['',Validators.required]
      }
    ) 
    // this.consoleFunction()
    this.getCapcha();
  } 
  
  consoleFunction()
  {
      console.log('Web ' + Breakpoints.Web);
      console.log('WebLandscape ' + Breakpoints.WebLandscape);
      console.log('WebPortrait ' + Breakpoints.WebPortrait);

      console.log('Tablet ' + Breakpoints.Tablet);
      console.log('TabletPortrait ' + Breakpoints.TabletPortrait);
      console.log('TabletLandscape ' + Breakpoints.TabletLandscape);

      console.log('Handset ' + Breakpoints.Handset);
      console.log('HandsetLandscape ' + Breakpoints.HandsetLandscape);
      console.log('HandsetPortrait ' + Breakpoints.HandsetPortrait);

      console.log('XSmall ' + Breakpoints.XSmall);
      console.log('Small ' + Breakpoints.Small);
      console.log('Medium ' + Breakpoints.Medium);
      console.log('Large ' + Breakpoints.Large);
      console.log('XLarge ' + Breakpoints.XLarge);

      this.responsive.observe(Breakpoints.HandsetLandscape)
      .subscribe(result => {

        if (result.matches) {
          console.log("screens matches HandsetLandscape");
        }})
  }
  datas:any
  loginObj:any={}
  passwordWrong:boolean=false;
  errorMsg:String=''
  loginFunction(data:any)
  {  
    
     if(data.capcha==this.capchaDeatils.value)
     {
      let payload={ userName:data.userId,password:data.password}
      this.userService.authSession(payload).subscribe(response=>{
           if(response.status==true)
           {
            this.jwtService.saveToken(response.token)
            this.userService.getSession().subscribe(responce=>{
              if(responce.status==true)
              {
                this.router.navigate(['dashboard'])
              }
            })
           }else{
            this.errorMsg=response.message
           }
       })
     }
     else
     {
       this.errorMsg="Invalid Capcha"
     }
     
  }
  
  show:boolean=true
  toggleShow(event:any,inputId:any,eyeId:any)
  {
     var input=document.getElementById(inputId)
     var icon=document.getElementById(eyeId)
     if(this.show)
     { 
      input?.setAttribute("type",'text')
      icon?.setAttribute("class",'fa fa-eye-slash')
     }
     else{
      input?.setAttribute("type",'password')
      icon?.setAttribute("class",'fa fa-eye')
     }
     this.show=!this.show
  }

capchaDeatils:any={}
  getCapcha()
  {
    this.userService.getCapcha('0').subscribe(data=>{
          this.capchaDeatils=data
          this.capchaDeatils.image="data:image/png;base64,"+this.capchaDeatils.image;
    })
    // this.connectToDatabase()
  }
// ----------------test db connection-------------------


// async  connectToDatabase() {
//   const  config: sql.config = {
//     server: '192.168.5.160',
//     database: 'test',
//     user: 'RCNGUSER',
//     password: 'rcng@)!*',
//     options: {
//       encrypt: true, // Enable encryption if needed
//     },
//   };
//     try {
//       await  sql.connect(config);
//       console.log('Connected to the database successfully!');
//       // Perform database operations here
//     } catch (error) {
//       console.error('Error connecting to the database:', error);
//     }
//   }
}
