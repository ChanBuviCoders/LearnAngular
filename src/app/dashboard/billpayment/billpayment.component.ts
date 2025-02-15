import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { userAccount } from 'src/app/models/getsession.model';
import { SubjectService } from 'src/app/shared/services/subjectService';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-billpayment',
  templateUrl: './billpayment.component.html',
  styleUrls: ['./billpayment.component.css']
})
export class BillpaymentComponent implements OnInit {

  form: FormGroup;
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
  todayCredit: number = 0
  customerList: any = []
  getPaymentList() {
    const payLoad = {
      userAccountId: this.currentUserDetails.userAccountId,
      date: new Date(this.form.value.date),
      loanType: this.form.value.loanType
    }
    this.userService.getPaymentList(payLoad).subscribe({
      next: (value) => {
        if (value.status) {
          this.customerList = value.data.paymentList;
          this.todayCredit = value.data?.todayCredit ?? 0;
          let count = 0;
          this.customerList.forEach(data => { data.SerialNumber = ++count; })
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
  onPayableAmountChange(i, data) {
    this.customerList[i].amount = data.target.value;
  }
  onPaymentModeChange(i, data) {
    this.customerList[i].paymentMode = data.target.checked ? 'Online' : 'Offline';
    this.changePaymentStatus(this.customerList[i])
  }
}
