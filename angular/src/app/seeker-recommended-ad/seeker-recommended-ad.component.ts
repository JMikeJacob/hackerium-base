import { Component, OnInit, Input } from '@angular/core'
import { Job } from '../job'

@Component({
  selector: 'app-seeker-recommended-ad',
  templateUrl: './seeker-recommended-ad.component.html',
  styleUrls: ['./seeker-recommended-ad.component.css']
})
export class SeekerRecommendedAdComponent implements OnInit {

  @Input() job:Job

  constructor() { }

  ngOnInit() {
  }

}
