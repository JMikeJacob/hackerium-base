import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
import { CookieService } from 'ngx-cookie-service'
import { TestService } from '../services/test.service';
import { Test } from '../test';

@Component({
  selector: 'app-employer-test',
  templateUrl: './employer-test.component.html',
  styleUrls: ['./employer-test.component.css']
})
export class EmployerTestComponent implements OnInit {

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code: string= 'function x() {\nconsole.log("Hello world!");\n}';

  test: any;
  testId: string;
  no_test: boolean;
  loading: boolean;
  edited: boolean;

  testCaseInput: string = '';
  testCaseOutput: string = '';

  activeTestCase: number = 0;

  constructor(private testService: TestService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location
            ) { }

  ngOnInit() {
    
    this.loading = true;
    this.no_test = true;
    this.getTest()
  }

  getTest() {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.testService.getTestById(this.testId).subscribe(
      (res) => {
        console.log(res);
        this.test = res.payload.data;
        console.log(this.test);
        this.loading = false
        this.checkTestCase(0);
      },
      (err) => {
        console.error(err);
        this.no_test = true;
        this.loading = false;
      }
    )
  }

  checkTestCase(caseIndex) {
    this.activeTestCase = caseIndex;
    console.log(this.test.test_cases[caseIndex]);
    this.testCaseInput = this.test.test_cases[caseIndex].testCaseInputRaw.replace(/\\n/g, '\n');
    this.testCaseOutput = this.test.test_cases[caseIndex].testCaseOutputRaw.replace(/\\n/g, '\n');
  }

  toEdit() {
    this.router.navigate([`../employer/tests/edit/${this.test.test_id}`], {state: this.test})
  }

  toDelete() {
    this.testService.deleteTest(this.test.test_id).subscribe(
      (res) => {
        this.router.navigate([`../employer/tests/1`]);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  goBack() {
    this.location.back();
  }

}