import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { JwtService } from './shared/services/jwt.service';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // @HostListener('window:beforeunload', ['$event'])
  // browserCloseFunction(event) {
  //   console.log('---enne event----',event);
  //   event.preventDefault();
  //   event.returnValue = 'Your data will be lost!';
  //   return false;
  // }

  title = 'learning';
  previousUrl: String
  currentUrl: string
  constructor(private router: Router, private userService: UserService, private location: Location, private jwtService: JwtService) {
    // -------------------back restriction --------------------->
    window.onpopstate = function (event: any) { history.go(2); };
    // this.location.onUrlChange(x => this.urlChange(x));
  }

  ngOnInit(): void {
    this.userService.refreshFunction();
  }

  onRightClick(e: MouseEvent) {
    e.preventDefault();
  }
  currentLocation: String
  urlChange(x: any) {
    this.currentLocation = x
    this.preventDefaultUrlFunction()
  }
  preventDefaultUrlFunction() {
    this.currentUrl = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if ((event.url.search("/login") != -1 || event.url == '/') && sessionStorage.getItem("jwtToken") != '')
          this.location.replaceState(this.currentUrl)
      };
    });
  }

}