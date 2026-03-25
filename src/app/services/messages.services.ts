import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateMessageDto, Message } from "../mock-api/routing/routing.model";
import { COUNTRIES, OPERATORS } from "../mock-api/routing/routing-mock.store";
@Injectable({ providedIn: 'root' })
export class MessagesService {
  private http = inject(HttpClient);
  private readonly base = '/api/messages';
  
  private prefixTable:{
    fullPrefix:string,
    country: any,
    operator: any
  }[] = [];
  constructor(){
    this.buildprefixTable();
  }
  getAll() { return this.http.get<Message[]>(this.base); }
  create(dto: CreateMessageDto) { 
    const trySending = this.simulateSend(dto);
    
    const newDto:CreateMessageDto= {
      senderId:dto.senderId,
      sendTo:dto.sendTo,
      messageText:dto.messageText,
      sent:trySending.success,
      failReason:trySending.failReason,
      operator:trySending.route?.operator,
      country:trySending.route?.country
    }

    return this.http.post<Message>(this.base, newDto);
  }
  delete(id: number) { return this.http.delete(`/api/messages/${id}`);}

  private buildprefixTable(){
    const countryMap = new Map(COUNTRIES.map(c=>[c.id,c]));
    this.prefixTable=[];

    OPERATORS.forEach(o=>{
      const country = countryMap.get(o.countryId);
      o.prefix.forEach(pref=>{
        const localPart = pref.startsWith('0') ? pref.substring(1) : pref;
        const fullPrefix = country!.countryCode + localPart;

        this.prefixTable.push({
          fullPrefix,
          country,
          operator:o
        });
      })

    })


    this.prefixTable.sort((a,b)=>b.fullPrefix.length-a.fullPrefix.length);
  }

  private findRoute(number:string){
    return this.prefixTable.find(pref=>number.startsWith(pref.fullPrefix))
  }
  
  private simulateSend(dto:CreateMessageDto){
    const number = dto.sendTo;
    const route = this.findRoute(number);
    if(!route){
      return{
        success:false,
        failReason:'No route found',
        route:null
      }
    }

    const success = Math.random() < 0.8;
    
    return {
      success,
      failReason:success?null:'Random failure',
      route
    };

  }

}