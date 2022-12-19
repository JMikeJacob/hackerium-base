import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl, AbstractFormGroupDirective } from '@angular/forms'

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() term: string
  @Output() searchEvent = new EventEmitter<string>()
  search: FormControl
  searchForm: FormGroup
  constructor() { }

  ngOnInit() {
    this.search = new FormControl(this.term || '')
    this.searchForm = new FormGroup({
      'search': this.search
    })
  }

  onSubmit() {
    console.log(this.searchForm.value.search)
    this.searchEvent.emit(this.searchForm.value.search)
  }
}
