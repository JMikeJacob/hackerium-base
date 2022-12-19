import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SeekerService } from '../services/seeker.service'
import { contactValidator } from '../shared/contact-validator.directive'
import { EmployerService } from '../services/employer.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-register-employer',
  templateUrl: './register-employer.component.html',
  styleUrls: ['./register-employer.component.css']
})
export class RegisterEmployerComponent implements OnInit {
  params?: any
  role?: string
  account_conflict: boolean
  employerForm: FormGroup
  email: FormControl
  password: FormControl
  lastname: FormControl
  firstname: FormControl
  company: FormControl
  contact: FormControl

  constructor(public employerService: EmployerService, private router: Router) { }

  ngOnInit() {
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
    this.company = new FormControl('', [
      Validators.required
    ])
    this.contact = new FormControl('', [
      Validators.required,
      contactValidator(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
    ])
    this.employerForm = new FormGroup({
      'email': this.email,
      'password': this.password,
      'lastname': this.lastname,
      'firstname': this.firstname,
      'company': this.company,
      'contact': this.contact
    })
  }

  onSubmit(): void {
    console.log(this.employerForm.value)
    this.employerService.addEmployer(this.employerForm.value).subscribe(
      (data) => {
        alert('Registration complete!')
        console.log(data) //show modal
        this.router.navigate(['/login'], {queryParams: {"role": "employer"}})
      },
      (err) => {
        console.log(err)
        if(err.error.error.errorCode === 1002) {
          this.account_conflict = true
        }
        console.log(this.account_conflict)
      }
    )
  }

}
