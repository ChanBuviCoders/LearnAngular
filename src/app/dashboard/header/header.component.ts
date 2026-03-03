import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { userAccount } from 'src/app/models/getsession.model';
import { SubjectService } from 'src/app/shared/services/subjectService';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private subjectService: SubjectService, private userService: UserService) { }

  currentUserDetails: userAccount;
  ngOnInit(): void {
    this.subjectService.currentuserSubject.subscribe(data => {
      this.currentUserDetails = data.data
    })
    this.getNavigationMenu()
  }

  navigationMenuDetails: any = []
  getNavigationMenu() {

    this.userService.getNavigationMenu(this.currentUserDetails.userGroupId).subscribe(response => {
      if (response.status) {
        this.navigationMenuDetails = response.data;
      }
    })
  }
  getRouter(menu, type) {
    switch (menu.menuId) {
      case 1:
        if (type == 1)
          return "fa fa-bar-chart "
        else
          return "/dashboard/myAct";
      case 2:
        if (type == 1)
          return "fa fa-users text-warning"
        else
          return "/dashboard/fundTrs";
      case 3:
        if (type == 1)
          return "fa-dark fa-file text-light"
        else
          return "/dashboard/e-deposit";
      case 4:
        if (type == 1)
          return "fa-dark fa-credit-card text-light"
        else
          return "/dashboard/billpayment";
      case 5:
        if (type == 1)
          return "fa-light fa-charging text-info"
        else
          return "/dashboard/topup-recharge";
      case 6:
        if (type == 1)
          return "fa fa-credit-card text-success"
        else
          return "/dashboard/manageCards";
      case 7:
        if (type == 1)
          return "fa fa-wrench text-light"
        else
          return "/dashboard/services";
      case 8:
        if (type == 1)
          return "fa-solid fa-code-pull-request text-dark"
        else
          return "/dashboard/requests";
      default:
        return null;
    }

  }

  logout() {
    const payload = { "userAccountId": this.currentUserDetails.userAccountId };
    this.userService.logout(payload).subscribe(data => {
      if (data.status) {
        this.router.navigate(['/login'])
      }
    })
    this.userService.clearLocalStorage()
  }



}


