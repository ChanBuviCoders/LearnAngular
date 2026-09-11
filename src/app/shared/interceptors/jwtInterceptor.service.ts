import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtService } from '../services/jwt.service';
import { SubjectService } from '../services/subjectService';

const PUBLIC_API_PATHS = [
  '/api/authSession',
  '/api/getCapcha',
  '/api/createUser',
  '/api/getUsergroupList'
];

@Injectable()
export class JwtAuthInterceptor implements HttpInterceptor {
  private readonly jwtService = inject(JwtService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith(environment.api_url)) {
      return next.handle(req);
    }

    const token = this.jwtService.getToken();
    const isPublic = PUBLIC_API_PATHS.some(path => req.url.includes(path));

    let headers = req.headers;
    if (token && !isPublic && !headers.has('Authorization')) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Let the browser set multipart boundary automatically
    if (req.body instanceof FormData && headers.has('Content-Type')) {
      headers = headers.delete('Content-Type');
    }

    return next.handle(req.clone({ headers }));
  }
}

@Injectable()
export class ApiResponseInterceptor implements HttpInterceptor {
  private readonly jwtService = inject(JwtService);
  private readonly subjectService = inject(SubjectService);
  private readonly router = inject(Router);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.body && typeof event.body === 'object') {
          return event.clone({ body: normalizeApiBody(event.body) });
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && req.url.startsWith(environment.api_url)) {
          const isPublic = PUBLIC_API_PATHS.some(path => req.url.includes(path));
          if (!isPublic) {
            this.subjectService.setIsAuthenticated(false);
            this.jwtService.destroyToken();
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }
}

/** Normalize PascalCase Status/Message from older payloads to camelCase. */
function normalizeApiBody(body: any): any {
  if (Array.isArray(body) || body === null || typeof body !== 'object') {
    return body;
  }

  const normalized: any = { ...body };

  if (normalized.status === undefined && normalized.Status !== undefined) {
    normalized.status = normalized.Status;
  }
  if (normalized.message === undefined && normalized.Message !== undefined) {
    normalized.message = normalized.Message;
  }

  delete normalized.Status;
  delete normalized.Message;

  return normalized;
}
