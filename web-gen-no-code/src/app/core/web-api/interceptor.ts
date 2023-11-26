// my-interceptor.ts

import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { STORAGED_KEY } from '../config/storage-key/localstorage.const';
import { Router } from '@angular/router';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {
  private route = inject(Router);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const secretKey = sessionStorage.getItem(STORAGED_KEY.modules.manageApi.connection.secretKey);
    const token = localStorage.getItem(STORAGED_KEY.global.auth.token);
    const modifiedRequest = request.clone({
      setHeaders: {
        'X-Secretkey': secretKey ?? '',
        'Authenticate': token ?? '',
      },
    });

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status == HttpStatusCode.Unauthorized) {
          this.route.navigate(['login']);
        }
        return throwError(() => error);
      })
    );
  }
}
