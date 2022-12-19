const knex = require('knex')({
    client: process.env.KNEX_CLIENT,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.KVS_DB
    }
})

module.exports = {
    getHash: (key) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getHash(?)', key)
            .then((results) => {
                resolve({
                    data: JSON.parse((results[0][0][0] || {hash_value: 'null'}).hash_value)
                });
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    },

    putHash: async (key, value) => {
        try {
            const query = await new Promise((resolve) => {
                let q = `INSERT INTO ${process.env.KVS_DB}.hashes VALUES('${key}', '${JSON.stringify(value)}', UNIX_TIMESTAMP())`
                       + ' ON DUPLICATE KEY UPDATE hash_value = JSON_SET(hash_value';
                Object.keys(value).forEach(hashkey => {
                    q += ',"$.' + hashkey + '","' + value[hashkey] + '"';
                });
                q += ')';
                resolve(q);
            })

            const results = await knex.raw(query);

            return results;
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
            // return new Promise((resolve, reject) => {
                
            //     knex.raw('CALL putHash(?,?)', [key, JSON.stringify(value)])
            //     .then((results) => {
            //         resolve();
            //     })
            //     .catch((err) => {
            //         console.error(err);
            //         reject(err);
            //     });
            // });
    },

    deleteHash: (key) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL deleteHash(?)', key)
            .then((results) => {
                resolve();
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    },

    getSortedSet: (key ) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getSortedSet(?)', key)
            .then((results) => {    
                if(!results || results[0][0].length > 0) {
                    let set = [];
                    for(let i = 0; i < results[0][0].length; i++) {
                        set.push(JSON.parse(results[0][0][i].hash_value));
                    }        
                    resolve({
                        data: set
                    });
                }
                else {
                    resolve({data: []});
                }
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            })
        })
    }
}