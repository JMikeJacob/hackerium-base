import { Component, OnInit, Input } from '@angular/core'
import { JobService } from  '../services/job.service'
import { TestService } from '../services/test.service'
import { NotificationService } from '../services/notification.service'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-employer-app-item',
  templateUrl: './employer-app-item.component.html',
  styleUrls: ['./employer-app-item.component.css']
})
export class EmployerAppItemComponent implements OnInit {
  @Input() app: any
  @Input() tests: any
  status: string
  post_closed: boolean
  id: string

  selected: any
  testLoading: boolean
  interviewLink: string

  constructor(public jobService: JobService,
              private notificationService: NotificationService,
              private testService: TestService,
              private cookieService: CookieService) { }

  ngOnInit() {
    console.log(this.tests);
    if(this.tests.length > 0) {
      this.selected = this.tests[0].test_id;
    }
    this.id = this.cookieService.get('posted_by_id');
    this.status = this.app.status;
    console.log(this.app)
    if(this.app.is_open==="no" && this.app.status==="pending") {
      this.post_closed = true
    }
    else {
      this.post_closed = false
    }
  }

  accept() {
    this.jobService.changeApplicationStatus(this.app.user_id, this.app.app_id, "accepted").subscribe(
      (res) => {
        console.log(res)
        this.status = "accepted"
        this.notificationService.respondNotification({
          to: this.app.user_id,
          from: this.id,
          message: `You have been accepted for the ${this.app.job_name} position!`,
          type: "accept"
        })
      },
      (err) => {
        console.error(err)
      }
    )
  }

  reject() {
    this.jobService.changeApplicationStatus(this.app.user_id, this.app.app_id, "rejected").subscribe(
      (res) => {
        console.log(res)
        this.status = "rejected"
      },
      (err) => {
        console.error(err)
      }
    )
  }

  selectOption(value) {
    this.selected = value;
    console.log(this.selected);
  }

  sendTest() {
    console.log(this.selected)
    this.jobService.sendApplicationTest(this.app.app_id, this.selected, 'testing').subscribe(
      (res) => {
        console.log(res);
        this.status = "testing";
      },
      (err) => {
        console.error(err);
      }
    )
  }
}
