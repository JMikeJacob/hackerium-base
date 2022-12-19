import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
// import { filter } from 'rxjs/operators'
// import 'rxjs/add/operator/filter'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Seeker } from '../seeker'
import { SeekerService } from '../services/seeker.service'
import { EmployerService } from '../services/employer.service'
import { CookieService } from 'ngx-cookie-service'
import { NotificationService } from '../services/notification.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  params?: any
  role?: string
  change?: string
  logged_in: boolean
  seeker: any
  invalid: boolean

  registerLink: string

  loginForm: FormGroup
  email: FormControl
  password: FormControl

  constructor(private route: ActivatedRoute, 
              private router: Router,
              public seekerService: SeekerService, 
              public employerService: EmployerService,
              public cookieService: CookieService,
              private notificationService: NotificationService
            ) { }

  ngOnInit() {
    if(this.cookieService.get('loggedIn')) {
      this.router.navigate([`../${this.cookieService.get('role')}/dashboard`])
    }
    this.invalid = false
    this.checkRole()
    this.logged_in = false
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ])
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
    this.loginForm = new FormGroup({
      'email': this.email,
      'password': this.password
    })
  }

  checkRole(): void {
    this.route.queryParamMap.subscribe((params:any) => {
      // this.params = {...params.keys, ...params}
      console.log(params)
      this.role = params.params.role
      this.change ='applicant'
      if(this.role != 'employer') {
        this.role = 'applicant'
        this.change = 'employer'
      }
      console.log(this.role)
      this.registerLink = `/register/${this.role}`;
    })
    // this.role = this.params.params.role
    
  }

  onSubmit(): void {
    // console.log(this.loginForm.value)
    if(this.role === 'employer') {
      this.employerService.loginEmployer(this.loginForm.value).subscribe(
        (data) => {
          console.log(data)
          this.invalid = false
          this.notificationService.subscribeToNotifs('employer', data.user.user_id, data.user.app_notifications)
          this.cookieService.set('role', 'employer', null, '/')
          /* FOR TESTING PURPOSES ONLY */
          this.cookieService.set('posted_by_id', data.user.user_id, null, '/')
          this.cookieService.set('name', data.user.first_name + " " + data.user.last_name, null, '/')
          this.cookieService.set('company', data.user.company_name, null, '/')
          this.cookieService.set('app_count', data.user.app_notifications, null, '/')
          /* */
          // this.router.navigate(['/employer/dashboard'])
          this.router.navigate(['/employer/jobs'])
      }, (err) => {
        console.log(err)
        this.invalid = true
      })
    }
    else {
      this.seekerService.loginSeeker(this.loginForm.value).subscribe(
        (data) => {
          console.log(data)
          this.invalid = false
          this.notificationService.subscribeToNotifs('seeker', data.user.user_id)
          this.cookieService.set('role', 'seeker', null, '/')
          this.cookieService.set('user_id', data.user.user_id, null, '/')
          this.cookieService.set('name', data.user.first_name + " " + data.user.last_name, null, '/')
          this.cookieService.set('last_name', data.user.last_name, null, '/')
          this.cookieService.set('first_name', data.user.first_name, null, '/')
          this.router.navigate(['/seeker/jobs'])
      }, (err) => {
        console.log(err)
        this.invalid = true
      })
    }
  }

  changeRole() {
    this.change = this.role
    this.role = this.role==='employer' ? 'applicant' : 'employer'
    if(this.role === 'employer') {
      this.router.navigate(['/login'], {queryParams: {role:'employer'}})
    }
    else {
      this.router.navigate(['/login'])
    }
    this.loginForm.reset()
    this.invalid = false
  }
}
