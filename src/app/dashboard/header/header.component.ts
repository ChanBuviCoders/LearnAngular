import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { userAccount } from 'src/app/models/getsession.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  currentUserDetails: userAccount;
  ngOnInit(): void {
    this.userService.currentuserSubject.subscribe(data => {
      this.currentUserDetails = data.data
    })
  }


  logout() {
    let payload = { "userAccountId": this.currentUserDetails.userAccountId };
    this.userService.logout(payload).subscribe(data => {
      if (data.status) {
        this.router.navigate(['/login'])
        this.userService.clearLocalStorage()
      }
    })
  }



}


