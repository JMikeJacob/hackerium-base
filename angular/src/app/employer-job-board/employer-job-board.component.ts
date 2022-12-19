import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

//testing
import { CookieService } from 'ngx-cookie-service'

import { Job } from '../job'
import { JobService } from '../services/job.service'
import { OptionsService } from '../services/options.service'

@Component({
  selector: 'app-employer-job-board',
  templateUrl: './employer-job-board.component.html',
  styleUrls: ['./employer-job-board.component.css']
})
export class EmployerJobBoardComponent implements OnInit {
  // @Output() job_ad: EventEmitter<Job> = new EventEmitter()
  logged_in: boolean
  loading: boolean
  jobs: Job[]
  count: number
  page: number
  routePage: number
  pageEvent = PageEvent
  _querySub: Subscription
  sortValue: string
  sorts: any[]
  limit: number

  navigator: string
  pageCount: number
  onFirstPage: boolean
  onLastPage: boolean

  //testing
  id: string

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private router: Router,
              public cookieService: CookieService,
              private optionsService: OptionsService
            ) { }

  ngOnInit() {
    this.navigator = "../employer/jobs/"
    this.limit = 5
    this.loading = true
    this.count = 0
    this.id = this.cookieService.get('posted_by_id')
    // this.getJobCountEmployer()
    this.logged_in = false
    // this.count = NaN
    // this.getPageNumber()
    this.sorts = []
    this.optionsService.loadData().subscribe(
      res => this.sorts = res.data.sorts,
      err => console.error(err)
    )
    this.sortValue = "Sort: Latest to Oldest"
    this.route.params.subscribe((res) => {
      this.page = res.page
      if(isNaN(this.page)) {
        this.router.navigate(['/../employer/jobs', 1])
        //navigate to error page
      }
      else if(!this.page || this.page === 0) {
        this.page = 1
      }
      this.getJobsByPageEmployer(this.page)
      this._querySub = this.route.queryParamMap.subscribe(
        (res:any) => {
          console.log("change")
          this.getJobsByPageEmployer(this.page, res.params.order, res.params.how)
        },
        err => console.error(err)
      )
    })
  }

  getJobsByPageEmployer(page:number, order?: string, how?:string) {
    // const start = 10 * (this.page - 1)
    this.jobService.getJobsPerPageEmployer(this.id,page,this.limit,order,how).subscribe(
      (res) => {
        console.log(res.data)
        if(res.data.jobs) {
          this.count = res.data.count
          this.jobs = res.data.jobs
          
        }
        else {
          this.count = res.data.count
        }
        this.pageCount = Math.trunc((res.data.count-1)/5) + 1;
        if(this.pageCount <= 0) this.pageCount = 1;
        this.onFirstPage = (this.page == 1);
        this.onLastPage = (this.page == this.pageCount);
        this.loading = false
      },
      (err) => {
        console.error(err)
      }
    )
  }

  loadPage(page) {
    this.router.navigate([`../employer/jobs/`, page]);
  }

  selected(event) {
    console.log(event.source.value)
    this.sortValue = event.source.value
    const options = this.sorts[event.source.value]
    this.router.navigate([`../employer/jobs/${this.page}`], {queryParams: {order:options.order, how:options.how}})
  }

  ngOnDestroy() {
    this._querySub.unsubscribe()
  }

}
