import { Connection, CreateConnectionDto, UpdateConnectionDto } from './connection.model';

const STORAGE_KEY = 'mock_connections';
const SEQ_KEY = 'mock_connections_seq';

const SEED_DATA: Omit<Connection, 'id'>[] = [
    {
        name: 'Main HTTP Gateway',
        userName: 'http_user_1',
        password: 'pass123',
        type: 'http',
        smsThroughput: 1000,
        url: 'https://gateway.example.com/sms'
    },
    {
        name: 'Primary SMPP',
        userName: 'smpp_user_1',
        password: 'pass456',
        type: 'smpp',
        smsThroughput: 5000,
        url: ''
    },
    {
        name: 'Backup SMPP',
        userName: 'smpp_user_2',
        password: 'pass789',
        type: 'smpp',
        smsThroughput: 2000,
        url: ''
    }
];

export class ConnectionsMockStore {

    private load(): Connection[] | null {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Connection[]) : null;
    }

    private save(records: Connection[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }

    private nextId(): number {
        const current = parseInt(localStorage.getItem(SEQ_KEY) ?? '0', 10);
        const next = current + 1;
        localStorage.setItem(SEQ_KEY, String(next));
        return next;
    }

    private initialize(): Connection[] {
        const existing = this.load();
        if (existing !== null) return existing;
        const seeded = SEED_DATA.map(dto => ({ id: this.nextId(), ...dto }));
        this.save(seeded);
        return seeded;
    }

    getAll(): Connection[] {
        return this.initialize();
    }

    getById(id: number): Connection | undefined {
        return this.initialize().find(c => c.id === id);
    }

    create(dto: CreateConnectionDto): Connection {
        const records = this.initialize();
        const record: Connection = { id: this.nextId(), ...dto };
        records.push(record);
        this.save(records);
        return record;
    }

    /** Full replace (PUT) */
    update(id: number, dto: CreateConnectionDto): Connection | null {
        const records = this.initialize();
        const index = records.findIndex(c => c.id === id);
        if (index === -1) return null;
        records[index] = { id, ...dto };
        this.save(records);
        return records[index];
    }

    /** Partial merge (PATCH) */
    patch(id: number, dto: UpdateConnectionDto): Connection | null {
        const records = this.initialize();
        const index = records.findIndex(c => c.id === id);
        if (index === -1) return null;
        records[index] = { ...records[index], ...dto };
        this.save(records);
        return records[index];
    }

    remove(id: number): Connection | null {
        const records = this.initialize();
        const index = records.findIndex(c => c.id === id);
        if (index === -1) return null;
        const [deleted] = records.splice(index, 1);
        this.save(records);
        return deleted;
    }

    isUserNameTaken(userName: string, excludeId?: number): boolean {
        return this.initialize().some(
            c => c.userName === userName && c.id !== excludeId
        );
    }

    /** Dev helper — wipe all data and re-seed */
    reset(): void {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SEQ_KEY);
        this.initialize();
    }
}
