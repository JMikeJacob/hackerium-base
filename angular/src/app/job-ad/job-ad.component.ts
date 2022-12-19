import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Job } from '../job';

import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';

import { CONSTANTS } from '../constants';

@Component({
  selector: 'app-job-ad',
  templateUrl: './job-ad.component.html',
  styleUrls: ['./job-ad.component.css']
})
export class JobAdComponent implements OnInit {

  __socketSub: Subscription;

  tags:string;

  @Input() job:Job

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    console.log(this.job);
    this.initTags();
    this.listenToEvent();
  }

  initTags() {
    this.tags = '';
    this.tags += this.job.type + ', ';
    this.tags += this.job.level + ', ';
    this.tags += this.job.field
  }

  listenToEvent() {
    this.socketService.subscribeToEvents('job', this.job.job_id);
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
            this.initTags();
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

  ngOnDestroy() {
    this.socketService.unsubscribeFromEvents('job', this.job.job_id);
    if(this.__socketSub) this.__socketSub.unsubscribe();
  }

}
