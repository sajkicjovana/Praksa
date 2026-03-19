# Routing Mock API — Integration Guide

Static endpoints for **Countries** and **Operators**, plus full CRUD for **Routing** rules.
Routing data is persisted in `localStorage`. Four seed records are created on first load.

---

## 1. Copy the Files

```
src/mock-api/routing/
  routing.model.ts
  routing-mock.store.ts
  routing-mock.interceptor.ts
```

---

## 2. Register the Interceptor

In your `app.config.ts`, register alongside the Connections interceptor:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConnectionsMockInterceptor } from './mock-api/connections/connections-mock.interceptor';
import { RoutingMockInterceptor } from './mock-api/routing/routing-mock.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: ConnectionsMockInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RoutingMockInterceptor,     multi: true },
    ],
};
```

---

## 3. Endpoints

### Countries (read-only, static)

| Method | URL                    | Query Params | Description              | Status |
|--------|------------------------|--------------|--------------------------|--------|
| `GET`  | `/api/countries`       | —            | List all 10 countries    | 200    |
| `GET`  | `/api/countries/:id`   | —            | Get one country by id    | 200    |

### Operators (read-only, static)

| Method | URL                    | Query Params       | Description                          | Status |
|--------|------------------------|--------------------|--------------------------------------|--------|
| `GET`  | `/api/operators`       | —                  | List all operators (30 total)        | 200    |
| `GET`  | `/api/operators`       | `?countryId=1`     | List operators filtered by country   | 200    |
| `GET`  | `/api/operators/:id`   | —                  | Get one operator by id               | 200    |

### Routing (full CRUD, persisted)

| Method   | URL                  | Body                | Description             | Status |
|----------|----------------------|---------------------|-------------------------|--------|
| `GET`    | `/api/routing`       | —                   | List all routing rules  | 200    |
| `GET`    | `/api/routing/:id`   | —                   | Get routing rule by id  | 200    |
| `POST`   | `/api/routing`       | `CreateRoutingDto`  | Create routing rule     | 201    |
| `PUT`    | `/api/routing/:id`   | `CreateRoutingDto`  | Full replace            | 200    |
| `PATCH`  | `/api/routing/:id`   | `UpdateRoutingDto`  | Partial update          | 200    |
| `DELETE` | `/api/routing/:id`   | —                   | Delete, returns record  | 200    |

---

## 4. Data Models

```typescript
interface Country {
    id: number;
    countryCode: string; // mobile number prefix e.g. "381"
    name: string;
}

interface Operator {
    id: number;
    countryId: number;
    prefix: string[];    // number prefixes e.g. ["060", "061"]
    name: string;
}

interface Routing {
    id: number;          // auto-assigned, never send on create
    countryId: number;
    operatorId: number;
    connectionId: number; // FK to Connection (from connections mock)
    price: number;        // decimal e.g. 0.0050
    currency: string;     // e.g. "EUR"
}

type CreateRoutingDto = Omit<Routing, 'id'>;
type UpdateRoutingDto = Partial<Omit<Routing, 'id'>>;
```

---

## 5. Validation Rules (Routing writes)

| Field          | Rule                                                   | HTTP Error |
|----------------|--------------------------------------------------------|------------|
| `countryId`    | Must match an existing country id                      | 400        |
| `operatorId`   | Must match an existing operator id                     | 400        |
| `operatorId`   | Operator must belong to the given `countryId`          | 400        |
| `connectionId` | Must be a positive integer                             | 400        |
| `price`        | Must be a non-negative number                          | 400        |
| `currency`     | Must not be empty                                      | 400        |

Error response shape:
```json
{ "error": "Description of what went wrong" }
```

---

## 6. Typical Workflow (Add a Routing Rule)

1. Load countries → populate country dropdown
2. On country select → load operators by `?countryId=` → populate operator dropdown, or pull whole list and match on client
3. Load connections (from ConnectionsService) → populate connection dropdown
4. Submit form → `POST /api/routing`


---

## 7. Reset Routing Data

```javascript
// Browser console — clears only routing, countries/operators are always static
localStorage.removeItem('mock_routing');
localStorage.removeItem('mock_routing_seq');
location.reload();
```
