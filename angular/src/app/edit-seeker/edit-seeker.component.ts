import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SeekerService } from '../services/seeker.service'
import { CookieService } from 'ngx-cookie-service'
import { Seeker } from '../seeker'

@Component({
  selector: 'app-edit-seeker',
  templateUrl: './edit-seeker.component.html',
  styleUrls: ['./edit-seeker.component.css']
})
export class EditSeekerComponent implements OnInit {

  email: FormControl
  password: FormControl
  lastname: FormControl
  firstname: FormControl
  seekerForm: FormGroup

  seeker: Seeker
  editing: boolean
  id: string
  account_conflict: boolean

  constructor(public seekerService: SeekerService,
              private cookieService: CookieService) { }

  ngOnInit() {
    this.account_conflict = false
    this.editing = false
    this.id = this.cookieService.get('user_id')
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
    this.seekerForm = new FormGroup({
      'email': this.email,
      'password': this.password,
      'lastname': this.lastname,
      'firstname': this.firstname
    })
    this.getSeeker(this.id)
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
    this.email.reset({value: this.seeker.email, disabled: true})
    this.lastname.reset({value: this.seeker.lastname, disabled: true})
    this.firstname.reset({value: this.seeker.firstname, disabled: true})
    this.password.reset({value: this.seeker.password, disabled: true})
  }

  getSeeker(id:string) {
    this.seekerService.getSeekerAccount(id).subscribe(
      (res) => {     
        console.log(res)
        this.seeker = res.data
        this.seeker.lastname = res.data.last_name
        this.seeker.firstname = res.data.first_name
        console.log(this.seeker.email)
        this.seekerForm.patchValue({
          email: res.data.email,
          password: res.data.password,
          lastname: res.data.last_name,
          firstname: res.data.first_name
        })
      }
    )
  }

  onSubmit() {
    console.log(this.seekerForm.value)
    this.seekerService.editSeekerAccount({
      id: this.id, 
      data: this.seekerForm.value
    }).subscribe(
      (data) => {
        alert('Credentials updated!')
        this.editing = false
        this.cookieService.set('name', this.firstname.value + " " + this.lastname.value, null, '/')
        this.seeker = {
          id: this.id,
          email: this.email.value,
          password: this.password.value,
          first_name: this.firstname.value,
          last_name: this.lastname.value,
          firstname: this.firstname.value,
          lastname: this.lastname.value
        };
        console.log(this.seeker)
        this.account_conflict = false
        this.email.disable()
        this.password.disable()
        this.firstname.disable()
        this.lastname.disable()
      },
      (err) => {
        console.log(err)
        //error page
        if(err.error.error.errorCode === 1103) {
          this.account_conflict = true
        }
        console.log(this.account_conflict)
      }
    )
  }

}
