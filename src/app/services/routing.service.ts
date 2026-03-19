import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RoutingService {
    private http = inject(HttpClient);
    private readonly base = '/api/routing';
    private readonly countryBase='/api/countries';
    private readonly operatrsBase='/api/operators';
    getAll() { return this.http.get<any[]>(this.base); }
    create(dto: any) { return this.http.post<any>(this.base, dto); }
    update(id: number, dto: any) { return this.http.put<any>(`${this.base}/${id}`, dto); }
    delete(id: number) { return this.http.delete<any>(`${this.base}/${id}`); }
    getCountries(){return this.http.get<any[]>(this.countryBase); }
    getOperators(){return this.http.get<any[]>(this.operatrsBase); }
}
