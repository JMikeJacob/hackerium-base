import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { EmployerService } from '../services/employer.service'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-edit-employer',
  templateUrl: './edit-employer.component.html',
  styleUrls: ['./edit-employer.component.css']
})
export class EditEmployerComponent implements OnInit {

  email: FormControl
  password: FormControl
  lastname: FormControl
  firstname: FormControl
  employerForm: FormGroup

  employer: any
  editing: boolean
  id: string

  constructor(public employerService: EmployerService,
              private cookieService: CookieService) { }

  ngOnInit() {
    this.editing = false
    this.id = this.cookieService.get('posted_by_id')
    console.log(this.id)
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
    this.email.disable()
    this.password.disable()
    this.firstname.disable()
    this.lastname.disable()
    this.employerForm = new FormGroup({
      'email': this.email,
      'password': this.password,
      'lastname': this.lastname,
      'firstname': this.firstname
    })
    this.getEmployer(this.id)
  }

  onEdit() {
    this.editing = true
    this.email.enable()
    this.password.enable()
    this.lastname.enable()
    this.firstname.enable()
  }

  cancelEdit() {
    this.editing = false
    this.email.reset({value: this.employer.email, disabled: true})
    this.lastname.reset({value: this.employer.last_name, disabled: true})
    this.firstname.reset({value: this.employer.first_name, disabled: true})
    this.password.reset({value: this.employer.password, disabled: true})
  }

  getEmployer(id:string) {
    this.employerService.getEmployerAccount(id).subscribe(
      (res) => {
        console.log(res)
        this.employer = res.data
        this.employer.lastname = res.data.last_name
        this.employer.firstname = res.data.first_name
        console.log(this.employer.email)
        this.employerForm.patchValue({
          email: res.data.email,
          password: res.data.password,
          lastname: res.data.last_name,
          firstname: res.data.first_name
        })
      }
    )
  }

  onSubmit() {
    console.log(this.employerForm.value)
    this.employerService.editEmployerAccount(this.id, this.employerForm.value).subscribe(
      (data) => {
        alert('Credentials updated!')
        this.editing = false
        this.employer = this.employerForm.value
        this.email.disable()
        this.password.disable()
        this.firstname.disable()
        this.lastname.disable()
      },
      (err) => {
        console.log(err)
        //error page
      }
    )
  }

}
