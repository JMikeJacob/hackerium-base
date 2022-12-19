const CONSTANTS = require('../utils/constants');

const knex = require('knex')({
    client: process.env.KNEX_CLIENT,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        charset: 'utf8'
    }
})

const repo = (keyValueStore) => {
    const __self = this;
    this.kvs = keyValueStore;

    this.updateFromEvent = async (event) => {
        switch(event.payload.eventType) {
            case CONSTANTS.EVENTS.JOB_POST_CREATED:
                __self.createJobPost({
                    jobId: event.payload.jobId,
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.JOB_POST_EDITED:
                __self.editJobPost({
                    jobId: event.payload.jobId,
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.JOB_POST_DELETED:
                __self.deleteJobPost({
                    jobId: event.payload.jobId
                });
                break;
            case CONSTANTS.EVENTS.APPLICATION_SUBMITTED:
                await __self.applyForJob({
                    appId: event.payload.appId,
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.APPLICATION_STATUS_CHANGED:
                __self.editApplicationStatus({
                    appId: event.payload.appId,
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.APPLICATION_TEST_SENT:
                __self.addApplicationTest({
                    appId: event.streamId,
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.APPLICATION_TEST_CODE_SUBMITTED:
                __self.updateApplicationTestCode({
                    appId: event.streamId,
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.APPLICATION_TEST_RESULTS_UPDATED:
                __self.updateApplicationTestResults({
                    appId: event.streamId,
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.APPLICATION_WITHDRAWN:
                __self.deleteApplication({
                    appId: event.payload.appId
                });
                break;
            case CONSTANTS.EVENTS.INTERVIEW_SCRIPT_SAVED:
                __self.saveInterviewScript({
                    interviewId: event.payload.interviewId,
                    interviewScript: event.payload.interviewScript
                })
            case CONSTANTS.EVENTS.INTERVIEW_SCRIPT_DELETED:
                __self.deleteInterviewScript({
                    interviewId: event.payload.interviewId
                })
            default: 
                break;
        }
    },

    //create job post
    this.createJobPost = async (data) => {
        await knex.raw('CALL addJobPost(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            data.jobId,
            data.payload.jobName || null, 
            data.payload.companyName || null,
            data.payload.companyId || null,
            data.payload.datePosted || null, 
            data.payload.dateDeadline || null,
            data.payload.fieldId,
            data.payload.fieldName,
            data.payload.typeId,
            data.payload.typeName,
            data.payload.levelId,
            data.payload.levelName,
            data.payload.jobLocation || null
        ])

        await __self.kvs.putHash(`job:${data.jobId}`, {
            'job_id': data.jobId,
            'job_name': data.payload.jobName,
            'type_id': data.payload.typeId,
            'type': data.payload.typeName,
            'level_id': data.payload.levelId,
            'level': data.payload.levelName,
            'field_id': data.payload.fieldId,
            'field': data.payload.fieldName,
            'posted_by_id': data.payload.companyId,
            'company_name': data.payload.companyName,
            'job_location': data.payload.jobLocation,
            'description': data.payload.description,
            'qualifications': data.payload.qualifications,
            'is_open': data.payload.isOpen,
            'date_posted': data.payload.datePosted,
            'date_deadline': data.payload.dateDeadline
        })

        await __self.kvs.deleteHash(`job:tags:${data.jobId}`);
        await __self.kvs.putHash(`job:tags:${data.jobId}`, {tags: data.payload.tags});
    },

    //edit job post
    this.editJobPost = async (data) => {
        await knex.raw("CALL editJobPost(?, ?, ?, ?)", [
            data.payload.jobName || null, 
            data.payload.isOpen || null, 
            data.payload.dateDeadline || null, 
            data.jobId || null
        ]);

        await __self.kvs.putHash(`job:${data.jobId}`, {
            'job_name': data.payload.jobName,
            'type_id': data.payload.typeId,
            'type': data.payload.typeName,
            'level_id': data.payload.levelId,
            'level': data.payload.levelName,
            'field_id': data.payload.fieldId,
            'field': data.payload.fieldName,
            'posted_by_id': data.payload.companyId,
            'job_location': data.payload.jobLocation,
            'description': data.payload.description,
            'qualifications': data.payload.qualifications,
            'is_open': data.payload.isOpen,
            'date_posted': data.payload.datePosted,
            'date_deadline': data.payload.dateDeadline
        });

        await __self.kvs.deleteHash(`job:tags:${data.jobId}`);
        await __self.kvs.putHash(`job:tags:${data.jobId}`, {tags: data.payload.tags});

    },

    this.addJobTags = (tagId, jobId, userId, tags, tags_str) => {
        return __self.kvs.putHash(`job:tags:${jobId}`, {tags: tags_str});
        // .then(() => {
            // return Promise.all(tags.map((tag) => {
            //     knex.raw("CALL addJobTag(?,?,?,?)", [
            //         jobId, 
            //         userId, 
            //         tag.tag, 
            //         tag.tag_type])
            //     .then(null, console.log)
            // }))
        // })
    },

    //delete seeker tags
    this.delJobTags = async (jobId) => {
        try {
            await __self.kvs.deleteHash(`job:tags:${jobId}`);

        await knex.raw('CALL delJobTag', [jobId]);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    },

    this.getJobTags = async (jobId) => {
        try {
            const results = await __self.kvs.getHash(`job:tags:${jobId}`);

            return results.data;
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    },

    //delete job post
    this.deleteJobPost = async (data) => {
        await knex.raw("CALL deleteJobPost(?)", [
            data.jobId || null
        ])
        
        await __self.kvs.deleteHash(`job:${data.jobId}`);
    },

    //view job list
    this.getJobList = () => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobList()')
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })    
    },

    //get jobs by id
    this.getJobById = (jobId) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobById(?)', [
                jobId
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    //get jobs by id kvs
    this.getJobByIdKVS = async (jobId) => {
        const job = await __self.kvs.getHash(`job:${jobId}`);

        return job.data;
    },

    this.getMatchingTags = (userId, offset, limit) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getMatchingTags(?,?,?)', [
                userId,
                offset,
                limit
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.verifyJobStatus = (jobId) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL verifyJobStatus(?)', [
                jobId
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.verifyIfApplied = (data) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL verifyIfApplied(?, ?)', [
                data.user_id,
                data.job_id
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    // getJobsPerPage: (order, how, offset, limit) => {
    //     return new Promise((resolve, reject) => {
    //         knex.raw('CALL getJobsPerPage(?, ?, ?, ?, ?, ?, ?)', [
    //             order || 'date_posted',
    //             how || 'ASC',
    //             offset || 0,
    //             limit || 20,
    //             null,
    //             null,
    //             null
    //         ])
    //         .then((results) => {
    //             resolve(results[0][0]);
    //         })
    //         .catch((err) => {
    //             reject(err);
    //         })
    //     })
    // },

    this.getJobsPerPageSearch = (order, how, offset, limit, search) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobsPerPageSearch(?, ?, ?, ?, ?)', [
                order || 'date_posted',
                how || 'ASC',
                offset || 0,
                limit || 20,
                search+'%' || null
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getJobsPerPage = (order, how, offset, limit, field, type, level, search) => { //convert array to strings
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobsPerPage(?, ?, ?, ?, ?, ?, ?, ?)', [
                order || 'date_posted',
                how || 'ASC',
                offset || 0,
                limit || 20,
                field || null,
                type || null,
                level || null,
                search || null
            ])
            .then((results) => {
                resolve({
                    count: results[0][1][0].count,
                    jobs: results[0][0]
                });
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getJobsPerPageFilterSearch = (order, how, offset, limit, filters, search) => { // convert array to strings
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobsPerPageFilterSearch(?, ?, ?, ?, ?, ?)', [
                order || 'date_posted',
                how || 'ASC',
                offset || 0,
                limit || 20,
                filters || '',
                search+'%' || ''
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },
    //get jobs per company
    this.getJobsPerPageEmployer = (order, how, offset, limit, id) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobsPerPageEmployer(?, ?, ?, ?, ?)', [
                order || 'date_posted',
                how || 'ASC',
                offset || 0,
                limit || 20,
                id || null
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getJobCount = () => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobCount()')
            .then((results) => {
                resolve(results[0][0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getJobCountSearch = (search) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobCountSearch(?)', [
                search+'%' || ''
            ])
            .then((results) => {
                resolve(results[0][0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getJobCountFilterSearch = (jobs, search) => { //convert array to strings
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobCountFilterSearch(?, ?)', [
                jobs || '',
                search+'%' || ''
            ])
            .then((results) => {
                resolve(results[0][0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getJobCountEmployer = (id) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobCountEmployer(?)', [
                id || null
            ])
            .then((results) => {
                resolve(results[0][0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getJobsWithLevels = (levels) => {
        return new Promise((resolve, reject) => {
            console.log("LVL");
            console.log(levels);
            knex.raw('CALL getJobsWithTagsStart(?)', [
                levels || ''
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getJobsWithTypes = (types, jobs) => {
        // console.log(table)
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobsWithTags(?,?)', [
                types || '',
                jobs || ''
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getJobsWithTypesStart =  (types) => {
        // console.log(jobs)
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobsWithTagsStart(?)', [
                types || ''
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getJobsWithFields = (fields, jobs) => {
        knex.raw('CALL getJobsWithTags(?,?)', [
            fields || '',
            jobs || ''
        ])
        .then((results) => {
            resolve(results[0][0]);
        })
        .catch((err) => {
            reject(err);
        })
    },

    this.getJobsWithFieldsStart = (fields) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getJobsWithTagsStart(?)', [
                fields || ''
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getOptions = async () => {
        try {
            const levels = await __self.kvs.getSortedSet('levels');
            const fields = await __self.kvs.getSortedSet('fields');
            const types = await __self.kvs.getSortedSet('types');
            const skills = await __self.kvs.getSortedSet('skills');
            const educations = await __self.kvs.getSortedSet('educations');
            const genders = await __self.kvs.getSortedSet('genders');

            return {
                levels: levels.data,
                fields: fields.data,
                types: types.data,
                skills: skills.data,
                educations: educations.data,
                genders: genders.data
            };
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    },

    //delete applications
    this.delApplications = (jobId) => {
        return knex.raw("CALL delApplications(?)", [
            jobId || null
        ])
    },

    this.verifyIfApplied = (data) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL verifyIfApplied(?, ?)', [
                data.user_id,
                data.job_id
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getApplicationStatusById = (id) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getApplicationStatusById(?)', [
                id
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.applyForJob = (data) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL addApplication(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                data.appId,
                data.payload.userId,
                data.payload.jobId,
                data.payload.companyId,
                data.payload.datePosted,
                data.payload.lastName,
                data.payload.firstName,
                data.payload.companyName,
                data.payload.jobName
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getSocketId = async (userId) => {
        try {
            const socket = await __self.kvs.getHash(`employer:socketId:${userId}`);

            return socket.data;
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    },

    this.incrementNotifCount = async (data) => { //!!EDIT!!
        try {
            const user = await __self.kvs.getHash(`employer:${data.companyId}`);
            user.data.app_notifications = +data.payload.appNotifs;
            user.data.app_notification_offset = +data.payload.offset;
            return await __self.kvs.putHash(`employer:${data.companyId}`, user.data);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    },

    this.resetNotifCount = async (data) => { //!!EDIT!!
        try {
            const user = await __self.kvs.getHash(`employer:${data.companyId}`);
            user.data.app_notifications = 0;
            user.data.app_notification_offset = +data.payload.offset;
            return await __self.kvs.putHash(`employer:${data.companyId}`, user.data);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    },

    this.getApplication = (appId, data) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getApplication(?, ?, ?)', [
                data.job_id,
                data.user_id,
                appId
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.deleteApplication = (data) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL deleteApplication(?)', [
                data.appId
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getApplicationsForJob = (job_id) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getApplicationsForJob(?)', [
                job_id
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.editApplicationStatus = (data) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL editApplicationStatus(?, ?)', [
                data.appId,
                data.payload.status
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.addApplicationTest = (data) => {
        console.log(data);
        return new Promise((resolve, reject) => {
            knex.raw('CALL addApplicationTest(?,?,?)', [
                data.appId,
                data.payload.status,
                data.payload.testId
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.updateApplicationTestCode = (data) => {
        try {
            return new Promise((resolve, reject) => {
                knex.raw('CALL updateApplicationTestCode(?,?,?,?,?,?,?,?,?)', [
                    data.appId,
                    data.payload.script,
                    data.payload.testTitle,
                    JSON.stringify(data.payload.testFileUrls),
                    JSON.stringify(data.payload.testParameters),
                    data.payload.testDuration,
                    data.payload.dateTaken,
                    data.payload.status,
                    data.payload.testExecutionTime                
                ])
                .then((results) => {
                    resolve(results[0][0]);
                })
                .catch((err) => {
                    reject(err);
                })
            })
        } catch(err) {
            console.error(err);
        }
    },

    this.updateApplicationTestResults = (data) => {
        try {
            return new Promise((resolve, reject) => {
                knex.raw('CALL updateApplicationTestResults(?,?,?,?)', [
                    data.appId,
                    JSON.stringify(data.payload.testOutput),
                    data.payload.testScore,
                    data.payload.status
                ])
                .then((results) => {
                    resolve(results[0][0]);
                })
                .catch((err) => {
                    reject(err);
                })
            })
        } catch(err) {
            console.error(err);
        }
    },
    
    this.getApplicationsPerPage = (order, how, offset, limit, id) => {
        return new Promise((resolve, reject) => {
            knex.raw("CALL getApplicationsPerPageEmployer(?, ?, ?, ?, ?)", [
                order || null,
                how || null,
                offset || 0,
                limit || 20,
                id || null
            ])
            .then((results) => {
                resolve({
                    count: results[0][1][0].count,
                    apps: results[0][0]
                });
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getApplicationsPerPageSeeker = (order, how, offset, limit, id) => {
        return new Promise((resolve, reject) => {
            knex.raw("CALL getApplicationsPerPageSeeker(?, ?, ?, ?, ?)", [
                order || null,
                how || null,
                offset || 0,
                limit || 20,
                id || null
            ])
            .then((results) => {
                resolve({
                    count: results[0][1][0].count,
                    apps: results[0][0]
                });
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getApplicationCount = (id) => {
        return new Promise((resolve, reject) => {
            knex.raw("CALL getApplicationCount(?)", [
                id || null
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getApplicationCountSeeker = (id) => {
        return new Promise((resolve, reject) => {
            knex.raw("CALL getApplicationCountSeeker(?)", [
                id || null
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },
    
    this.deleteNotifications = async (role, userId) => { //!!EDIT!!
        console.log(`${role}:${userId}`)
        try {
            // const user = await __self.kvs.getHash(`${role}:${userId}`);

            // return await __self.kvs.putHash(`${role}:${userId}`, user.data);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    },

    this.getEmailValues = async (seekerId, employerId, jobId) => {
        try {
            const seeker = await __self.kvs.getHash(`seeker:${seekerId}`);
            const employer = await __self.kvs.getHash(`employer:${employerId}`);
            const job = await __self.kvs.getHash(`job:${jobId}`);

            return {seeker: seeker.data, employer: employer.data, job: job.data};
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    },

    this.getEmailValuesResult = async (seekerId, jobId) => {
        try {
            const seeker = await __self.kvs.getHash(`seeker:${seekerId}`);
            const job = await __self.kvs.getHash(`job:${jobId}`);
            const employer = await __self.kvs.getHash(`employer:${job.data.posted_by_id}`);
            return {seeker: seeker.data, employer: employer.data, job: job.data};
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    },

    this.getTestsTakenApplicant = (id) => {
        return new Promise((resolve, reject) => {
            knex.raw("CALL getTestsApplicant(?)", id)
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    },

    this.getApplicationTestResultById = (appId) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getApplicationTestResultById(?)', appId)
            .then((results) => {
                resolve(results[0][0][0] || {});
            })
            .catch((err) => {
                reject(err);
            });
        });
    },

    this.saveInterviewScript = (data) => {
        try {
            return __self.kvs.putHash(data.interviewId, {
                script: data.interviewScript.replace(/\n/g, '\\n')
            });
        } catch(err) {
            console.error(err);
        }
    },

    this.deleteInterviewScript = (data) => {
        try {
            return __self.kvs.deleteHash(data.interviewId);
        } catch(err) {
            console.error(err);
        }
    },

    this.getInterviewScript = async (interviewId) => {
        try {
            const results = await __self.kvs.getHash(interviewId);

            return results.data;
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    return this;
}

module.exports = repo;