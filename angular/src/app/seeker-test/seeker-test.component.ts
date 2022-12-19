import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { TestService } from '../services/test.service';
import { JobService } from '../services/job.service';
import { SocketService } from '../services/socket.service';
import { ActivatedRoute, Router } from '@angular/router';

import { AceComponent, AceDirective, AceConfigInterface } from 'ngx-ace-wrapper';

import 'brace';
import 'brace/mode/text';
import 'brace/theme/github';
import 'brace/theme/clouds';
import 'brace/mode/javascript';

import { Test } from '../test';

@Component({
  selector: 'app-seeker-test',
  templateUrl: './seeker-test.component.html',
  styleUrls: ['./seeker-test.component.css']
})
export class SeekerTestComponent implements OnInit {

  config: AceConfigInterface = {
    mode: 'javascript',
    theme: 'clouds',
    readOnly: false
  };

  configReadOnly: AceConfigInterface = {
    mode: 'text',
    theme: 'clouds',
    readOnly: true,
    highlightActiveLine: false, 
    highlightGutterLine: false
  };

  configCustomEditor: AceConfigInterface = {
    mode: 'text',
    theme: 'clouds',
    readOnly: false
  };

  editorValue: string;

  @ViewChildren(AceComponent) componentRef?: QueryList<AceComponent>

  @ViewChild(AceComponent, {static: false}) aceEditor?: AceComponent;

  // @ViewChild(AceComponent, { static: false }) componentRef?: AceComponent;
  // @ViewChild(AceDirective, { static: false }) directiveRef?: AceDirective;

  @ViewChild('inputCase', {
    static: false
  }) inputCase: AceComponent;

  @ViewChild('expectedCase', {
    static: false
  }) expectedCase: AceComponent;

  @ViewChild('outputCase', {
    static: false
  }) outputCase: AceComponent;
  
  @ViewChild('customCase', {
    static: false
  }) customCase: AceComponent;

  @ViewChild('customOutput', {
    static: false
  }) customOutput: AceComponent;

  editorOptions = {
    language: 'javascript', 
    automaticLayout: true
  };

  editorOptionsReadOnly = {
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

  editorOptionsCustom = {
    language: 'javascript', 
    automaticLayout: true
  };

  _socketSub: Subscription
  _testCaseSub: Subscription[]

  code: string= 'function x() {\nconsole.log("Hello world!");\n}';
  testId: string
  appId: string

  test: any
  testCasesWithOutput: any[]
  testCasesNoUserOutput: any[]
  loading: boolean
  terminalCollapsed: boolean
  usedRunButton: boolean
  activePanel: string //testcase, customcase
  activeTestCase: number
  initializedTerminal: boolean
  hiddenCase: boolean
  testCaseReceivedCount: number
  
  runningCustomTest: boolean
  runningTestCases: boolean
  //runningTestCasesArray

  customInputValue: string
  customOutputValue: string

  __querySub: Subscription
  constructor(private testService: TestService,
              private jobService: JobService,
              private socketService: SocketService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.testCaseReceivedCount = 0;
    this.initializedTerminal = false;
    this.loading = true;
    this.hiddenCase = false;
    this.runningCustomTest = false;
    this.runningTestCases = false;
    this.terminalCollapsed = true;
    this.usedRunButton = false;
    this.activePanel = 'testcase';
    this.activeTestCase = 0;

    this.__querySub = this.route.queryParamMap.subscribe(
      (res:any) => {
        this.testId = res.params.testid;
        this.appId = res.params.appid;

        this.jobService.getApplicationTestResult(res.params.appid).subscribe(
          (res) => {
            console.log(res);
            if(res.data.status === 'testing') {
              this.getTest(this.appId, this.testId);
            }
            else {
              this.goToSubmitPage();
            }
          },
          (err) => {
            console.error(err);
          }
        )
      },
      err => console.error(err)
    );
  }

  ngAfterViewInit() {
    this.componentRef.changes.subscribe((comps: QueryList<AceComponent>) => {
      comps.first.directiveRef.ace().resize();
      // comps.first.directiveRef.ace().addEventListener('exec', (e) => {
      //   let rowCol = comps.first.directiveRef.ace().getSelection().getCursor();
      //   console.log(rowCol);
      //   if ((rowCol.row == 0) || ((rowCol.row + 1) == comps.first.directiveRef.ace().getSession().getLength())) {
      //     e.preventDefault();
      //     e.stopPropagation();
      //   }
      // })
    })
    
  }

  getTest(appId: string, testId: string) {
    this.testService.getTestById(testId).subscribe(
      (res) => {
        console.log(res);
        this.test = res.payload.data;
        if(typeof this.test.test_file_urls === 'string') this.test.test_file_urls = JSON.parse(this.test.test_file_urls);
        this.editorValue = res.payload.data.test_boilerplate.replace(/\\n/g, '\n');
        this.testCasesWithOutput = res.payload.data.test_cases;
        if(typeof this.test.test_parameters === 'string') this.test.test_parameters = JSON.parse(this.test.test_parameters);
        for(let i = 0; i < this.testCasesWithOutput.length; i++) {
          this.testCasesWithOutput[i].userOutput = '';
          this.testCasesWithOutput[i].loading = false;
        }
        this.loading = false;
      },
      err => console.error(err)
    )
  }

  onInitCustomOutput(editor) {
    this.customOutput = editor;
  }

  toggleTerminalRun() {
    if(this.activePanel === 'testcase') {
      this.toggleTerminalRunTests();
      this.inputCase.directiveRef.ace().resize();
    }
    else {
      this.toggleTerminalRunCustom();
    }
  }

  toggleTerminalRunTests() {
    this.toggleTestPanel();
    if(this.terminalCollapsed) {
      this.terminalCollapsed = !this.terminalCollapsed;
    }
    this.runTestCases();
  }

  toggleTerminalRunCustom() {
    this.toggleCustomPanel();
    if(this.terminalCollapsed) {
      this.terminalCollapsed = !this.terminalCollapsed;
    }
    this.runCustomCase();
  }

  runTestCases() {
    let testRunId = `${this.appId}-${this.testId}-testcases`;
    let testCaseData = {
      script: this.aceEditor.directiveRef.getValue(),
      testCases: this.test.test_cases,
      testParameters: this.test.test_parameters,
      testRunId: testRunId,
      testExecutionTime: this.test.test_execution_time
    };
    console.log(testCaseData);
    this.testService.runTestCases(testCaseData).subscribe(
      (res) => {
        console.log(res);
        this.runningTestCases = true;
        for(let i = 0; i < this.testCasesWithOutput.length; i++) {
          this.testCasesWithOutput[i].loading = true;
        }
        this.listenToTest(testRunId);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  updateTestCase(data) {
    this.testCasesWithOutput[data.index].verdict = data.verdict;
    if(data.verdict.includes('ERROR')) {
      this.testCasesWithOutput[data.index].userOutput = `${data.verdict}: ${data.output}`;
    }
    else {
      this.testCasesWithOutput[data.index].userOutput = `${data.output}\nExecution time: ${data.timeTaken/1000.0} seconds`;
    }
    this.testCasesWithOutput[data.index].loading = false;
    if(data.index === this.activeTestCase) {
      this.checkTestCase(data.index);
    }
  }

  runCustomCase() {
    this.customInputValue = this.customCase.directiveRef.getValue();
    const testRunId = `${this.appId}-${this.testId}-custom`;
    const testCaseData = {
      script: this.aceEditor.directiveRef.getValue(),
      inputRaw: this.customInputValue,
      outputRaw: null,
      testParameters: this.test.test_parameters,
      testRunId: testRunId,
      testExecutionTime: this.test.test_execution_time
    };
    console.log(testCaseData);
    this.testService.runCustomCase(testCaseData).subscribe(
      (res) => {
        //loadingSpinner
        this.runningCustomTest = true;
        this.listenToTest(testRunId, true);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  listenToTest(testRunId, fromCustom?: boolean) {
    this.socketService.subscribeToEvents('testRun', testRunId);
    const _socketSub = this.socketService.socketEvent.subscribe(
      (res) => {
        console.log(res);
        if(fromCustom) {
          this.updateCustomCase(res.payload);
          this.socketService.unsubscribeFromEvents('testRun', testRunId);
          _socketSub.unsubscribe();
        }
        else {
          this.updateTestCase(res.payload);
          this.testCaseReceivedCount++;
          if(this.testCaseReceivedCount === this.testCasesWithOutput.length) {
            this.testCaseReceivedCount = 0;
            this.runningTestCases = false;
            this.socketService.unsubscribeFromEvents('testRun', testRunId);
            _socketSub.unsubscribe();
          }
        }
        
      }
    )
  }

  updateTestCases(data) {
    console.log(data);
    for(let i = 0; i < this.testCasesWithOutput.length; i++) {
      this.testCasesWithOutput[i].verdict = data.outputs[i].verdict
      if(data.outputs[i].verdict.includes('ERROR')) {
        this.testCasesWithOutput[i].userOutput = `${data.outputs[i].verdict}: ${data.outputs[i].output}`;
      }
      else {
        this.testCasesWithOutput[i].userOutput = `${data.outputs[i].output}\nExecution time: ${data.outputs[i].timeTaken/1000.0} seconds`;      }
      
      if(i === this.testCasesWithOutput.length-1) {
        this.checkTestCase(this.activeTestCase);
        this.runningTestCases = false;
      }
    }
  }

  updateCustomCase(data) {
    if(data.verdict.includes('ERROR')) {
      this.customOutput.directiveRef.setValue(`${data.verdict}: ${data.output}`);
    }
    else {
      this.customOutput.directiveRef.setValue(`${data.output}`);
    }
    this.runningCustomTest = false;
  }

  toggleTerminal() {
    this.terminalCollapsed = !this.terminalCollapsed;
    if(!this.initializedTerminal) {
      this.initializeTerminal();
    }
  }

  toggleTestPanel() {
    this.activePanel = 'testcase';
    if(!this.initializedTerminal) {
      this.initializeTerminal();
    }
  }

  toggleCustomPanel() {
    this.activePanel = 'customcase';
  }

  initializeTerminal() {
      this.checkTestCase(0);
      this.initializedTerminal = true;
      
      this.inputCase.directiveRef.ace().resize();
      this.outputCase.directiveRef.ace().resize();
      this.expectedCase.directiveRef.ace().resize();
      this.customCase.directiveRef.ace().resize();
      this.customOutput.directiveRef.ace().resize();
  }

  checkTestCase(caseIndex) {
    this.activeTestCase = caseIndex;
    this.hiddenCase = this.test.test_cases[caseIndex].testCaseHidden;
    console.log(this.test.test_cases[caseIndex]);
    console.log(this.testCasesWithOutput[caseIndex]);
    this.inputCase.directiveRef.setValue(this.testCasesWithOutput[caseIndex].testCaseInputRaw.replace(/\\n/g, '\n'));
    this.outputCase.directiveRef.setValue(this.testCasesWithOutput[caseIndex].userOutput);
    this.expectedCase.directiveRef.setValue(this.testCasesWithOutput[caseIndex].testCaseOutputRaw.replace(/\\n/g, '\n'));
  }

  submitCode() {
    for(let i = 0; i < this.test.test_cases.length; i++) {
      delete this.test.test_cases[i].userOutput;
    }
    const payload = {
      appId: this.appId,
      testId: this.testId,
      script: this.aceEditor.directiveRef.getValue(),
      testTitle: this.test.test_title,
      testExecutionTime: this.test.test_execution_time,
      testFileUrls: this.test.test_file_urls,
      testParameters: this.test.test_parameters,
      testTotal: this.test.test_total,
      testDuration: 0,
      dateTaken: new Date().getTime()
    }
    this.jobService.submitApplicationTestCode(payload).subscribe(
      (res) => {
        console.log(res);
        this.goToSubmitPage();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  goToSubmitPage() {
    this.router.navigate(['seeker/apps/test/answer/submit'], {queryParams: {
      testid: this.testId,
      appid: this.appId
    }});
  }

}
