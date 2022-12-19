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
    const __self = this;
    this.kvs = keyValueStore;
    //create accounts
    this.updateFromEvent = async (event) => {
        switch(event.payload.eventType) {
            case CONSTANTS.EVENTS.SEEKER_REGISTERED:
                __self.createAccountSeeker({
                    userId: event.payload.userId, 
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.SEEKER_ACCOUNT_EDITED:
                __self.editAccountSeeker({
                    userId: event.payload.userId, 
                    payload: event.payload
                })
                break;
            case CONSTANTS.EVENTS.SEEKER_DELETED:
                __self.deleteAccountSeeker({
                    userId: event.payload.userId
                })
                break;
            case CONSTANTS.EVENTS.SEEKER_PROFILE_EDITED:
                __self.editSeekerProfile({
                    userId: event.payload.userId,
                    payload: event.payload,
                });
                break;
            case CONSTANTS.EVENTS.COMPANY_REGISTERED:
                __self.createAccountCompany({
                    userId: event.payload.userId,
                    payload: event.payload
                });
                break;
            case CONSTANTS.EVENTS.COMPANY_ACCOUNT_EDITED:
                __self.editAccountCompany({
                    userId: event.payload.userId, 
                    payload: event.payload
                })
                break;
            case CONSTANTS.EVENTS.COMPANY_DELETED:
                __self.deleteAccountCompany({
                    userId: event.payload.userId
                })
                break;
            case CONSTANTS.EVENTS.COMPANY_PROFILE_EDITED:
                __self.editCompanyProfile({
                    userId: event.payload.userId,
                    payload: event.payload
                });
                break;
            default: 
                break;
        }
    }

    this.createAccountSeeker = async (data) => {
        try {
            await knex.raw('CALL addSeekerAccount(?, ?, ?, ?, ?)', [
                            data.userId,
                            data.payload.email || null,
                            data.payload.password || null,
                            data.payload.lastName || null,
                            data.payload.firstName || null
                        ]);
            await __self.kvs.putHash(`seeker:${data.userId}`, {
                'user_id': data.userId,
                'email': data.payload.email, 
                'password': data.payload.password, 
                'last_name': data.payload.lastName, 
                'first_name': data.payload.firstName,
                'role': 'seeker',
                'contact_no': '',
                'gender': '',
                'birthdate': '',
                'salary_per_month': '',
                'education': '',
                'level': '',
                'pic_url': '',
                'pic_url_old': '',
                'app_notifications': '',
                'offset': 0
            });
            
            await __self.kvs.putHash(`seeker:email:${data.payload.email}`, {
                'user_id': data.userId, 
                'password': data.payload.password
            });
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }

    this.createAccountCompany = async (data) => {
        try {
            await knex.raw('CALL addEmployerAccount(?, ?, ?, ?, ?, ?, ?)', [
                data.userId,
                data.payload.email || null,
                data.payload.password || null,
                data.payload.lastName || null,
                data.payload.firstName || null,
                data.payload.companyName || null,
                data.payload.contact || null
            ]);
    
            await __self.kvs.putHash(`employer:${data.userId}`, {
                'user_id': data.userId,
                'company_id': data.userId,
                'email': data.payload.email, 
                'password': data.payload.password, 
                'last_name': data.payload.lastName, 
                'first_name': data.payload.firstName, 
                'company_name': data.payload.companyName, 
                'name': data.payload.company,
                'contact_no': data.payload.contact,
                'role': 'employer',
                'app_notifications': "0",
                'website': '',
                'description': '',
                'establishment_date': '',
                'location': '',
                'pic_url': '',
                'pic_url_old': '',
                'resume_url': '',
                'resume_url_old': ''
            });
    
            await __self.kvs.putHash(`employer:email:${data.payload.email}`, {
                'user_id': data.userId,
                'company_name': data.payload.company
            });
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    //login account seeker
    this.loginAccountSeeker = (data) => {
        return knex.raw("CALL getSeekerLogin(?,?)", [
            data.email || null,
            data.password || null
        ])
        .then((results) => {
            resolve(results[0][0][0]);
        })
        .catch((err) => {
            reject(err);
        })
    }

    this.loginAccountEmployer = (data) => {
        return knex.raw("CALL getEmployerLogin(?,?)", [
            data.email || null,
            data.password || null
        ])
        .then((results) => {
            resolve(results[0][0][0]);
        })
        .catch((err) => {
            reject(err);
        })
    }

    this.loginAccountSeekerKVS = async (key) => {
        try {
            const userId = await __self.kvs.getHash(`seeker:email:${key}`);

            return await __self.kvs.getHash(`seeker:${userId.data.user_id}`);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    this.loginAccountEmployerKVS = async (key) => {
        try {
            const userId = await __self.kvs.getHash(`employer:email:${key}`);

            return await __self.kvs.getHash(`employer:${userId.data.user_id}`);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }
    
    //edit account
    this.editAccountSeeker = async (data) => {
        try {
            const user = await __self.kvs.getHash(`seeker:${data.userId}`);

            await knex.raw('CALL editSeekerAccount(?, ?, ?, ?, ?)', [
                            data.payload.email || null,
                            data.payload.password || null,
                            data.payload.lastName || null,
                            data.payload.firstName || null,
                            data.userId
                        ]);

            
            await __self.kvs.deleteHash(`seeker:email:${user.data.email}`);

            // user.data.email = data.email;
            // user.data.password = data.password;
            // user.data.last_name = data.lastname;
            // user.data.first_name = data.firstname;

            await __self.kvs.putHash(`seeker:${data.userId}`, {
                email: data.payload.email,
                password: data.payload.password,
                last_name: data.payload.lastName,
                first_name: data.payload.firstName
            });


            await __self.kvs.putHash(`seeker:email:${data.payload.email}`, {
                'user_id': data.userId, 
                'password': data.payload.password
            });
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }

    //edit account
    this.editAccountCompany = async (data) => {
        try {
            const user = await __self.kvs.getHash(`employer:${data.userId}`);

            await knex.raw('CALL editEmployerAccount(?, ?, ?, ?, ?)', [
                            data.payload.email || null,
                            data.payload.password || null,
                            data.payload.lastName || null,
                            data.payload.firstName || null,
                            data.userId
                        ]);

            await __self.kvs.deleteHash(`employer:email:${user.data.email}`);
            
            await __self.kvs.putHash(`employer:${data.userId}`, {
                email: data.payload.email,
                password: data.payload.password,
                last_name: data.payload.lastname,
                first_name: data.payload.firstname
            });

            await __self.kvs.putHash(`employer:email:${data.payload.email}`, {
                'user_id': data.userId, 
                'password': data.payload.password
            });
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }  
    }

    //delete account seeker
    this.deleteAccountSeeker = async (data) => {
        try {
            await knex.raw('CALL deleteSeekerAccount(?)', [
                data.userId || null
            ]);
            
            const user = await __self.kvs.getHash(`seeker:${data.userId}`);

            await __self.kvs.deleteHash(`seeker:email:${user.data.email}`); 
    
            await __self.kvs.deleteHash(`seeker:${data.userId}`);

        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    //delete account
    this.deleteAccountCompany = async (userId) => {
        try {
            await knex.raw("CALL delEmployerAccount(?)", [
                userId || null
            ]);
    
            const user = await __self.kvs.getHash(`seeker:${userId}`);
    
            await __self.kvs.deleteHash(`employer:email:${user.data.email}`);
    
            await __self.kvs.deleteHash(`employer:${userId}`);

        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    //get all accounts
    this.getAllSeekers = () => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getAllSeekers()')
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    this.getAllEmployers = () => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getAllEmployers()')
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    //get specific seeker
    this.getSeekerById = (userId) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getSeekerById(?)', [
                userId || null
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    //get specific seeker KVS
    this.getSeekerByIdKVS = async (userId) => {
        try {
            const user = await __self.kvs.getHash(`seeker:${userId}`);

            return user.data;
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    //get specific seeker profile
    this.getSeekerProfile = (userId) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getSeekerProfile(?)', [
                userId || null
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    this.getSeekerTags = async (userId) => {
        try {
            const tags = await __self.kvs.getHash(`seeker:tags:${userId}`);

            return tags.tags;
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    //get seeker by email
    this.getSeekerByEmail = async (email) => {
        try {
            const data = await __self.kvs.getHash(`seeker:email:${email}`);
            return data.data;
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    //get specific employer
    this.getEmployerById = (userId) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getEmployerById(?)', [
                userId
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    this.getEmployerByIdKVS = async (userId) => {
        try {
            return await __self.kvs.getHash(`employer:${userId}`);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    //get employer by email
    this.getEmployerByEmail = async (email) => {
        try {
            const data = await __self.kvs.getHash(`employer:email:${email}`);

            return data.data;
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    //get company account
    this.getCompanyByName = async (company) => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getCompanyByName(?)', [company])
            .then((results) => {
                resolve(results[0][0])
            })
            .catch((err) => {
                reject(err)
            })
        });
    }

    //get company account
    this.getCompanyByIdKVS = async (companyId) => {
        try {
            const employer = await __self.kvs.getHash(`employer:${companyId}`);
            delete employer.data.password;
            return employer.data;
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
        
    }

    //edit seeker profile **ADD EDUCATION, INTERESTS**
    this.editSeekerProfile = async (data) => {
        try {
            await knex.raw('CALL editSeekerProfile(?,?)', [
                data.payload.level || null,
                data.userId || null
            ]);

            const user = await __self.kvs.getHash(`seeker:${data.userId}`);
    
            await __self.kvs.putHash(`seeker:${data.userId}`, {
                'contact_no': data.payload.contactNo,
                'gender': data.payload.gender,
                'birthdate': data.payload.birthdate,
                'salary_per_month': data.payload.salaryPerMonth,
                'education': data.payload.education,
                'level': data.payload.level,
                'pic_url': data.payload.picUrl || '',
                'pic_url_old': data.payload.picUrlOld || user.data.picUrl || '',
                'resume_url': data.payload.resumeUrl || '',
                'resume_url_old': data.payload.resumeUrlOld || user.data.resumeUrl || ''  
            });
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

    //create seeker skill set
    this.addSeekerTags = async (tagId, userId, tags, tags_str) => {
        try {
            return await __self.kvs.putHash(`seeker:tags:${userId}`, tags_str);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
        // .then(() => {
        //     return Promise.all(tags.map((tag) => {
        //         console.log(tag)
        //         knex.raw("CALL addSeekerTag(?, ?,?,?)", [
        //             tagId,
        //             userId, 
        //             tag.tag, 
        //             tag.tag_type
        //         ]).then(null, console.log)
        //     }))
        // })
    }

    //delete seeker tags
    this.delSeekerTags = async (userId) => {
        try {
            await __self.kvs.deleteHash(`seeker:tags:${userId}`);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
        //     return knex.raw("CALL delSeekerTag(?)", [
        //         userId
        //     ]).then(null,console.log)
        // })
    }

    //edit company profile
    this.editCompanyProfile = async (data) => { //!!EDIT!!
        const user = await __self.kvs.getHash(`employer:${data.userId}`);
        
        await knex.raw('CALL editCompanyProfile(?,?,?)', [
            data.userId || null,
            data.payload.name,
            data.payload.contact
        ]);

        user.data.company_name = data.payload.name;
        user.data.name = data.payload.name;
        user.data.contact_no = data.payload.contact;
        user.data.website = data.payload.website;
        user.data.description = data.payload.description;
        user.data.establishment_date = data.payload.establishmentDate;
        user.data.location = data.payload.location;
        user.data.pic_url = data.payload.picUrl;

        await __self.kvs.putHash(`employer:${data.userId}`, user.data);
    }

    this.addCompanyPic = async (key, url) => {
        const user = await __self.kvs.getHash(`employer:${data.userId}`);

        user.data.pic_url_old = user.data.pic_url;
        user.data.pic_url = url;

        await __self.kvs.putHash(`employer:${data.userId}`, user.data);
    }

    //get all companies
    this.getAllCompanies = () => {
        return new Promise((resolve, reject) => {
            knex.raw('CALL getAllCompanies()')
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

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
    }

    this.deleteNotifications = async (role, userId) => { //!!EDIT!!
        console.log(`${role}:${userId}`)
        try {
            const user = await __self.kvs.getHash(`${role}:${userId}`);

            return await __self.kvs.putHash(`${role}:${userId}`, user.data);
        } catch(err) {
            console.error(err);
            throw new Error(err);
        }
    }

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
    }

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
    }

    this.getCompaniesPerPage = (order, how, offset, limit) => {
        return new Promise((resolve, reject) => {
            knex.raw("CALL getCompaniesPerPage(?, ?, ?, ?)", [
                order || '',
                how || '',
                offset || 0,
                limit || 20
            ])
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    this.getCompanyCount = () => {
        return new Promise((resolve, reject) => {
            knex.raw("CALL getCompanyCount()")
            .then((results) => {
                resolve(results[0][0]);
            })
            .catch((err) => {
                reject(err);
            })
        })
    }

    return this;
}

module.exports = repo;