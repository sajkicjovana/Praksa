import { Country, Operator, Routing, CreateRoutingDto, UpdateRoutingDto, Message, CreateMessageDto } from './routing.model';

// ── Static Countries ──────────────────────────────────────────────────────────

export const COUNTRIES: Country[] = [
    { id: 1,  countryCode: '381', name: 'Serbia' },
    { id: 2,  countryCode: '382', name: 'Montenegro' },
    { id: 3,  countryCode: '30',  name: 'Greece' },
    { id: 4,  countryCode: '385', name: 'Croatia' },
    { id: 5,  countryCode: '49',  name: 'Germany' },
    { id: 6,  countryCode: '33',  name: 'France' },
    { id: 7,  countryCode: '39',  name: 'Italy' },
    { id: 8,  countryCode: '34',  name: 'Spain' },
    { id: 9,  countryCode: '43',  name: 'Austria' },
    { id: 10, countryCode: '31',  name: 'Netherlands' },
];

// ── Static Operators ──────────────────────────────────────────────────────────

export const OPERATORS: Operator[] = [
    // Serbia (id: 1)
    { id: 1,  countryId: 1,  name: 'Telekom Srbija',         prefix: ['060', '061', '062', '063'] },
    { id: 2,  countryId: 1,  name: 'Telenor Serbia',         prefix: ['064', '065'] },
    { id: 3,  countryId: 1,  name: 'A1 Serbia',              prefix: ['066', '067'] },
    // Montenegro (id: 2)
    { id: 4,  countryId: 2,  name: 'Crnogorski Telekom',     prefix: ['067', '069'] },
    { id: 5,  countryId: 2,  name: 'Telenor Montenegro',     prefix: ['068'] },
    { id: 6,  countryId: 2,  name: 'M:tel Montenegro',       prefix: ['063', '066'] },
    // Greece (id: 3)
    { id: 7,  countryId: 3,  name: 'Cosmote Greece',         prefix: ['694', '697', '698'] },
    { id: 8,  countryId: 3,  name: 'Vodafone Greece',        prefix: ['695', '699'] },
    { id: 9,  countryId: 3,  name: 'Nova Greece',            prefix: ['690', '693'] },
    // Croatia (id: 4)
    { id: 10, countryId: 4,  name: 'T-Mobile Croatia',       prefix: ['091', '092', '099'] },
    { id: 11, countryId: 4,  name: 'A1 Croatia',             prefix: ['098'] },
    { id: 12, countryId: 4,  name: 'Tele2 Croatia',          prefix: ['095', '096'] },
    // Germany (id: 5)
    { id: 13, countryId: 5,  name: 'T-Mobile Germany',       prefix: ['0151', '0152', '0160', '0170'] },
    { id: 14, countryId: 5,  name: 'Vodafone Germany',       prefix: ['0162', '0172'] },
    { id: 15, countryId: 5,  name: 'O2 Germany',             prefix: ['0176', '0179'] },
    // France (id: 6)
    { id: 16, countryId: 6,  name: 'Orange France',          prefix: ['0600', '0601', '0602'] },
    { id: 17, countryId: 6,  name: 'SFR France',             prefix: ['0700', '0701'] },
    { id: 18, countryId: 6,  name: 'Bouygues Telecom',       prefix: ['0620', '0630'] },
    // Italy (id: 7)
    { id: 19, countryId: 7,  name: 'TIM Italy',              prefix: ['330', '333', '338'] },
    { id: 20, countryId: 7,  name: 'Vodafone Italy',         prefix: ['340', '346', '349'] },
    { id: 21, countryId: 7,  name: 'WindTre Italy',          prefix: ['320', '327', '328'] },
    // Spain (id: 8)
    { id: 22, countryId: 8,  name: 'Movistar Spain',         prefix: ['600', '606', '607'] },
    { id: 23, countryId: 8,  name: 'Vodafone Spain',         prefix: ['617', '618', '619'] },
    { id: 24, countryId: 8,  name: 'Orange Spain',           prefix: ['620', '630', '631'] },
    // Austria (id: 9)
    { id: 25, countryId: 9,  name: 'A1 Austria',             prefix: ['650', '664', '676'] },
    { id: 26, countryId: 9,  name: 'Magenta Austria',        prefix: ['676', '699'] },
    { id: 27, countryId: 9,  name: 'Drei Austria',           prefix: ['660', '665'] },
    // Netherlands (id: 10)
    { id: 28, countryId: 10, name: 'KPN Netherlands',        prefix: ['0610', '0611', '0612'] },
    { id: 29, countryId: 10, name: 'T-Mobile Netherlands',   prefix: ['0613', '0614'] },
    { id: 30, countryId: 10, name: 'Vodafone Netherlands',   prefix: ['0620', '0621'] },
];

// ── Routing Store (localStorage CRUD) ────────────────────────────────────────

const STORAGE_KEY = 'mock_routing';
const SEQ_KEY     = 'mock_routing_seq';

const SEED_DATA: Omit<Routing, 'id'>[] = [
    { countryId: 1, operatorId: 1,  connectionId: 1, price: 0.0050, currency: 'EUR' },
    { countryId: 1, operatorId: 2,  connectionId: 1, price: 0.0055, currency: 'EUR' },
    { countryId: 4, operatorId: 10, connectionId: 2, price: 0.0045, currency: 'EUR' },
    { countryId: 5, operatorId: 13, connectionId: 1, price: 0.0030, currency: 'EUR' },
];

export class RoutingMockStore {

    private load(): Routing[] | null {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Routing[]) : null;
    }

    private save(records: Routing[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }

    private nextId(): number {
        const current = parseInt(localStorage.getItem(SEQ_KEY) ?? '0', 10);
        const next = current + 1;
        localStorage.setItem(SEQ_KEY, String(next));
        return next;
    }

    private initialize(): Routing[] {
        const existing = this.load();
        if (existing !== null) return existing;
        const seeded = SEED_DATA.map(dto => ({ id: this.nextId(), ...dto }));
        this.save(seeded);
        return seeded;
    }

    getAll(): Routing[] {
        return this.initialize();
    }

    getById(id: number): Routing | undefined {
        return this.initialize().find(r => r.id === id);
    }

    create(dto: CreateRoutingDto): Routing {
        const records = this.initialize();
        const record: Routing = { id: this.nextId(), ...dto };
        records.push(record);
        this.save(records);
        return record;
    }

    /** Full replace (PUT) */
    update(id: number, dto: CreateRoutingDto): Routing | null {
        const records = this.initialize();
        const index = records.findIndex(r => r.id === id);
        if (index === -1) return null;
        records[index] = { id, ...dto };
        this.save(records);
        return records[index];
    }

    /** Partial merge (PATCH) */
    patch(id: number, dto: UpdateRoutingDto): Routing | null {
        const records = this.initialize();
        const index = records.findIndex(r => r.id === id);
        if (index === -1) return null;
        records[index] = { ...records[index], ...dto };
        this.save(records);
        return records[index];
    }

    remove(id: number): Routing | null {
        const records = this.initialize();
        const index = records.findIndex(r => r.id === id);
        if (index === -1) return null;
        const [deleted] = records.splice(index, 1);
        this.save(records);
        return deleted;
    }

    /** Dev helper — wipe all routing data and re-seed */
    reset(): void {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SEQ_KEY);
        this.initialize();
    }
}
// ── Messages Store (localStorage) ────────────────────────────────────────────

const MSG_STORAGE_KEY = 'mock_messages';
const MSG_SEQ_KEY     = 'mock_messages_seq';

export class MessagesMockStore {

    private load(): Message[] {
        const raw = localStorage.getItem(MSG_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Message[]) : [];
    }

    private save(records: Message[]): void {
        localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(records));
    }

    private nextId(): number {
        const current = parseInt(localStorage.getItem(MSG_SEQ_KEY) ?? '0', 10);
        const next = current + 1;
        localStorage.setItem(MSG_SEQ_KEY, String(next));
        return next;
    }

    getAll(): Message[] {
        return this.load();
    }


    create(dto: CreateMessageDto): Message {
        const records = this.load();
        const record: Message = { id: this.nextId(), ...dto };
        records.push(record);
        this.save(records);
        return record;
    }
    remove(id: number): Message | null {
    const records = this.load();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;
    const [deleted] = records.splice(index, 1);
    this.save(records);
    return deleted;
    }

    /** Dev helper — wipe all message log data */
    reset(): void {
        localStorage.removeItem(MSG_STORAGE_KEY);
        localStorage.removeItem(MSG_SEQ_KEY);
    }
}