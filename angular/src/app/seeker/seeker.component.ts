import { Component, OnInit } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'
import { NotificationService } from '../services/notification.service'
import { Subscription, of } from 'rxjs'
import { Notification } from '../notification'

import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-seeker',
  templateUrl: './seeker.component.html',
  styleUrls: ['./seeker.component.css']
})
export class SeekerComponent implements OnInit {

  __notifSub: Subscription
  _removerSub: Subscription
  __socketSub: Subscription
  accepts: Notification[]

  constructor(
    public cookieService: CookieService,
    public router: Router,
    private notificationService: NotificationService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.accepts = []
    const cookies = {} = this.cookieService.getAll()
    console.log(cookies)
    const role = this.cookieService.get('role')
    if(!role) {
      this.router.navigate([`../index`])
    }
    else if(role==="employer") {
      this.router.navigate([`../employer`])
    }
    else {
      this.notificationService.subscribeToNotifs('seeker', this.cookieService.get('user_id'))
      this.__notifSub = this.notificationService.notification.subscribe(
        (notif) => {
          if(notif.type = "accept") {
            this.accepts.push(notif)
          }
        }
      )
      this._removerSub = this.notificationService.editNotification$.subscribe(
        (res) => {
          this.accepts = []
        }
      )
      this.socketService.subscribeToEvents('seeker', this.cookieService.get('user_id'));
      this.socketService.socketEvent.subscribe(
        (event) => {
          console.log(event);
          if(event.payload.eventType === 'seeker_account_edited') {
            this.cookieService.set('last_name', event.payload.lastName, null, '/');
            this.cookieService.set('first_name', event.payload.firstName, null, '/');
          }
        },
        (err) => {
          console.error(err);
        }
      )
    }

  }

  followLink() {
    this.notificationService.editNotification("remove")
    this.accepts = []
    this.router.navigate(["/seeker/apps/1"])
  }

  removeNotifs() {
    this.notificationService.editNotification("remove")
    this.accepts = []
  }

  ngOnDestroy() {
    if(this.__notifSub) {
      this.__notifSub.unsubscribe()
    }
    if(this._removerSub) {
      this._removerSub.unsubscribe()
    }
    if(this.__socketSub) {
      this.__socketSub.unsubscribe();
    }
  }

}
