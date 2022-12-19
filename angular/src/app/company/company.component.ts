import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
//testing
import { CookieService } from 'ngx-cookie-service'
import { JobService } from '../services/job.service'
import { CompanyService } from '../services/company.service'
import { Company } from '../company'
import { EditCompanyService } from '../services/edit-company.service'

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  @Input() company: Company
  pic_url: string
  loading: boolean
  no_company: boolean
  edited: boolean
  id: string
  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private companyService: CompanyService,
    private editCompanyService: EditCompanyService,
    private cookieService: CookieService //testing
  ) { }

  ngOnInit() {
    this.edited = false
    this.loading = true
    this.no_company = true
    this.id = this.cookieService.get('posted_by_id')
    this.getCompanyProfile(this.id)
  }

  // getCompanyProfile(id:number) {
  //   this.companyService.getCompanyProfile(id).subscribe(
  //     (res) => {
  //       this.no_company = false
  //       this.company = res.success.sdata

  //       console.log(this.company)
  //       if(!this.company.website) this.company.website="URL not provided."
  //       if(!this.company.location) this.company.location="Location not provided."
  //       if(!this.company.description) this.company.description="Description not provided."
  //     },
  //     (err) => {
  //       console.error(err)
  //       // console.log("yo")
  //       this.no_company = true
  //     }
  //   )
  // }

  getCompanyProfile(id:string) {
    this.editCompanyService.loadCompany("post", id).subscribe(
      (res) => {
        console.log(res)
        this.editCompanyService.delCompany()
        this.company = res.success.data

        console.log(this.company)
        if(!this.company.website) this.company.website="URL not provided."
        if(!this.company.location) this.company.location="Location not provided."
        if(!this.company.description) this.company.description="Description not provided."
        this.loading = false
        this.no_company = false
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

        if(res.success.data.edited) {
          if(res.success.data.edited === true) {
            this.edited = true
          }
        } 
      },
      (err) => {
        console.error(err)
        // console.log("yo")
        this.loading = false
        this.no_company = true
      }
    )
  }

  toEdit() {
    this.editCompanyService.sendCompany(this.company)
    this.router.navigate([`../employer/company/edit`])
  }

  updateUrl(event) {
    if(this.company.pic_url_old !== "" && this.company.pic_url_old !== event.srcElement.currentSrc) {
      this.pic_url = this.company.pic_url_old
    }
    else {
      this.pic_url = '../../assets/img/placeholder.png'
    }
  }

  goBack() {
    this.location.back()
  }
}
