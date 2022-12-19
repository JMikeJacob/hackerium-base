import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Location } from '@angular/common';

import { contactValidator } from '../shared/contact-validator.directive'

import { Test } from '../test';
import { TestService } from '../services/test.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.css']
})
export class EditTestComponent implements OnInit {
  @Input() testId: string;

  companyId: string;

  testForm: FormGroup;
  testTitle: FormControl;
  testDifficulty: FormControl;
  testTotal: FormControl;
  testBody: FormControl;
  testCases: FormArray;

  @ViewChild('testQuill', {
    static: true
  }) testQuill: QuillEditorComponent;

  constructor(private router: Router,
              public cookieService: CookieService,
              private location: Location,
              public testService: TestService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.companyId = this.cookieService.get('posted_by_id');

    this.testTitle = new FormControl('', [
      Validators.required
    ]);

    this.testDifficulty = new FormControl('', [
      Validators.required
    ]);
   
    this.testTotal = new FormControl('', [
      Validators.required,
      contactValidator(/^(0|[1-9][0-9]*)$/)
    ]);

    this.testBody = new FormControl('', [
      Validators.required
    ]);

    this.testCases = new FormArray([], [
      Validators.required
    ]);

    this.testForm = new FormGroup({
      'testTitle': this.testTitle,
      'testDifficulty': this.testDifficulty,
      'testTotal': this.testTotal,
      'testBody': this.testBody,
      'testCases': this.testCases
    });

    this.route.params.subscribe((res) => {
      this.testId = res.id;
      this.getTest();
    })

    this.testForm.controls.testBody.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe();

    this.testQuill.onContentChanged.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe();
  }

  initializeTestCase() {
    return new FormGroup({
      'testCaseInput': new FormControl('', [Validators.required]),
      'testCaseOutput': new FormControl('', [Validators.required])
    });
  }

  addTestCase() {
    this.testCases.push(this.initializeTestCase());
  }

  getTest() {
    this.testService.getTestById(this.testId).subscribe(
      (res) => {
        const test = res.payload.data
        console.log(res);
        this.testForm.patchValue({
          testTitle: test.test_title,
          testDifficulty: test.test_difficulty,
          testTotal: test.test_total,
          testBody: test.test_body
        })
      },
      (err) => {
        console.error(err);
      }
    )
  }

  deleteTestCase(i:number) {
    this.testCases.removeAt(i);
    console.log(this.testCases.controls)
  }

  onSubmit() {
    let testData = this.testForm.value;
    testData.companyId = this.companyId;
    console.log(testData);
    this.testService.createTest(testData).subscribe(
      (res) => {
        console.log(res);
        alert("Test Created!");
        this.router.navigate(['/employer/tests/1']);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  testSubmit() {
    let testData = this.testForm.value;
    console.log(testData);
  }

  goBack() {
    this.location.back();
  }
}
