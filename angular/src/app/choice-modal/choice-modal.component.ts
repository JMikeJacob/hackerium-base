import { Component, OnInit, Input } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-choice-modal',
  templateUrl: './choice-modal.component.html',
  styleUrls: ['./choice-modal.component.css']
})
export class ChoiceModalComponent implements OnInit {
  @Input() dialog: any
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  yes() {
    this.activeModal.close("yes")
  }

  no() {
    this.activeModal.close("no")
  }
}
