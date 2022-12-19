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
    }
}