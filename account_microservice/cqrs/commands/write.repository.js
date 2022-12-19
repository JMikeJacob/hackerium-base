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
    validateSeekerEmail: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL validateSeekerEmail(?)', 
                    data.email
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

    addSeekerValidations: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL addSeekerValidations(?,?,?)', [
                    data.email,
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

    deleteSeekerValidations: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL deleteSeekerValidations(?)', [
                    data.userId
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

    validateCompanyEmailAndName: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL validateCompanyEmailAndName(?,?)', 
                    [data.email,
                    data.companyName]
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

    addCompanyValidations: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL addCompanyValidations(?,?,?,?)', [
                    data.email,
                    data.companyName,
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

    updateCompanyEmail: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL updateCompanyEmail(?,?)', [
                    data.email,
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

    updateCompanyName: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL updateCompanyName(?,?)', [
                    data.company,
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

    deleteCompanyValidations: (data) => {
        return new Promise((resolve, reject) => {
            try {
                return knex.raw(
                    'CALL deleteCompanyValidations(?)', [
                    data.userId
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