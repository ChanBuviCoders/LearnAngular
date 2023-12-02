import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/user.service';
import * as $ from "jquery";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private jwtService: JwtService,
    private datepipe :DatePipe,
    private router:Router
  ) {}
  editForm: FormGroup;
  filter: FormGroup;
  mode: any;
  date: any;
  currentUserDetails: any;
  defaultImg: any = "./assets/images/user.webp";
  currentDate:any
  minDate:any
  ngOnInit(): void { 
    this.date=new Date();
    this.currentDate =this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.minDate =this.datepipe.transform(this.createDate(0,0,100), 'yyyy-MM-dd');
    this.editForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dob: ["", Validators.required],
      gender: ["", Validators.required],
      email: ["",Validators.required]
    });
    this.userService.currentuserSubject.subscribe((data) => {this.currentUserDetails = data;});
  } 

  createDate(days, months, years) {
    var date = new Date(); 
    date.setDate(date.getDate() - days);
    date.setMonth(date.getMonth() -months);
    date.setFullYear(date.getFullYear() -years);
    return date;    
}

  editFunction(data: any) {
    var editObj = {
      dob: data.dob,
      email: data.email,
      gender: data.gender,
      firstName: data.firstName,
      lastName: data.lastName,
      clientInfoId:this.currentUserDetails.clientInfoId
    };

    this.userService.updateUserProfile(editObj).subscribe(data=>{
        if(data.status=="Success")
        {
          this.toastr.success(data.message)
        }
        else
        {
          this.toastr.error(data.message)
        }
    })
  }
  imgMaxSize: any;
  imagearr: any;
  dataimg: any;
  fileUpload(event: any) {
    let acceptFormat = ["image/png", "image/x-png", "image/jpeg", "image/jpg"];
    let formDetails={firstName:"chandran",lastname:"subramani"}
    const formData = new FormData();
    formData.append("file",event.target.files[0])
    formData.append("formDetails",JSON.stringify(formDetails))
    setTimeout(() => {
      this.userService.uploadImage(formData).subscribe(data=>{console.log('-----------',data);})
    }, 10);
    // console.log('------------formdata---------',formData);
  return;
    let reader = new FileReader();
    console.log('-----event------',event);
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      // console.log('-------onloadEvent---0',events);
      if (!acceptFormat.includes(event.target.files[0].type)) {
      }
      else if (event.target.files[0].size > this.imgMaxSize) {
      } else {
        this.dataimg = events.currentTarget.result;
        // console.log('----------dataImag---',this.dataimg);
        this.imagearr = {
          filename: event.target.files[0].name,
          primary: true,
          filetype: event.target.files[0].type.split("/")[1],
          value: events.currentTarget.result.split(",")[1],
        };
        // console.log('----------imagearr---',this.imagearr);
      }
    };
  }
  changePassword: any = {};
  newConfirm: boolean = false;

  changePasswordFunction(value,form) {
    if (this.changePassword.newPwd === this.changePassword.confirmPwd) {
      this.newConfirm = false;
      let payLoad={
                  "clientId":this.currentUserDetails.clientInfoId,
                  "password":value.newPwd
                  }
      this.userService.changePassword(payLoad).subscribe(data=>{
        if(data.status=="Success")
        {
           this.toastr.info(data.message)
           form.resetForm();
           this.userService.clearLocalStorage()
           this.router.navigateByUrl('/login')
        }
        else{
           this.toastr.error(data.message)
        }

      })
    } else {
      this.newConfirm = true;
    }
  } 
  currentPwdStatus:string='';
  checkCurrentPwt(currentPassword)
  { 
    this.currentPwdStatus=''
   
    if(currentPassword!='')
    {
      let payLoad={
        "clientId":this.currentUserDetails.clientInfoId,
        "password":currentPassword
      }
      this.userService.checkCurrentPassword(payLoad).subscribe(data=>{
          if(data.status=="Success")
          {
             this.currentPwdStatus=data.message
          }
          else{
             this.currentPwdStatus=data.message
             this.changePassword.currentPwd=''
          }
      })
    }

  }

  errorMessage: any;
  checkValidation() {
    if (
      this.passkey &&
      this.passkey1 &&
      this.passkey2 &&
      this.passkey3 &&
      this.passkey4
    ) {
      this.errorMessage = "";
    } else {
      this.errorMessage =
        "Kindly satisfy all the requirements for setting a password";
    }
  }

  show: boolean = false;
  toggleShow(event: any, id: any, inputid: any) {
    this.show = !this.show;

    if (this.show) {
      $(`#${id}`).removeClass("fa-eye");
      $(`#${id}`).addClass("fa-eye-slash");
      let input = $(`#${inputid}`);
      input.attr("type", "text");
    } else {
      $(`#${id}`).removeClass("fa-eye-slash");
      $(`#${id}`).addClass("fa-eye");
      let input = $(`#${inputid}`);
      input.attr("type", "password");
    }
  }

  showInput:boolean=true
  toggleShowFunction(inputId,eyeId)
  { 
     var input=document.getElementById(inputId)
     var icon=document.getElementById(eyeId)
     if(this.showInput)
     { 
      input?.setAttribute("type",'text')
      icon?.setAttribute("class",'fa fa-eye-slash')
     }
     else{
      input?.setAttribute("type",'password')
      icon?.setAttribute("class",'fa fa-eye')
     }
     this.showInput=!this.showInput
  }

  //password validation
  passval: boolean = false;
  passval1: boolean = false;
  passval2: boolean = false;
  passval3: boolean = false;
  passval4: boolean = false;
  passkey: boolean = false;
  passkey1: boolean = false;
  passkey2: boolean = false;
  passkey3: boolean = false;
  passkey4: boolean = false;
  passlast: boolean = false;
  passlast1: boolean = false;
  passlast2: boolean = false;
  passlast3: boolean = false;
  passlast4: boolean = false;
  onKey(event: any) {
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var special = /[#$^+=!*()@%&]/g;
    if (event.target.value.match(lowerCaseLetters)) {
      this.passval = true;
    } else {
      this.passval = false;
    }
    if (event.target.value.match(upperCaseLetters)) {
      this.passval1 = true;
    } else {
      this.passval1 = false;
    }
    if (event.target.value.match(numbers)) {
      this.passval2 = true;
    } else {
      this.passval2 = false;
    }
    if (event.target.value.length >= 8) {
      this.passval3 = true;
    } else {
      this.passval3 = false;
    }
    if (event.target.value.match(special)) {
      this.passval4 = true;
    } else {
      this.passval4 = false;
    }
  }
  onKey1(event: any) {
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var special = /[#$^+=!*()@%&]/g;
    if (event.target.value.match(lowerCaseLetters)) {
      this.passkey = true;
    } else {
      this.passkey = false;
    }
    if (event.target.value.match(upperCaseLetters)) {
      this.passkey1 = true;
    } else {
      this.passkey1 = false;
    }
    if (event.target.value.match(numbers)) {
      this.passkey2 = true;
    } else {
      this.passkey2 = false;
    }
    if (event.target.value.length >= 8) {
      this.passkey3 = true;
    } else {
      this.passkey3 = false;
    }
    if (event.target.value.match(special)) {
      this.passkey4 = true;
    } else {
      this.passkey4 = false;
    }
  }
  outfocus(event: any, id: any) {
    if (event) {
      $(`#${id}`).removeClass("shown");
    }
  }
  focus(event: any, id: any) {
    if (event) {
      $(`#${id}`).addClass("shown");
    }
  }


}
