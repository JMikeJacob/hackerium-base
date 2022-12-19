import { Component, OnInit } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'
import { NotificationService } from '../services/notification.service'
import { Subscription } from 'rxjs'
import { last } from 'rxjs/operators'

@Component({
  selector: 'app-employer-navbar',
  templateUrl: './employer-navbar.component.html',
  styleUrls: ['./employer-navbar.component.css']
})
export class EmployerNavbarComponent implements OnInit {
  notifCount: number
  _notifSub: Subscription
  _removerSub: Subscription
  constructor(
    public cookieService: CookieService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.notifCount = this.notificationService.init_count || 0
    this.notificationService.initial_count.subscribe(
      count => this.notifCount = count.count
    )
    this._notifSub = this.notificationService.notification.subscribe(
      notif => this.notifCount = notif.count
    )
    this._removerSub = this.notificationService.editNotification$.pipe().subscribe(
      res => {
        console.error(res)
        if(res ==="remove") this.notifCount = 0
      }
    )
  }

  logout() {
    const cookies: {} = this.cookieService.getAll()
    console.log(cookies)
    if(cookies) {
      this.notificationService.unsubscribeFromNotifs('employer', this.cookieService.get('posted_by_id'))
      this.cookieService.delete('role', '/')
      this.cookieService.delete('posted_by_id', '/')
      this.cookieService.delete('company', '/')
      this.cookieService.delete('name', '/')
      const cookie: {} = this.cookieService.getAll()
      console.log(cookie)
      this.router.navigate(['../index'])
    }
  }

  removeNotifs() {
    this.notifCount = 0
    this.notificationService.editNotification("remove")
    if(this.router.url.split('/')[2] === "apps") {
      this.notificationService.editNotification("refresh")
    }
  }

  ngOnDestroy() {
    if(this._notifSub) {
      this._notifSub.unsubscribe()
    }
    if(this._removerSub) {
      this._removerSub.unsubscribe()
    }
  }
}
