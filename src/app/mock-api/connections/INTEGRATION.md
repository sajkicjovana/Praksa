# Connections Mock API — Integration Guide

A drop-in Angular HTTP interceptor that simulates a full REST CRUD API for **Connections**.
Data is persisted in `localStorage` so records survive page reloads.
Three seed records are created automatically on first load.

---

## 1. Copy the Files

Copy the three files into your project:

```
src/mock-api/connections/
  connection.model.ts
  connections-mock.store.ts
  connections-mock.interceptor.ts
```

---

## 2. Register the Interceptor

In your `app.config.ts` (Angular standalone bootstrap):

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConnectionsMockInterceptor } from './mock-api/connections/connections-mock.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ConnectionsMockInterceptor,
            multi: true,
        },
    ],
};
```

> **Note:** `withInterceptorsFromDi()` is required so that class-based interceptors decorated with `@Injectable()` are picked up by the Angular DI system.

---

## 3. Endpoints

Base URL: `/api/connections`

| Method   | URL                       | Body              | Description               | Status |
|----------|---------------------------|-------------------|---------------------------|--------|
| `GET`    | `/api/connections`        | —                 | List all connections      | 200    |
| `GET`    | `/api/connections/:id`    | —                 | Get connection by id      | 200    |
| `POST`   | `/api/connections`        | `CreateConnectionDto` | Create new connection | 201    |
| `PUT`    | `/api/connections/:id`    | `CreateConnectionDto` | Full replace          | 200    |
| `PATCH`  | `/api/connections/:id`    | `UpdateConnectionDto` | Partial update        | 200    |
| `DELETE` | `/api/connections/:id`    | —                 | Delete, returns record    | 200    |

---

## 4. Data Model

```typescript
interface Connection {
    id: number;            // auto-assigned by the mock, never send on create
    name: string;
    userName: string;      // must be unique across all connections
    password: string;
    type: 'http' | 'smpp';
    smsThroughput: number; // max 100,000
    url: string;           // required and validated only when type === 'http'
}

type CreateConnectionDto = Omit<Connection, 'id'>;

type UpdateConnectionDto = Partial<Omit<Connection, 'id'>>;
```

---

## 5. Validation Rules

| Field           | Rule                                         | HTTP Error |
|-----------------|----------------------------------------------|------------|
| `type`          | Must be `"http"` or `"smpp"`                 | 400        |
| `smsThroughput` | Must be ≤ 100,000                            | 400        |
| `url`           | Required + must be a valid URL when `type="http"` | 400   |
| `url`           | Not required when `type="smpp"`              | —          |
| `userName`      | Must be unique across all connections        | 409        |

Error response shape:
```json
{ "error": "Description of what went wrong" }
```

---

## 6. Create a Connections Service

Recommended wrapper service to use in your components:

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Connection, CreateConnectionDto, UpdateConnectionDto } from './mock-api/connections/connection.model';

@Injectable({ providedIn: 'root' })
export class ConnectionsService {
    private http = inject(HttpClient);
    private readonly base = '/api/connections';

    getAll() {
        return this.http.get<Connection[]>(this.base);
    }

    getById(id: number) {
        return this.http.get<Connection>(`${this.base}/${id}`);
    }

    create(dto: CreateConnectionDto) {
        return this.http.post<Connection>(this.base, dto);
    }

    update(id: number, dto: CreateConnectionDto) {
        return this.http.put<Connection>(`${this.base}/${id}`, dto);
    }

    patch(id: number, dto: UpdateConnectionDto) {
        return this.http.patch<Connection>(`${this.base}/${id}`, dto);
    }

    delete(id: number) {
        return this.http.delete<Connection>(`${this.base}/${id}`);
    }
}
```

---

## 7. Usage in a Component

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ConnectionsService } from './connections.service';
import { Connection, CreateConnectionDto } from './mock-api/connections/connection.model';

@Component({
    selector: 'app-connections',
    standalone: true,
    template: `...`
})
export class ConnectionsComponent implements OnInit {
    private service = inject(ConnectionsService);
    connections: Connection[] = [];

    ngOnInit() {
        this.loadAll();
    }

    loadAll() {
        this.service.getAll().subscribe(data => {
            this.connections = data;
        });
    }

    createConnection() {
        const dto: CreateConnectionDto = {
            name: 'New HTTP Gateway',
            userName: 'new_http_user',
            password: 'secret',
            type: 'http',
            smsThroughput: 500,
            url: 'https://new-gateway.example.com/sms'
        };

        this.service.create(dto).subscribe({
            next: created => {
                console.log('Created:', created);
                this.loadAll(); // refresh list
            },
            error: err => console.error('Validation error:', err)
        });
    }

    deleteConnection(id: number) {
        this.service.delete(id).subscribe(() => {
            this.loadAll(); // refresh list
        });
    }
}
```

---

## 8. Seed Data

The following records are automatically created on first load:

| id | name               | userName     | type   | smsThroughput | url                                 |
|----|--------------------|--------------|--------|---------------|-------------------------------------|
| 1  | Main HTTP Gateway  | http_user_1  | http   | 1,000         | https://gateway.example.com/sms     |
| 2  | Primary SMPP       | smpp_user_1  | smpp   | 5,000         | —                                   |
| 3  | Backup SMPP        | smpp_user_2  | smpp   | 2,000         | —                                   |

---

## 9. Reset / Clear Data

To wipe `localStorage` and re-seed from scratch during development:

**Option A — In code:**
```typescript
import { ConnectionsMockStore } from './mock-api/connections/connections-mock.store';

const store = new ConnectionsMockStore();
store.reset();
```

**Option B — Browser console:**
```javascript
localStorage.removeItem('mock_connections');
localStorage.removeItem('mock_connections_seq');
location.reload();
```
