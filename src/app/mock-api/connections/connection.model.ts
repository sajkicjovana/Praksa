export type ConnectionType = 'http' | 'smpp';

export interface Connection {
    id: number;
    name: string;
    userName: string;
    password: string;
    type: ConnectionType;
    smsThroughput: number;
    url: string;
}

export type CreateConnectionDto = Omit<Connection, 'id'>;

export type UpdateConnectionDto = Partial<Omit<Connection, 'id'>>;
