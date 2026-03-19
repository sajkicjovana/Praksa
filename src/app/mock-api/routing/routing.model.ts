// ── Country ───────────────────────────────────────────────────────────────────

export interface Country {
    id: number;
    countryCode: string; // mobile number prefix (e.g. "381" for Serbia)
    name: string;
}

// ── Operator ──────────────────────────────────────────────────────────────────

export interface Operator {
    id: number;
    countryId: number;
    prefix: string[]; // list of number prefixes belonging to this operator
    name: string;
}

// ── Routing ───────────────────────────────────────────────────────────────────

export interface Routing {
    id: number;
    countryId: number;
    operatorId: number;
    connectionId: number; // FK to Connection
    price: number;        // decimal
    currency: string;
}

export type CreateRoutingDto = Omit<Routing, 'id'>;

export type UpdateRoutingDto = Partial<Omit<Routing, 'id'>>;
