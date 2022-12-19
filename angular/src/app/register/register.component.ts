import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
// import { filter } from 'rxjs/operators'
// import 'rxjs/add/operator/filter'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Seeker } from '../seeker'
import { SeekerService } from '../services/seeker.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  params?: any
  role?: string
  account_conflict: boolean
  seekerForm: FormGroup;
  email: FormControl;
  password: FormControl;
  lastname: FormControl;
  firstname: FormControl;

  constructor(private route: ActivatedRoute, 
              public seekerService: SeekerService,
              private router: Router
             ) { }

  ngOnInit() {
    this.account_conflict = false
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ])
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
    this.lastname = new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ])
    this.firstname = new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ])
    this.seekerForm = new FormGroup({
      'email': this.email,
      'password': this.password,
      'lastname': this.lastname,
      'firstname': this.firstname
    })
  }

  checkRole(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.params = {...params.keys, ...params}
    })
    this.role = this.params.role
  }

  onSubmit(): void {
    console.log(this.seekerForm.value)
    this.seekerService.addSeeker(this.seekerForm.value).subscribe(
      (data) => {
        console.log('Registration complete!')
        alert('Registration complete! Please log in to continue.')
        this.account_conflict = false
        this.router.navigate(['/login'])
      },
      (err) => {
        console.error(err)
        if(err.error.error.errorCode === 1001) {
          this.account_conflict = true
        }
        console.log(this.account_conflict)
      }
    )
  }
}
