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

// ── Message Log ───────────────────────────────────────────────────────────────

export interface Message {
    id: number;
    senderId: string;
    sendTo: string;
    messageText: string;
    country?: string;
    operator?: string;
    connection?: Object;
    sent?: boolean;
    failReason?: string | null;

    

}
export interface realMessage{
    type?: string;
    sender?: string;
    receiver?: string;
    dlrMask?: number;
    dlrUrl?: string;
    flash?: boolean;
    validityPeriodMinutes?: number;
    custom?: Object;
    auth?:Object;
    text?:string;
    dcs?:string;
    
}

export type CreateMessageDto = Omit<Message, 'id'>;