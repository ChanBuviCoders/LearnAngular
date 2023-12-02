import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor( private router:Router,private userService:UserService) { }

  currentUserDetails:any={}
  ngOnInit(): void {
    this.userService.currentuserSubject.subscribe(data=>{
      this.currentUserDetails=data
     })
  }


  logout()
  {
    this.router.navigate(['/login'])
    this.userService.clearLocalStorage()
  }     


 
}


