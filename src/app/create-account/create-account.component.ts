import { DatePipe } from "@angular/common";
import { Component, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CanComponentDeactivate } from "../shared/services/canDeactivate/canDeactivateInterface";
import { UserService } from "../shared/services/user.service";

@Component({
  standalone: false,
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements CanComponentDeactivate {

  createActForm: FormGroup;
  loginCredForm: FormGroup;
  constructor(
    private userservice: UserService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    private datepipe: DatePipe
  ) {

  }
  hasUnsavedChanges = false;
  @HostListener('window:beforeunload', ['$event'])
  validateForm(event): boolean {
    if (this.createActForm.dirty) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }
  canDeactivate(): boolean {
    if (this.createActForm.dirty) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }

  createAccount: boolean = true;
  currentDate: any
  ngOnInit(): void {
    this.date = new Date();
    this.currentDate = this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.formBuildFunction()

  }
  formBuildFunction() {
    this.createActForm = this.fb.group(
      {
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
      }
    );
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
    // createActForm.panImagePath = this.panfilejson.fileEncode;
    // createActForm.adharImagePath = this.adharfilejson.fileEncode;
    createActForm.isActive = 0;

    const formData = new FormData();

    // 1. Append primary file matching @RequestPart("primaryFile")
    formData.append('panFile', this.panfilejson, this.panfilejson?.name);

    // 2. Append secondary file matching @RequestPart("secondaryFile")
    formData.append('adharFile', this.adharfilejson, this.adharfilejson?.name);

    // 3. Append JSON payload matching @RequestPart("data")
    const jsonBlob = new Blob([JSON.stringify(createActForm)], {
      type: 'application/json'
    });
    formData.append('data', jsonBlob);
    
    this.userservice.createUser(formData).subscribe((response) => {
      if (response.status == true) {
        this.toaster.success(response.message);
        this.createActForm.reset();
        this.router.navigateByUrl("login");
        this.variable1 = "will";
        this.variable2 = "validate";
      } else {
        this.toaster.error(response.message);
      }
    });
  }
  saveLoginCred(_value) {
    // Credentials are already persisted by /api/createUser — no separate backend endpoint.
    this.toaster.info('Please sign in with the username and password you created.');
    this.router.navigateByUrl('login');
  }

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
          this.adharfilejson = filesdata[0];
          // base64 = "";
          // var reader = new FileReader();
          // reader.readAsDataURL(filesdata[k]);
          // reader.onload = function () {
          //   setTimeout(() => {
          //     base64 = reader.result;
          //     self.adharfilejson = {
          //       filename: filesdata[k].name,
          //       filetype: filesdata[k].type,
          //       fileEncode: base64.split(",")[1],
          //     };
          //   }, 1000);
          // };
        }
        if (this.edata.target.id == "pan") {
          this.panfilejson = filesdata[0];
          // base64 = "";
          // var reader = new FileReader();
          // reader.readAsDataURL(filesdata[k]);
          // reader.onload = function () {
          //   setTimeout(() => {
          //     base64 = reader.result;
          //     self.panfilejson = {
          //       filename: filesdata[k].name,
          //       filetype: filesdata[k].type,
          //       fileEncode: base64.split(",")[1],
          //     };
          //   }, 1000);
          // };
        }
      }
    }
  }


}
