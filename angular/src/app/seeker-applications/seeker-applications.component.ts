import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

import { CookieService } from 'ngx-cookie-service'

import { Job } from '../job'
import { JobService } from '../services/job.service'
import { Subscription } from 'rxjs'
import { Notification } from '../notification'
import { NotificationService } from '../services/notification.service'

@Component({
  selector: 'app-seeker-applications',
  templateUrl: './seeker-applications.component.html',
  styleUrls: ['./seeker-applications.component.css']
})
export class SeekerApplicationsComponent implements OnInit {
  apps: any[]
  count: Observable<any>
  loading: boolean
  hasApps: boolean
  page: number
  id: string
  pageEvent = PageEvent  
  accepts: Notification[]
  _notifSub: Subscription
  _removerSub: Subscription


  private appPage = true

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private router: Router,
              public cookieService: CookieService,
              public notificationService: NotificationService
            ) { }

  ngOnInit() {
    this.accepts = []
    // this.count = NaN
    // this.getPageNumber()
    this.loading = true
    this.hasApps = false
    this.route.params.subscribe((res) => {
      this.page = res.page
      this.id = this.cookieService.get('user_id')
      if(isNaN(this.page)) {
        this.router.navigate(['/../apps', 1])
        //navigate to error page
      }
      else if(!this.page || this.page === 0) {
        this.page = 1
      }
      this.getAppsByPage(this.id, this.page)
    })
    this._notifSub = this.notificationService.notification.subscribe(
      (notif) => {
        if(notif.type === "accept") {
          this.accepts.push(notif)
        }
      }
    )
    this._removerSub = this.notificationService.editNotification$.subscribe(
      (res) => {
        if(res === "remove") {
          this.accepts = []
        }
        else if(res === "refresh") {
          this.getAppsByPage(this.id, this.page, true)
        }
      }
    )
  }

  getAppsByPage(id:string, page:number, from?:boolean) {
    // const start = 10 * (this.page - 1)
    this.jobService.getApplicationsSeeker(id, page).subscribe(
      (res) => {
        console.log(res.data)
        this.count = res.data.count
        if(res.data.apps) {
          this.apps = res.data.apps
          this.hasApps = true
        }
        this.loading = false
        if(from) {
          this.accepts = []
          this.notificationService.editNotification("remove")
        }
      },
      (err) => {
        console.error(err)
      }
    )
  }

  loadPage(event?: PageEvent) {
    this.router.navigate([`../apps/`, event.pageIndex + 1])
  }

  removeNotifs() {
    this.notificationService.editNotification("remove")
    this.accepts = []
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


/*
 
*/