import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SignupSplitComponent } from '../signup-split/signup-split.component'
import { Router } from '@angular/router'


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  open_modal: boolean
  has_clicked: boolean

  constructor(public modalService: NgbModal,
              private router: Router) { }

  ngOnInit() {
  }

  signup() {
    if(!this.has_clicked) {
      this.has_clicked = true
      if(!this.open_modal) {
        const modalRef = this.modalService.open(SignupSplitComponent)
        this.open_modal = true
        modalRef.result.then((res) => {
          if(res === "seeker") {
            this.router.navigate(['./register/seeker'])
          }
          else if(res === "employer") {
            this.router.navigate(['./register/employer'])
          }
          this.open_modal = false
          this.has_clicked = false
        },
        (err) => {
          this.open_modal = false
          this.has_clicked = false
        })
      }
    }
  }

}
