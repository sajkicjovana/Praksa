import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { count } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private count = signal(0);
    increment(){
        this.count.set(this.count()+1);
    }
    decrement(){
        if(this.count()>0) this.count.set(this.count()-1);
    }
    isLoading(){
        return this.count()>0;
    }
    reset(){
        this.count.set(0);
    }
}