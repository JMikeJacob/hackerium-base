const _ = require('lodash');
const shortid = require('shortid');
const helper = require('../../utils/helper');
const CONSTANTS = require('../../utils/constants');

const controller = (readRepository, commandHandler) => {
    const __self = this;
    this.repo = readRepository;
    this.commandHandler = commandHandler;
    /* TO COMMAND MODEL */
    //create job post
    this.createJobPost = (req, res, next) => {
        let id = ''
        try {
            const companyId = req.body.posted_by_id;
            const tags = helper.stringifyTags(req.body.tags);
            const jobId = shortid.generate();
            if(!req.body.job_name || !req.body.company_name || !req.body.date_deadline) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REQUIRED)
            }
            if(!helper.validateInt(req.body.date_posted) || !helper.validateInt(req.body.date_deadline)) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_DATE)
            }
            __self.commandHandler.sendCommand({
                commandType: CONSTANTS.COMMANDS.CREATE_JOB_POST,
                aggregateId: jobId,
                payload: {
                    jobId: jobId,
                    companyId: companyId,
                    jobName: req.body.job_name,
                    typeId: req.body.type[0],
                    typeName: req.body.type[1],
                    fieldId: req.body.field[0],
                    fieldName: req.body.field[1],
                    levelId: req.body.level[0],
                    levelName: req.body.level[1],
                    jobLocation: req.body.job_location,
                    description: req.body.description,
                    qualifications: req.body.qualifications,
                    isOpen: 'yes',
                    datePosted: req.body.date_posted,
                    dateDeadline: req.body.date_deadline,
                    tags: tags || ''
                }
            })
            .then(() => {
                res.status(200).send({success: {statusCode:200, message: "Job Post Created!"}})
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
        catch(err) {
            console.log(err)
            res.status(400).send({error: {statusCode:400, message:err.message, errorCode: 4000}})
        }
    },

    //edit job post
    this.editJobPost = (req, res, next) => {
        try {
            if(!req.body.job_name || !req.body.date_deadline) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REQUIRED)
            }
            if(!helper.validateInt(req.body.date_deadline)) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_DATE)
            }
            const tags = helper.stringifyTags(req.body.tags);
            __self.commandHandler.sendCommand({
                commandType: CONSTANTS.COMMANDS.EDIT_JOB_POST,
                aggregateId: req.params.id,
                payload: {
                    jobId: req.params.id,
                    companyId: req.body.posted_by_id,
                    jobName: req.body.job_name,
                    typeId: req.body.type[0],
                    typeName: req.body.type[1],
                    fieldId: req.body.field[0],
                    fieldName: req.body.field[1],
                    levelId: req.body.level[0],
                    levelName: req.body.level[1],
                    jobLocation: req.body.job_location,
                    description: req.body.description,
                    qualifications: req.body.qualifications,
                    isOpen: req.body.is_open,
                    datePosted: req.body.date_posted,
                    dateDeadline: req.body.date_deadline,
                    tags: tags
                }
            })
            .then(() => {
                res.status(200).send({message: "Job Post Updated!"})
            }).catch((err) => {
                console.log(err)
                if(err.message === error_messages.no_existing) {
                    res.status(404).send({error: {statusCode:404, message:err.message, errorCode: 1204}})
                }
                else {
                    res.status(500).send({error: {statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                }
            })
        }
        catch(err) {
            console.log(err)
            res.status(400).send({error: {statusCode:400, data: req.body, message:err.message, errorCode: 4000}})
        }
    },

    //delete job post
    this.deleteJobPost = (req, res, next) => {
        try {
            __self.commandHandler.sendCommand({
                commandType: CONSTANTS.COMMANDS.DELETE_JOB_POST,
                aggregateId: req.params.id,
                payload: {
                    jobId: req.params.id,
                }
            })
            .then(() => {
                res.status(200).send({success: {statusCode:200, message:"Job Post deleted!"}})
            }).catch((err) => {
                console.error(err)
                if(err.message === CONSTANTS.ERROR_MESSAGES.NO_JOB) {
                    res.status(404).send({error:{statusCode:404, message: CONSTANTS.ERROR_MESSAGES.NO_JOB, errorCode: 1204}})
                }
                else {
                    res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                }
            })
        }
        catch(err) {
            console.error(err)
            res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 500}})
        }
    },

     //apply for job
    this.applyForJob = (req, res, next) => {
        //check if jobseeker
        const appId = shortid.generate()

        __self.commandHandler.sendCommand({
            commandType: CONSTANTS.COMMANDS.SUBMIT_APPLICATION,
            aggregateId: appId,
            payload: {
                appId: appId,
                userId: req.body.user_id,
                companyId: req.body.posted_by_id,
                jobId: req.body.job_id,
                status: CONSTANTS.APPLICATION_STATUS.PENDING,
                datePosted: req.body.date_posted
            }
        })
        .then(() => {
            const msg = "User " + req.body.userId + " applied for " + req.body.jobId;
            res.status(200).send({app_id: appId});
            // console.log(app_id)
        })
        // .then(() => {
        //     return __self.repo.getEmailValues(req.body.user_id, req.body.posted_by_id, req.body.job_id)
        // })
        // .then((results) => {
            // console.log(results)
            // const emailValuesSeeker = {
            //     company_name: results.employer.company_name,
            //     first_name: results.seeker.first_name,
            //     last_name: results.seeker.last_name,
            //     job_name: results.job.job_name,
            //     date_posted: new Date(req.body.date_posted),
            //     to_address: results.employer.email,
            //     employer_name: results.employer.first_name + " " + results.employer.last_name,
            //     employer_email: results.employer.email,
            //     contact_no: results.employer.contact_no
            // }
            // const emailValues = {
            //     company_name: results.employer.company_name,
            //     first_name: results.seeker.first_name,
            //     last_name: results.seeker.last_name,
            //     job_name: results.job.job_name,
            //     date_posted: new Date(req.body.date_posted),
            //     to_address: results.employer.email,
            //     employer_name: results.employer.first_name + " " + results.employer.last_name
            // }
            // console.log(emailValues)
            // helper.sendAppAlertToEmployer(emailValues)
            // helper.sendAppAlertToSeeker(emailValuesSeeker)
        // })
        .catch((err) => {
            console.log(err)
            if(err.message === error_messages.no_job) {
                res.send({error: {statusCode: 403}})
            }
            else {
                res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            }
        })
    },

    //delete application
    this.deleteApplication = (req, res, next) => {
        __self.commandHandler.sendCommand({
            commandType: CONSTANTS.COMMANDS.WITHDRAW_APPLICATION,
            aggregateId: req.params.id,
            payload: {
                appId: req.params.id
            }
        })
        .then(() => {
                res.status(200).send({data: "Delete Success!"})
        })
        .catch((err) => {
            console.error(err)
            if(err.message === CONSTANTS.ERROR_MESSAGES.APPLICATION_PROCESSED) {
                res.status(403).send({error: {statusCode: 403, message: "cannot withdraw processed application", errorCode: 4003}})
            }
            else {
                res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            }
        })
    },

    //change application status
    this.editApplicationStatus = (req, res, next) => {
        console.log(req.body)
        __self.commandHandler.sendCommand({
            commandType: CONSTANTS.COMMANDS.CHANGE_APPLICATION_STATUS,
            aggregateId: req.params.id,
            payload: {
                appId: req.params.id,
                status: req.body.status
            }
        })
        // .then(() => {
        //     return __self.repo.getEmailValuesResult(req.body.user_id, req.params.id)
        // })
        // .then((results) => {
        //     console.log(results)
        //     const emailValuesSeeker = {
        //         company_name: results.employer.company_name,
        //         first_name: results.seeker.first_name,
        //         last_name: results.seeker.last_name,
        //         job_name: results.job.job_name,
        //         // date_posted: new Date(req.body.date_posted),
        //         to_address: results.seeker.email,
        //         employer_name: results.employer.first_name + " " + results.employer.last_name,
        //         employer_email: results.employer.email,
        //         contact_no: results.employer.contact_no,
        //         result: req.body.status
        //     }
        //     console.log(emailValuesSeeker)
        //     helper.sendResultAlertToSeeker(emailValuesSeeker)
        // })
        .then(() => {
            res.status(200).send({success: {job: req.params.id, data: req.body}})
        }).catch((err) => {
            console.log(err)
            res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    },

    this.sendApplicationTest = (req, res, next) => {
        __self.commandHandler.sendCommand({
            commandType: CONSTANTS.COMMANDS.SEND_APPLICATION_TEST,
            aggregateId: req.params.id,
            payload: {
                appId: req.params.id,
                testId: req.body.testId,
                status: req.body.status
            }
        })
        .then(() => {
            res.status(200).send({success: {app: req.params.id, data: req.body}})
        }).catch((err) => {
            console.log(err)
            res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    },

    this.submitApplicationTestCode = (req, res, next) => {
        const script = helper.stringifyScript(req.body.script);
        // const sampleCases = helper.stringifyTestCases(req.body.testSampleCases);
        // const testCases = helper.stringifyTestCases(req.body.testCases);
        __self.commandHandler.sendCommand({
            commandType: CONSTANTS.COMMANDS.SUBMIT_APPLICATION_TEST_CODE,
            aggregateId: req.body.appId,
            payload: {
                appId: req.body.appId,
                status: CONSTANTS.APPLICATION_STATUS.PROCESSING_TEST,
                testId: req.body.testId,
                script: script,
                testTitle: req.body.testTitle,
                testExecutionTime: req.body.testExecutionTime,
                testFileUrls: req.body.testFileUrls,
                testParameters: req.body.testParameters,
                testDuration: req.body.testDuration,
                testTotal: req.body.testTotal,
                dateTaken: req.body.dateTaken
            }
        })
        .then(() => {
            res.status(200).send({success: {app: req.body.appId, data: req.body}})
        }).catch((err) => {
            console.log(err)
            res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    },

    /* TO READ MODEL */
    //view all jobs
    this.getJobList = (req, res, next) => {
        __self.repo.getJobList().then((data) => {
            if(data.length === 0) {
                res.status(200).send({data: {count: 0}})
            }
            else {
                
                res.status(200).send({data: data})
            }
        }).catch((err) => {
            console.log(err)
            res.status(500).send({error:{statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 1}})
        })
    },

    //view job post
    this.getJobById = (req, res, next) => {
        let payload = {}
        __self.repo.getJobByIdKVS(req.params.id).then((data) => {
            if(data) {
                console.log(data)
                if(req.params.id === data.job_id) {
                    console.log("in redis")
                    return Promise.resolve([data])
                }
            }
            console.log("not in redis")
            return __self.repo.getJobById(req.params.id)})
        .then((data) => {
            if(data.length === 0) {
                res.status(404).send({error: {statusCode: 404, message: "job not posted", errorCode: 1}})
                return Promise.resolve("nojob")
            }
            else {
                payload = data[0]
                return __self.repo.getJobTags(req.params.id)
            }
        }).then((data) => {
            if(data !== "nojob") {
                console.log(data)
                // payload.tags = JSON.parse(data)
                payload.tags = '';
                console.log(payload)
                res.status(200).send({data: payload})
            } 
        }).catch((err) => {
            console.log(err)
            res.send({error:{statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 1}})
        })
    },

    //recommended jobs
    this.getRecommendedJobs = (req, res, next) => {
        const order = CONSTANTS.ORDERS.includes(req.query.order) ? req.query.order : 'date_posted'
        const how = req.query.how==='asc' ? 'asc' : 'desc'
        if(req.params.id === '') {
            //error 4000 = bad request
            throw Error(4000)
        }
        // if(req.params.id === '') req.params.id = ''
        const limit = req.query.limit || 20
        const start = limit * (req.params.page - 1) || 0
        let counts = []
        let total = 0
        __self.repo.getSeekerById(req.params.id).then((data) => {
            if(data.length === 0) {
                return Promise.reject(new Error(error_messages.no_match))
            }
            else {
                return Promise.resolve()
            }
        }).then(() => {
                return __self.repo.getMatchingTags(req.params.id, start, limit)
        }).then((results) => {
            console.log(results)
            if(results.length === 0) {
                res.status(200).send({data:{count: 0, jobs: []}})
                return Promise.resolve()
            }
            total = results[0].length
            for(let i = 0; i < results[0].length; i++) {
                counts.push(results[0][i].match_count)
            }


            Promise.all(results[0].map((key) => {
                        return __self.repo.getJobById(key.job_id)
                    }))
                    .then((results) => {
                        console.log(results)
                        const jobs = []
                        for(let i = 0; i < results.length; i++){
                            results[i][0].count = counts[i]
                            jobs.push(results[i][0])
                        }
                        res.status(200).send({data:{count: total, jobs: jobs}})
                    })
        }).catch((err) => {
            console.log(err)
            if(err.message === error_messages.no_match) {
                //1205 - no matching jobs
                res.status(404).send({error: {statusCode: 404, message: error_messages.no_match, errorCode: 1205}})
            }
            else {
                res.status(500).send({error:{statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            }
        })
    },

    this.getJobsPerPage = (req, res, next) => {
        try {
            let payload = {}
            const order = CONSTANTS.ORDERS.includes(req.query.order) ? req.query.order : 'date_posted'
            const how = req.query.how==='asc' ? 'asc' : 'desc'
            if(req.params.id < 0) {
                //error 4000 = bad request
                throw Error(4000)
            }
            // if(req.params.id === 0) req.params.id = 1
            const limit = +req.query.limit || 20
            const start = limit * (+req.params.id - 1) || 0
            console.log(req.params)
            /* WITH FILTER */
            // if(req.query.l || req.query.f || req.query.t) {
                // __self.repo.getJobsPerPage
                // console.log(req.query.t)
                // let filter_flags = []
                // let levels = []
                // let fields = []
                // let types = []
                // if(req.query.l && req.query.l !== "") {
                //     filter_flags.push("levels")
                //     levels = req.query.l ? req.query.l.split(';') : null
                // }
                // if(req.query.t && req.query.t!== "") {
                //     filter_flags.push("types")
                //     types = req.query.t ? req.query.t.split(';') : null
                // }
                // if(req.query.f && req.query.f !== "") {
                //     filter_flags.push("fields")
                //     fields = req.query.f ? req.query.f.split(';') : null
                // }
                // Promise.resolve().then(() => {
                //     /* LEVEL TIER */
                //     if(filter_flags.includes("levels")) { // 1 X X
                //         return __self.repo.getJobsWithLevels(helper.stringifyTagsSQL(levels))
                //     }
                //     else { // 0 X X
                //         return Promise.resolve("no levels")
                //     }
                // }).then((results) => {
                //     /* TYPE TIER */
                //     if(!results || results.length === 0) {
                //         res.status(200).send({data: {count: 0}})
                //         return Promise.reject("no error")
                //     }
                //     if(results === "no levels") { // 0 X X
                //         if(filter_flags.includes("types")) { // 0 1 X
                //             return __self.repo.getJobsWithTypesStart(helper.stringifyTagsSQL(types))
                //         }
                //         else { // 0 0 X
                //             return Promise.resolve("no types nor levels")
                //         }
                //     }
                //     else { // 1 X X
                //         if(filter_flags.includes("types")) { // 1 1 X
                //             return __self.repo.getJobsWithTypes(helper.stringifyTagsSQL(types), helper.extractJobIdsSQL(results))
                //         }
                //         else { // 1 0 X
                //             return Promise.resolve(results)
                //         }
                //     }
                // }).then((results) => {
                //     /* FIELD TIER */
                //     if(!results || results.length === 0) {
                //         res.status(200).send({data: {count: 0}})
                //         return Promise.reject("no error")
                //     }
                //     if(results === "no types nor levels") { // X 0 X
                //         console.log("yo")
                //         return __self.repo.getJobsWithFieldsStart(fields)
                //     }
                //     else { // at least one tier has results
                //         if(filter_flags.includes("fields")) {
                //             return __self.repo.getJobsWithFields(helper.stringifyTagsSQL(fields), helper.extractJobIdsSQL(results))
                //         }
                //         else {
                //             return Promise.resolve(results)
                //         }
                //     }
                // }).then((results) => {
                //     if(req.query.search) {
                //         payload.jobs = results
                //         return __self.repo.getJobCountFilterSearch(helper.extractJobIdsSQL(results), req.query.search)
                //     }
                //     else {
                //         payload.count = results.length
                //         return __self.repo.getJobsPerPageFilter(order, how, start, limit, helper.extractJobIdsSQL(results))
                //     }
                // }).then((results) => {
                //     console.log(results)
                //     if(payload.count) {
                //         payload.jobs = results
                //         res.status(200).send({data: payload})
                //         return Promise.resolve("sent jobs")
                //     }
                //     else if(results.length === 0 || results[0].count === 0) {
                //         res.status(200).send({data: {count: 0}})
                //         return Promise.reject("no error")
                //     }
                //     else {
                //         payload.count = results.count
                //         return __self.repo.getJobsPerPageFilterSearch(order, how, start, limit, helper.extractJobIdsSQL(payload.jobs), req.query.search)
                //     }
                // }).then((results) => {
                //     if(results === "sent jobs") {
                //         return Promise.resolve()
                //     }
                //     else {
                //         payload.jobs = results
                //         res.status(200).send({data: payload})
                //         return Promise.resolve()
                //     }
                // }).catch((err) => {
                //     console.error(err)
                    
                //     if(err !== "no error") {
                //         res.status(500).send({error:{statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                //     }
                // })
            // }
            /* END FILTER */
            /* NO FILTER */
            // else if(req.query.search) {
            //     // console.log(req.query.search)
            //     __self.repo.getJobCountSearch(req.query.search).then((results) => {
            //         console.log(results)
            //         if(results.length === 0 || results.count === 0) {
            //             console.log("woops")
            //             res.status(200).send({data: {count: 0}})
            //             return Promise.reject("no error")
            //         }
            //         else {
            //             payload.count = results.count
            //             return __self.repo.getJobsPerPageSearch(order, how, start, limit, req.query.search)
            //         }
            //     }).then((results) => {
            //         // console.log(results)
            //         if(results.length === 0) {
            //             res.status(200).send({data: {count: 0}})
            //             return Promise.resolve()
            //         }
            //         else {
            //             payload.jobs = results
            //             res.status(200).send({data: payload})
            //             return Promise.resolve()
            //         }
            //     }).catch((err) => {
            //         console.error(err)
            //         if(err !== "no error") {
            //             res.status(500).send({error:{statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            //         }
            //     })
            // }
            // else {
                // __self.repo.getJobCount()
                // .then((results) => {
                //     if(results.length === 0 || results.count === 0) {
                //         res.status(200).send({data: {count: 0}})
                //         return Promise.reject("no error")
                //     }
                //     else {
                //         payload.count = results.count
                //         return __self.repo.getJobsPerPage(order, how, start, limit)
                //     }
                // })
                let field = (!req.query.f || req.query.f === '') ? null : req.query.f.slice(0,-1);
                let type = (!req.query.t || req.query.t === '') ? null : req.query.t.slice(0,-1);
                let level = (!req.query.l || req.query.l === '') ? null : req.query.l.slice(0,-1);
                let search = (!req.query.search || req.query.search === '') ? null : req.query.search;
                console.log(req.query)
                __self.repo.getJobsPerPage(order, how, start, limit, field, type, level, search, null)
                .then((results) => {
                    console.log(results)
                    if(results.length === 0) {
                    //error 1200 = no jobs found
                    //error 5000 = server error
                        res.status(200).send({data: {count: 0}})
                        return Promise.resolve()
                    }
                    else {
                        payload.count = results.count
                        payload.jobs = results.jobs
                        res.status(200).send({data: payload})
                    }
                }).catch((err) => {
                    console.error(err)
                    if(err !== "no error") {
                        res.status(500).send({error:{statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                    }
                })
            // }
        }
        catch(err) {
            console.error(err)
            if(err.message === 4000) {
                res.status(400).send({error:{statusCode:400, message: error_messages.bad_page, errorCode: 4000}})
            }
            else {
                res.status(500).send({error:{statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            }
        }
    },

    this.getJobsPerPageEmployer = (req, res, next) => {
        try {
            // console.log(req.session.id)
            let start = 0
            let payload = {}
            // let id = 0
            const order = CONSTANTS.ORDERS.includes(req.query.order) ? req.query.order : 'date_posted'
            const how = req.query.how==='asc' ? 'asc' : 'desc'
            const id = req.query.posted_by_id 
            const limit = +req.query.limit || 20
            if(!req.params.id || req.params.id < 0) {
                start = 0
            }
            else {
                start = limit * (req.params.id - 1) || 0
            }
            
            
            // __self.repo.getJobCountEmployer(id).then((results) => {
                // if(results.length === 0) {
                    // res.status(200).send({data: {count: 0}})
                    // return Promise.reject("no error") 
            //    }
                // else {
                    // payload.count = results.count
                    // return __self.repo.getJobsPerPage(order, how, start, limit, null, null, null, id)
                // }
            // })
            let search = (!req.query.search || req.query.search === '') ? null : req.query.search
            __self.repo.getJobsPerPageEmployer(order, how, start, limit, id)
            .then((results) => {
                if(results.length === 0) {
                //error 1200 = no jobs found
                //error 5000 = server error
                    res.status(200).send({data: {count: 0}})
                    return Promise.reject("no error")
                }
                else {
                    payload.count = results.length
                    payload.jobs = results
                    res.status(200).send({data: payload})
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
                res.status(400).send({error:{statusCode:400, message: error_messages.bad_page, errorCode: 4000}})
            }
            else {
                res.status(500).send({error:{statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            }
        }
    },

    this.getJobCount = (req, res, next) => {
        __self.repo.getJobCount().then((results) => {
            res.status(200).send({data: results})
        }).catch((err) => {
            console.log(err)
            res.status(500).send({error: {statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    },

    this.getJobCountEmployer = (req, res, next) => {
        console.log("YAY")
        console.log(req.query)
        const id = req.query.posted_by_id 
        __self.repo.getJobCountEmployer(id).then((results) => {
            res.status(200).send({data: results})
        }).catch((err) => {
            console.log(err)
            res.status(500).send({error: {statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    },

    this.getOptions = (req, res, next) => {
        const payload = {
            levels: [],
            types: [],
            fields: [],
            skills: [],
            educations: [],
            genders: []
        };
        __self.repo.getOptions()
        .then((data) => {
            let tmp = '';
            for(let i = 0; i < data.levels.length; i++) {
                tmp = 'level' + (i+1).toString();
                payload.levels.push([tmp, data.levels[i][tmp]]);
            }
            for(let i = 0; i < data.types.length; i++) {
                tmp = 'type' + (i+1).toString();
                payload.types.push([tmp, data.types[i][tmp]]);
            }
            for(let i = 0; i < data.fields.length; i++) {
                tmp = 'field' + (i+1).toString();
                payload.fields.push([tmp, data.fields[i][tmp]]);
            }
            for(let i = 0; i < data.skills.length; i++) {
                tmp = 'skill' + (i+1).toString();
                payload.skills.push([tmp, data.skills[i][tmp]]);
            }
            for(let i = 0; i < data.educations.length; i++) {
                tmp = 'education' + (i+1).toString();
                payload.educations.push([tmp, data.educations[i][tmp]]);
            }
            for(let i = 0; i < data.genders.length; i++) {
                tmp = 'gender' + (i+1).toString();
                payload.genders.push([tmp, data.genders[i][tmp]]);
            }
            payload.sorts = helper.sorts
            console.log(payload)
            res.status(200).send({data: payload})
        }).catch((err) => {
            console.error(err)
            res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    },

    this.seedJobs = (req, res, next) => {
        let seed_amount = req.params.amount;
        let fields = helper.options.fields;
        let types = helper.options.types;
        let levels = helper.options.levels;

        let jobid = '';
        let job_name = '';
        let company_name = '';
        let posted_by_id = '';
        let date_posted = Date.now();
        let date_deadline = Date.now();
        let field = '';
        let type = '';
        let level = '';
        let job_location = '';
        let data = {};
        let count = 0;

        let company_num = '';
        let company_amt = 10;

        let err_flag = false;
        for(let i = 0; i < seed_amount; i++) {
            if(err_flag) break;
            company_num = Math.floor(Math.random() * company_amt).toString();
            jobid = 'job-' + i.toString();
            job_name = 'Job #' + i.toString();
            company_name = 'Company #' + i.toString();
            posted_by_id = 'company-' + '0'.repeat(company_amt.toString().length - company_num.length) + company_num;
            job_location = 'Place';
            field = fields[Math.floor(Math.random() * fields.length)].split(';');
            type = types[Math.floor(Math.random() * types.length)].split(';');
            level = levels[Math.floor(Math.random() * levels.length)].split(';');
            data = {
                job_name: job_name,
                company_name: company_name,
                job_location: job_location,
                field: field,
                type: type,
                level: level,
                date_posted: date_posted/1000,
                date_deadline: date_deadline/1000
            }
            __self.repo.createJobPost(posted_by_id, jobid, data).then(() => {
                count++;
                if(count === +seed_amount) {
                    res.status(200).send('SEED COMPLETE');
                }
            }).catch((err) => {
                console.error(err);
                err_flag = true;
                res.status(400).send('error occured');
            })
        }
    },

    //view all applications
    this.getApplications = (req, res, next) => {
        //check if employer
        console.log(req.body.id)
        // __self.repo.getEmployerById(req.body.id).then((results) => {
        //     if(results.length === 0) {
        //         res.send("User not registered")
        //         return Promise.reject(new Error("user not registered"))
        //     }
        //     else {
        //         return Promise.resolve()
        //     }
        // }).then(() => {
        //     return __self.repo.getApplications(req.body.userId)
        // }).
        let payload = {}
        let id = req.params.posted_by_id
        let page = req.params.page
        console.log(id)
        if(!id || id === '') {
            //error 4000 = bad request
            throw Error(4000)
        }
        const order = CONSTANTS.ORDERS.includes(req.query.order) ? req.query.order : 'date_posted'
        const how = req.query.how==='asc' ? 'asc' : 'desc'
        if(page === 0) page = 1
        const start = 10 * (page - 1) || 0
        const limit = 10
        // __self.repo.getApplicationCount(id).then((results) => {
        //     if(results.length === 0) {
        //         res.status(200).send({data: {count: 0}})
        //     }
        //     else {
        //         payload.count = results.count
        __self.repo.getApplicationsPerPage(order, how, start, limit, id)
            // }
        // })
        .then((results) => {
            console.log(results)
            if(results.count === 0 || results.apps.length === 0) {
                res.status(200).send({data: {count: 0}});
                return Promise.resolve('skip');
            }
            payload.count = results.count;
            payload.apps = results.apps;
            return __self.repo.deleteNotifications("employer",id)
        }).then((results) => {
            if(results !=='skip') {
                res.status(200).send({data: payload})
                return Promise.resolve()
            }
        }).catch((err) => {
            console.error(err)
            res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    },

    this.getApplicationStatus = (req, res, next) => {
        __self.repo.verifyIfApplied(req.params).then((results) => {
            if(results.length === 0) {
                res.status(200).send({applied: 'no'})
            }
            else {
                res.status(200).send({app_id: results[0].app_id, applied: 'yes', status: results[0].status})
            }
        }).catch((err) => {
            console.error(err)
            res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    },

    this.getApplicationTestResultById = (req, res, next) => {
        __self.repo.getApplicationTestResultById(req.params.id)
        .then( async (results) => {
            if(!results) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_APPLICATION);
            }
            else {
                if(results.test_file_urls) {
                    let fileUrls = JSON.parse(results.test_file_urls);
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

                    results.test_cases = [];
                    for(let i = 0; i < testCaseInputs.length; i++) {
                        results.test_cases.push({
                            testCaseInputRaw: testCaseInputs[i],
                            testCaseOutputRaw: testCaseOutputString.split('\n')[i],
                            testCaseHidden: (testCaseHiddenArray[i] === 'true')
                        });
                    }

                    descriptionString = await helper.getObjectFromS3Text(CONSTANTS.AWS.BUCKET, fileUrls[fileUrls.length-1].split('/')[fileUrls[fileUrls.length-1].split('/').length - 1])

                    results.test_description = JSON.parse(descriptionString);

                    results.test_parameters = JSON.parse(results.test_parameters);
                }

                res.status(200).send({applied: true, data: results});
            }
        })
        .catch((err) => {
            if(err.message === CONSTANTS.ERROR_MESSAGES.NO_APPLICATION) {
                res.status(404).send({applied: false});
            }
            console.error(err)
            res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        })
    },

    //view applications for job ad
    this.getApplicationsForJob = (req, res, next) => {
        //check if employer
        //check if poster
        
        __self.repo.getApplicationForJob(req.params.id).then((results) => {
            if(results.length === 0) {
                res.send("no applications for this job")
                return Promise.resolve()
            }
            res.send(results)
        }).catch((e)=> {
            console.log(e)
            res.send("Error connecting to database")
        })
    },

    //view jobseeker applications
    this.getApplicationsSeeker = (req, res, next) => {
        //check if jobseeker
        let payload = {}
        let id = req.params.user_id
        let page = req.params.page
        console.log(id)
        if(!id || id === '') {
            //error 4000 = bad request
            throw Error(4000)
        }
        const order = CONSTANTS.ORDERS.includes(req.query.order) ? req.query.order : 'date_posted'
        const how = req.query.how==='asc' ? 'asc' : 'desc'
        if(page === 0) page = 1
        const start = 20 * (page - 1) || 0
        const limit = 20
        // __self.repo.getApplicationCountSeeker(id).then((results) => {
            
        //     if(results.length === 0 || results.count === 0) {
        //         res.status(200).send({data: {count: 0}})
        //         return Promise.reject("no error")
        //     }
        //     else {
                // payload.count = results.count
        __self.repo.getApplicationsPerPageSeeker(order, how, start, limit, id)
            // }
        // })
        .then((results) => {
            console.log(results)
            if(results.count === 0 || results.apps.length === 0) {
                res.status(200).send({data: {count: 0}});
                return Promise.resolve();
            }
            payload.count = results.count;
            payload.apps = results.apps;
            res.status(200).send({data: payload});
            return Promise.resolve();
        }).catch((err) => {
            if(err != "no error") {
                console.log(err.message)
                res.status(500).send("Error connecting to database")
            }
        })
    },

    this.getInterviewScript = (req, res, next) => {
        __self.repo.getInterviewScript(`interview:${req.params.id}`)
        .then((result) => {
            console.log(result);
            res.status(200).send({data: result});
        }).catch((err) => {
            console.error(err);
            res.status(500).send("Error connecting to database");
        });
    }

    this.seedApps = (req, res, next) => {
        let seed_amount = req.params.amount;
        let app_id = '';
        let count = 0;
        let data = {
            user_id: '',
            job_id: '',
            posted_by_id: '',
            date_posted: 0,
            last_name: 'Last',
            first_name: 'First',
            company_name: '',
            job_name: ''
        };
        let company_amt = 10;
        let user_amt = 10;
        let job_amt = 10000;
        let company_num = '';
        let user_num = '';
        let job_num = '';
        
        let err_flag = false;
        for(let i = 0; i < seed_amount; i++) {
            if(err_flag) break;
            company_num = Math.floor(Math.random() * company_amt).toString();
            user_num = Math.floor(Math.random() * user_amt).toString();
            job_num = Math.floor(Math.random() * job_amt).toString();
            app_id = 'app-' + '0'.repeat(seed_amount.toString().length - i.toString().length) + i.toString();
            data.job_id = 'job-' + '0'.repeat(job_amt.toString().length - job_num.length) + job_num;
            data.user_id = 'user-' + '0'.repeat(user_amt.toString().length - user_num.length) + user_num;
            data.posted_by_id = 'company-' + '0'.repeat(company_amt.toString().length - company_num.length) + company_num;
            data.date_posted = Date.now() / 1000;
            data.company_name = 'Company #' + '0'.repeat(company_amt.toString().length - company_num.length) + company_num;
            data.job_name = 'Job #' + '0'.repeat(job_amt.toString().length - job_num.length) + job_num;
            __self.repo.applyForJob(app_id, data).then(() => {
                count++;
                if(count === +seed_amount) {
                    res.status(200).send('SEED COMPLETE');
                }
            }).catch((err) => {
                console.error(err);
                err_flag = true;
                res.status(400).send('error occured');
            })
        }
    }

    return this;
 }

module.exports = controller;