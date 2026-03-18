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
import { ConnectionsMockStore } from './connections-mock.store';
import { CreateConnectionDto, UpdateConnectionDto } from './connection.model';

const BASE_PATH = '/api/connections';
const SIMULATED_DELAY_MS = 300;

function ok(body: unknown, status = 200): Observable<HttpEvent<unknown>> {
    return of(new HttpResponse({ status, body })).pipe(delay(SIMULATED_DELAY_MS));
}

function err(status: number, message: string): Observable<HttpEvent<unknown>> {
    return of(new HttpResponse({ status, body: { error: message } })).pipe(delay(SIMULATED_DELAY_MS));
}

function isValidUrl(value: string): boolean {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

@Injectable()
export class ConnectionsMockInterceptor implements HttpInterceptor {
    private store = new ConnectionsMockStore();

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (!req.url.includes(BASE_PATH)) {
            return next.handle(req);
        }

        const idMatch = req.url.match(/\/api\/connections\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : null;

        switch (req.method) {
            case 'GET':    return id !== null ? this.getOne(id) : this.getAll();
            case 'POST':   return this.post(req as HttpRequest<CreateConnectionDto>);
            case 'PUT':    return id !== null ? this.put(id, req as HttpRequest<CreateConnectionDto>) : err(405, 'PUT requires an id');
            case 'PATCH':  return id !== null ? this.patch(id, req as HttpRequest<UpdateConnectionDto>) : err(405, 'PATCH requires an id');
            case 'DELETE': return id !== null ? this.delete(id) : err(405, 'DELETE requires an id');
            default:       return next.handle(req);
        }
    }

    // ── Handlers ────────────────────────────────────────────────────────────

    private getAll(): Observable<HttpEvent<unknown>> {
        return ok(this.store.getAll());
    }

    private getOne(id: number): Observable<HttpEvent<unknown>> {
        const record = this.store.getById(id);
        return record ? ok(record) : err(404, `Connection with id ${id} not found`);
    }

    private post(req: HttpRequest<CreateConnectionDto>): Observable<HttpEvent<unknown>> {
        const body = req.body ?? ({} as CreateConnectionDto);
        const validationError = this.validate(body, null);
        if (validationError) return err(validationError.status, validationError.message);
        return ok(this.store.create(body), 201);
    }

    private put(id: number, req: HttpRequest<CreateConnectionDto>): Observable<HttpEvent<unknown>> {
        if (!this.store.getById(id)) return err(404, `Connection with id ${id} not found`);
        const body = req.body ?? ({} as CreateConnectionDto);
        const validationError = this.validate(body, id);
        if (validationError) return err(validationError.status, validationError.message);
        return ok(this.store.update(id, body));
    }

    private patch(id: number, req: HttpRequest<UpdateConnectionDto>): Observable<HttpEvent<unknown>> {
        const existing = this.store.getById(id);
        if (!existing) return err(404, `Connection with id ${id} not found`);
        const body = req.body ?? ({} as UpdateConnectionDto);
        // Validate the merged result so partial updates don't break invariants
        const merged = { ...existing, ...body };
        const validationError = this.validate(merged, id);
        if (validationError) return err(validationError.status, validationError.message);
        return ok(this.store.patch(id, body));
    }

    private delete(id: number): Observable<HttpEvent<unknown>> {
        const deleted = this.store.remove(id);
        return deleted ? ok(deleted) : err(404, `Connection with id ${id} not found`);
    }

    // ── Validation ───────────────────────────────────────────────────────────

    private validate(
        body: Partial<CreateConnectionDto>,
        excludeId: number | null
    ): { status: number; message: string } | null {

        if (body.type !== undefined && body.type !== 'http' && body.type !== 'smpp') {
            return { status: 400, message: 'type must be "http" or "smpp"' };
        }

        if (body.smsThroughput !== undefined && body.smsThroughput > 100_000) {
            return { status: 400, message: 'smsThroughput must not exceed 100,000' };
        }

        if (body.type === 'http') {
            if (!body.url || body.url.trim() === '') {
                return { status: 400, message: 'url is required when type is "http"' };
            }
            if (!isValidUrl(body.url)) {
                return { status: 400, message: 'url must be a valid URL (e.g. https://gateway.example.com/sms)' };
            }
        }

        if (body.userName && this.store.isUserNameTaken(body.userName, excludeId ?? undefined)) {
            return { status: 409, message: `userName "${body.userName}" is already taken` };
        }

        return null;
    }
}
