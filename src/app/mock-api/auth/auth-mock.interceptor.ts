import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthMockStore } from './auth-mock.store';
import { LoginRequest, LoginResponse,RegisterRequest,RegisterResponse,User } from './auth.model';

import { throwError } from 'rxjs';

const LOGIN_PATH = '/api/login';
const REGISTER_PATH = '/api/register';
const SIMULATED_DELAY_MS = 300;

function ok(body: unknown, status = 200): Observable<HttpEvent<unknown>> {
    return of(new HttpResponse({ status, body })).pipe(delay(SIMULATED_DELAY_MS));
}

function err(status: number, message: string): Observable<HttpEvent<unknown>> {
    // return of(new HttpResponse({ status, body: { error: message } })).pipe(delay(SIMULATED_DELAY_MS));
    return throwError(() => ({
        status,
        error: { error: message }
    })).pipe(delay(SIMULATED_DELAY_MS));
}
// }


@Injectable()
export class AuthMockInterceptor implements HttpInterceptor {
    private store = new AuthMockStore();

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (req.url.includes(LOGIN_PATH) && req.method === 'POST') {
             return this.login(req);
        }
        if (req.url.includes(REGISTER_PATH) && req.method === 'POST') {
            return this.register(req);
        }

        return next.handle(req);

    }

    // ── Handlers ────────────────────────────────────────────────────────────

    private login(req: HttpRequest<LoginRequest>): Observable<HttpEvent<unknown>> {
        // console.log(this.store.getAll());
        const body =  req.body ;
        // console.log("aaaa:",body?.email)
        // console.log("paaaasssLogin:",body?.password)
        if (!body?.email || !body?.password) {
            return err(400, 'email and password are required');
        }
        const user = this.store.findUser(body.email);
        // console.log("aaaa:",user?.email)
        if(!user){
            return err(404,'The requested email does not exist')
        }
        // console.log("userPass:",user?.password)
        if(user.password !== body.password){
            // console.log("jok")
            return err(401,'Wrong password');
        }

        // console.log("aaaa:",user.email)
        const rsponse: LoginResponse ={
            email:user.email,
            token:this.generateToken(user.email)
        }
        return ok(rsponse);
    }
    private register(req: HttpRequest<RegisterRequest>): Observable<HttpEvent<unknown>> {
        const body =  req.body ;
        if (!body?.email || !body?.password || !body.name) {
            return err(400, 'Email,password and name are required');
        }
        if(this.store.isEmailTaken(body.email)){
            return err(409,'Email already exist')
        }
        if(body.password.length < 8){
            return err(400,'Password must be at least 8 characters');
        }

        const user = this.store.create(body);

        const response: RegisterResponse ={
            id: user.id,
            email:user.email,
            name: user.name,
        }
        return ok(response,201);
    }
    private generateToken(email: string): string{
        const str = email+'123';
        return btoa(str);
    }

}
