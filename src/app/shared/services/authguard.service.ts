import { Injectable,AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
// import { User } from './user/user.module';
import { UserService } from './user.service';
import { take } from 'rxjs/operators';
//  class Permissions {
//   canGoToRoute(user: User, id: string): boolean {
//     return true;
//   }
// }

@Injectable({providedIn:"root"})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private userService: UserService
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.userService.isAuthenticated.pipe(take(1));
  }
  
}
