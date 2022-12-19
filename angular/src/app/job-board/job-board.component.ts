import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'

import { Job } from '../job'
import { JobService } from '../services/job.service'
import { OptionsService } from '../services/options.service'
// import { EventEmitter } from 'events';

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.css']
})
export class JobBoardComponent implements OnInit, OnDestroy {
  // @Input() job:Job
  // @Output() job_ad: EventEmitter<Job> = new EventEmitter()
  logged_in: boolean
  loading: boolean
  jobs: Job[]
  count: Observable<any>
  page: number
  pageCount: number
  onFirstPage: boolean
  onLastPage: boolean
  routePage: number
  pageEvent = PageEvent
  _querySub: Subscription
  sortValue: string
  sorts: any[]
  filters: any
  querying: boolean
  forQuery: boolean

  search: string
  filter: any
  order: string
  how: string

  navigator: string

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private router: Router,
              private optionsService: OptionsService
            ) { }

  ngOnInit() {
    if(this.router.url.split('/')[1] === "seeker") this.navigator = "../seeker/jobs/"
    else this.navigator = "../jobs/"
    this.forQuery = true
    this.querying = false
    this.search = ""
    this.filter = {}
    this.order = ""
    this.how = ""
    this.filters = {}
    this.sorts = []
    this.optionsService.loadData().subscribe(
      res => {
        this.sorts = res.data.sorts
      },
      err => console.error(err)
    )
    this.sortValue = "Sort: Latest to Oldest"
    this.loading = true
    this.jobs = []
    this.logged_in = false
    // this.count = NaN
    // this.getPageNumber()
    
    this.route.params.subscribe((res) => {
      this.page = res.page
      console.error(this.page)

      if(isNaN(this.page)) {
        console.log("hoy")

        this.router.navigate(['/../jobs', 1])
        //navigate to error page
      }
      else if(!this.page || this.page === 0) {
        console.log("hoy")
        this.page = 1
      }
      if(!this.forQuery) {
        console.log(this.forQuery)
        console.log("groot")
        let filter = ""
        if(this.filters['l']) filter += `l=${this.filters['l']}&`
        if(this.filters['t']) filter += `t=${this.filters['t']}&`
        if(this.filters['f']) filter += `f=${this.filters['f']}&`
        this.getJobsByPage(this.page, this.order, this.how, filter, this.search)
      }
    })

    this._querySub = this.route.queryParamMap.subscribe(
      (res:any) => {
          let filter = ""
          if(res.params.l) {filter += `l=${res.params.l}&`; this.filters['l'] = res.params.l; this.filter['l'] = res.params.l.split(','); this.filter['l'].pop()}
          if(res.params.t) {filter += `t=${res.params.t}&`; this.filters['t'] = res.params.t; this.filter['t'] = res.params.t.split(','); this.filter['t'].pop()}
          if(res.params.f) {filter += `f=${res.params.f}&`; this.filters['f'] = res.params.f; this.filter['f'] = res.params.f.split(','); this.filter['f'].pop()}
          this.search = res.params.search
          this.order = res.params.order
          this.how = res.params.how
        if(this.forQuery) {
          console.log(this.forQuery)
          this.getJobsByPage(this.page, res.params.order, res.params.how, filter, res.params.search)
          this.forQuery = false
          console.log(this.forQuery)
        }
        
      },
      err => console.error(err)
    )
  }

  getJobsByPage(page:number, order?:string, how?:string, filter?:string, search?:string) {
    // const start = 10 * (this.page - 1)
    console.log("firepower")
    this.querying = true
    // console.log(page)
    this.jobService.getJobsPerPage(page, 5, order, how, filter, search).subscribe(
      (res) => {
        console.log(res.data)
        this.count = res.data.count
        this.pageCount = Math.trunc((res.data.count-1)/5) + 1;
        if(this.pageCount <= 0) this.pageCount = 1;
        this.onFirstPage = (this.page == 1);
        this.onLastPage = (this.page == this.pageCount);
        if(res.data.jobs) {
          this.jobs = res.data.jobs
        }
        else {
          this.jobs = []
        }
        this.loading = false
        this.querying = false
      },
      (err) => {
        console.error(err)
      }
    )
  }

  // loadPage(event?: PageEvent) {
  //   const parameters = {}
  //   this.forQuery = false
  //   if(this.search) parameters['search'] = this.search
  //   if(this.order) parameters['order'] = this.order
  //   if(this.how) parameters['how'] = this.how
  //   if(this.filters['l']) parameters['l'] = this.filters['l']
  //   if(this.filters['t']) parameters['t'] = this.filters['t']
  //   if(this.filters['f']) parameters['f'] = this.filters['f']
  //   console.log(parameters)
  //   this.router.navigate([this.navigator, event.pageIndex + 1], {queryParams: parameters})
  // }

  loadPage(page: any) {
    const parameters = {};
    this.forQuery = false;
    if(this.search) parameters['search'] = this.search;
    if(this.order) parameters['order'] = this.order;
    if(this.how) parameters['how'] = this.how;
    if(this.filters['l']) parameters['l'] = this.filters['l'];
    if(this.filters['t']) parameters['t'] = this.filters['t'];
    if(this.filters['f']) parameters['f'] = this.filters['f'];
    console.log(parameters);
    this.router.navigate([this.navigator, page], {queryParams: parameters});
  }

  selected(event) {
    console.log(event.source.value)
    this.sortValue = event.source.value
    const options = this.sorts[event.source.value]
    this.route.queryParamMap.subscribe(
      (res:any) => {
        let filter = ""
        if(res.params.l) filter += `l=${res.params.l}&`
        if(res.params.t) filter += `t=${res.params.t}&`
        if(res.params.f) filter += `f=${res.params.f}&`
        // this.getJobsByPage(this.page, options.order, options.how, res.params.filter, res.params.search)
        const parameters = {}
        parameters['order'] = options.order
        parameters['how'] = options.how
        if(res.params.search) parameters['search'] = res.params.search
        if(res.params.l) parameters['l'] = res.params.l
        if(res.params.t) parameters['t'] = res.params.t
        if(res.params.f) parameters['f'] = res.params.f
        parameters['filter'] = res.params.filter
        this.forQuery = true
        this.router.navigate([`${this.navigator}1`], {queryParams: parameters})
      },
      err => console.error(err)
    )
  }

  filterEventHandler(event: any) {
    console.error(event)
    let levels = "l="
    let types = "t="
    let fields = "f="
    let filter = ""
    if(event.levels && event.levels !== []) {
      event.levels.forEach((tag) => {
        levels += `${tag},`
      })
      filter += "&" + levels
    }
    if(event.types && event.types !== []) {
      event.types.forEach((tag) => {
        types += `${tag},`
      })
      filter += "&" + types
    }
    if(event.fields && event.fields !== []) {
      event.fields.forEach((tag) => {
        fields += `${tag},`
      })
      filter += "&" + fields
    }
    console.log(filter)
    if(levels !== "l=") this.filters['l'] = levels.split('=')[1]
    else delete this.filters['l']
    if(types !== "t=") this.filters['t'] = types.split('=')[1]
    else delete this.filters['t']
    if(fields !== "f=") this.filters['f'] = fields.split('=')[1]
    else delete this.filters['f']
    const parameters = {}
    this.forQuery = true
    if(this.search) parameters['search'] = this.search
    if(this.order) parameters['order'] = this.order
    if(this.how) parameters['how'] = this.how
    if(this.filters['l']) parameters['l'] = this.filters['l']
    if(this.filters['t']) parameters['t'] = this.filters['t']
    if(this.filters['f']) parameters['f'] = this.filters['f']
    console.log(parameters)
    this.router.navigate([`${this.navigator}1`], {queryParams: parameters})
    // this.route.queryParamMap.subscribe(
    //   (res:any) => {
    //     // this.getJobsByPage(this.page, res.params.order, res.params.how, filter, res.params.search)
    //     const parameters = {}
    //     if(res.params.order) parameters['order'] = res.params.order
    //     if(res.params.how) parameters['how'] = res.params.how
    //     if(res.params.search) parameters['search'] = res.params.search
    //     if(levels !== "l=") parameters['l'] = levels.split('=')[1]
    //     if(types !== "t=") parameters['t'] = types.split('=')[1]
    //     if(fields !== "f=") parameters['f'] = fields.split('=')[1]
    //     this.forQuery = true
    //     console.error(parameters)
    //     this.router.navigate([`/jobs/1`], {queryParams: parameters})
    //   },
    //   err => console.error(err)
    // )
  }

  searchEventHandler(event: string) {
    console.error(event)
    if(event) this.search = event
    else this.search = ""
    const parameters = {}
    this.forQuery = true
    if(this.search) parameters['search'] = this.search
    if(this.order) parameters['order'] = this.order
    if(this.how) parameters['how'] = this.how
    if(this.filters['l']) parameters['l'] = this.filters['l']
    if(this.filters['t']) parameters['t'] = this.filters['t']
    if(this.filters['f']) parameters['f'] = this.filters['f']
    this.router.navigate([`${this.navigator}1`], {queryParams: parameters})
    // this.route.queryParamMap.subscribe(
    //   (res:any) => {
    //     // if()
    //     let filter = ""
    //     if(res.params.l) filter += `l=${res.params.l}&`
    //     if(res.params.t) filter += `t=${res.params.t}&`
    //     if(res.params.f) filter += `f=${res.params.f}&`
    //     // this.getJobsByPage(this.page, res.params.order, res.params.how, filter, event)
    //     const parameters = {}
    //     parameters['order'] = res.params.order
    //     parameters['how'] = res.params.how
    //     if(event) parameters['search'] = event
    //     if(res.params.l) parameters['l'] = res.params.l
    //     if(res.params.t) parameters['t'] = res.params.t
    //     if(res.params.f) parameters['f'] = res.params.f
    //     this.forQuery = true
    //     this.router.navigate([`/jobs/1`], {queryParams: parameters})
    //   },
    //   err => console.error(err)
    // )
  }



  ngOnDestroy() {
    this._querySub.unsubscribe()
  }
}
