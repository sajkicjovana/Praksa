import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country, Operator, Routing, CreateRoutingDto, UpdateRoutingDto } from '../mock-api/routing/routing.model';

@Injectable({ providedIn: 'root' })
export class RoutingService {
    private http = inject(HttpClient);

    // Countries
    getCountries() {
        return this.http.get<Country[]>('/api/countries');
    }

    getCountryById(id: number) {
        return this.http.get<Country>(`/api/countries/${id}`);
    }

    // Operators
    getAllOperators() {
        return this.http.get<Operator[]>('/api/operators');
    }

    getOperatorsByCountry(countryId: number) {
        return this.http.get<Operator[]>('/api/operators', { params: { countryId } });
    }

    getOperatorById(id: number) {
        return this.http.get<Operator>(`/api/operators/${id}`);
    }

    // Routing CRUD
    getAllRouting() {
        return this.http.get<Routing[]>('/api/routing');
    }

    getRoutingById(id: number) {
        return this.http.get<Routing>(`/api/routing/${id}`);
    }

    createRouting(dto: CreateRoutingDto) {
        return this.http.post<Routing>('/api/routing', dto);
    }

    updateRouting(id: number, dto: CreateRoutingDto) {
        return this.http.put<Routing>(`/api/routing/${id}`, dto);
    }

    patchRouting(id: number, dto: UpdateRoutingDto) {
        return this.http.patch<Routing>(`/api/routing/${id}`, dto);
    }

    deleteRouting(id: number) {
        return this.http.delete<Routing>(`/api/routing/${id}`);
    }
}