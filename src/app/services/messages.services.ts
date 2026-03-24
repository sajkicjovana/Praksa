import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateMessageDto, Message } from "../mock-api/routing/routing.model";
@Injectable({ providedIn: 'root' })
export class MessagesService {
  private http = inject(HttpClient);
  private readonly base = '/api/messages';

  getAll() { return this.http.get<Message[]>(this.base); }
  create(dto: CreateMessageDto) { return this.http.post<Message>(this.base, dto); }
  delete(id: number) { return this.http.delete(`/api/messages/${id}`);}
  

}