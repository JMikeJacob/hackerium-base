import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms'
import { Location, DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

import { EstablishmentValidatorDirective } from '../shared/establishment-validator.directive'
import { DuplicateValidatorDirective } from '../shared/duplicate-validator.directive'
import { contactValidator } from '../shared/contact-validator.directive'

import { OptionsService } from '../services/options.service'
import { FileService } from '../services/file.service'
import { EditSeekerProfileService } from '../services/edit-seeker-profile.service'
import { SeekerService } from '../services/seeker.service'
import { CookieService } from 'ngx-cookie-service'

import { Seeker } from '../seeker'

import { LoadingComponent } from '../loading/loading.component'

const image_exts = [
  "jpeg",
  "jpg",
  "png"
]

const resume_exts = [
  "pdf",
  "docx",
  "doc"
]
@Component({
  selector: 'app-edit-seeker-profile',
  templateUrl: './edit-seeker-profile.component.html',
  styleUrls: ['./edit-seeker-profile.component.css']
})
export class EditSeekerProfileComponent implements OnInit {
  seeker: Seeker

  id:string
  level_options: string[]
  skill_options: string[]
  field_options: string[]
  education_options: string[]
  gender_options: string[]
  pic_url: string

  //temp
  pic: string
  file: any
  resume: string
  old_resume: string
  resume_file: string

  profileForm: FormGroup
  skills: FormArray
  fields: FormArray
  contact_no: FormControl
  gender: FormControl
  birthdate: FormControl
  education: FormControl
  level: FormControl
  salary_per_month: FormControl
  image: FormControl
  resumeControl: FormControl
  tmpSeeker: Seeker

  constructor(private location: Location,
              private seekerService: SeekerService,
              private establishmentValidatorDirective: EstablishmentValidatorDirective,
              private duplicateValidatorDirective: DuplicateValidatorDirective,
              private cookieService: CookieService,
              private optionService: OptionsService,
              private editSeekerProfileService: EditSeekerProfileService,
              private fileService: FileService,
              public modalService: NgbModal) { }

  ngOnInit() {
    this.pic = ""
    this.pic_url = "none"
    this.resume = "No uploaded resume"
    this.old_resume = "No uploaded resume"
    this.seeker = new Seeker()
    this.optionService.loadData().subscribe(
      (res) => {
        this.field_options = res.data.fields
        this.skill_options = res.data.skills
        this.level_options = res.data.levels
        this.education_options = res.data.educations
        this.gender_options = res.data.genders
      },
      (err) => {
        console.error(err)
      }
    )
    this.id = this.cookieService.get('user_id')
    this.contact_no = new FormControl('', [
      contactValidator(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
    ])
    this.gender = new FormControl('')
    this.birthdate = new FormControl('', [
      this.establishmentValidatorDirective.establishmentValidator()
    ])
    this.education = new FormControl('')
    this.level = new FormControl('')
    this.image = new FormControl('', [
      this.duplicateValidatorDirective.fileValidator(image_exts)
    ])
    this.resumeControl = new FormControl('', [
      this.duplicateValidatorDirective.fileValidator(resume_exts)
    ])
    this.salary_per_month = new FormControl(0)
    this.skills = new FormArray([], [
      this.duplicateValidatorDirective.duplicateValidator()
    ])
    this.fields = new FormArray([], [
      this.duplicateValidatorDirective.duplicateValidator()
    ])
    this.profileForm = new FormGroup({
      'contact_no': this.contact_no,
      'gender': this.gender,
      'birthdate': this.birthdate,
      'education': this.education,
      'level': this.level,
      'salary_per_month': this.salary_per_month,
      'skills': this.skills,
      'fields': this.fields,
      'image': this.image,
      'resumeControl': this.resumeControl
    })
    this.getSeekerProfile(this.id)
  }

  setTags(tags: any[]) {
    for(let i = 0; i < tags.length; i++) {
      if(tags[i].tag_type === "skill") {
        console.log(tags[i].tag)
        this.skills.push(new FormControl(tags[i].tag, [Validators.required]))
      }
      else if(tags[i].tag_type === "field") {
        this.fields.push(new FormControl(tags[i].tag, [Validators.required]))
      } 
    }
  }

  getSeekerProfile(id:string) {
    this.editSeekerProfileService.loadProfile("edit", id).subscribe(
      (res) => {
        console.log(res)
        const dp = new DatePipe(navigator.language)
        this.seeker = res.data
        this.tmpSeeker = res.data
        const estdate = +res.data.birthdate || null
        this.profileForm.patchValue({
          'contact_no': res.data.contact_no,
          'gender': res.data.gender,
          'birthdate': dp.transform(new Date(estdate), 'yyyy-MM-dd'),
          'education': res.data.education,
          'level': res.data.level,
          'salary_per_month': +res.data.salary_per_month
        })
        if(res.data.tags) {
          this.setTags(res.data.tags)
        }
        if(res.data.pic_url) {
          if(res.data.pic_url === "") {
            this.pic_url = '../../assets/img/placeholder.png'
          }
          else {
            this.pic_url = res.data.pic_url
          }
        }
        else {
          this.pic_url = '../../assets/img/placeholder.png'
        }
        if(res.data.resume_url) {
          if(res.data.resume_url !== "") {
            this.old_resume = decodeURI(res.data.resume_url.split('/')[res.data.resume_url.split('/').length-1])
            this.tmpSeeker.resume_url = res.data.resume_url
          }
        }
        this.editSeekerProfileService.delProfile()
      },
      (err) => {
        console.error(err)
      }
    )
  }

  addSkill() {
    this.skills.push(new FormControl('', [Validators.required]))
  }

  delSkill(i:number) {
    this.skills.removeAt(i)
  }

  addField() {
    this.fields.push(new FormControl('', [Validators.required]))
  }

  delField(i:number) {
    this.fields.removeAt(i)
  }

  goBack() {
    this.editSeekerProfileService.sendProfile(this.seeker).subscribe(
      () =>  this.location.back(),
      (err) => console.error(err)
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

  onResumeChange(event) {
    if (event.target.files && event.target.files[0]) {
      const [file] = event.target.files
      console.log(file)

      const ext = file.name.split('.')[file.name.split('.').length-1]
      if(resume_exts.includes(ext)) {
        this.resume_file = file
        this.resume = file.name
      }
      else {
        this.resume = "No uploaded resume"
      }

      console.log(this.resume)
    }
  }

  onSubmit() {
    console.log(this.profileForm.value)
    this.seeker = this.profileForm.value
    this.seeker.tags = []
    for(let i = 0; i < this.seeker.skills.length; i++) {
      console.log()
      this.seeker.tags.push({"tag": this.seeker.skills[i], "tag_type": "skill"})
    }
    for(let i = 0; i < this.seeker.fields.length; i++) {
      this.seeker.tags.push({"tag": this.seeker.fields[i], "tag_type": "field"})
    }
    delete this.seeker.skills
    delete this.seeker.fields
    this.seeker.birthdate = new Date(this.seeker.birthdate).getTime()

    if(this.pic !== "") {
      this.seeker.pic_url_old = this.tmpSeeker.pic_url;
      this.seeker.pic_url = this.pic.split('.')[0] + '_' + new Date().getTime() + '_' + '.' + this.pic.split('.')[this.pic.split('.').length-1]
    }
    if(this.resume !== "No uploaded resume") {
      this.seeker.resume_url_old = this.tmpSeeker.resume_url;
      this.seeker.resume_url = this.resume.split('.')[0] + '_' + new Date().getTime() + '_' + '.' + this.resume.split('.')[this.resume.split('.').length-1]
    }
    // this.job_post.description = this.job_post.description.replace("\n", "<br>")

    console.log(this.seeker)
    const hasPic = (this.pic !== "" )
    const hasResume = (this.resume !== "No uploaded resume")
    const modalRef = this.modalService.open(LoadingComponent,{ backdrop : 'static', keyboard : false })
    if(hasPic || hasResume) {
      console.log("YO")
      this.fileService.getSignedUrl({pic_url: this.seeker.pic_url, resume_url:this.seeker.resume_url}).subscribe(
        (res) => {
          console.log(res)
          if(hasPic && !hasResume) {
            this.uploadPicOnly(res, modalRef)
          }
          else if(!hasPic && hasResume) {
            this.uploadResumeOnly(res, modalRef)
          }
          else if(hasPic && hasResume) {
            this.uploadPicAndResume(res, modalRef)
          }
        },
        (err) => {
          console.error(err)
        }
      )
    }
    else {
      console.log("NAY")
      this.seeker.resume_url = this.tmpSeeker.resume_url
      this.seeker.pic_url = this.tmpSeeker.pic_url
      this.goBackDefaults(modalRef)
    }
  }

  uploadPicOnly(res, modalRef) {
    this.seeker.pic_url = res.data.pic_url.split('?')[0]
    const contenttype = 'image/' + this.pic.split('.')[this.pic.split('.').length-1]
    this.fileService.uploadToAWSS3(res.data.pic_url,contenttype, this.file).subscribe(
      () => {
        this.seeker.resume_url = this.tmpSeeker.resume_url
        this.goBackDefaults(modalRef)
      },
      (err) => console.error(err)
    )
  }

  uploadResumeOnly(res, modalRef) {
    this.seeker.resume_url = res.data.resume_url.split('?')[0]
    let contenttypeResume = ""
    let ext = this.resume.split('.')[this.resume.split('.').length-1]
    if(ext === "docx" || ext === "doc") {
      contenttypeResume = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
    else if(ext === "pdf") {
      contenttypeResume = "application/pdf"
    }
    this.fileService.uploadToAWSS3(res.data.resume_url,contenttypeResume, this.resume_file).subscribe(
      () => {
        this.seeker.pic_url = this.tmpSeeker.pic_url
        this.goBackDefaults(modalRef)
      },
      (err) => console.error(err)
    )
  }

  uploadPicAndResume(res, modalRef) {
    /* IMAGE */
    this.seeker.pic_url = res.data.pic_url.split('?')[0]
    const contenttypeImage = 'image/' + this.pic.split('.')[this.pic.split('.').length-1]
    this.seeker.resume_url = res.data.resume_url.split('?')[0]
    /* IMAGE END */
    /* RESUME */
    let contenttypeResume = ""
    let ext = this.resume.split('.')[this.resume.split('.').length-1]
    if(ext === "docx" || ext === "doc") {
      contenttypeResume = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
    else if(ext === "pdf") {
      contenttypeResume = "application/pdf"
    }
    /* RESUME END */
    forkJoin(this.fileService.uploadToAWSS3(res.data.pic_url, contenttypeImage, this.file), //upload image
             this.fileService.uploadToAWSS3(res.data.resume_url,contenttypeResume, this.resume_file) //upload resume
             ).subscribe(
              () => {
                this.goBackDefaults(modalRef)
              },
              (err) => console.error(err)
             )
  }

  goBackDefaults(modalRef) {
    this.seekerService.editSeekerProfile(this.id, this.seeker).subscribe(
      () => {
        this.seeker.user_id = this.id
        this.seeker.last_name = this.tmpSeeker.last_name
        this.seeker.first_name = this.tmpSeeker.first_name
        this.seeker.email = this.tmpSeeker.email
        this.seeker.edited = true
        this.editSeekerProfileService.sendProfile(this.seeker)
        modalRef.close()
        this.location.back()
      },
      (err) => {
        console.error(err)
      }
    )
  }

  updateUrl(event) {
    if(this.seeker.pic_url_old !== "" && this.seeker.pic_url_old !== event.srcElement.currentSrc) {
      this.pic_url = this.seeker.pic_url_old
    }
    else {
      this.pic_url = '../../assets/img/placeholder.png'
    }
  }
}
