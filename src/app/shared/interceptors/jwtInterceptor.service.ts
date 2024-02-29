import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { JwtService } from "../services/jwt.service";

@Injectable({ providedIn: "root" })
export class jwtInterceptorsRequest implements HttpInterceptor {

    constructor(private jwtService: JwtService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwtToken = this.jwtService.getToken();
        //  if()
        //  {
        //     req=req.clone({
        //         headers: req.headers.set('Authorization', jwtToken)
        //      })
        //  }
        //  else{
        //     req=req.clone({
        //         headers: req.headers.set('Authorization', jwtToken)
        //      })
        //  }
        return next.handle(req);
    }

}

@Injectable({ providedIn: "root" })
export class jwtInterceptorsResponce implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(tap({
            next:(event)=>{
                console.log('----tab next event----',event);
            },
            error:(error)=>{
                console.log('----tab next error----',error);
            }
        }))
       
    }

}