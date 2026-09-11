import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { jwtInterceptorsRequest, jwtInterceptorsResponce } from './shared/interceptors/jwtInterceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafeUrlPipe } from './pipes/SafeUrlPipe';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    ToastNoAnimationModule.forRoot(),
    TabsModule,
    ModalModule,
    TooltipModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: jwtInterceptorsRequest, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: jwtInterceptorsResponce, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
