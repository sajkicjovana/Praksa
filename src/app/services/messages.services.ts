//////////////////////////////////////////
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateMessageDto, Message, realMessage } from "../mock-api/routing/routing.model";
import { COUNTRIES, OPERATORS } from "../mock-api/routing/routing-mock.store";
import { RoutingMockStore } from "../mock-api/routing/routing-mock.store";
import { ConnectionsMockStore } from "../mock-api/connections/connections-mock.store";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
@Injectable({ providedIn: 'root' })
export class MessagesService {
  private routingStore = new RoutingMockStore();
  private connectionsStore = new ConnectionsMockStore();
  private http = inject(HttpClient);
  private readonly base = '/api/messages';
  public isReal: boolean = false;
  private prefixTable:{
    fullPrefix:string,
    country: any,
    operator: any
  }[] = [];
  constructor(){
    this.buildprefixTable();
  }
  getAll() { return this.http.get<Message[]>(this.base, { params: { useRealSendAPI: this.isReal }}); }
  create(dto: CreateMessageDto): Observable<Message> {
    const sendResult$: Observable<{ success: boolean; failReason: string | null; route: any }> =
      this.isReal ? this.realSending(dto) : of(this.simulateSend(dto));

    return sendResult$.pipe(
      switchMap(trySending => {
        const newDto: CreateMessageDto = {
          senderId: dto.senderId,
          sendTo: dto.sendTo,
          messageText: dto.messageText,
          sent: trySending?.success,
          failReason: trySending?.failReason,
          operator: trySending?.route?.operator,
          country: trySending?.route?.country,
          connection: trySending?.route?.connection?.name
        };
        return this.http.post<Message>(this.base, newDto, { params: { useRealSendAPI: this.isReal } });
      })
    );
  }
  delete(id: number) { return this.http.delete(`/api/messages/${id}`, { params: { useRealSendAPI: this.isReal } });} 

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
    console.log('Building prefixes',this.prefixTable);
    this.prefixTable.sort((a,b)=>b.fullPrefix.length-a.fullPrefix.length);
  }

  private findRoute(number:string){
    console.log('Find prefix for num:',number);
    const prefix= this.prefixTable.find(pref=>number.startsWith(pref.fullPrefix))
    console.log(prefix)
    if(!prefix)
      return null;

    const route = this.routingStore.getAll().find(r =>r.countryId === prefix.country.id && r.operatorId === prefix.operator.id);
    if(!route)
      return null;

    //konekcija id
    const connection = this.connectionsStore.getAll().find(con => con.id===route.connectionId);

    if(!connection)
      return null;


    return{
      ...prefix,
      route,
      connection
    };

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
    // const success = true;
    return {
      success,
      failReason:success?null:'Random failure',
      route
    };

  }
  private realSending(dto: CreateMessageDto): Observable<{ success: boolean; failReason: string | null; route: any }> {
    const route = this.findRoute(dto.sendTo);

    if (!route) {
      return of({ success: false, failReason: 'No route found', route: null });
    }

    const dtoReal: realMessage = {
      sender: dto.senderId,
      receiver: dto.sendTo,
      dirMask: 19,
      dirUrl: route.connection.url,
      auth: {
        username: route.connection.userName,
        password: route.connection.password
      }
    };

    return this.callRealAPI(route.connection, route, dtoReal);
  }
  private callRealAPI(conn: any, route: any, dto: any): Observable<{ success: boolean; failReason: string | null; route: any }> {
    console.log('Call real API: ', conn, route, dto);
    return this.http.post(conn.url, dto).pipe(
      map(resp => {
        console.log('Resp', resp);
        return { success: true, failReason: null, route };
      }),
      catchError(err => {
        console.log('Err', err);
        return of({ success: false, failReason: 'API call failed', route: null });
      })
    );
  }

}