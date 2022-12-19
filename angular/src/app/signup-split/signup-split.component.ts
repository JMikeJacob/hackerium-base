import { Component, OnInit } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-signup-split',
  templateUrl: './signup-split.component.html',
  styleUrls: ['./signup-split.component.css']
})
export class SignupSplitComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  seeker() {
    this.activeModal.close("seeker")
  }

  employer() {
    this.activeModal.close("employer")
  }
}
