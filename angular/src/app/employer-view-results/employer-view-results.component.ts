import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../services/job.service';
import { CONSTANTS } from '../constants';

import { AceConfigInterface, AceComponent } from 'ngx-ace-wrapper';

@Component({
  selector: 'app-employer-view-results',
  templateUrl: './employer-view-results.component.html',
  styleUrls: ['./employer-view-results.component.css']
})
export class EmployerViewResultsComponent implements OnInit {
  appId: string
  loading: boolean
  test: any
  activeTestCase: any
  hasOutputs: boolean

  appData: any
  testCases: any[]
  testOutputs: any[]
  scoreTotal: number
  scorePercentage: number

  editorValue: any
  initInput: any
  initOutput: any
  initExpected: any
  interviewStatus: string
  link: string

  //test
  testCasesWithOutput: any[]

  @ViewChild('inputCase', {
    static: false
  }) inputCase: AceComponent;

  @ViewChild('expectedCase', {
    static: false
  }) expectedCase: AceComponent;

  @ViewChild('outputCase', {
    static: false
  }) outputCase: AceComponent;

  @ViewChild('userSubmit', {
    static: false
  }) userSubmit: AceComponent;

  configReadOnlyScript: AceConfigInterface = {
    mode: 'javascript',
    theme: 'clouds',
    readOnly: true,
    highlightActiveLine: false, 
    highlightGutterLine: false
  };

  configReadOnly: AceConfigInterface = {
    mode: 'text',
    theme: 'clouds',
    readOnly: true,
    highlightActiveLine: false, 
    highlightGutterLine: false
  };

  editorOptionsReadOnly = {
    language: 'javascript', 
    automaticLayout: true, 
    readOnly: true
  };

  editorOptionsReadOnlyNoNumbers = {
    language: 'javascript', 
    automaticLayout: true, 
    readOnly: true,
    lineNumbers: 'off',
    glyphMargin: false,
    folding: false,
    // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0
  };

  constructor(private route: ActivatedRoute,
              private jobService: JobService) { }

  ngOnInit() {
    this.loading = true;
    this.hasOutputs = false;
    this.interviewStatus = CONSTANTS.INTERVIEW_STATUS.NONE;
    console.log(this.interviewStatus)
    this.appId = this.route.snapshot.paramMap.get('id');
    if(!this.appId) {
      window.history.back();
    }
    this.link = `${window.location.origin}/interview?appid=${this.appId}`;
    this.loadApplicationResult();
    // this.test.test_body = "Note:";

    //test
    this.testCasesWithOutput = [{
      testCaseInput: '1\n2',
      testCaseOutput: 'Output',
      userOutput: 'user output submitted'
    }];
  }

  loadApplicationResult() {
    this.jobService.getApplicationTestResult(this.appId).subscribe(
      (res) => {
        console.log(res);
        this.appData = res.data;
        this.editorValue = this.convertScript(res.data.script);
        if(res.data.test_score) {
          this.hasOutputs = true;
        }
        if (this.hasOutputs) {
          this.testOutputs = JSON.parse(res.data.test_output);
          this.testCases = res.data.test_cases;
          console.log(this.testCases);
          this.scoreTotal = this.testCases.length;
          this.scorePercentage = (res.data.test_score / this.scoreTotal) * 100;
          this.initInput = this.testCases[0].testCaseInputRaw.replace(/\\n/g, '\n');
          this.initOutput = this.testOutputs[0].output.toString();
          this.initExpected = this.testCases[0].testCaseOutputRaw.toString();
        }
        this.activeTestCase = 0;
        this.loading = false;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  convertScript(script) {
    script = script.replace(/\\n/g, '\n');
    script = script.replace(/\\"/g, '"');

    return script;
  }

  checkTestCase(caseIndex) {
    this.activeTestCase = caseIndex;
    this.inputCase.directiveRef.setValue(this.testCases[caseIndex].testCaseInputRaw.replace(/\\n/g, '\n'));
    this.outputCase.directiveRef.setValue(this.testOutputs[caseIndex].output.toString());
    this.expectedCase.directiveRef.setValue(this.testCases[caseIndex].testCaseOutputRaw.toString());
  }

  holdInterview() {
      this.jobService.changeApplicationStatus(this.appData.user_id, this.appData.app_id, CONSTANTS.APPLICATION_STATUS.INTERVIEWING).subscribe(
        (res) => {
          console.log(res)
          this.appData.status = CONSTANTS.APPLICATION_STATUS.INTERVIEWING; 
        },
        (err) => {
          console.error(err)
        }
      )
  }

  copyInterviewLink(inputElement) {
    inputElement.select();
    document.execCommand('copy');
  }

  stopInterview() {
    this.jobService.changeApplicationStatus(this.appData.user_id, this.appData.app_id, CONSTANTS.APPLICATION_STATUS.REVIEWING_TEST).subscribe(
      (res) => {
        console.log(res)
        this.appData.status = CONSTANTS.APPLICATION_STATUS.REVIEWING_TEST; 
      },
      (err) => {
        console.error(err)
      }
    )
  }

}
