import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.services';
const SIMULATED_DELAY_MS = 300;
@Injectable()
export class loadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService){}
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  this.loadingService.increment();
  return next.handle(req).pipe(finalize(() => this.loadingService.decrement()));
  }
}
