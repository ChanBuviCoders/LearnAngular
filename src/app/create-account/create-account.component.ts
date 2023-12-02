import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { UserService } from "../services/user.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  createActForm: FormGroup;
  loginCredForm: FormGroup;
  pan = "";
  constructor(
    private userservice: UserService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    private datepipe: DatePipe
  ) {}

  createAccount: boolean = true;
  currentDate:any
  ngOnInit(): void {
    this.date=new Date();
    this.currentDate =this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.formBuildFunction()
   
  }
  formBuildFunction()
  {
    this.createActForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dob: ["", Validators.required],
      gender: ["", Validators.required],
      fatherName: ["", Validators.required],
      marriedStatus: [null, Validators.required],
      annualIncome: ["", Validators.required],
      qualification: [null, Validators.required],
      pan: ["", Validators.required],
      occupation: [null, Validators.required],
      mobileNumber: ["", Validators.required],
      altMobileNumber: ["", Validators.required],
      email: ["", Validators.required],
      adharNumber: ["", Validators.required],
      adharfile: ["", Validators.required],
      panfile: ["", Validators.required],
      state: ["", Validators.required],
      city: ["", Validators.required],
      zipcode: ["", Validators.required],
      address: ["", Validators.required],
      userId: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.loginCredForm = this.fb.group({
      userId: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  date: any;
  

  genderValue(data) {}
  resetForm() {
    this.createActForm.reset();
  }
  setmask: any;
  onchange() {
    this.setmask = "(000) 000-0000";
  }

  variable1: any = "will";
  variable2: any = "validate";
  formvalidation() {
    this.variable1 = "was";
    this.variable2 = "validated";
  }
  datas: any;
  createActObj: any = {};
  createActFunction(data) {
    this.datas = data;
    this.createActObj = {
      firstName: this.datas.firstName,
      lastName: this.datas.lastName,
      dob: this.datas.dob,
      gender: this.datas.gender,
      fatherName: this.datas.fatherName,
      marriedStatus: this.datas.marriedStatus,
      annualIncome: Number(this.datas.annualIncome),
      qualification: this.datas.qualification,
      occupation: this.datas.occupation,
      mobileNumber: Number(this.datas.mobileNumber),
      altMobileNumber: Number(this.datas.altMobileNumber),
      email: this.datas.email,
      state: this.datas.state,
      city: this.datas.city,
      zipcode: this.datas.zipcode,
      address: this.datas.address,
      adharDetails: {
        "adharNumber": this.datas.adharNumber,
        "imagePath": this.adharfilejson.fileEncode,
      },
      panDetails: {
        "panNumber": this.datas.pan,
        "imagePath": this.panfilejson.fileEncode,
      },
      loginCred:{
        "userId":this.datas.userId,
        "password":this.datas.password
      }
    };

    this.userservice.createUser(this.createActObj).subscribe((response) => {
      if (response.Status == "Success") {
        this.toaster.success(response.Message);
        this.createActForm.reset();
        // this.createAccount = false;
        this.router.navigateByUrl("login");
        this.variable1= "will";
        this.variable2= "validate";
      } else {
        this.toaster.error  (response.Message);
      }
    });
  } 
  saveLoginCred(value) {
    this.userservice.saveLoginCred(value).subscribe((data) => {
      if (data.status == "Success") {
        this.toaster.success(data.message);
        this.router.navigateByUrl("login");
      } else {
        this.toaster.error(data.message);
        this.loginCredForm.reset()
      }
    });
  }
  //single file uploader

  panfilejson: any;
  adharfilejson: any;
  fileslist: any = [];
  arrayBuffer: any;
  JSONObject: any;
  showspinner: boolean = false;
  edata: any;

  fileuploadsingle(e) {
    this.edata = e;
    console.log(this.edata.target.id);
    let base64: any;
    let self = this;
    if (e.target.files) {
      var filesdata: any = e.target.files;

      for (let k = 0; k < e.target.files.length; k++) {
        if (this.edata.target.id == "adhar") {
          base64 = "";
          var reader = new FileReader();
          reader.readAsDataURL(filesdata[k]);
          reader.onload = function () {
            setTimeout(() => {
              // console.log(reader.result)
              base64 = reader.result;
              self.adharfilejson = {
                filename: filesdata[k].name,
                // "filesize":filesdata[k].size,
                filetype: filesdata[k].type,
                fileEncode: base64.split(",")[1],
              };
            }, 1000);
          };
        }
        if (this.edata.target.id == "pan") {
          base64 = "";
          var reader = new FileReader();
          reader.readAsDataURL(filesdata[k]);
          reader.onload = function () {
            setTimeout(() => {
              // console.log(reader.result)
              base64 = reader.result;
              self.panfilejson = {
                filename: filesdata[k].name,
                // "filesize":filesdata[k].size,
                filetype: filesdata[k].type,
                fileEncode: base64.split(",")[1],
              };
            }, 1000);
          };
        }
      }
    }
  }


}
