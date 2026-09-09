import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { responsiveService } from '../shared/responsive.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  standalone: false,
  selector: 'app-myaccounts',
  templateUrl: './myaccounts.component.html',
  styleUrls: ['./myaccounts.component.css']
})
export class MyaccountsComponent {

  coloumn1:any
  coloumn2:any
  actDetails:boolean=true
  accountSummary:boolean=false
  constructor(private responsiveService:responsiveService) { }
  readonly  now = new Date();

  ngOnInit(): void {
  }
  
  gedgetType:number=0
  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   console.log("hostlistener",event);
  //   this.gedgetType=this.responsiveService.getGadgets()
  // }
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
