import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { userAccount } from 'src/app/models/getsession.model';
import { SubjectService } from 'src/app/shared/services/subjectService';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  standalone: false,
  selector: 'app-fundtransfer',
  templateUrl: './fundtransfer.component.html',
  styleUrls: ['./fundtransfer.component.css']
})
export class FundtransferComponent implements OnInit, AfterViewInit {

  modalRef: BsModalRef;
  testForm: FormGroup;
  addCustomerForm: FormGroup;
  customerDataSource = new MatTableDataSource<any>([]);
  paymentDataSource = new MatTableDataSource<any>([]);
  customerDisplayedColumns: string[] = ['SerialNumber', 'firstName', 'lastName', 'loanAmount', 'loanType', 'startDate', 'endDate', 'action'];
  paymentDisplayedColumns: string[] = ['SerialNumber', 'paymentId', 'date', 'paymentMode', 'amount'];
  @ViewChild('customerPaginator') customerPaginator: MatPaginator;
  @ViewChild('paymentPaginator') paymentPaginator: MatPaginator;

  constructor(private fb: FormBuilder, private subjectService: SubjectService, private modalService: BsModalService, private datePipe: DatePipe, private userService: UserService, private toastr: ToastrService) {
    this.testForm = this.fb.group({
      date: ["", Validators.required],
      time: this.fb.group({
        HH: ["", Validators.required],
        min: ["", Validators.required],
        sec: ["", Validators.required],
      }),
    });

    this.addCustomerForm = this.fb.group({
      firstName: ['', Validators.required,],
      lastName: ['', Validators.required],
      loanAmount: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.minLength(10)]],
      loanType: [null, Validators.required],
      gender: [null, Validators.required]
    })
  }
  currentUserDetails: userAccount;
  loanType:string="All"
  ngOnInit(): void {
    this.subjectService.currentuserSubject.subscribe((data) => { this.currentUserDetails = data.data; });
    this.getallCustomerList()
  }
  customerList: any = [];
  get controls() {
    return this.addCustomerForm.controls;
  }

  ngAfterViewInit() {
    this.customerDataSource.paginator = this.customerPaginator;
    this.paymentDataSource.paginator = this.paymentPaginator;
  }

  applyCustomerFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.customerDataSource.filter = value.trim().toLowerCase();
  }

  applyPaymentFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.paymentDataSource.filter = value.trim().toLowerCase();
  }

  contentReady(_event: unknown) {}
  type: string = "Add"
  openPopUp(modalName) {
    this.type = "Add"
    this.addCustomerForm.reset()
    this.modalRef = this.modalService.show(modalName)
  }
  addCustomerFunction(formValue) {
    if (this.addCustomerForm.valid) {
      let startDate = new Date()
      formValue.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      formValue.userAccountId = this.currentUserDetails.userAccountId
      formValue.endDate = this.datePipe.transform(new Date(new Date().setDate(startDate.getDate() + 100)), 'yyyy-MM-dd')
      formValue.loanAmount = Number(formValue.loanAmount);
      formValue.mobileNumber = Number(formValue.mobileNumber);
      if (this.type == "Add") {
        this.userService.addCustomer(formValue).subscribe(res => {
          if (res.status == true) {
            this.toastr.success(res.message)
            this.modalRef.hide()
            this.getallCustomerList()
          }
          else {
            this.toastr.error(res.message)
          }
        })
      }
      else {
        formValue.customerId = this.editCustomerDetails.customerId
        this.userService.updateCustomer(formValue).subscribe(res => {
          if (res.status == true) {
            this.toastr.success(res.message)
            this.modalRef.hide()
            this.getallCustomerList()
          }
          else {
            this.toastr.error(res.message)
          }
        })
      }
    }

  }
  editCustomerDetails: any = {}
  editFunction(values, popUpName) {
    this.addCustomerForm.reset()
    this.type = "Update"
    this.editCustomerDetails = values
    this.addCustomerForm.patchValue({
      firstName: values.firstName,
      lastName: values.lastName,
      loanAmount: values.loanAmount,
      mobileNumber: values.mobileNumber,
      loanType: values.loanType,
      gender: values.gender
    });
    this.modalRef = this.modalService.show(popUpName)
  }

  getallCustomerList() {
    const payLoad = { userAccountId: this.currentUserDetails.userAccountId, loanType: this.loanType };
    this.userService.getAllCustomerList(payLoad).subscribe(data => {
      this.customerList = data.data;
      let count = 0;
      this.customerList.forEach((row: any) => {
        row.SerialNumber = ++count;
      });
      this.customerDataSource.data = this.customerList;
    });
  }
  @ViewChild('deleteConfirmationAlert') deleteTemp: TemplateRef<any>;
  selectedCustomer: Customer;
  openDeleteAlert(customer: Customer) {
    this.selectedCustomer = customer
    this.modalRef = this.modalService.show(this.deleteTemp);
  }
  deleteCustomer(values: Customer) {
    let payLoad = { customerId: values.customerId }
    this.userService.deleteCustomer(payLoad).subscribe(res => {
      if (res.status == true) {
        this.toastr.success(res.message)
        this.getallCustomerList();
      }
      else {
        this.toastr.error(res.message)
      }
    })
  }
  @ViewChild('viewPaymentInfo') viewPaymentInfo: TemplateRef<any>;
  paymentList: any = []
  viewDetails(customer: Customer) {
    this.userService.getPaymentListByCustomerId(customer.customerId).subscribe(response => {
      if (response.status) {
        this.modalRef = this.modalService.show(this.viewPaymentInfo, { class: "col-8" });
        this.paymentList = response.data;
        let count = 0;
        this.paymentList.forEach((row: any) => { row.SerialNumber = ++count; });
        this.paymentDataSource.data = this.paymentList;
      }
    });
  }
  sendSms(data) {
    this.userService.sendSmsToMobileNumber().subscribe(data => { console.log('--------status--------', data); })
  }

  sendMail() {
    this.userService.sendMail().subscribe(data => { console.log('--------status--------', data); })
  }

}
export interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  gender: string;
  loanAmount: number;
  loanType: string;
  mobileNumber: number;
  startDate: string;
  endDate: string;
  userAccountId: number;
  payments: string;
}