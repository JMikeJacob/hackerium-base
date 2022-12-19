import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { Location, DatePipe } from '@angular/common'
import { FormGroup, FormControl, Validators, Form } from '@angular/forms'
import { JobService } from '../services/job.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Company } from '../company'
import { contactValidator } from '../shared/contact-validator.directive'
import { EstablishmentValidatorDirective } from '../shared/establishment-validator.directive'
import { DuplicateValidatorDirective } from '../shared/duplicate-validator.directive'
import { EditCompanyService } from '../services/edit-company.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { QuillEditorComponent } from 'ngx-quill'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { CompanyService } from '../services/company.service'
import { CookieService } from 'ngx-cookie-service'
import { FileService } from '../services/file.service'

import { LoadingComponent } from '../loading/loading.component'
import { ErrorModalComponent } from '../error-modal/error-modal.component'

const image_exts = [
  "jpeg",
  "jpg",
  "png"
]

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  company: Company
  type_options: string[]
  level_options: string[]
  posted_by_id: string
  date_posted: number
  qualifications: string //temporary
  email: string
  pic: string
  pic_url: string
  tmp_url: string
  file: any

  companyForm: FormGroup 
  name: FormControl
  website: FormControl
  location: FormControl
  establishment_date: FormControl
  description: FormControl
  contact_no: FormControl
  image: FormControl
  //testing
  id: string

  @ViewChild('descriptionQuill', {
    static: true
  }) descriptionQuill: QuillEditorComponent

  constructor(public jobService: JobService,
              private router: Router,
              private route: ActivatedRoute,
              private Location: Location,
              public companyService: CompanyService,
              private establishmentValidatorDirective: EstablishmentValidatorDirective,
              private duplicateValidatorDirective: DuplicateValidatorDirective,
              private editCompanyService: EditCompanyService,
              public fileService: FileService,
              public modalService: NgbModal,
              public cookieService: CookieService //testing
              ) { }

  ngOnInit() {
    this.pic_url = "none"
    this.pic = ""
    this.posted_by_id = this.cookieService.get('posted_by_id') //testing
    // this.type_options = this.types.types
    // this.level_options = this.levels.levels
    this.qualifications = "" //temp
    this.name = new FormControl('', [
      Validators.required
    ])
    this.website = new FormControl('')
    this.location = new FormControl('')
    this.description = new FormControl('')
    // this.qualifications = new FormControl('', [
    //   Validators.required
    // ])
    this.establishment_date = new FormControl('', [
      this.establishmentValidatorDirective.establishmentValidator()
    ])
    this.contact_no = new FormControl('', [
      Validators.required,
      contactValidator(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
    ])
    this.image = new FormControl('', [
      this.duplicateValidatorDirective.fileValidator(image_exts)
    ])
    this.companyForm = new FormGroup({
      'name': this.name,
      'website': this.website,
      'location': this.location,
      'description': this.description,
      'establishment_date': this.establishment_date,
      'contact_no': this.contact_no,
      'image': this.image
    })
    this.getCompanyProfile(this.posted_by_id)

    this.companyForm.controls.description.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe()

    this.descriptionQuill.onContentChanged.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe()
  }

  getCompanyProfile(id:string) {
    this.editCompanyService.loadCompany("edit", id).subscribe(
      (res) => {
        console.log(res)
        const dp = new DatePipe(navigator.language)
        this.company = res.success.data
        this.email = res.success.data.email
        let estdate = res.success.data.establishment_date || null
        if(estdate) estdate = dp.transform(new Date(+res.success.data.establishment_date), 'yyyy-MM-dd')
        this.companyForm.patchValue({
          name: res.success.data.name,
          website: res.success.data.website,
          location: res.success.data.location,
          description:res.success.data.description,
          establishment_date: estdate,
          contact_no: res.success.data.contact_no
        })
        if(res.success.data.pic_url) {
          if(res.success.data.pic_url === "") {
            this.pic_url = '../../assets/img/placeholder.png'
          }
          else {
            this.pic_url = res.success.data.pic_url
            this.tmp_url = this.pic_url
          }
        }
        else {
          this.pic_url = '../../assets/img/placeholder.png'
        }
        this.editCompanyService.delCompany()
      },
      (err) => {
        console.error(err)
        // console.log("yo")
      }
    )
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader()

      const [file] = event.target.files
      const ext = file.name.split('.')[file.name.split('.').length-1]
      if(image_exts.includes(ext)) {
        this.file = file
        this.pic = file.name
      }
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        if(image_exts.includes(ext)) {
          this.pic_url = event.target.result
        }
      }
    }
  }

  onSubmit() {
    const modalRef = this.modalService.open(LoadingComponent,{ backdrop : 'static', keyboard : false })
    console.log(this.companyForm.value)
    this.companyForm.value.establishment_date = new Date(this.companyForm.value.establishment_date).getTime() 
    if(this.pic !== "") {
      this.companyForm.value.pic_url = this.pic.split('.')[0] + '_' + new Date().getTime() + '_' + '.' + this.pic.split('.')[this.pic.split('.').length-1]
      this.fileService.getSignedUrl({pic_url: this.companyForm.value.pic_url}).subscribe(
        (res) => {
          const contenttype = 'image/' + this.pic.split('.')[this.pic.split('.').length-1]
          this.fileService.uploadToAWSS3(res.data.pic_url,contenttype, this.file).subscribe(
            () => this.editCompany(res.data.pic_url, modalRef),
            (err) => {
              console.error(err)
              modalRef.close()
              const errorModal = this.modalService.open(ErrorModalComponent)
              errorModal.componentInstance.dialog = {
                header: "Update Failed",
                message: "There was an error in updating your profile. Please try again."
              }
              errorModal.result.then(
                () => {
                  this.editCompanyService.sendCompany(this.company).subscribe(
                    () => this.Location.back(),
                    (err) => console.error(err)
                  )
                },
                (err) => {
                  console.error(err)
                }
              )
            }
          )    
        },
        (err) => {
          console.error(err)
        }
      )
    }
    else {
      this.editCompany(this.tmp_url, modalRef)
    }
  }

  editCompany(pic_url:string, modalRef) {
    this.companyService.editCompanyProfile(this.posted_by_id, this.companyForm.value).subscribe(
      (res) => {
        const company = this.companyForm.value
        company.pic_url = pic_url
        company.email = this.email
        company.posted_by_id = this.posted_by_id
        company.edited = true
        this.editCompanyService.sendCompany(company)
        modalRef.close()
        this.Location.back()
      },
      (err) => {
        console.error(err)
      })
  }

  goBack() {
    this.editCompanyService.sendCompany(this.company).subscribe(
      () => this.Location.back(),
      (err) => console.error(err)
    )
  }
  
  updateUrl(event) {
    if(this.company.pic_url_old !== "" && this.company.pic_url_old !== event.srcElement.currentSrc) {
      this.pic_url = this.company.pic_url_old
    }
    else {
      this.pic_url = '../../assets/img/placeholder.png'
    }
  }
}
