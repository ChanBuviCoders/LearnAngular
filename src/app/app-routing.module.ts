import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/authguard.service';
import { NoAuthGuard } from './services/no-auth-guard.service';

const routes: 
Routes = [ 
          { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule),canActivate:[NoAuthGuard] }, 
          { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),canActivate:[AuthGuard] },
          { path: 'create-account', loadChildren: () => import('./create-account/create-account.module').then(m => m.CreateAccountModule) },
          { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) }
         ];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
