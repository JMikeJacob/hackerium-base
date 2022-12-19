import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { TestService } from '../services/test.service';
import { JobService } from '../services/job.service';
import { SocketService } from '../services/socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { AceComponent, AceDirective, AceConfigInterface } from 'ngx-ace-wrapper';

import 'brace';
import 'brace/mode/text';
import 'brace/theme/github';
import 'brace/theme/clouds';
import 'brace/mode/javascript';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-technical-interview',
  templateUrl: './technical-interview.component.html',
  styleUrls: ['./technical-interview.component.css']
})
export class TechnicalInterviewComponent implements OnInit {

  // results$: Observable<any>;
  subject = new Subject();
  
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
  _testCaseSub: Subscription

  code: string= 'function x() {\nconsole.log("Hello world!");\n}';
  userId: string
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
  
  runningCustomTest: boolean
  runningTestCases: boolean
  //runningTestCasesArray

  customInputValue: string
  customOutputValue: string

  currentInterview: any

  testCaseReceivedCount: number

  testCaseInput: string = ''
  testCaseOutput: string = ''

  __querySub: Subscription
  constructor(private testService: TestService,
              private jobService: JobService,
              private socketService: SocketService,
              private route: ActivatedRoute,
              private cookieService: CookieService,
              private router: Router) { }

  ngOnInit() {
    this.initializedTerminal = false;
    this.testCaseReceivedCount = 0;
    this.loading = true;
    this.hiddenCase = false;
    this.runningCustomTest = false;
    this.runningTestCases = false;
    this.terminalCollapsed = true;
    this.usedRunButton = false;
    this.activePanel = 'testcase';
    this.activeTestCase = 0;

    this.subject.pipe(
      debounceTime(400)
    ).subscribe(() => {
      this.editInterview();
    })
    this.__querySub = this.route.queryParamMap.subscribe(
      (res:any) => {
        if(this.cookieService.get('role') === 'seeker') {
          this.userId = this.cookieService.get('user_id')
        }
        else if(this.cookieService.get('role') === 'employer') {
          this.userId = this.cookieService.get('posted_by_id');
        }
        else {
          this.userId = this.generateId(8);
        }
        this.appId = res.params.appid;

        this.jobService.getApplicationTestResult(res.params.appid).subscribe(
          (res) => {
            console.log(res);
            this.test = res.data;
            this.testCasesWithOutput = res.data.test_cases;
            this.editorValue = res.data.script.replace(/\\n/g, '\n');

            this.socketService.subscribeToInterview(this.appId, this.editorValue);
        
            for(let i = 0; i < this.testCasesWithOutput.length; i++) {
              this.testCasesWithOutput[i].userOutput = '';
              this.testCasesWithOutput[i].loading = false;
            }

            this.jobService.getInterview(this.appId).subscribe(
              (res) => {
                if(res.data) {
                  this.editorValue = res.data.script.replace(/\\n/g, '\n');
                }
                this.loading = false;
                this.joinInterview(this.appId, this.editorValue);
              },
              (err) => {
                console.error(err);
              }
            )
            
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
    })
    
  }

  joinInterview(appId, script) {
    // this.socketService.getInterview(appId);
    this.socketService.subscribeToEvents('application', this.appId);
    this._socketSub = this.socketService.socketEvent.subscribe(
      (event) => {
        console.log(event);
        this.editorValue = event.payload.interviewScript.replace(/\\n/g, '\n');
      }
    );
    // this.socketService.getInterview(appId);


  }

  leaveInterview(appId) {
    this._socketSub.unsubscribe();
    this.socketService.unsubscribeFromInterview(appId);
    this.socketService.unsubscribeFromEvents('application', this.appId);
  }

  onKeyUp() {
    this.subject.next();
  }
  
  editInterview() {
    this.socketService.editInterview(this.appId, this.aceEditor.directiveRef.getValue())
  }

  onInitCustomOutput(editor) {
    this.customOutput = editor;
  }

  toggleTerminalRun() {
    if(this.activePanel === 'testcase') {
      this.toggleTerminalRunTests();
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
    let testRunId = `${this.appId}-${this.userId}-testcases`;
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

  runCustomCase() {
    this.customInputValue = this.customCase.directiveRef.getValue();
    const testRunId = `${this.appId}-${this.userId}-custom`;
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
          // _socketSub.unsubscribe();
        }
        else {
          this.updateTestCase(res.payload);
          this.testCaseReceivedCount++;
          if(this.testCaseReceivedCount === this.testCasesWithOutput.length) {
            this.testCaseReceivedCount = 0;
            this.runningTestCases = false;
            this.socketService.unsubscribeFromEvents('testRun', testRunId);
            // _socketSub.unsubscribe();
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
        this.testCasesWithOutput[i].userOutput = `${data.outputs[i].output}\nExecution time: ${data.outputs[i].timeTaken/1000.0} seconds`;      
      }
      
      if(i === this.testCasesWithOutput.length-1) {
        this.checkTestCase(this.activeTestCase);
        this.runningTestCases = false;
      }
    }
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

  updateCustomCase(data) {
    if(data.verdict.includes('ERROR')) {
      this.customOutput.directiveRef.setValue(`${data.verdict}: ${data.output}`);
    }
    else {
      this.customOutput.directiveRef.setValue(`${data.output}\nExecution time: ${data.timeTaken/1000.0} seconds`);
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

  generateId(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  ngOnDestroy() {
    this.leaveInterview(this.appId);
  }


}
