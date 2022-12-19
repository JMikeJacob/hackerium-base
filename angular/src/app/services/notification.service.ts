import { Injectable } from '@angular/core'
import { Socket } from 'ngx-socket-io'
import { Notification } from '../notification'
import { Subject, Observable } from 'rxjs'
import { CONSTANTS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification = this.socket.fromEvent<Notification>('notification')
  connection = this.socket.fromEvent<any>('user connected')
  initial_count = this.socket.fromEvent<any>('send count')
  fromMaster: Notification[]
  
  public init_count = 0
  private editNotificationSource = new Subject<string>()
  private getAppSource = new Subject<string>()

  editNotification$ = this.editNotificationSource.asObservable()
  getApp$ = this.getAppSource.asObservable()

  constructor(private socket: Socket) { }

  editNotification(message: string) {
    this.fromMaster = []
    this.editNotificationSource.next(message)
  }

  sendNotifications(notifs: Notification[]) {
    console.log({master: notifs})
    this.fromMaster = notifs
  }

  getApps(message:string) {
    this.getAppSource.next(message)
  }

  getNotifications() {
    if(this.fromMaster) {
      console.log({get:this.fromMaster})
      return this.fromMaster
    }
    else {
      console.log({get:"empty"})
      return []
    }
  }

  applyNotification(notif: Notification) {
    console.log(notif)
    this.socket.emit('notification', notif)
  }

  respondNotification(notif: Notification) {
    console.log(notif)
    this.socket.emit('response', notif)
  }

  notifyUser(data: any) {
    switch(data.eventType) {
      case CONSTANTS.EVENTS.APPLICATION_SUBMITTED:
        return `User ${data.firstName} ${data.lastName} applied for ${data.jobName}!`
        break;
      case CONSTANTS.EVENTS.APPLICATION_WITHDRAWN:
        return `User ${data.firstName} ${data.lastName} withdrew their application for ${data.jobName}.`
      case CONSTANTS.EVENTS.APPLICATION_STATUS_CHANGED:
        if(data.status === 'accepted') {
          return `Congratulations! You have been ${data.status} for ${data.jobName}!`;
        }
        else if(data.status === 'rejected') {
          return `You have been ${data.status} for ${data.jobName}.`;
        }
        else if(data.status === 'test_sent') {
          return `You have received a test for ${data.jobName}. Good luck!`;
        }
        else if(data.status === 'test_completed') {
          return `User ${data.firstName} ${data.lastName} for ${data.jobName}!`;
        }
      default:
        return null;
        break;
    }
  }

  subscribeToNotifs(role: string, id: any, count?: number) {
    this.init_count = count
    console.log(this.init_count)
    this.socket.emit('subscribe to notifs', {role: role, id: id})
  }

  unsubscribeFromNotifs(role: string, id:any) {
    this.socket.emit('unsubscribe from notifs', {role: role, id: id})
  }
}
