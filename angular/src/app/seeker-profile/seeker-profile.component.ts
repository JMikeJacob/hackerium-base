import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Seeker } from '../seeker'
import { SeekerService } from '../services/seeker.service'
import { CookieService } from 'ngx-cookie-service'
import { Router, ActivatedRoute } from '@angular/router'
import { EditSeekerProfileService } from '../services/edit-seeker-profile.service'

@Component({
  selector: 'app-seeker-profile',
  templateUrl: './seeker-profile.component.html',
  styleUrls: ['./seeker-profile.component.css']
})
export class SeekerProfileComponent implements OnInit {

  seeker:Seeker
  id: string
  edited: boolean
  pic_url: string
  resume_url: string
  skills: string[]
  fields: string[]

  constructor(private seekerService: SeekerService,
              private editSeekerProfileService: EditSeekerProfileService,
              private router: Router,
              private route: ActivatedRoute,
              private cookieService: CookieService) { }

  ngOnInit() {
    this.edited = false
    this.resume_url = "none"
    this.pic_url = "none"
    this.skills = []
    this.fields = []
    this.seeker = new Seeker()
    this.id = this.cookieService.get('user_id')
    this.getSeekerProfile(this.id)
  }

  getSeekerProfile(id:string) {
    this.editSeekerProfileService.loadProfile("post",id).subscribe(
      (res) => {
        console.log(res)
        this.editSeekerProfileService.delProfile()
        this.seeker = res.data
        if(res.data.tags) {
          for(let i = 0; i < res.data.tags.length; i++) {
            if(res.data.tags[i].tag_type === "skill") {
              this.skills.push(res.data.tags[i].tag)
            }
            else if(this.seeker.tags[i].tag_type === "field") {
              this.fields.push(res.data.tags[i].tag)
            }
          }
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
            this.resume_url = res.data.resume_url
          }
        }
        if(res.data.edited) {
          if(res.data.edited === true) {
            this.edited = true
          }
        } 
      },
      (err) => {
        console.error(err)
      }
    )
  }

  getResume() {
    window.open(this.resume_url, "_blank")
  }

  toEdit() {
    this.editSeekerProfileService.sendProfile(this.seeker).subscribe(
      () => this.router.navigate(['../edit'], {relativeTo: this.route}),
      (err) => console.error(err)
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
