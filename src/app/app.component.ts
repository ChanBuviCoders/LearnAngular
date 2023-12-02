import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UserService } from './services/user.service';
import {Location} from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'learning';
  previousUrl:String
  currentUrl:string
  constructor(private router:Router,private userService:UserService,private location:Location){
    // -------------------back restriction --------------------->
    window.onpopstate = function (event:any) {history.go(2);};
    // this.location.onUrlChange(x => this.urlChange(x));
  }
 
ngOnInit():void{
   this.userService.refreshFunction();
}

onRightClick(e: MouseEvent){
  e.preventDefault();
} 
currentLocation:String
urlChange(x:any) {
  this.currentLocation=x
  this.preventDefaultUrlFunction()
}
preventDefaultUrlFunction(){
  this.currentUrl = this.router.url;
  this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      if((event.url.search("/login")!= -1 || event.url=='/') &&  localStorage.getItem("jwtToken")!='')
      this. location.replaceState(this.currentUrl)
    };
  });
  }
}