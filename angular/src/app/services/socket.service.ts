import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socketJobConfig: SocketIoConfig = { url: 'http://localhost:3002', options: {} };
  socketJob: Socket = new Socket(this.socketJobConfig);

  socketEvent = this.socketPush.fromEvent<any>('event');
  currentInterview = this.socketJob.fromEvent<any>('interview');


  constructor(private socketPush: Socket) { }

  subscribeToEvents(aggregate: string, id: any, offset?: any) {
    this.socketPush.emit('joinRoom', {aggregate: aggregate, aggregateId: id, offset: offset});
  }

  unsubscribeFromEvents(aggregate: string, id:any) {
    this.socketPush.emit('leaveRoom', {aggregate: aggregate, aggregateId: id});
  }

  subscribeToInterview(appId: string, script: string) {
    this.socketJob.emit('joinInterview', {
      id: appId,
      script: script
    });
  }

  unsubscribeFromInterview(appId: string) {
    this.socketJob.emit('leaveInterview', appId);
    this.socketJob.disconnect();
  }

  getInterview(appId: string) {
    this.socketJob.emit('getInterview', appId);
  }

  editInterview(appId: string, script: string) {
    this.socketJob.emit('editInterview', {
      id: appId,
      script: script
    });
  }
}
