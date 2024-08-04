import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { UserService } from "../shared/services/user.service";

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
  ) { }

  createAccount: boolean = true;
  currentDate: any
  ngOnInit(): void {
    this.date = new Date();
    this.currentDate = this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.formBuildFunction()

  }
  formBuildFunction() {
    this.createActForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dob: ["", Validators.required],
      gender: ["", Validators.required],
      fathersName: ["", Validators.required],
      marriedStatus: [null, Validators.required],
      annualIncome: ["", Validators.required],
      qualification: [null, Validators.required],
      panNumber: ["", Validators.required],
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
      userName: ["", Validators.required],
      password: ["", Validators.required],
      userGroupId: [null, Validators.required],
    });
    this.getUsergroupList();
  }
  userGroupList: any = null;
  getUsergroupList() {
    this.userservice.getUsergroupList().subscribe(response => {
      this.userGroupList = response.data;
    })
  }

  date: any;
  genderValue(data) { }
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
  createActFunction(createActForm) {

    createActForm.annualIncome = Number(createActForm.annualIncome);
    createActForm.mobileNumber = Number(createActForm.mobileNumber);
    createActForm.userGroupId = Number(createActForm.userGroupId);
    createActForm.altMobileNumber = Number(createActForm.altMobileNumber);
    createActForm.panImagePath = this.panfilejson.fileEncode;
    createActForm.adharImagePath = this.adharfilejson.fileEncode;
    createActForm.isActive = 0;
    this.userservice.createUser(createActForm).subscribe((response) => {
      if (response.status == true) {
        this.toaster.success(response.message);
        this.createActForm.reset();
        // this.createAccount = false;
        this.router.navigateByUrl("login");
        this.variable1 = "will";
        this.variable2 = "validate";
      } else {
        this.toaster.error(response.message);
      }
    });
  }
  saveLoginCred(value) {
    this.userservice.saveLoginCred(value).subscribe((data) => {
      if (data.status == true) {
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
