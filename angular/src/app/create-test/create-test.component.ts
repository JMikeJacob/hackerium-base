import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Location } from '@angular/common';

import { contactValidator } from '../shared/contact-validator.directive'

import { Test } from '../test';
import { TestService } from '../services/test.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../services/socket.service';
import { LoadingComponent } from '../loading/loading.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css']
})
export class CreateTestComponent implements OnInit {
  @Input() testId: string;

  companyId: string;
  uploading: boolean = false;

  testForm: FormGroup;
  testTitle: FormControl;
  testDifficulty: FormControl;
  testExecutionTime: FormControl;
  testBody: FormControl;
  testFunctionDesc: FormControl;
  testInputFormat: FormControl;
  testConstraints: FormControl;
  testSampleCases: FormArray;
  testParameters: FormArray;
  testCases: FormArray;

  @ViewChild('testQuill', {
    static: true
  }) testQuill: QuillEditorComponent;

  @ViewChild('functionQuill', {
    static: true
  }) functionQuill: QuillEditorComponent;

  @ViewChild('inputQuill', {
    static: true
  }) inputQuill: QuillEditorComponent;

  @ViewChild('constraintQuill', {
    static: true
  }) constraintQuill: QuillEditorComponent;

  constructor(private router: Router,
              public cookieService: CookieService,
              private socketService: SocketService,
              private modalService: NgbModal,
              private location: Location,
              public testService: TestService) { }

  ngOnInit() {
    this.companyId = this.cookieService.get('posted_by_id');

    this.testTitle = new FormControl('', [
      Validators.required
    ]);

    this.testDifficulty = new FormControl('', [
      Validators.required
    ]);
   
    this.testExecutionTime = new FormControl('', [
      Validators.required,
      contactValidator(/^(0|[1-9][0-9]*)$/)
    ]);

    this.testBody = new FormControl('', [
      Validators.required
    ]);

    this.testFunctionDesc = new FormControl('', []);

    this.testInputFormat = new FormControl('', []);

    this.testConstraints = new FormControl('', []);

    this.testParameters = new FormArray([], [
      Validators.required
    ]);

    this.testCases = new FormArray([], [
      Validators.required
    ]);

    this.testSampleCases = new FormArray([
      new FormGroup({
        'sampleCaseInput': new FormControl('', [Validators.required]),
        'sampleCaseOutput': new FormControl('', [Validators.required]),
        'sampleExplanation': new FormControl('', [])
      }),
      new FormGroup({
        'sampleCaseInput': new FormControl('', [Validators.required]),
        'sampleCaseOutput': new FormControl('', [Validators.required]),
        'sampleExplanation': new FormControl('', [])
      })
    ], [
      Validators.required
    ]);

    this.testForm = new FormGroup({
      'testTitle': this.testTitle,
      'testDifficulty': this.testDifficulty,
      'testExecutionTime': this.testExecutionTime,
      'testBody': this.testBody,
      'testFunctionDesc': this.testFunctionDesc,
      'testInputFormat': this.testInputFormat,
      'testConstraints': this.testConstraints,
      'testSampleCases': this.testSampleCases,
      'testParameters': this.testParameters,
      'testCases': this.testCases
    });

    this.testForm.controls.testBody.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe();

    this.testQuill.onContentChanged.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe();

    this.functionQuill.onContentChanged.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe();

    this.inputQuill.onContentChanged.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe();

    this.constraintQuill.onContentChanged.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe();
  }

  initializeTestCase() {
    return new FormGroup({
      'testCaseInputRaw': new FormControl('', [Validators.required]),
      'testCaseOutputRaw': new FormControl('', [Validators.required]),
      'testCaseHidden': new FormControl('', [])
    });
  }

  addTestCase() {
    this.testCases.push(this.initializeTestCase());
  }

  deleteTestCase(i:number) {
    this.testCases.removeAt(i);
    console.log(this.testCases.controls)
  }

  initializeTestParameter() {
    return new FormGroup({
      'testParameterName': new FormControl('', [Validators.required]),
      'testParameterType': new FormControl('', [Validators.required])
    });
  }

  addTestParameter() {
    this.testParameters.push(this.initializeTestParameter());
  }

  deleteTestParameter(i:number) {
    this.testParameters.removeAt(i);
  }

  onSubmit() {
    let testData = this.testForm.value;
    testData.testTotal = testData.testCases.length;
    let outputString = '';
    for(let i = 0; i < testData.testCases.length; i++) {
      outputString += testData.testCases[i].testCaseOutputRaw.trim() + '\n';
    }
    outputString += 'hidden:\n';
    
    let hiddenFlag = false;
    for(let i = 0; i < testData.testCases.length; i++) {
      if(testData.testCases[i].testCaseHidden) {
        outputString += 'true' + ',';
      } 
      else {
        outputString += 'false' + ',';
      }
    }
    
    if(hiddenFlag) outputString.slice(0, outputString.length-1);

    const description = {
      test_body: testData.testBody,
      test_function_desc: testData.testFunctionDesc,
      test_constraints: testData.testConstraints,
      test_input_format: testData.testInputFormat,
      test_sample_cases: testData.testSampleCases
    }
    this.uploading = true;
    const modalRef = this.modalService.open(LoadingComponent,{ backdrop : 'static', keyboard : false });
    this.testService.createTest({
      testTitle: testData.testTitle,
      testTotal: testData.testTotal,
      testDifficulty: testData.testDifficulty,
      testExecutionTime: testData.testExecutionTime,
      testParameters: testData.testParameters,
      testCases: testData.testCases,
      testOutputString: outputString,
      testDescription: JSON.stringify(description),
      companyId: this.companyId
    }).subscribe(
      (res) => {
        console.log(res);
        this.waitForUpload(res.success.testId, modalRef);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  waitForUpload(testId: string, modalRef) {
    this.socketService.subscribeToEvents('test', testId);
    this.socketService.socketEvent.subscribe(
      (res) => {
        console.log(res);
        this.uploading = false;
        modalRef.close();
        alert("Test Created!");
        this.socketService.unsubscribeFromEvents('test', testId);
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
