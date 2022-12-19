import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

import { CookieService } from 'ngx-cookie-service'

import { Job } from '../job'
import { JobService } from '../services/job.service'
import { TestService } from '../services/test.service'
import { NotificationService } from '../services/notification.service'

@Component({
  selector: 'app-employer-applications',
  templateUrl: './employer-applications.component.html',
  styleUrls: ['./employer-applications.component.css']
})
export class EmployerApplicationsComponent implements OnInit {
  loading: boolean
  apps: any[]
  count: Observable<any>
  app_count: number
  page: number
  id: string
  pageEvent = PageEvent
  set: boolean
  notifs: any[]
  _notifSub: Subscription
  _removerSub: Subscription

  tests: any[]

  constructor(public jobService: JobService,
              public testService: TestService,
              private route: ActivatedRoute,
              private router: Router,
              public cookieService: CookieService,
              private notificationService: NotificationService
            ) { }

  ngOnInit() {
    // this.count = NaN
    // this.getPageNumber()
    this.notifs = []
    this.app_count = 0
    this.set = false
    this.loading = true
    this.apps = []
    this.route.params.subscribe((res) => {
      this.page = res.page
      this.id = this.cookieService.get('posted_by_id')
      if(isNaN(this.page)) {
        this.router.navigate(['/../apps', 1])
        //navigate to error page
      }
      else if(!this.page || this.page === 0) {
        this.page = 1
      }
      this.getAppsByPage(this.id, this.page)
      this.set = true
    })
    this.notifs = this.notificationService.getNotifications()
    console.log(this.notifs)
    this._notifSub = this.notificationService.notification.subscribe(
      notif => {
        this.notifs.push(notif)
        this.app_count = notif.count
      }
    )
    this._removerSub = this.notificationService.editNotification$.subscribe(
      res => {
        if(res === "remove" || res === "remove not navbar") {
          this.notifs = []
          this.app_count = 0
        }
        else if(res === "refresh") {
          this.getAppsByPage(this.id, this.page, true)
        }
      }
    )
  }

  getAppsByPage(id:string, page:number, from?:boolean) {
    // const start = 10 * (this.page - 1)
    this.jobService.getApplicationsEmployer(id, page).subscribe(
      (res) => {
        console.log(res.data)
        this.count = res.data.count
        if(res.data.apps) {
          this.apps = res.data.apps
        }
        this.getTests();
        if(from) {
          this.notifs = []
          this.app_count = 0
          this.notificationService.editNotification("remove")
        }
      },
      (err) => {
        console.error(err)
      }
    )
  }

  getTests() {
    this.testService.getAllTestsCompany(this.id).subscribe(
      (res) => {
        console.log(res);
        this.tests = res.data.tests;
        this.loading = false;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  loadPage(event?: PageEvent) {
    this.router.navigate([`../apps/`, event.pageIndex + 1])
  }

  removeNotifs() {
    this.notifs = []
    this.notificationService.editNotification("remove not navbar")
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
