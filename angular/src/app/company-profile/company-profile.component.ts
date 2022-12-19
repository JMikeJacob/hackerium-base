import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
//testing
import { CookieService } from 'ngx-cookie-service'
import { JobService } from '../services/job.service'
import { CompanyService } from '../services/company.service'
import { Company } from '../company'

import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';
import { CONSTANTS } from '../constants';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  __socketSub: Subscription;
  
  @Input() company: Company
  pic_url: string
  loading: boolean
  no_company: boolean
  id: string
  from:string
  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private companyService: CompanyService,
    private socketService: SocketService,
    private cookieService: CookieService //testing
  ) { }

  ngOnInit() {
    this.loading = true
    this.no_company = true
    this.route.params.subscribe(
      (res) => {
        this.id = res.id
        this.getCompanyProfile(res.id)
      }
    )
    this.route.queryParamMap.subscribe(
      (res:any) => {
        if(res.params.from) {
          this.from = res.params.from
        }
        else {
          this.from = ""
        }
      },
      (err) => {
        this.from = ""
      }
    )
  }

  getCompanyProfile(id:number) {
    this.companyService.getCompanyProfile(id).subscribe(
      (res) => {
        this.company = res.success.data
        console.log(this.company)
        if(!this.company.website) this.company.website="URL not provided."
        if(!this.company.location) this.company.location="Location not provided."
        if(!this.company.description) this.company.description="Description not provided."
        this.no_company = false
        this.loading = false
        if(res.success.data.pic_url) {
          if(res.success.data.pic_url === "") {
            this.pic_url = '../../assets/img/placeholder.png'
          }
          else {
            this.pic_url = res.success.data.pic_url
          }
        }
        else {
          this.pic_url = '../../assets/img/placeholder.png'
        }
        this.listenToEvent();
      },
      (err) => {
        console.error(err)
        // console.log("yo")
        this.no_company = true
        this.loading = false
      }
    )
  }

  toEdit() {
    this.router.navigate([`../employer/company/edit`])
  }

  listenToEvent() {
    this.socketService.subscribeToEvents('company', this.id);
    const __socketSub = this.socketService.socketEvent.subscribe(
      (event) => {
        console.log(event);
        switch(event.payload.eventType) {
          case CONSTANTS.EVENTS.COMPANY_ACCOUNT_EDITED:
            this.company.email = event.payload.email;
            break;
          case CONSTANTS.EVENTS.COMPANY_PROFILE_EDITED:
            this.company.name = event.payload.companyName;
            this.company.website = event.payload.website;
            this.company.location = event.payload.location;
            this.company.establishment_date = event.payload.establishmentDate;
            this.company.contact_no = event.payload.contact;
          default:
            break;
        }
      }
    )
  }

  goBack() {
    this.location.back();
    this.socketService.unsubscribeFromEvents('company', this.id);
    if(this.__socketSub) this.__socketSub.unsubscribe;
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
