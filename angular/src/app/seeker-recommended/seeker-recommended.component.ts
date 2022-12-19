import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

import { Job } from '../job'
import { JobService } from '../services/job.service'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-seeker-recommended',
  templateUrl: './seeker-recommended.component.html',
  styleUrls: ['./seeker-recommended.component.css']
})
export class SeekerRecommendedComponent implements OnInit {
  jobs: Job[]
  id: string
  loading: boolean
  count: Observable<any>
  page: number
  routePage: number
  pageEvent = PageEvent

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private cookieService: CookieService,
              private router: Router
            ) { }

  ngOnInit() {
    // this.count = NaN
    // this.getPageNumber()
    this.jobs = []
    this.loading = true
    this.route.params.subscribe((res) => {
      this.id = this.cookieService.get('user_id')
      this.page = res.page
      if(isNaN(this.page)) {
        this.router.navigate(['/../jobs', 1])
        //navigate to error page
      }
      else if(!this.page || this.page === 0) {
        this.page = 1
      }
      this.getJobsByPage(this.page)
    })
  }

  getJobsByPage(page:number) {
    // const start = 10 * (this.page - 1)
    this.jobService.getRecommendedJobs(this.id, page).subscribe(
      (res) => {
        console.log(res.data)
        this.count = res.data.count
        this.jobs = res.data.jobs
        this.loading = false
      },
      (err) => {
        console.error(err)
      }
    )
  }

  loadPage(event?: PageEvent) {
    this.router.navigate([`../seeker/jobs/`, event.pageIndex + 1])
  }

}
