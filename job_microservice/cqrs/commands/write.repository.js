const knex = require('knex')({
    client: process.env.KNEX_CLIENT,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.WRITE_DB
    }
});

module.exports = {
    validateSeekerId: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL validateSeekerId(?)', 
                    data.userId
                )
                .then((results) => {
                    resolve({
                        email: (results[0][0][0] || {email: null}).email,
                        userId: (results[0][0][0] || {user_id: null}).user_id
                    });
                });
            } catch(err) {
                console.error(err);
                reject(err);
            }
        })
    },

    validateCompanyId: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL validateCompanyId(?)', 
                    data.userId
                )
                .then((results) => {
                    resolve({
                        email: (results[0][0][0] || {email: null}).email,
                        companyName: (results[0][0][0] || {company: null }).company,
                        userId: (results[0][0][0] || {user_id: null}).user_id
                    });
                });
            } catch(err) {
                console.error(err);
                reject(err);
            }
        })
    },

    validateJobId: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL validateJobId(?)', 
                    data.jobId
                )
                .then((results) => {
                    resolve({
                        jobId: (results[0][0][0] || {job_id: null}).job_id,
                        companyId: (results[0][0][0] || {company_id: null }).company_id
                    });
                });
            } catch(err) {
                console.error(err);
                reject(err);
            }
        })
    },

    validateApplicationOfUser: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL validateApplicationOfUser(?,?)', 
                    [data.jobId,
                    data.userId]
                )
                .then((results) => {
                    resolve({
                        jobId: (results[0][0][0] || {job_id: null}).job_id,
                        userId: (results[0][0][0] || {user_id: null }).user_id
                    });
                });
            } catch(err) {
                console.error(err);
                reject(err);
            }
        })
    },

    addApplicationValidations: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL addApplicationValidations(?,?,?)', [
                        data.jobId,
                        data.userId,
                        data.aggregateId
                ])
                .then((results) => {
                    resolve();
                });
            } catch(err) {
                console.error(err);
                reject(err);
            }
        })
    },

    deleteApplicationValidations: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL deleteApplicationValidations(?)', [
                    data.aggregateId
                ])
                .then((results) => {
                    resolve();
                });
            } catch(err) {
                console.error(err);
                reject(err);
            }
        })
    },
    
    validateJobId: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL validateJobId(?)', 
                    data.jobId
                )
                .then((results) => {
                    resolve({
                        jobId: (results[0][0][0] || {job_id: null}).job_id,
                        companyId: (results[0][0][0] || {company_id: null }).company_id
                    });
                });
            } catch(err) {
                console.error(err);
                reject(err);
            }
        })
    },

    addJobValidations: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL addJobValidations(?,?,?)', [
                    data.jobId,
                    data.companyId,
                    data.aggregateId
                ])
                .then((results) => {
                    resolve();
                });
            } catch(err) {
                console.error(err);
                reject(err);
            }
        })
    },

    deleteJobValidations: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL deleteJobValidations(?)', [
                    data.jobId
                ])
                .then((results) => {
                    resolve();
                });
            } catch(err) {
                console.error(err);
                reject(err);
            }
        })
    }
}