import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Server } from 'ws';
import { Socket } from 'net';
import { /* dd, */ dump } from 'dumper.js';
import { IncomingMessage } from 'http';
import { use, delegate } from 'typescript-mix';
import { v4 as uuid } from 'uuid';


const getPlayerUID = () => this._id;
const isIdentifiable = (obj: any) => '__identifiable' in obj;

class Identifiable {
  __identifiable: () => void;
  private _uid: string;
  get id(): string { return this._uid; }
  set id(value: string) { this._uid = value; }

  @delegate(getPlayerUID) getUID:() => void
}

const isConnectable = (obj: any) => '__connectable' in obj;

class Connectable {
  // 
  __connectable: () => void;
  private _socket: Socket;
  private _request: IncomingMessage;
  get socket() { return this._socket; }
  set socket(value: Socket) { this._socket = value; }
  get request() { return this._request }
  set request(value: IncomingMessage) { this._request = value; }
}


interface Player extends Identifiable, Connectable {}
class Player {
  @use(Identifiable, Connectable) this

  constructor() {
    // 
    this.__identifiable = () => false;
    this.__connectable = () => false;
  }
}

// 可用 WebSocketGateway 修飾器(Decorator) 修改 port 和傳輸方式
// @WebSocketGateway(81, { transports: ['websocket'] })
@WebSocketGateway(8080)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  clients: Map<string, Player>;

  afterInit(server: Server): any {
    this.clients = new Map();
    console.log('websocket server listen at ' + server.options.port);
  }

  handleConnection(client: Socket, request: IncomingMessage): any {
    // // dump('connected... ', client);
    const newPlayer = new Player();
    newPlayer.id = uuid();
    newPlayer.socket = client;
    newPlayer.request = request;
    
    this.clients.set(newPlayer.id, newPlayer);
    // dump(newPlayer.getId());
    console.log(isIdentifiable(newPlayer), isConnectable(newPlayer));
    dump('new connection id: ' + newPlayer.id + ', palyers: '+ this.clients.size);
    // dump(client.options)
  }

  handleDisconnect(client: Socket): any {
    // from(this.clients.entries())
    //   .pipe(map((item:any[]) => item[1])) // only values
    //   .pipe(filter((player: Player) => player.socket === client))
    //   .subscribe((player: Player) => {
    //     this.clients.delete(player.id) && dump('delete ' + player.id + ', players: ' + this.clients.size);
    //   });

    this.clients.forEach((player, key) => {
      if (player.socket === client) {
        // this.clients.has(player.id) && this.clients.delete(player.id);
        this.clients.delete(key);
        dump('delete ' + key + ', players: ' + this.clients.size);
      }
    })
  }

  // 官網不建議用這種方式
  // onEvent(client: Socket, data: any): Observable<WsResponse<number>>
  @SubscribeMessage('events')
  onEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any
  ): Observable<WsResponse<number>> {
    // client: Websockeet
    console.log('message from client: ' + data);
    return from([1,2,3]).pipe(
      map(item => ({ event: 'events', data: item }))
    );
    // return data;
  }

}
