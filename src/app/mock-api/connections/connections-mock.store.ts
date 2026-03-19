import { Connection, CreateConnectionDto, UpdateConnectionDto } from './connection.model';

const STORAGE_KEY = 'mock_connections';
const SEQ_KEY = 'mock_connections_seq';

const SEED_DATA: Omit<Connection, 'id'>[] = [
    {
        name: 'Main HTTP Gateway',
        userName: 'httpUser1',
        password: 'pass123',
        type: 'http',
        smsThroughput: 1000,
        url: 'https://gateway.example.com/sms'
    },
    {
        name: 'Primary SMPP',
        userName: 'smppUser1',
        password: 'pass456',
        type: 'smpp',
        smsThroughput: 5000,
        url: ''
    },
    {
        name: 'Backup SMPP',
        userName: 'smppUse2',
        password: 'pass789',
        type: 'smpp',
        smsThroughput: 2000,
        url: ''
    },
    
  {
    "name": "Main HTTP Gateway",
    "userName": "httpUser01",
    "password": "SecurePass1",
    "type": "http",
    "smsThroughput": 5000,
    "url": "https://api.alpha-gw.com"
  },
  {
    "name": "Primary SMPP",
    "userName": "smppUser02",
    "password": "BckpRoute99",
    "type": "smpp",
    "smsThroughput": 1200,
    "url": ""
  },
  {
    "name": "Secondary SMPP Hub",
    "userName": "nodeadmin13",
    "password": "ClusterNode01",
    "type": "smpp",
    "smsThroughput": 12000,
    "url": ""
  },
  {
    "name": "Enterprise Bridge",
    "userName": "entbridge04",
    "password": "Enterprise2024",
    "type": "http",
    "smsThroughput": 15000,
    "url": "https://ent-bridge.com/v1"
  },
  {
    "name": "Secure FinTech",
    "userName": "fintechops07",
    "password": "GoldStandard1",
    "type": "smpp",
    "smsThroughput": 3000,
    "url": ""
  },
  {
    "name": "Marketing Push Dev",
    "userName": "marketdev06",
    "password": "PromoPush77",
    "type": "http",
    "smsThroughput": 25000,
    "url": "https://dev.marketing.ai"
  },
  {
    "name": "Internal Notifier",
    "userName": "internal99",
    "password": "LocalPass101",
    "type": "http",
    "smsThroughput": 100,
    "url": "https://int.notify.local"
  },
  {
    "name": "Rapid Delivery v2",
    "userName": "rapiduser10",
    "password": "SpeedLimit200",
    "type": "http",
    "smsThroughput": 80000,
    "url": "https://fast-sms.com/v2"
  },
  {
    "name": "Data Link SMPP",
    "userName": "datalink021",
    "password": "BufferOver1",
    "type": "smpp",
    "smsThroughput": 1500,
    "url": ""
  },
  {
    "name": "Support Ticket Bot",
    "userName": "supportbot12",
    "password": "TicketMaster1",
    "type": "http",
    "smsThroughput": 4500,
    "url": "https://helpdesk.bot.io"
  },
  {
    "name": "Gamma Router Core",
    "userName": "gammacore024",
    "password": "CoreRoute01",
    "type": "smpp",
    "smsThroughput": 40000,
    "url": ""
  },
  {
    "name": "Verification Service",
    "userName": "authchecker14",
    "password": "VerifyMe2026",
    "type": "http",
    "smsThroughput": 95000,
    "url": "https://verify.auth.com"
  },
  {
    "name": "Cloud Messaging Pro",
    "userName": "cloudpro16",
    "password": "NimbusScale1",
    "type": "http",
    "smsThroughput": 35000,
    "url": "https://cloud.msg.com"
  },
  {
    "name": "High Volume Batch",
    "userName": "batchworker18",
    "password": "HeavyLoad22",
    "type": "http",
    "smsThroughput": 100000,
    "url": "https://batch.sender.io"
  },
  {
    "name": "Delta Emergency",
    "userName": "emergency025",
    "password": "UrgentCare9",
    "type": "http",
    "smsThroughput": 500,
    "url": "https://delta.sos.com"
  },
  {
    "name": "Alpha Messaging Hub",
    "userName": "alphahub022",
    "password": "FirstPlace1",
    "type": "http",
    "smsThroughput": 22000,
    "url": "https://alpha.hub.com"
  },
  {
    "name": "Monitoring Agent",
    "userName": "monitor020",
    "password": "HealthCheck1",
    "type": "http",
    "smsThroughput": 50,
    "url": "https://mon.health.net"
  },
  {
    "name": "Nordic SMPP Relay",
    "userName": "nordicsmpp18",
    "password": "Stockholm08",
    "type": "smpp",
    "smsThroughput": 7500,
    "url": ""
  },
  {
    "name": "Global Traffic Node",
    "userName": "globalnode19",
    "password": "RoutePass33",
    "type": "http",
    "smsThroughput": 60000,
    "url": "https://global.traffic.com"
  },
  {
    "name": "Local SMS Bridge",
    "userName": "localbridge20",
    "password": "LocalNet2024",
    "type": "smpp",
    "smsThroughput": 200,
    "url": ""
  },
  {
    "name": "Customer Feedback",
    "userName": "feedbackusr21",
    "password": "CommentOne1",
    "type": "http",
    "smsThroughput": 4000,
    "url": "https://feedback.service.io"
  },
  {
    "name": "Legacy SMPP Link",
    "userName": "legacyops22",
    "password": "OldButGold1",
    "type": "smpp",
    "smsThroughput": 1100,
    "url": ""
  },
  {
    "name": "Retail Promo Auth",
    "userName": "retailauth23",
    "password": "SaleSeason25",
    "type": "http",
    "smsThroughput": 55000,
    "url": "https://promo.retail.com"
  },
  {
    "name": "Priority Signal Hub",
    "userName": "priority24",
    "password": "HighSignal99",
    "type": "http",
    "smsThroughput": 30000,
    "url": "https://priority.hub.com"
  },
  {
    "name": "Transit SMPP Port",
    "userName": "transituser25",
    "password": "PortControl1",
    "type": "smpp",
    "smsThroughput": 9000,
    "url": ""
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
