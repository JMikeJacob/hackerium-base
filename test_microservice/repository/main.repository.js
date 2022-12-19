const CONSTANTS = require('../utils/constants');

const knex = require('knex')({
    client: process.env.KNEX_CLIENT,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
})

const repo = (keyValueStore) => {
    const _self = this;
    this.kvs = keyValueStore;
    
    this.updateFromEvent = async (event) => {
        switch(event.payload.eventType) {
            case CONSTANTS.EVENTS.TEST_CREATED: 
                _self.addTest({
                    testId: event.payload.testId,
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.TEST_EDITED:
                _self.editTest({
                    testId: event.payload.testId,
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.TEST_DELETED:
                _self.deleteTest({
                    testId: event.payload.testId
                });
                break;
            default: 
                break;
        }
    }

    this.addTest = async (data) => {
        try {
            await knex.raw('CALL addTest(?,?,?,?,?,?,?,?,?,?,?)', [
                data.testId,
                data.payload.testTitle,
                data.payload.testTotal,
                data.payload.testDifficulty,
                data.payload.companyId,
                data.payload.companyName,
                data.payload.createdAt,
                data.payload.testBoilerplate,
                JSON.stringify(data.payload.testParameters),
                data.payload.testExecutionTime,
                JSON.stringify(data.payload.testFileUrls)
            ]);

            await this.kvs.putHash(`test:${data.testId}`, {
                test_id: data.testId,
                test_title: data.payload.testTitle,
                test_total: data.payload.testTotal,
                test_difficulty: data.payload.testDifficulty,
                company_id: data.payload.companyId,
                company_name: data.payload.companyName,
                created_at: data.payload.createdAt,
                updated_at: data.payload.createdAt,
                test_boilerplate: data.payload.testBoilerplate,
                test_parameters: data.payload.testParameters,
                test_execution_time: data.payload.testExecutionTime,
                test_file_urls: data.payload.testFileUrls
            });
    
            // await this.kvs.putHash(`test:${data.testId}`, {
            //     test_id: data.testId,
            //     test_title: data.payload.testTitle,
            //     test_total: data.payload.testTotal,
            //     test_difficulty: data.payload.testDifficulty,
            //     company_id: data.payload.companyId,
            //     company_name: data.payload.companyName,
            //     test_body: data.payload.testBody,
            //     test_cases: data.payload.testCases, //temp
            //     test_execution_time: data.payload.testExecutionTime,
            //     created_at: data.payload.createdAt,
            //     updated_at: data.payload.createdAt,
            //     test_boilerplate: data.payload.testBoilerplate,
            //     test_parameters: data.payload.testParameters

            // });
        } catch(err) {
            console.error(err);
        }
    }

    this.editTest = async (data) => {
        try {
            await knex.raw('CALL addTest(?,?,?,?,?,?,?,?,?,?,?)', [
                data.testId,
                data.payload.testTitle,
                data.payload.testTotal,
                data.payload.testDifficulty,
                data.payload.companyId,
                data.payload.companyName,
                data.payload.createdAt,
                data.payload.testBoilerplate,
                JSON.stringify(data.payload.testParameters),
                data.payload.testExecutionTime,
                JSON.stringify(data.payload.testFileUrls)
            ]);
    
            await this.kvs.putHash(`test:${data.testId}`, {
                test_id: data.testId,
                test_title: data.payload.testTitle,
                test_total: data.payload.testTotal,
                test_difficulty: data.payload.testDifficulty,
                test_body: data.payload.testBody,
                test_cases: data.payload.testCases, //temp
                updated_at: data.payload.updatedAt,
                test_boilerplate: data.payload.testBoilerplate,
                test_parameters: data.payload.testParameters,
                test_execution_time: data.payload.testExecutionTime
            });
        } catch(err) {
            console.error(err);
        }
    }

    this.deleteTest = (data) => {
        try {
            knex.raw('CALL deleteTest(?)', [
                data.testId
            ]);

            this.kvs.deleteHash(data.testId);

        } catch(err) {
            console.error(err);
        }
    }

    this.getTestById = (data) => {
        return new Promise((resolve, reject) => {
            knex.raw("CALL getTestById(?)", [
                data.testId || null
            ])
            .then((results) => {
                if(results[0][0][0]) {
                    // results[0][0][0].test_cases = JSON.parse(results[0][0][0].test_cases);
                    resolve({data: results[0][0][0]})
                    // resolve({
                    //     testId: results[0][0][0].test_id,
                    //     testTitle: results[0][0][0].test_title,
                    //     testTotal: results[0][0][0].test_total,
                    //     testDifficulty: results[0][0][0].test_difficulty,
                    //     testBody: results[0][0][0].test_body,
                    //     testCases: results[0][0][0].test_cases,
                    //     createdAt: results[0][0][0].created_at,
                    //     updatedAt: results[0][0][0].updated_at,
                    //     companyId: results[0][0][0].company_id,
                    //     companyName: results[0][0][0].company_name
                    // });
                }
                else {
                    resolve({
                        testId: null
                    });
                }
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    this.getTestByIdKVS = async (data) => {
        try {
            return await this.kvs.getHash(`test:${data.testId}`);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }  
    }

    this.getTestsEmployer = (id) => {
        return new Promise((resolve, reject) => {
            knex.raw("CALL getTestsEmployer(?)", id)
            .then((results) => {
                console.log(results[0][0])
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

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
    }

    this.getTestTakers = (id) => {
        return new Promise((resolve, reject) => {
            knex.raw("CALL getTestTakers(?)", id)
            .then((results) => {
                console.log(results)
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    this.getTestsPerPageEmployer = (order, how, offset, limit, companyId) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getTestsPerPageEmployer(?, ?, ?, ?, ?)', [
                order || 'date_posted',
                how || 'ASC',
                offset || 0,
                limit || 20,
                companyId || null
            ])
            .then((results) => {
                resolve({
                    count: results[0][1][0].count,
                    tests: results[0][0]
                });
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    return this;
};

module.exports = repo;