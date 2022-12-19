const _ = require('lodash');
const shortid = require('shortid');
const helper = require('../../utils/helper');
const CONSTANTS = require('../../utils/constants');

const controller = (readRepository, commandHandler, broker) => {
    this.repo = readRepository;
    this.commandHandler = commandHandler;
    this.broker = broker;

    /* TO WRITE MODEL */
    this.createTest = async (req, res, next) => {
        try {
            const testId = shortid.generate();

            //upload to S3

            let promiseLoop = [];

            //input files
            for(let i = 0; i < req.body.testCases.length; i++) {
                let promise = helper.uploadFileToS3(testId, 
                                                    CONSTANTS.AWS.UPLOAD_TYPES.TEST, 
                                                    CONSTANTS.AWS.BUCKET, 
                                                    'input-' + (i.toString().padStart(3, '0')),
                                                    CONSTANTS.AWS.EXTENSIONS.TEXT,
                                                    CONSTANTS.AWS.CONTENT_TYPES.TEXT,
                                                    req.body.testCases[i].testCaseInputRaw
                                                    );
                promiseLoop.push(promise);
            }

            //output file
            let outputPromise = helper.uploadFileToS3(testId, 
                                                  CONSTANTS.AWS.UPLOAD_TYPES.TEST, 
                                                  CONSTANTS.AWS.BUCKET, 
                                                  'output',
                                                  CONSTANTS.AWS.EXTENSIONS.TEXT,
                                                  CONSTANTS.AWS.CONTENT_TYPES.TEXT,
                                                  req.body.testOutputString
                                                  );
            promiseLoop.push(outputPromise);

            //JSON file for descriptions
            

            let jsonPromise = helper.uploadFileToS3(testId, 
                                                  CONSTANTS.AWS.UPLOAD_TYPES.TEST, 
                                                  CONSTANTS.AWS.BUCKET, 
                                                  'description',
                                                  CONSTANTS.AWS.EXTENSIONS.JSON,
                                                  CONSTANTS.AWS.CONTENT_TYPES.JSON,
                                                  req.body.testDescription);

            promiseLoop.push(jsonPromise);

            let fileUrls = await Promise.all(promiseLoop).catch((err) => { throw err; });

            const boilerplate = helper.constructBoilerplate(req.body.testTitle, req.body.testParameters);
    
            this.commandHandler.sendCommand({
                commandType: CONSTANTS.COMMANDS.CREATE_TEST,
                aggregateId: testId,
                payload: {
                    testId: testId,
                    testTitle: req.body.testTitle,
                    testTotal: req.body.testTotal,
                    testDifficulty: req.body.testDifficulty,
                    testExecutionTime: req.body.testExecutionTime,
                    testFileUrls: fileUrls,
                    testParameters: req.body.testParameters,
                    testBoilerplate: boilerplate,
                    companyId: req.body.companyId,
                    createdAt: new Date().getTime()
                }
            })
            .then(() => {
                res.status(200).send({success: {statusCode:200, message: "Test Created!", testId: testId}});
            }).catch((err) => {
                console.log(err)
                throw err;
            })
    
        } catch(err) {
            console.error(err)
            if(err.message === CONSTANTS.ERROR_MESSAGES.NO_COMPANY) {
                res.status(404).send({error: {statusCode:404, message:err.message, errorCode: 1104}})
            }
            else {
                res.status(500).send({error: {statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            }
        }
    }

    this.getSignedUrls = async (req, res, next) => {
        try {

            const testId = shortid.generate();

            let promiseLoop = [];

            //input files
            for(let i = 0; i < req.query.inputAmount; i++) {
                let promise = helper.getSignedUrl(testId, 
                                                    CONSTANTS.AWS.UPLOAD_TYPES.TEST, 
                                                    CONSTANTS.AWS.BUCKET, 
                                                    'input-' + (i.toString().padStart(3, '0')),
                                                    CONSTANTS.AWS.EXTENSIONS.TEXT,
                                                    CONSTANTS.AWS.CONTENT_TYPES.TEXT,
                                                    );
                promiseLoop.push(promise);
            }

            //output file
            let outputPromise = helper.getSignedUrl(testId, 
                                                  CONSTANTS.AWS.UPLOAD_TYPES.TEST, 
                                                  CONSTANTS.AWS.BUCKET, 
                                                  'output',
                                                  CONSTANTS.AWS.EXTENSIONS.TEXT,
                                                  CONSTANTS.AWS.CONTENT_TYPES.TEXT);
            promiseLoop.push(outputPromise);

            //JSON file for descriptions
            let jsonPromise = helper.getSignedUrl(testId, 
                                                  CONSTANTS.AWS.UPLOAD_TYPES.TEST, 
                                                  CONSTANTS.AWS.BUCKET, 
                                                  'description',
                                                  CONSTANTS.AWS.EXTENSIONS.JSON,
                                                  CONSTANTS.AWS.CONTENT_TYPES.JSON);

            promiseLoop.push(jsonPromise);

            let signedUrls = await Promise.all(promiseLoop);

            res.status(200).send({id: testId, data: signedUrls});

        } catch(err) {
            console.error(err);
            res.status(500).send({error: {statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}});
        }
    }

    this.editTest = (req, res, next) => {
        
        this.commandHandler.sendCommand({
            commandType: CONSTANTS.COMMANDS.EDIT_TEST,
            aggregateId: req.params.id,
            payload: {
                testId: req.params.id,
                testTitle: req.body.testTitle,
                testTotal: req.body.testTotal,
                testDifficulty: req.body.testDifficulty,
                testBody: req.body.testBody,
                testFunctionDesc: req.body.testFunctionDesc,
                testInputFormat: req.body.testInputFormat,
                testConstraints: req.body.testConstraints,
                testOutputFormat: req.body.testOutputFormat,
                testSampleCases: req.body.testSampleCases,
                testExecutionTime: req.body.testExecutionTime,
                testCases: req.body.testCases,
                companyId: req.body.companyId,
                updatedAt: new Date().getTime()
            }
        })
        .then(() => {
            res.status(200).send({success: {statusCode:200, message: "Test Edited!"}})
        }).catch((err) => {
            console.log(err)
            if(err.message === CONSTANTS.ERROR_MESSAGES.NO_COMPANY) {
                res.status(404).send({error: {statusCode:404, message:err.message, errorCode: 1104}})
            }
            else {
                res.status(500).send({error: {statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            }
        })
    }

    this.deleteTest = (req, res, next) => {
        try {
            this.commandHandler.sendCommand({
                commandType: CONSTANTS.COMMANDS.DELETE_TEST,
                aggregateId: req.params.id,
                payload: {
                    testId: req.params.id,
                }
            })
            .then(() => {
                res.status(200).send({success: {statusCode:200, message:"Test deleted!"}})
            }).catch((err) => {
                console.error(err)
                if(err.message === CONSTANTS.ERROR_MESSAGES.NO_TEST) {
                    res.status(404).send({error:{statusCode:404, message: CONSTANTS.ERROR_MESSAGES.NO_TEST, errorCode: 1204}})
                }
                else {
                    res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                }
            })
        }
        catch(err) {
            console.error(err)
            res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        }
    }

    /* TO READ MODEL */

    this.getTestsPerCompany = (req, res, next) => {
      this.repo.getTestsEmployer(req.params.id).then((results) => {
            if(results.length===0) {
              res.status(200).send({data: {count: 0}})
          }
          else {
              res.status(200).send({data: {count: results.length, tests: results}})
          }
      }).catch((err) => {
            console.log(err)
            res.status(500).send({error: {statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    }

    this.getTestsTakenApplicant = (req, res, next) => {
        this.repo.getTestsTakenApplicant(req.params.id).then((results) => {
            if(results.length===0) {
                res.status(200).send({data: {count: 0}})
            }
            else {
                res.status(200).send({data: {count: results.length, tests: results}})
            }
        }).catch((err) => {
            console.error(err)
            res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    }

    this.getTestTakers = (req,res, next) => {
        this.repo.getTestTakers(req.params.id).then((results) => {
            if(results.length===0) {
                res.status(200).send({data: {count: 0}})
            }
            else {
                res.status(200).send({data: {count: results.length, applicants: results}})
            }
        }).catch((err) => {
            console.error(err)
            res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    }

    this.getTest = async (req, res, next) => {
        try {
            const testId = req.params.id;

            let test = await this.repo.getTestByIdKVS({testId: testId});
            
            if(!test.data) {
                test = await this.repo.getTestById({testId: testId});
                if(!test.data.test_id) {
                    throw new Error(CONSTANTS.ERROR_MESSAGES.NO_TEST);
                }
                else {
                    let fileUrls = JSON.parse(test.data.test_file_urls);
                    let testCaseInputs = [];
                    let promiseLoop = [];
                    //get inputs
                    for(let i = 0; i < fileUrls.length - 2; i++) {
                        let promise = helper.getObjectFromS3Text(CONSTANTS.AWS.BUCKET, 
                                                                 fileUrls[i].split('/')[fileUrls[i].split('/').length - 1]);

                        promiseLoop.push(promise);
                    }

                    testCaseInputs = await Promise.all(promiseLoop).catch((err) => { throw err; });

                    outputString = await helper.getObjectFromS3Text(CONSTANTS.AWS.BUCKET, fileUrls[fileUrls.length-2].split('/')[fileUrls[fileUrls.length-2].split('/').length - 1])
                    
                    testCaseOutputString = outputString.slice(0, outputString.indexOf('hidden:'));
                    testCaseHiddenArray = outputString.slice(outputString.indexOf('hidden:')+7, outputString.length).split(',');

                    test.data.test_cases = [];
                    for(let i = 0; i < testCaseInputs.length; i++) {
                        test.data.test_cases.push({
                            testCaseInputRaw: testCaseInputs[i],
                            testCaseOutputRaw: testCaseOutputString.split('\n')[i],
                            testCaseHidden: (testCaseHiddenArray[i] === 'true')
                        });
                    }

                    descriptionString = await helper.getObjectFromS3Text(CONSTANTS.AWS.BUCKET, fileUrls[fileUrls.length-1].split('/')[fileUrls[fileUrls.length-1].split('/').length - 1])

                    test.data.test_description = JSON.parse(descriptionString);

                    res.status(200).send({payload: test});
                }
            }
            else {
                let fileUrls = test.data.test_file_urls;
                let testCaseInputs = [];
                let promiseLoop = [];
                //get inputs
                for(let i = 0; i < fileUrls.length - 2; i++) {
                    let promise = helper.getObjectFromS3Text(CONSTANTS.AWS.BUCKET, 
                                                                fileUrls[i].split('/')[fileUrls[i].split('/').length - 1]);

                    promiseLoop.push(promise);
                }

                testCaseInputs = await Promise.all(promiseLoop).catch((err) => { throw err; });

                outputString = await helper.getObjectFromS3Text(CONSTANTS.AWS.BUCKET, fileUrls[fileUrls.length-2].split('/')[fileUrls[fileUrls.length-2].split('/').length - 1])

                testCaseOutputString = outputString.slice(0, outputString.indexOf('hidden:'));
                testCaseHiddenArray = outputString.slice(outputString.indexOf('hidden:')+7, outputString.length).split(',');

                test.data.test_cases = [];
                for(let i = 0; i < testCaseInputs.length; i++) {
                    test.data.test_cases.push({
                        testCaseInputRaw: testCaseInputs[i],
                        testCaseOutputRaw: testCaseOutputString.split('\n')[i],
                        testCaseHidden: (testCaseHiddenArray[i] === 'true')
                    });
                }

                descriptionString = await helper.getObjectFromS3Text(CONSTANTS.AWS.BUCKET, fileUrls[fileUrls.length-1].split('/')[fileUrls[fileUrls.length-1].split('/').length - 1])

                test.data.test_description = JSON.parse(descriptionString);

                res.status(200).send({payload: test});
            }

        } catch(err) {
            console.error(err);
            if(err.message === CONSTANTS.ERROR_MESSAGES.NO_TEST) {
                res.status(404).send({error: {statusCode:404, message:err.message, errorCode: 1104}})
            }
            else {
                res.status(500).send({error: {statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            }
        }
    }

    this.getTestsPerPageEmployer = (req, res, next) => {
        try {
            // console.log(req.session.id)
            let start = 0
            let payload = {}
            // let id = 0
            const order = CONSTANTS.ORDERS.includes(req.query.order) ? req.query.order : 'created_at'
            const how = req.query.how==='asc' ? 'asc' : 'desc'
            const id = req.query.posted_by_id 
            const limit = +req.query.limit || 20
            if(!req.params.id || req.params.id < 0) {
                start = 0
            }
            else {
                start = limit * (req.params.id - 1) || 0
            }
            
            let search = (!req.query.search || req.query.search === '') ? null : req.query.search
            this.repo.getTestsPerPageEmployer(order, how, start, limit, id)
            .then((results) => {
                if(results.tests.length === 0) {
                //error 1200 = no jobs found
                //error 5000 = server error
                    res.status(200).send({data: {count: 0}})
                    return Promise.reject("no error")
                }
                else {
                    res.status(200).send({data: results})
                }
            }).catch((err) => {
                console.error(err)
                if(err != "no error") {
                    res.status(500).send({error:{statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                }
            })

        }
        catch(err) {
            console.error(err)
            if(err.message === 4000) {
                res.status(400).send({error:{statusCode:400, message: CONSTANTS.ERROR_MESSAGES.INVALID_PAGE, errorCode: 4000}})
            }
            else {
                res.status(500).send({error:{statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            }
        }
    }

    this.runScript = (req, res, next) => {
        try {
            //validate
            if(!req.body.script || !req.body.testParameters || !req.body.testRunId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REQUIRED);
            }

            const constructedTestCase = helper.constructTestCase(
                req.body.testParameters,
                {
                    testCaseInputRaw: req.body.inputRaw,
                    testCaseOutputRaw: req.body.outputRaw
                }
            );

            this.broker.publish(CONSTANTS.TOPICS.TEST_MS_CODE_ENGINE_TOPIC, {
                action: CONSTANTS.ENGINE.ACTIONS.EXECUTE_TEST_CASE,
                aggregateId: req.body.testRunId,
                payload: {
                    script: req.body.script,
                    input: constructedTestCase.testCaseInput,
                    output: constructedTestCase.testCaseOutput,
                    testRunId: req.body.testRunId,
                    testExecutionTime: req.body.testExecutionTime,
                    origin: CONSTANTS.ENGINE.TEST_CASE_ORIGIN.CLIENT
                }
            }, req.body.testRunId);
            
            res.status(200).send({success: {statusCode:200, message:"Test case sent!"}});
        }
        catch(err) {
            console.error(err)
            res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        }
    };

    this.runMultipleScripts = (req, res, next) => {
        try {
            let testCases = helper.constructTestCases(req.body.testParameters, req.body.testCases);

            for(let i = 0; i < testCases.length; i++) {
                this.broker.publish(CONSTANTS.TOPICS.TEST_MS_CODE_ENGINE_TOPIC, {
                    action: CONSTANTS.ENGINE.ACTIONS.EXECUTE_TEST_CASE,
                    aggregateId: req.body.testRunId,
                    payload: {
                        script: req.body.script,
                        input: testCases[i].testCaseInput,
                        output: testCases[i].testCaseOutput,
                        testRunId: req.body.testRunId,
                        testExecutionTime: req.body.testExecutionTime,
                        index: i,
                        origin: CONSTANTS.ENGINE.TEST_CASE_ORIGIN.CLIENT
                    }
                }, req.body.testRunId);
            }
            
            res.status(200).send({success: {statusCode:200, message:"Test cases sent!"}});
        }
        catch(err) {
            console.error(err)
            res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        }
    };

    return this;
}

    // seedTests: (req, res, next) => {
    //     let seed_amount = req.params.amount;
    //     let user_id = '';
    //     let user_num = '';
    //     let count = 0;
    //     let data = {
    //         email: '',
    //         password: 'password',
    //         lastname: 'Last',
    //         firstname: 'First',
    //         company: '',
    //         contact: '123456789'
    //     }

    //     let err_flag = false;
    //     for(let i = 0; i < seed_amount; i++) {
    //         if(err_flag) break;
    //         company_num = Math.floor(Math.random() * seed_amount).toString();
    //         user_id = 'company-' + '0'.repeat(seed_amount.toString().length - i.toString().length) + i.toString();
    //         data.company = 'Company #' + '0'.repeat(seed_amount.toString().length - i.toString().length) + i.toString();
    //         data.email = 'compmail' + '0'.repeat(seed_amount.toString().length - i.toString().length) + i.toString() + '@gmail.com';
    //         commandHandler.sendCommand({
    //             commandType: CONSTANTS.COMMANDS.REGISTER_COMPANY,
    //             aggregateId: user_id,
    //             payload: {
    //                 userId: user_id,
    //                 companyName: data.company,
    //                 email: data.email,
    //                 password: data.password,
    //                 lastName: data.lastname,
    //                 firstName: data.firstname,
    //                 contact: data.contact,
    //                 role: CONSTANTS.ROLES.EMPLOYER,
    //                 appNotifications: '0',
    //                 website: '',
    //                 description: '',
    //                 establishmentDate: '',
    //                 location: '',
    //                 picUrl: '',
    //                 picUrlOld: ''
    //             }
    //         })
    //         .then(() => {
    //             count++;
    //             if(count === +seed_amount) {
    //                 res.status(200).send('SEED COMPLETE');
    //             }
    //         }).catch((err) => {
    //             console.error(err);
    //             err_flag = true;
    //             res.status(400).send('error occurred');
    //         })
    //     }
    // }

module.exports = controller;