import { Component, OnInit } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

import { Test } from '../test';
import { TestService } from '../services/test.service';
import { ThrowStmt } from '@angular/compiler';
import { NumberFilter } from 'aws-sdk/clients/securityhub';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employer-test-board',
  templateUrl: './employer-test-board.component.html',
  styleUrls: ['./employer-test-board.component.css']
})
export class EmployerTestBoardComponent implements OnInit {

  logged_in: boolean
  loading: boolean
  tests: any
  companyId: string
  count: number
  page: number
  pageCount: number
  limit: number

  onFirstPage: boolean;
  onLastPage: boolean;

  constructor(public testService: TestService,
              public cookieService: CookieService,
              private route: ActivatedRoute,
              private router: Router
            ) { }

  ngOnInit() {
    this.loading = true;
    this.logged_in = false;
    this.limit = 5;
    this.companyId = this.cookieService.get('posted_by_id');
    this.route.params.subscribe((res) => {
      console.log(res)
      if(isNaN(res.page)) {
        this.router.navigate(['/../employer/tests', 1]);
      }
      else if(!res.page || res.page <= 0) {
        this.page = 1;
      }
      else {
        this.page = res.page;
      }
      console.log(this.page)
      this.getTestsPerPageEmployer(this.page);
    })
  }

  getTestsPerPageEmployer(page:number, order?:string, how?:string) {
    this.testService.getTestsPerPageEmployer(this.companyId, page, this.limit, order, how).subscribe(
      (res) => {
        console.log(res.data);
        if(res.data.tests) {
          this.count = res.data.count;
          this.pageCount = Math.trunc((this.count-1)/this.limit) + 1;
          if(this.pageCount <= 0) this.pageCount = 1;
          this.tests = res.data.tests;
          this.onFirstPage = (this.page == 1);
          this.onLastPage = (this.page == this.pageCount);
          console.log(this.onFirstPage)
        }
        else {
          this.count = res.data.count;
        }
        this.loading = false;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getTestsCompany() {
    console.log(this.companyId);
    this.testService.getAllTestsCompany(this.companyId).subscribe(
      (res) => {
        console.log(res.data);
        if(res.data.tests) {
          this.count = res.data.count;
          this.pageCount = Math.trunc((this.count-1)/this.limit) + 1;
          if(this.pageCount <= 0) this.pageCount = 1;
          this.tests = res.data.tests;
        }
        else {
          this.count = res.data.count;
        }
        this.loading = false;
      },
      (err) => {
        console.error(err);
      }
    )
  }
}
