import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { COUNTRIES, OPERATORS, RoutingMockStore } from './routing-mock.store';
import { CreateRoutingDto, UpdateRoutingDto } from './routing.model';

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

@Injectable()
export class RoutingMockInterceptor implements HttpInterceptor {
    private store = new RoutingMockStore();

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const url = req.url;

        // ── /api/countries ────────────────────────────────────────────────────
        if (url.includes('/api/countries')) {
            if (req.method !== 'GET') return err(405, 'Only GET is supported on /api/countries');

            const idMatch = url.match(/\/api\/countries\/(\d+)/);
            if (idMatch) {
                const id = parseInt(idMatch[1], 10);
                const country = COUNTRIES.find(c => c.id === id);
                return country ? ok(country) : err(404, `Country with id ${id} not found`);
            }
            return ok(COUNTRIES);
        }

        // ── /api/operators ────────────────────────────────────────────────────
        if (url.includes('/api/operators')) {
            if (req.method !== 'GET') return err(405, 'Only GET is supported on /api/operators');

            const idMatch = url.match(/\/api\/operators\/(\d+)/);
            if (idMatch) {
                const id = parseInt(idMatch[1], 10);
                const operator = OPERATORS.find(o => o.id === id);
                return operator ? ok(operator) : err(404, `Operator with id ${id} not found`);
            }

            // Support ?countryId= filter
            const countryIdParam = req.params.get('countryId');
            if (countryIdParam !== null) {
                const countryId = parseInt(countryIdParam, 10);
                if (isNaN(countryId)) return err(400, 'countryId must be a number');
                if (!COUNTRIES.find(c => c.id === countryId)) {
                    return err(404, `Country with id ${countryId} not found`);
                }
                return ok(OPERATORS.filter(o => o.countryId === countryId));
            }

            return ok(OPERATORS);
        }

        // ── /api/routing ──────────────────────────────────────────────────────
        if (url.includes('/api/routing')) {
            const idMatch = url.match(/\/api\/routing\/(\d+)/);
            const id = idMatch ? parseInt(idMatch[1], 10) : null;

            switch (req.method) {
                case 'GET':    return id !== null ? this.getOne(id) : this.getAll();
                case 'POST':   return this.post(req as HttpRequest<CreateRoutingDto>);
                case 'PUT':    return id !== null ? this.put(id, req as HttpRequest<CreateRoutingDto>) : err(405, 'PUT requires an id');
                case 'PATCH':  return id !== null ? this.patch(id, req as HttpRequest<UpdateRoutingDto>) : err(405, 'PATCH requires an id');
                case 'DELETE': return id !== null ? this.delete(id) : err(405, 'DELETE requires an id');
                default:       return next.handle(req);
            }
        }

        return next.handle(req);
    }

    // ── Routing Handlers ─────────────────────────────────────────────────────

    private getAll(): Observable<HttpEvent<unknown>> {
        return ok(this.store.getAll());
    }

    private getOne(id: number): Observable<HttpEvent<unknown>> {
        const record = this.store.getById(id);
        return record ? ok(record) : err(404, `Routing with id ${id} not found`);
    }

    private post(req: HttpRequest<CreateRoutingDto>): Observable<HttpEvent<unknown>> {
        const body = req.body ?? ({} as CreateRoutingDto);
        const validationError = this.validate(body, null);
        if (validationError) return err(validationError.status, validationError.message);
        return ok(this.store.create(body), 201);
    }

    private put(id: number, req: HttpRequest<CreateRoutingDto>): Observable<HttpEvent<unknown>> {
        if (!this.store.getById(id)) return err(404, `Routing with id ${id} not found`);
        const body = req.body ?? ({} as CreateRoutingDto);
        const validationError = this.validate(body, id);
        if (validationError) return err(validationError.status, validationError.message);
        return ok(this.store.update(id, body));
    }

    private patch(id: number, req: HttpRequest<UpdateRoutingDto>): Observable<HttpEvent<unknown>> {
        const existing = this.store.getById(id);
        if (!existing) return err(404, `Routing with id ${id} not found`);
        const body = req.body ?? ({} as UpdateRoutingDto);
        // Validate against merged result so partial updates don't break invariants
        const merged = { ...existing, ...body };
        const validationError = this.validate(merged, id);
        if (validationError) return err(validationError.status, validationError.message);
        return ok(this.store.patch(id, body));
    }

    private delete(id: number): Observable<HttpEvent<unknown>> {
        const deleted = this.store.remove(id);
        return deleted ? ok(deleted) : err(404, `Routing with id ${id} not found`);
    }

    // ── Validation ───────────────────────────────────────────────────────────

    private validate(
        body: Partial<CreateRoutingDto>,
        _excludeId: number | null
    ): { status: number; message: string } | null {

        if (body.countryId !== undefined) {
            if (!COUNTRIES.find(c => c.id === body.countryId)) {
                return { status: 400, message: `countryId ${body.countryId} does not exist` };
            }
        }

        if (body.operatorId !== undefined) {
            const operator = OPERATORS.find(o => o.id === body.operatorId);
            if (!operator) {
                return { status: 400, message: `operatorId ${body.operatorId} does not exist` };
            }
            if (body.countryId !== undefined && operator.countryId !== body.countryId) {
                return {
                    status: 400,
                    message: `operatorId ${body.operatorId} does not belong to countryId ${body.countryId}`
                };
            }
        }

        if (body.connectionId !== undefined && (!Number.isInteger(body.connectionId) || body.connectionId < 1)) {
            return { status: 400, message: 'connectionId must be a positive integer' };
        }

        if (body.price !== undefined && (isNaN(body.price) || body.price < 0)) {
            return { status: 400, message: 'price must be a non-negative number' };
        }

        if (body.currency !== undefined && body.currency.trim() === '') {
            return { status: 400, message: 'currency must not be empty' };
        }

        return null;
    }
}
