import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  constructor(
    public cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
      const role = this.cookieService.get('role')
      if(role === "employer") {
        this.router.navigate([`../employer/jobs/1`])
      }      
      if(role === "seeker") {
        this.router.navigate([`../seeker/jobs/1`])
      }
    }
}
