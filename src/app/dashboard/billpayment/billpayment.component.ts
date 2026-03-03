import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { userAccount } from 'src/app/models/getsession.model';
import { SubjectService } from 'src/app/shared/services/subjectService';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  standalone: false,
  selector: 'app-billpayment',
  templateUrl: './billpayment.component.html',
  styleUrls: ['./billpayment.component.css']
})
export class BillpaymentComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  customerDataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['SerialNumber', 'firstName', 'lastName', 'loanAmount', 'totalPayable', 'totalPaid', 'balanceAmount', 'paymentMode', 'payableAmount', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: UserService, private subjectService: SubjectService, private fb: FormBuilder, private datepipe: DatePipe) {
    this.form = fb.group({
      date: [datepipe.transform(new Date(), 'YYYY-MM-dd'), [Validators.required]],
      loanType: ['Daily', [Validators.required]]
    })
  }
  get CurrentDate() {
    return this.datepipe.transform(new Date(), 'YYYY-MM-dd');
  }

  currentUserDetails: userAccount;
  ngOnInit(): void {
    this.subjectService.currentuserSubject.subscribe((data) => { this.currentUserDetails = data.data; });
    this.getPaymentList();
  }
  todayCredit: number = 0;
  customerList: any = [];

  ngAfterViewInit() {
    this.customerDataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.customerDataSource.filter = value.trim().toLowerCase();
  }

  getPaymentList() {
    const payLoad = {
      userAccountId: this.currentUserDetails.userAccountId,
      date: new Date(this.form.value.date),
      loanType: this.form.value.loanType
    };
    this.userService.getPaymentList(payLoad).subscribe({
      next: (value) => {
        if (value.status) {
          this.customerList = value.data.paymentList;
          this.customerDataSource.data = this.customerList;
          this.todayCredit = value.data?.todayCredit ?? 0;
          let count = 0;
          this.customerList.forEach((row: any) => { row.SerialNumber = ++count; });
        }
      }
    });
  }

  payAmount(value) {
    value.paymentStatus = !value.paymentStatus;
    this.changePaymentStatus(value)
  }
  changePaymentStatus(value) {
    this.userService.changePaymentStatus(value).subscribe({
      next: (value) => {
        if (value.status) {
          this.todayCredit = value.data.todayCredit;
        }
      },
      error: (err) => {

      },
    })

  }
  onPayableAmountChange(row: any, data: Event) {
    const el = data.target as HTMLInputElement;
    row.amount = el.value;
  }
  onPaymentModeChange(row: any, data: Event) {
    const el = data.target as HTMLInputElement;
    row.paymentMode = el.checked ? 'Online' : 'Offline';
    this.changePaymentStatus(row);
  }
}
