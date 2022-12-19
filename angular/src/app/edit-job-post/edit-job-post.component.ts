import { Component, OnInit, ViewChild } from '@angular/core'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { Location, DatePipe } from '@angular/common'
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, NgControlStatusGroup, ValidationErrors } from '@angular/forms'
import { JobService } from '../services/job.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Tag } from '../tag'
import { dateValidator } from '../shared/date-validator.directive'
import { DuplicateValidatorDirective } from '../shared/duplicate-validator.directive'
import { OptionsService } from '../services/options.service'
import { EditJobPostService } from '../services/edit-job-post.service'
import { QuillEditorComponent } from 'ngx-quill'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

//testing
import { CookieService } from 'ngx-cookie-service'
import { Options } from 'selenium-webdriver/firefox';

// import { Levels } from '../levels'
// import { Types } from '../types'

@Component({
  selector: 'app-edit-job-post',
  templateUrl: './edit-job-post.component.html',
  styleUrls: ['./edit-job-post.component.css']
})
export class EditJobPostComponent implements OnInit {
  // jobs$: Observable<object>
  job: any
  type_options: string[]
  level_options: string[]
  skill_options: string[]
  field_options: string[]
  posted_by_id: string
  date_posted: number
  job_post: any

  jobForm: FormGroup 
  job_name: FormControl
  type: FormControl
  level: FormControl
  field: FormControl
  job_location: FormControl
  description: FormControl
  qualifications: FormControl
  date_deadline: FormControl
  is_open: FormControl
  
  skills: FormArray
  // fields: FormArray
  tag: FormControl

  //testing
  id: string

  @ViewChild('descriptionQuill', {
    static: true
  }) descriptionQuill: QuillEditorComponent

  @ViewChild('qualificationsQuill', {
    static: true
  }) qualificationsQuill: QuillEditorComponent

  constructor(public jobService: JobService,
              private route: ActivatedRoute,
              private location: Location,
              private duplicateValidatorDirective: DuplicateValidatorDirective,
              private optionService: OptionsService,
              private editJobPostService: EditJobPostService,
              public cookieService: CookieService //testing
              ) { }

  ngOnInit() {
    this.job = {}
    this.field_options = [];
    this.type_options = [];
    this.level_options = [];
    this.optionService.loadData().subscribe(
      (res) => {
        console.log(res);
        this.skill_options = res.data.skills
        if(res.data.fields) {
          for(let i = 0; i < res.data.fields.length; i++) {
            console.log(res.data.fields[i])
            this.field_options.push(res.data.fields[i]);
          }
        }
        if(res.data.types) {
          for(let i = 0; i < res.data.types.length; i++) {
            this.type_options.push(res.data.types[i]);
          }
        }
        if(res.data.levels) {
          for(let i = 0; i < res.data.levels.length; i++) {
            this.level_options.push(res.data.levels[i]);
          }
        }
      },
      (err) => {
        console.error(err)
      }
    )
    this.posted_by_id = this.cookieService.get('posted_by_id') //testing
    
    this.tag = new FormControl('', [
      Validators.required
    ])
    this.job_name = new FormControl('', [
      Validators.required
    ])
    this.type = new FormControl('', [
      Validators.required
    ])
    this.level = new FormControl('', [ 
      Validators.required
    ])
    this.field = new FormControl('', [ 
      Validators.required
    ])
    this.job_location = new FormControl('', [
      Validators.required
    ])
    this.description = new FormControl('', [
      Validators.required
    ])
    this.qualifications = new FormControl('', [
      Validators.required
    ])
    this.date_deadline = new FormControl('', [
      Validators.required,
      dateValidator()
    ])
    this.is_open = new FormControl('', [
      Validators.required
    ])
    this.skills = new FormArray([], [
      this.duplicateValidatorDirective.duplicateValidator()
    ])
    // this.fields = new FormArray([], [
    //   this.duplicateValidatorDirective.duplicateValidator()
    // ])
    this.jobForm = new FormGroup({
      'job_name': this.job_name,
      'type': this.type,
      'level': this.level,
      'field': this.field,
      'job_location': this.job_location,
      'description': this.description,
      'qualifications': this.qualifications,
      'date_deadline': this.date_deadline,
      'is_open': this.is_open,
      'skills': this.skills,
      // 'fields': this.fields
    })
    // this.getJobPost()
    this.route.params.subscribe((res) => {
      this.id = res.id
      this.getJobPost()
    })

    this.jobForm.controls.description.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe()

    this.descriptionQuill.onContentChanged.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe()

    this.jobForm.controls.qualifications.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe()

    this.qualificationsQuill.onContentChanged.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe()
  }


  setTags(tags: Tag[]) {
    for(let i = 0; i < tags.length; i++) {
      if(tags[i].tag_type === "skill") {
        this.skills.push(new FormControl(tags[i].tag, [Validators.required]))
      }
      // else if(tags[i].tag_type === "field") {
      //   this.fields.push(new FormControl(tags[i].tag, [Validators.required]))
      // } 
    }
  }

  addSkill() {
    this.skills.push(new FormControl('', [Validators.required]))
  }

  delSkill(i:number) {
    this.skills.removeAt(i)
  }

  // addField() {
  //   this.fields.push(new FormControl('', [Validators.required]))
  // }

  // delField(i:number) {
  //   this.fields.removeAt(i)
  // }

  // getJobPost() {
  //   this.jobService.getJobPost(this.id).subscribe(
  //     (res) => {
  //       console.log(res)
  //       const dp = new DatePipe(navigator.language)
  //       this.job = res.data
  //       this.jobForm.patchValue({
  //         job_name: res.data.job_name,
  //         type: res.data.type,
  //         level: res.data.level,
  //         job_location: res.data.job_location,
  //         description:res.data.description,
  //         qualifications: res.data.qualifications,
  //         date_deadline: dp.transform(new Date(res.data.date_deadline), 'yyyy-MM-dd'),
  //         is_open: res.data.is_open
  //       })
  //       this.setTags(res.data.tags)
  //     },
  //     (err) => {
  //       console.error(err)
  //       // console.log("yo")
  //     }
  //   )
  // }

  getJobPost() {
    this.editJobPostService.loadJob("edit", this.id).subscribe(
      (res) => {
        console.error(res)
        const dp = new DatePipe(navigator.language)
        this.job = res.data
        this.jobForm.patchValue({
        job_name: res.data.job_name,
        type: res.data.type,
        level: res.data.level,
        field: res.data.field,
        job_location: res.data.job_location,
        description:res.data.description,
        qualifications: res.data.qualifications,
        date_deadline: dp.transform(new Date(+res.data.date_deadline*1000), 'yyyy-MM-dd'),
        is_open: res.data.is_open
      })
      if(res.data.tags) {
        this.setTags(res.data.tags)
      }
      this.editJobPostService.delJob()
    },
    (err) => {
      console.error(err)
      // console.log("yo")
    })
  }

  onSubmit() {
    console.log(this.jobForm.value)
    this.job_post = this.jobForm.value
    this.job_post.tags = []
    for(let i = 0; i < this.job_post.skills.length; i++) {
      console.log()
      this.job_post.tags.push({"tag": this.job_post.skills[i], "tag_type": "skill"})
    }
    // for(let i = 0; i < this.job_post.fields.length; i++) {
    //   this.job_post.tags.push({"tag": this.job_post.fields[i], "tag_type": "field"})
    // }
    delete this.job_post.skills
    // delete this.job_post.fields
    this.job_post.posted_by_id = this.posted_by_id
    this.job_post.date_deadline = new Date(this.job_post.date_deadline).getTime()
    this.job_post.date_posted = new Date().getTime()
    this.job_post.date_deadline =  (this.job_post.date_deadline/1000).toFixed()
    this.job_post.date_posted = (this.job_post.date_posted/1000).toFixed()
    this.job_post.company = this.cookieService.get('company') //testing

    // this.job_post.description = this.job_post.description.replace("\n", "<br>")

    console.log(this.job_post)
    this.jobService.editJobPost(this.id, this.job_post).subscribe(
      (res) => {
        this.job_post.edited = true
        this.editJobPostService.sendJob(this.job_post)
        console.log(res)
        alert("Job Post Updated!")
        this.location.back()
      },
      (err) => {
        console.error(err)
      }
    )
  }

  goBack() {
    this.editJobPostService.sendJob(this.job).subscribe(
      () => this.location.back(),
      (err) => console.error(err)
    )
  }
}
