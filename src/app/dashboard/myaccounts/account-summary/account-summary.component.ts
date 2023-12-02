import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent implements OnInit {

  coloumn1:any
  coloumn2:any
  actDetails:boolean=true
  accountSummary:boolean=false
  constructor(private userService:UserService) { }
  readonly  now = new Date();

  ngOnInit(): void {
  }
  
  actSummary()
  {
    this.accountSummary=!this.accountSummary
    if(this.accountSummary==false)
    {
      this.actDetails=false
    }
    // this.userService.refreshFunction()
  }
  accountDetails()
  {
    this.actDetails=!this.actDetails
    // this.userService.refreshFunction()
  }
  createAccount:boolean=false

}
