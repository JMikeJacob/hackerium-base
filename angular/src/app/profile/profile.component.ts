import { Component, OnInit, OnDestroy } from '@angular/core'
import { Location } from '@angular/common'
import { Observable } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { Seeker } from '../seeker'
import { SeekerService } from '../services/seeker.service'

import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';
import { CONSTANTS } from '../constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  __socketSub: Subscription

  seeker:Seeker
  id: string
  resume_url: string
  pic_url: string
  skills: string[]
  fields: string[]

  constructor(private seekerService: SeekerService,
              private location: Location,
              private route: ActivatedRoute,
              private socketService: SocketService
              ) { }

  ngOnInit() {
    this.pic_url = '../../assets/img/placeholder.png'
    this.resume_url = "none"
    this.skills = []
    this.fields = []
    this.seeker = new Seeker()
    this.id = this.route.snapshot.paramMap.get('id')
    this.getSeekerProfile(this.id);
  }

  goBack() {
    this.location.back();
    this.socketService.unsubscribeFromEvents('seeker', this.id);
    if(this.__socketSub) this.__socketSub.unsubscribe();
  }
  
  getSeekerProfile(id:string) {
    this.seekerService.getSeekerProfile(id).subscribe(
      (res) => {
        console.log(res)
        this.seeker = res.data
        if(res.data.tags) {
          for(let i = 0; i < res.data.tags.length; i++) {
            if(res.data.tags[i].tag_type === "skill") {
              this.skills.push(res.data.tags[i].tag)
            }
            else if(res.data.tags[i].tag_type === "field") {
              this.fields.push(res.data.tags[i].tag)
            }
          }
        }
        if(res.data.pic_url) {
          if(res.data.pic_url !== "") {
            this.pic_url = res.data.pic_url
          }
        }
        if(res.data.resume_url) {
          if(res.data.resume_url !== "") {
            this.resume_url = res.data.resume_url
          }
        }
        this.listenToEvent();
      },
      (err) => {
        console.error(err)
      }
    )
  }

  getResume() {
    window.open(this.resume_url, "_blank")
  }

  updateUrl(event) {
    if(this.seeker.pic_url_old !== "" && this.seeker.pic_url_old !== event.srcElement.currentSrc) {
      this.pic_url = this.seeker.pic_url_old
    }
    else {
      this.pic_url = '../../assets/img/placeholder.png'
    }
  }

  listenToEvent() {
    this.socketService.subscribeToEvents('seeker', this.id);
    this.__socketSub = this.socketService.socketEvent.subscribe(
      (event) => {
        switch(event.payload.eventType) {
          case CONSTANTS.EVENTS.SEEKER_ACCOUNT_EDITED:
            this.seeker.first_name = event.payload.firstName;
            this.seeker.last_name = event.payload.lastName;
            this.seeker.email = event.payload.email;
            break;
          case CONSTANTS.EVENTS.SEEKER_PROFILE_EDITED:
            this.seeker.contact_no = event.payload.contactNo;
            this.seeker.level = event.payload.level;
            this.seeker.education = event.payload.education;
            this.seeker.birthdate = event.payload.birthdate;
            this.seeker.gender = event.payload.gender;
            if(event.payload.pic_url) {
              if(event.payload.pic_url !== "") {
                this.pic_url = event.payload.pic_url
              }
            }
            if(event.payload.resume_url) {
              if(event.payload.resume_url !== "") {
                this.resume_url = event.payload.resume_url
              }
            }
            break;
          default:
            break;
        }
      }
    )
  }

  ngOnDestroy() {
    this.socketService.unsubscribeFromEvents('seeker', this.id);
    if(this.__socketSub) this.__socketSub.unsubscribe();
  }
}
