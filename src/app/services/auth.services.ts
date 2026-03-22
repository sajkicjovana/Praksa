import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../mock-api/auth/auth.model';
import { Register } from '../components/register/register';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private readonly loginBase = '/api/login';
    private readonly registerBase='/api/register'

    login(dto: LoginRequest) {return this.http.post<LoginResponse>(this.loginBase, dto);}
    register(dto: RegisterRequest){return this.http.post<RegisterResponse>(this.registerBase,dto);}
}