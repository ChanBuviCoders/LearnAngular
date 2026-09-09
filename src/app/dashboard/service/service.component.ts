import { state } from '@angular/animations/animation_player.d-Dv9iW4uh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { data } from 'jquery';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  standalone: false,
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  employeeList: any[] = [];
  employeeDataSource = new MatTableDataSource<any>([]);
  employeeDisplayedColumns: string[] = ['SerialNumber', 'empFirstName', 'empLastName', 'empEmail', 'empPhone', 'empGender', 'empDOB', 'empDepartment', 'empDesignation', 'empSalary', 'empExperience', 'empCountry', 'empState', 'empCity'];
  modalRef: any;
  constructor(
    private UserService: UserService,
    private modalService: BsModalService,
    private fb: FormBuilder,
  ) {
    this.employeeForm()
  }
  type: string = "ADD";


  addEmployeeForm: FormGroup;
  ngOnInit(): void {
    this.getCountryList()
    this.getStateList()
    this.getCityList()
    this.employeeDataSource.data = this.getEmployeeList() || []

  }
  applyEmployeeFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.employeeDataSource.filter = value.trim().toLowerCase();
  }
  openPopUp(modalName) {
    this.type = "Add"
    this.addEmployeeForm.reset()
    this.modalRef = this.modalService.show(modalName)
  }
  employeeForm() {
    this.addEmployeeForm = this.fb.group({
      empFirstName: [" ", Validators.required],
      empLastName: ["", Validators.required],
      empEmail: ["", Validators.required],
      empPhone: ["", Validators.required],
      empGender: ["", Validators.required],
      empDOB: ["", Validators.required],
      empDepartment: ["", Validators.required],
      empDesignation: ["", Validators.required],
      empSalary: ["", Validators.required],
      empExperience: ["", Validators.required],
      empCountry: ["", Validators.required],
      empState: ["", Validators.required],
      empCity: ["",]

    })
  }
  countryList: Country[] = [];
  getCountryList() {
    this.UserService.getCountrys().subscribe((data: APIData) => {
      this.countryList = data?.data;
      console.log('this.countryList ==> ', this.countryList);
    })
  }
  stateList: stateLists[] = [];
  getStateList() {
    this.UserService.getStates().subscribe((data: APIData1) => {
      this.stateList = data?.data.states;
      console.log('this.stateList ==> ', this.stateList)
    })
  }
  cityList: string[] = [];
  getCityList() {
    let request = {
      "country": "India",
      "state": "Tamil Nadu"
    }
    this.UserService.getCities(request).subscribe((data: APIData2) => {
      this.cityList = data?.data;
      console.log('this.cityList ==> ', this.cityList)
    })
  }

  addEmployeeFunction(formValue) {
    if (this.addEmployeeForm.valid) {
      this.employeeList.push({ ...formValue, id: new Date().getTime() });
      console.log('this.employeeList', this.employeeList);
      this.storeEmployee(this.employeeList);
      this.employeeDataSource.data = this.employeeList;


      // formValue.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      // formValue.userAccountId = this.currentUserDetails.userAccountId
      // formValue.endDate = this.datePipe.transform(new Date(new Date().setDate(startDate.getDate() + 100)), 'yyyy-MM-dd')
      // formValue.loanAmount = Number(formValue.loanAmount);
      // formValue.mobileNumber = Number(formValue.mobileNumber);
      // if (this.type == "Add") {
      //   this.userService.addEmployee(formValue).subscribe(res => {
      //     if (res.status == true) {
      //       this.toastr.success(res.message)
      //       this.modalRef.hide()
      //       this.getallCustomerList()
      //     }
      //     else {
      //       this.toastr.error(res.message)
      //     }
      //   })
      // }
      // else {
      //   formValue.customerId = this.editCustomerDetails.customerId
      //   this.userService.updateCustomer(formValue).subscribe(res => {
      //     if (res.status == true) {
      //       this.toastr.success(res.message)
      //       this.modalRef.hide()
      //       this.getallCustomerList()
      //     }
      //     else {
      //       this.toastr.error(res.message)
      //     }
      //   })
      // }
    }

  }

  storeEmployee(employeeList) {
    console.log('this.employeeList', this.employeeList);
    localStorage.setItem("employeeList", JSON.stringify(employeeList))
  }

  getEmployeeList(): any {
    let data = localStorage.getItem("employeeList") || "";
    return JSON.parse(data) || [];
  }

  applyCustomerFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.employeeDataSource.filter = value.trim().toLowerCase();
  }

  get controls() {
    return this.addEmployeeForm.controls;
  }
}

export class Country {
  name: String;
  iso2: String;
  long: Number;
  lat: Number;
}
export class APIData {
  error: Boolean;
  msg: String;
  data: Country[];
}
export class stateLists {
  name: String;
  state_code: String;
}
export class State {
  name: String;
  iso3: String;
  iso2: String;
  states: stateLists[];
}
export class APIData1 {
  error: Boolean;
  msg: String;
  data: State;
}

export class APIData2 {
  error: Boolean;
  msg: String;
  data: string[];
}

