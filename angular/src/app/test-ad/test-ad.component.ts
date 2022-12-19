import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-test-ad',
  templateUrl: './test-ad.component.html',
  styleUrls: ['./test-ad.component.css']
})
export class TestAdComponent implements OnInit {

  @Input() test:any

  constructor() { }

  ngOnInit() {
    console.log(this.test);
  }

}
