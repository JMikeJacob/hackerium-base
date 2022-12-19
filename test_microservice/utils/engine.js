const { VM } = require('vm2');
const async = require('async');

const CONSTANTS = require('./constants');
const helper = require('./helper');

const TestAggregate = require('../cqrs/aggregates/test.aggregate');

// async.queue
const requestQueue = async.queue(function(task, callback) {
    console.log(task);
    task.func();
    callback();
}, 5)

const engineQueue = async.queue(function(task, callback) {
    // console.log(task)
    task.func();
    callback();
}, 1);

//objectify engine (broker & commandhandler)

const engine = (broker, commandHandler) => {
    const _self = this;
    this.broker = broker;
    this.commandHandler = commandHandler;

    this.runScript = async (data) => {
        const vm = new VM({
            timeout: data.testExecutionTime,
            sandbox: data.input 
        });

        return new Promise( (resolve) => {
            try {
                let verdict = '';
                const start = new Date().getTime();
                const eval =  vm.run(data.script);
                const end = new Date().getTime();
                
                if(data.output === null) {
                    resolve({
                        // testCaseInput: data.input,
                        // testCaseOutput: data.output,
                        output: eval,
                        timeTaken: end-start,
                        verdict: CONSTANTS.ENGINE.VERDICTS.CUSTOM
                        // script: data.script
                    });
                }
                else if(data.output === eval) {
                    verdict = CONSTANTS.ENGINE.VERDICTS.CORRECT;
                }
                else {
                    verdict = CONSTANTS.ENGINE.VERDICTS.WRONG;
                }

                resolve({
                    // testCaseInput: data.input,
                    // testCaseOutput: data.output,
                    output: eval,
                    timeTaken: end-start,
                    verdict: verdict,
                    // script: data.script
                });
                
            } catch(err) {
                console.log(err.code);
                if(err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
                    resolve({
                        // testCaseInput: data.input,
                        // testCaseOutput: data.output,
                        errorCode: err.code,
                        output: 'Time limit exceeded',
                        verdict: CONSTANTS.ENGINE.VERDICTS.ERROR_TIMEOUT,
                        // script: data.script
                    })
                }
                else {
                    resolve({
                        // testCaseInput: data.input,
                        // testCaseOutput: data.output,
                        errorCode: err.code,
                        output: err.message,
                        verdict: CONSTANTS.ENGINE.VERDICTS.ERROR_RUNTIME,
                        // script: data.script
                    });
                }
            }
        })
    };

    this.runMultipleTests = async (data) => {
        return new Promise((resolve, reject) => {
            let promiseLoop = [];
            for(let i = 0; i < data.testCases.length; i++) {
                let promise = _self.runScript({
                    script: data.script,
                    input: data.testCases[i].testCaseInput,
                    output: data.testCases[i].testCaseOutput,
                    testExecutionTime: data.testExecutionTime
                });
                promiseLoop.push(promise);
            }

            Promise.all(promiseLoop)
            .then((res) => {
                console.log(res);
                resolve(res);
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
        })
    }

    this.runMultipleTestsFromMicroservice = (script, testFileUrls, testExecutionTime, testParameters) => {
        return new Promise(async (resolve, reject) => {
            try {
                let promiseLoop = [];
                let outputFile = testFileUrls[testFileUrls.length-2].split('/');
                let outputs = await helper.getObjectFromS3Text(CONSTANTS.AWS.BUCKET, outputFile[outputFile.length-1]);
                outputs = outputs.slice(0, outputs.indexOf('hidden:')).split('\n');
                for(let i = 0; i < testFileUrls.length - 2; i++) {
                    let promise = helper.getObjectFromS3Text(CONSTANTS.AWS.BUCKET, testFileUrls[i].split('/')[testFileUrls[i].split('/').length-1])
                                    .then((string) => {
                                        let testCase = helper.constructTestCase(testParameters, {
                                            testCaseInputRaw: string,
                                            testCaseOutputRaw: outputs[i]
                                        });
    
                                        return _self.runScript({
                                            script: script,
                                            input: testCase.testCaseInput,
                                            output: testCase.testCaseOutput,
                                            testExecutionTime: testExecutionTime
                                        });
                                    })
                                    .catch((err) => { 
                                            throw err; 
                                        });
                    promiseLoop.push(promise);
                }
    
                Promise.all(promiseLoop)
                .then((res) => {
                    console.log(res);
                    resolve(res);
                })
                .catch((err) => {
                    console.error(err);
                    throw err;
                });
            } catch(err) {
                reject(err);
            }
        })
    }

    //listener
    broker.subscribeToCodeEngine((message) => {
        try {
            if(message !== 'skip') {
                //test case sent
                if(message.action === CONSTANTS.ENGINE.ACTIONS.EXECUTE_TEST_CASE) {
                    engineQueue.push({func: async() => {
                        const eval = await this.runScript({
                            input: message.payload.input,
                            output: message.payload.output,
                            script: message.payload.script,
                            testExecutionTime: message.payload.testExecutionTime
                        });

                        if(message.payload.origin === CONSTANTS.ENGINE.TEST_CASE_ORIGIN.CLIENT) {
                            broker.publish(CONSTANTS.TOPICS.TEST_MS_CODE_ENGINE_TOPIC, {
                                action: CONSTANTS.ENGINE.ACTIONS.RESOLVE_TEST_CASE,
                                aggregateId: message.payload.testRunId,
                                payload: {
                                    output: eval.output,
                                    verdict: eval.verdict,
                                    timeTaken: eval.timeTaken,
                                    script: eval.script,
                                    errorCode: eval.errorCode,
                                    testRunId: message.aggregateId,
                                    index: message.payload.index
                                }
                            }, message.payload.testRunId)
                        }
                    }})
                }

                else if(message.action === CONSTANTS.ENGINE.ACTIONS.EXECUTE_TESTS) {
                    engineQueue.push({func: async() => {
                        if(message.payload.origin === CONSTANTS.ENGINE.TEST_CASE_ORIGIN.MICROSERVICE) {
                            message.payload.script = message.payload.script.replace(/\\n/g, '\n');
                            message.payload.script = message.payload.script.replace(/\\"/g, '"');

                            const evals = await _self.runMultipleTestsFromMicroservice(message.payload.script, 
                                                                                    message.payload.testFileUrls,
                                                                                    message.payload.testExecutionTime,
                                                                                    message.payload.testParameters);

                            //compute score here
                            let correctCases = 0.0;
                            for(let i = 0; i < evals.length; i++) {
                                if(evals[i].verdict === CONSTANTS.ENGINE.VERDICTS.CORRECT) {
                                    correctCases++;
                                }
                            }

                            const output = {
                                payload: {
                                    action: CONSTANTS.ENGINE.ACTIONS.RESOLVE_MICROSERVICE_TEST_CASES,
                                    appId: message.payload.appId,
                                    testOutput: evals,
                                    testScore: correctCases,
                                }
                            };
                            broker.publish(CONSTANTS.TOPICS.ENGINE_REQUEST_TOPIC, output, output.payload.appId)
                        }

                        else if(message.payload.origin === CONSTANTS.ENGINE.TEST_CASE_ORIGIN.CLIENT) {
                            const evals = await _self.runMultipleTests(message.payload);

                            broker.publish(CONSTANTS.TOPICS.TEST_MS_CODE_ENGINE_TOPIC, {
                                action: CONSTANTS.ENGINE.ACTIONS.RESOLVE_TEST_CASE,
                                aggregateId: message.payload.testRunId,
                                payload: {
                                    outputs: evals,
                                    testRunId: message.payload.testRunId
                                } 
                            }, message.payload.testRunId)
                        }
                    }})
                }
            }
            
        } catch(err) {
            console.error(err);
        }
    });

    broker.subscribeToEngineRequests((message) => {
        if(message.payload.action === CONSTANTS.ENGINE.ACTIONS.REQUEST_MICROSERVICE_TESTS) {
            broker.publish(CONSTANTS.TOPICS.TEST_MS_CODE_ENGINE_TOPIC, {
                action: CONSTANTS.ENGINE.ACTIONS.EXECUTE_TESTS,
                payload: {
                    appId: message.payload.appId,
                    script: message.payload.script,
                    testId: message.payload.testId,
                    testParameters: message.payload.testParameters,
                    testFileUrls: message.payload.testFileUrls,
                    testExecutionTime: message.payload.testExecutionTime,
                    origin: CONSTANTS.ENGINE.TEST_CASE_ORIGIN.MICROSERVICE
                }
            }, message.payload.appId)
        }
    });
}

module.exports = engine;