import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../services/job.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-submit-test-page',
  templateUrl: './submit-test-page.component.html',
  styleUrls: ['./submit-test-page.component.css']
})
export class SubmitTestPageComponent implements OnInit {

  __querySub: Subscription

  loading: boolean
  appData: any
  
  constructor(private jobService: JobService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.route.queryParamMap.subscribe(
      (res:any) => {
        console.log(res);
        if(!res.params.appid || !res.params.testid) {
          this.returnToAppsPage();
        }
        else {
          this.getApplicationData(res.params.appid);
        }
      }
    )
  }

  getApplicationData(appId) {
    this.jobService.getApplicationTestResult(appId).subscribe(
      (res) => {
        console.log(res);
        if(res.applied) {
          if(res.data.status !== 'reviewing' && res.data.status !== 'testing') {
            this.returnToAppsPage();
          }
          this.appData = res.data;
          this.loading = false;
        }
      },
      (err) => {
        console.error(err);
        this.returnToAppsPage();
      }
    )
  }

  returnToAppsPage() {
    this.router.navigate(['../../../1'], {relativeTo: this.route});
  }

}
