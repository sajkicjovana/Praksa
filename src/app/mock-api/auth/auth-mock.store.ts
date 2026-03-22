import { LoginRequest, LoginResponse,RegisterRequest,User } from "./auth.model";

const STORAGE_KEY = 'mock_login';
const SEQ_KEY = 'mock_login_seq';

const SEED_DATA: Omit<User,'id'>[]=[
    {  email: 'admin@gmail.com',name: "Petar Petrovic", password: 'admin123', role:'admin' },
    {  email: 'user',name: "Marko Markovic" ,password: 'user123' , role:'admin'},
    {  email: 'test',name: "Nikola Nikolic", password: 'test123' , role:'admin'}

]

export class AuthMockStore{
     private load(): User[] | null {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    }

    private save(users: User[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
    private nextId(): number {
        const current = parseInt(localStorage.getItem(SEQ_KEY) ?? '0', 10);
        const next = current + 1;
        localStorage.setItem(SEQ_KEY, String(next));
        return next;
    }

    private initialize(): User[] {
        const existing = this.load();
        if (existing !== null) return existing;
        const seeded = SEED_DATA.map(dto => ({ id: this.nextId(), ...dto }));
        this.save(seeded);
        return seeded;
    }

    getAll(): User[] {
        return this.initialize();
    }

    findUser(email: string): User | undefined {
        return this.initialize().find(u => u.email === email);
    }
    create(dto: RegisterRequest):User{
        const users = this.initialize();
        const newUser: User = {
            id:this.nextId(),
            email:dto.email,
            name:dto.name,
            password:dto.password,
            role:'user'
        }

        users.push(newUser);
        this.save(users);
        return newUser;
    }
    isEmailTaken(email: string): boolean{
        return this.initialize().some(
            c => c.email === email);
        
    }

    
}