import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ConnectionsService {
  private http = inject(HttpClient);
  private readonly base = '/api/connections';

  getAll() { return this.http.get<any[]>(this.base); }
  create(dto: any) { return this.http.post<any>(this.base, dto); }
  update(id: number, dto: any) { return this.http.put<any>(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.http.delete<any>(`${this.base}/${id}`); }
}