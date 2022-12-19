import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'

import { JobService } from '../services/job.service'
import { Job } from '../job'

import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';
import { CONSTANTS } from '../constants';

@Component({
  selector: 'app-job-post',
  templateUrl: './job-post.component.html',
  styleUrls: ['./job-post.component.css']
})
export class JobPostComponent implements OnInit {
  __socketSub: Subscription;

  @Input() job: Job
  loading: boolean
  no_job: boolean
  skills: string[]
  fields: string[]
  job_id: string
  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private location: Location ,
    private socketService: SocketService 
  ) { }

  ngOnInit() {
    this.loading = true
    this.no_job = true
    this.skills = []
    this.fields = []
    this.getJobPost()
  }

  getJobPost() {
    const id = this.route.snapshot.paramMap.get('id')
    this.job_id = id;
    this.jobService.getJobPost(id).subscribe(
      (res) => {
        console.log(res)
        this.job = res.data
        
        if(this.job.tags) {
          for(let i = 0; i < this.job.tags.length; i++) {
          if(this.job.tags[i].tag_type === "skill") {
            this.skills.push(this.job.tags[i].tag)
          }
          // else if(this.job.tags[i].tag_type === "field") {
          //   this.fields.push(this.job.tags[i].tag)
          // }
          }
        }
        this.no_job = false
        this.loading = false
      },
      (err) => {
        console.error(err)
        // console.log("yo")
        this.no_job = true
        this.loading = false
      }
    )
  }

  listenToEvent() {
    this.socketService.subscribeToEvents('job', this.job_id);
    this.__socketSub = this.socketService.socketEvent.subscribe(
      (event) => {
        console.log(event);
        switch(event.payload.eventType) {
          case CONSTANTS.EVENTS.JOB_POST_EDITED: 
            this.job.job_name = event.payload.jobName;
            this.job.date_posted = event.payload.datePosted;
            this.job.date_deadline = event.payload.dateDeadline;
            this.job.job_location = event.payload.jobLocation;
            this.job.type = event.payload.typeName;
            this.job.level = event.payload.levelName;
            this.job.field = event.payload.fieldName;
            this.job.description = event.payload.description;
            this.job.qualifications = event.payload.qualifications;
            this.job.is_open = event.payload.isOpen;
            break;
          default:
            break;
        }
      },
      (err) => {
        console.error(err);
      }
    )
  }

  goBack() {
    this.location.back()
  }
}
