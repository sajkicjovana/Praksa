export interface LoginRequest{
    email: string; 
    password: string;
}

export interface LoginResponse{
    token: string;
    email: string; 
    name: string;
}
export interface User{
    id: number;
    email: string; 
    name: string; // ime prezime
    password: string;
    role: string; // 2 uloge
}
export interface RegisterResponse{
    id: number;
    email: string;
    name: string;
    token: string;
    
}
export interface RegisterRequest{
    email: string;
    name: string;
    password: string;
    role: string; // 2 uloge
}
