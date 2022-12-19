const _ = require('lodash')
const shortid = require('shortid')
const helper = require('../../utils/helper')
const CONSTANTS = require('../../utils/constants');

const controller = (readRepository, commandHandler) => {
    const __self = this;
    this.repo = readRepository;
    this.commandHandler = commandHandler;
    /* TO WRITE MODEL */
    //create account
    this.createAccount = (req, res, next) => {
        try {
            if(!req.body.email || !req.body.password || !req.body.lastname || !req.body.firstname) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REQUIRED)
            }
            else if(!helper.validateEmail(req.body.email)) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL)
            }
            else if(req.body.password.length < 8) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_PASSWORD)
            }

            let role = req.query.role || CONSTANTS.ROLES.SEEKER
            if(role != CONSTANTS.ROLES.SEEKER && role != CONSTANTS.ROLES.EMPLOYER)  {
                role = CONSTANTS.ROLES.SEEKER
            }

            if(role === CONSTANTS.ROLES.SEEKER) {
                const id = shortid.generate();
                __self.commandHandler.sendCommand({
                    commandType: CONSTANTS.COMMANDS.REGISTER_SEEKER,
                    aggregateId: id,
                    payload: {
                        userId: id,
                        email: req.body.email,
                        password: req.body.password,
                        firstName: req.body.firstname,
                        lastName: req.body.lastname,
                        role: CONSTANTS.ROLES.SEEKER
                    }
                })
                .then(() => {
                    //successfully registered
                    const msg = "Seeker " + req.body.firstname + " " + req.body.lastname + " created!"
                    res.status(200).send({success: {statusCode: 200, message: msg}})
                }).catch((err) => {
                    console.log(err)
                    if(err.message === CONSTANTS.ERROR_MESSAGES.REGISTERED) {
                        res.status(400).send({error: {statusCode: 401, message: err.message, errorCode: 1001}})
                    }
                    else {
                        res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, statusCode: 1}})
                    }
                })
            }

            else if(role === CONSTANTS.ROLES.EMPLOYER) {
                if(!req.body.company || !req.body.contact) {
                    throw new Error(CONSTANTS.ERROR_MESSAGES.REQUIRED);
                }
                if(req.body.contact.length > 20 || !helper.validateContact(req.body.contact)) {
                    throw new Error(CONSTANTS.ERROR_MESSAGES.CONTACT);
                }
                const id = shortid.generate();
                __self.commandHandler.sendCommand({
                    commandType: CONSTANTS.COMMANDS.REGISTER_COMPANY,
                    aggregateId: id,
                    payload: {
                        userId: id,
                        companyName: req.body.company,
                        email: req.body.email,
                        password: req.body.password,
                        lastName: req.body.lastname,
                        firstName: req.body.firstname,
                        contact: req.body.contact,
                        role: CONSTANTS.ROLES.EMPLOYER,
                        appNotifications: '0',
                        website: '',
                        description: '',
                        establishmentDate: '',
                        location: '',
                        picUrl: '',
                        picUrlOld: ''
                    }
                }).then((results) => {
                    //successfully registered
                    const msg = "Employer " + req.body.firstname + " " + req.body.lastname + " created!"
                    res.status(200).send({success: {statusCode: 200, message: msg, data: results}})
                }).catch((err) => {
                    console.log(err)
                    if(err.message === CONSTANTS.ERROR_MESSAGES.REGISTERED || err.message === CONSTANTS.ERROR_MESSAGES.COMPANY_EXISTS) {
                        res.status(400).send({error: {statusCode: 400, message: err.message, errorCode: 1002}})
                    }
                    else {
                        res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, statusCode: 1}})
                    }
                })
            }
        }
        catch(err) {
            console.log(err)
            res.status(400).send({error: {statusCode: 400, message: err.message, errorCode: 1000}})
        }
    },

    this.editAccount = (req, res, next) => {
        try {
            if(!helper.validateEmail(req.body.email) && !helper.validateEmail(req.body.data.email)) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.email)
            }
            if((req.body.password || req.body.data.password).length < 8) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.password)
            }
            let role = req.query.role || CONSTANTS.ROLES.SEEKER
            if(role != CONSTANTS.ROLES.SEEKER && role != CONSTANTS.ROLES.EMPLOYER) {
                role = CONSTANTS.ROLES.SEEKER
            }
            if(role === CONSTANTS.ROLES.SEEKER) { 
                //getseeker command
                __self.commandHandler.sendCommand({
                    commandType: CONSTANTS.COMMANDS.EDIT_SEEKER_ACCOUNT,
                    aggregateId: req.body.id,
                    payload: {
                        userId: req.body.id,
                        email: req.body.data.email,
                        password: req.body.data.password,
                        firstName: req.body.data.firstname,
                        lastName: req.body.data.lastname
                    }
                })
                .then(() => {
                    res.status(200).send({success: {message: "Account edit successful!"}})
                }).catch((err) => {
                    console.error(err)
                    if(err.message === CONSTANTS.ERROR_MESSAGES.registered) {
                        res.status(403).send({error: {statusCode: 403, message: CONSTANTS.ERROR_MESSAGES.registered, errorCode: 1103}})
                    }
                    else {
                        res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                    }
                })
            }
            else if(role === CONSTANTS.ROLES.EMPLOYER) { 
                __self.commandHandler.sendCommand({
                    commandType: CONSTANTS.COMMANDS.EDIT_COMPANY_ACCOUNT,
                    aggregateId: req.params.id,
                    payload: {
                        userId: req.params.id,
                        email: req.body.email,
                        password: req.body.password,
                        firstName: req.body.firstname,
                        lastName: req.body.lastname
                    }
                })
                .then(() => {
                    res.status(200).send({success: {message: "Account edit successful!"}})
                }).catch((err) => {
                    console.error(err)
                    res.status(500).send({error: {statusCode: 500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                })
            }
        }
        catch(err) {
            console.log(err)
            res.status(400).send({error: {statusCode: 400, message: err.message, errorCode: 1000}})
        }
    },

    //create seeker profile
    this.editSeekerProfile = (req, res, next) => {
        try {
            //check if jobseeker exists
            let urlPic = '';
            let urlResume = '';
            __self.commandHandler.sendCommand({
                commandType: CONSTANTS.COMMANDS.EDIT_SEEKER_PROFILE,
                aggregateId: req.params.id,
                payload: {
                    userId: req.params.id,
                    contactNo: req.body.contact_no,
                    gender: req.body.gender,
                    birthdate: req.body.birthdate,
                    salaryPerMonth: req.body.salary_per_month,
                    education: req.body.education,
                    level: req.body.level,
                    picUrl: req.body.pic_url || '',
                    picUrlOld: req.body.pic_url_old || '',
                    resumeUrl: req.body.resume_url || '',
                    resumeUrlOld: req.body.resume_url_old || ''
                }
            })
            // .then(() => {
            //     return __self.repo.delSeekerTags(req.params.id)
            // })
            // .then(() => {
            //     const tags = req.body.tags
            //     const tags_str = helper.stringifyTags(tags)
            //     const app_id = shortid.generate()
            //     return __self.repo.addSeekerTags(app_id, req.params.id, tags, tags_str)
            // })
            .then(() => {
                res.status(200).send({success:{statusCode:200, url: urlPic, urlResume: urlResume}})
            })
            .catch((err) => {
                console.log(err)
                if(err.message === CONSTANTS.ERROR_MESSAGES.bad_format) {
                    //4110: BAD FILE FORMAT
                    res.status(400).send({error:{statusCode:400, message:err.message, errorCode: 4110}})
                }
                else {
                    res.status(500).send({error: {statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 1}})
                }
            })
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: {statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 1}})
        }
    },

    //edit company profile (main recruiter only)
    this.editCompanyProfile = (req, res, next) => {
        try {
            let url = ""
            if(req.body.establishment_date && !helper.validateInt(req.body.establishment_date)) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_DATE)
            }
            if(!req.body.name) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.COMPANY_EXISTS)
            }
            __self.commandHandler.sendCommand({
                commandType: CONSTANTS.COMMANDS.EDIT_COMPANY_PROFILE,
                aggregateId: req.params.id,
                payload: {
                    userId: req.params.id,
                    companyName: req.body.name,
                    contact: req.body.contact_no,
                    website: req.body.website,
                    description: req.body.description,
                    establishmentDate: req.body.establishment_date,
                    location: req.body.location,
                    picUrl: req.body.pic_url,
                    picUrlOld: req.body.pic_url_old
                }
            })
            .then(() => {
                res.status(200).send({success:{statusCode:200, url: url}})
            }).catch((err) => {
                console.log(err)
                if(err.message === CONSTANTS.ERROR_MESSAGES.no_existing || err.message === CONSTANTS.ERROR_MESSAGES.no_company) {
                    res.status(404).send({error:{statusCode:404, message:err.message, errorCode: 1104}})
                }
                else if(err.message === CONSTANTS.ERROR_MESSAGES.bad_format) {
                    //4110: BAD IMAGE FORMAT
                    res.status(400).send({error:{statusCode:400, message:err.message, errorCode: 4110}})
                }
                else {
                    res.status(500).send({error: {statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                }
            })
        }
        catch(err) {
            console.log(err)
            res.status(400).send({error:{statusCode:400, message:err.message, errorCode: 4000}})
        }
    },

    //delete account
    this.deleteAccount = (req, res, next) => {
        try {
            //check if user
            let role = req.query.role || CONSTANTS.ROLES.SEEKER
            if(role != CONSTANTS.ROLES.SEEKER && role != CONSTANTS.ROLES.EMPLOYER) {
                role = CONSTANTS.ROLES.SEEKER
            }
            //check if jobseeker exists
            if(role === CONSTANTS.ROLES.SEEKER) {
                __self.commandHandler.sendCommand({
                    commandType: CONSTANTS.COMMANDS.DELETE_SEEKER,
                    aggregateId: req.params.id,
                    payload: {
                        userId: req.params.id
                    }
                })
                .then(() => {
                    const msg = role + " " + req.params.id + " deleted!"
                    res.send({success: {statusCode: 200, message: msg}})
                }).catch((err) => {
                    console.log(err)
                    if(err.message = CONSTANTS.ERROR_MESSAGES.no_existing) {
                        res.status(401).send({error:{statusCode:401, message:err.message, errorCode: 1}})
                    }
                    else {
                        res.status(500).send({error:{statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 1}})
                    }
                })
            }

            //check if employer exists
            else if(role === CONSTANTS.ROLES.EMPLOYER) {
                __self.commandHandler.sendCommand({
                    commandType: CONSTANTS.COMMANDS.DELETE_COMPANY,
                    aggregateId: req.params.id,
                    payload: {
                        userId: req.params.id
                    }
                })
                .then(() => {
                    const msg = role + " " + req.params.id + " deleted!"
                    res.send({success: {statusCode: 200, message: msg}})
                }).catch((err) => {
                    console.log(err)
                    if(err.message = CONSTANTS.ERROR_MESSAGES.no_existing) {
                        res.status(401).send({error:{statusCode:401, message:err.message, errorCode: 1}})
                    }
                    else {
                        res.status(500).send({error:{statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 1}})
                    }
                })
            }
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error:{statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 1}})
        }
    },

    /* TO READ MODEL */

    //login account
    this.loginAccount = (req, res, next) => {
        try {
            if(!helper.validateEmail(req.body.email)) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.email)
            }
            if(req.body.password.length < 8) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.password)
            }
            let role = req.query.role || "seeker"
            if(role != "seeker" && role != "employer") {
                role = "seeker"
            }
            if(role==="seeker") {
                __self.repo.loginAccountSeekerKVS(req.body.email).then((data) => {
                    if(data) { //in kvs
                        if(req.body.email === data.data.email && req.body.password === data.data.password) {
                            console.log("in kvs")
                            delete data.data.password
                            res.status(200).send({user:data.data})
                            return Promise.resolve()
                        }
                    }
                    console.log("not in redis")
                    return Promise.reject(new Error(CONSTANTS.ERROR_MESSAGES.no_account))
                }).catch((err) => {
                    console.log(err)
                    if(err.message === CONSTANTS.ERROR_MESSAGES.no_account) {
                        res.status(400).send({error: {statusCode:400, message: err.message, errorCode: 1}})
                    }
                    else {
                        res.status(500).send({error: {statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 1}})
                    }
                })
                
            }
            else if(role === "employer") {
                __self.repo.loginAccountEmployerKVS(req.body.email).then((data) => {
                    console.log(data)
                    if(data) { //in redis
                        if(req.body.email === data.data.email && req.body.password === data.data.password) {
                            console.log("in redis")
                            delete data.data.password
                            res.status(200).send({user:data.data})
                            return Promise.resolve()
                        }
                    }
                    console.log("not in redis")
                    return Promise.reject(new Error(CONSTANTS.ERROR_MESSAGES.no_account))
                }).catch((err) => {
                    console.log(err)
                    if(err.message === CONSTANTS.ERROR_MESSAGES.no_account) {
                        res.status(400).send({error: {statusCode:400, message: err.message, errorCode: 1}})
                    }
                    else {
                        res.status(500).send({error: {statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 1}})
                    }
                })
            }
            
        }
        catch(err) {
            console.log(err)
            res.status(400).send({error: {statusCode:400, message: err.message, errorCode: 1}})
        }
    },

    this.checkLogin = (req, res, next) => {
        try {
            req.session.user ? res.status(200).send({loggedIn:true}) : res.status(200).send({loggedIn: false})
        }
        catch(err) {
            console.error(err)
            res.status(500).send({statusCode: 500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000})
        }
    },

    //get all users
    this.getAllUsers = (req, res, next) => {
        try {
            Promise.all([__self.repo.getAllSeekers(), __self.repo.getAllEmployers()]).then((data) => {
                res.status(200).send({success: {statusCode: 200, data: data}})
            }).catch((err) => {
                console.log(err)
                res.status(500).send({error:{statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 1}})
            })
        }
        catch(err) {
            console.log(err)
            res.status(400).send({error:{statusCode:400, message:CONSTANTS.ERROR_MESSAGES.bad_id, errorCode: 1}})
        }
    },

    //get seeker account
    this.getSeeker = (req, res, next) => {
        try {
            // if(!req.params.id || typeof(req.params.id) != "number") {
            //     throw new Error(CONSTANTS.ERROR_MESSAGES.bad_id)
            // }
            __self.repo.getSeekerByIdKVS(req.params.id).then((data) => {
                if(data) { //check if user
                    if(req.params.id === data.user_id) {
                        console.log("in redis")
                        return Promise.resolve([data])
                    }
                    else {
                        console.log("not in redis")
                        return __self.repo.getSeekerById(req.query.id)
                    }
                }
            }).then((data) => {
                if(data.length === 0) {
                //1104 no account seeker
                    return Promise.reject(new Error(1104))
                }
                else {
                    res.status(200).send({data: data[0]})
                }
            }).catch((err) => {
                console.log(err)
                if(err.message === 1004) {
                    res.status(404).send({error:{statusCode:404, message:CONSTANTS.ERROR_MESSAGES.no_existing, errorCode: 1104}})
                }
                else {
                    res.status(500).send({error:{statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                }
            })
        }
        catch(err) {
            console.log(err)
            res.status(400).send({error:{statusCode:400, message:CONSTANTS.ERROR_MESSAGES.bad_id, errorCode: 1}})
        }
    },

    //get seeker account
    this.getSeekerByEmail = (req, res, next) => {
        __self.repo.getSeekerByEmail(req.body.email).then((data) => {
            if(data.length === 0) {
            //1104 no account employer
                return Promise.reject(new Error(1104))
            }
            else {
                delete data.password
                res.status(200).send({data: data})
            }
        }).catch((err) => {
            console.log(err)
            if(err.message === 1004) {
                res.status(404).send({error:{statusCode:404, message:CONSTANTS.ERROR_MESSAGES.no_existing, errorCode: 1104}})
            }
            else {
                res.status(500).send({error:{statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            }
        })
    },

    //get employer account
    this.getEmployer = (req, res, next) => {
        try {
            const id = req.params.id
            __self.repo.getEmployerById(req.params.id).then((data) => {
                if(data) { //in redis
                    if(req.params.id === data.user_id) {
                        console.log("in redis")
                        return Promise.resolve([data])
                    }
                    else {
                        console.log("not in redis")
                        return __self.repo.getEmployerById(req.params.id)
                    }
                }
            })
            .then((data) => {
                if(data.length === 0) {
                //1104 no account employer
                    return Promise.reject(new Error(1104))
                }
                else {
                    res.status(200).send({data: data[0]})
                }
            }).catch((err) => {
                console.log(err)
                if(err.message === 1004) {
                    res.status(404).send({error:{statusCode:404, message:CONSTANTS.ERROR_MESSAGES.no_existing, errorCode: 1104}})
                }
                else {
                    res.status(500).send({error:{statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                }
            })
        }
        catch(err) {
            console.log(err)
            res.status(403).send({error:{statusCode:403, message:CONSTANTS.ERROR_MESSAGES.bad_id, errorCode: 1}})
        }
    },

    //get company profile
    this.getCompanyProfile = (req, res, next) => {
        try {
            __self.repo.getCompanyByIdKVS(req.params.id).then((data) => {
                if(data) {
                    if(req.params.id === data.company_id) {
                        console.log("in redis")
                        res.status(200).send({success: {statusCode:200, data: data}})
                        return Promise.resolve()
                    }
                }
                console.log("not in redis")
                return Promise.reject(new Error(CONSTANTS.ERROR_MESSAGES.no_company))
            }).catch((err) => {
                console.log(err)
                if(err.message = CONSTANTS.ERROR_MESSAGES.no_company) {
                    res.status(404).send({error: {statusCode: 404, message:CONSTANTS.ERROR_MESSAGES.no_company, errorCode: 1104}})
                }
                else {
                    res.status(500).send({error:{statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
                }
            })
        }
        catch(err) {
            console.log(err)
            res.status(400).send({error:{statusCode:400, message:CONSTANTS.ERROR_MESSAGES.bad_id, errorCode: 4000}})
        }
    },

    //get all companies
    this.getAllCompanies = (req, res, next) => {
        try {
            __self.repo.getAllCompanies().then((data) => {
                if(data.length === 0) {
                    res.status(404).send({error: {statusCode: 404, message:CONSTANTS.ERROR_MESSAGES.no_company, errorCode: 1104}})
                }
                else {
                    res.status(200).send({success: {statusCode:200, data: data}})
                }
            }).catch((err) => {
                console.log(err)
                res.status(500).send({error:{statusCode:500, message:CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            })
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error:{statusCode:400, message:CONSTANTS.ERROR_MESSAGES.bad_id, errorCode: 5000}})
        }
    },

    //view jobseeker profile (lastname, firstname, email, profile, tags)
    this.getSeekerProfile = (req, res, next) => {
        try {
            let payload = {}
            __self.repo.getSeekerByIdKVS(req.params.id).then((results) => {
                if(results) {
                    if(req.params.id === results.user_id) {
                        console.log("in redis")
                        return Promise.resolve([results])
                    }
                }
                console.log("not in redis")
                return __self.repo.getSeekerProfile(req.params.id)
            }).then((results) => {
                payload = results[0] 
                delete payload.password
                // if(req.query.tags==="true") {
                //     return __self.repo.getSeekerTags(req.params.id)
                // }
                // else {
                //     console.log(payload)
                    return Promise.resolve("notags")
                // }
            }).then((results) => {
                if(results !== "notags") {
                    payload.tags = JSON.parse(results)
                }
                res.status(200).send({data: payload})
            })
            .catch((err) => {
                console.log(err)
                res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
            })
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error:{statusCode:500, message: CONSTANTS.ERROR_MESSAGES.SERVER, errorCode: 5000}})
        }
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

    this.seedUsers = (req, res, next) => {
        let seed_amount = req.params.amount;
        let user_id = '';
        let user_num = '';
        let count = 0;
        let data = {
            email: '',
            password: 'password',
            lastname: 'Last',
            firstname: 'First'
        }

        let err_flag = false;
        for(let i = 0; i < seed_amount; i++) {
            if(err_flag) break;
            user_num = Math.floor(Math.random() * seed_amount).toString();
            user_id = 'user-' + '0'.repeat(seed_amount.toString().length - i.toString().length) + i.toString();
            data.email = 'email' + '0'.repeat(seed_amount.toString().length - i.toString().length) + i.toString() + '@gmail.com';
            __self.repo.createAccountSeeker(user_id,data).then(() => {
                count++;
                if(count === +seed_amount) {
                    res.status(200).send('SEED COMPLETE');
                }
            }).catch((err) => {
                console.error(err);
                err_flag = true;
                res.status(400).send('error occurred');
            })
        }
    },

    this.seedEmployers = (req, res, next) => {
        let seed_amount = req.params.amount;
        let user_id = '';
        let user_num = '';
        let count = 0;
        let data = {
            email: '',
            password: 'password',
            lastname: 'Last',
            firstname: 'First',
            company: '',
            contact: '123456789'
        }

        let err_flag = false;
        for(let i = 0; i < seed_amount; i++) {
            if(err_flag) break;
            company_num = Math.floor(Math.random() * seed_amount).toString();
            user_id = 'company-' + '0'.repeat(seed_amount.toString().length - i.toString().length) + i.toString();
            data.company = 'Company #' + '0'.repeat(seed_amount.toString().length - i.toString().length) + i.toString();
            data.email = 'compmail' + '0'.repeat(seed_amount.toString().length - i.toString().length) + i.toString() + '@gmail.com';
            __self.commandHandler.sendCommand({
                commandType: CONSTANTS.COMMANDS.REGISTER_COMPANY,
                aggregateId: user_id,
                payload: {
                    userId: user_id,
                    companyName: data.company,
                    email: data.email,
                    password: data.password,
                    lastName: data.lastname,
                    firstName: data.firstname,
                    contact: data.contact,
                    role: CONSTANTS.ROLES.EMPLOYER,
                    appNotifications: '0',
                    website: '',
                    description: '',
                    establishmentDate: '',
                    location: '',
                    picUrl: '',
                    picUrlOld: ''
                }
            })
            .then(() => {
                count++;
                if(count === +seed_amount) {
                    res.status(200).send('SEED COMPLETE');
                }
            }).catch((err) => {
                console.error(err);
                err_flag = true;
                res.status(400).send('error occurred');
            })
        }
    }

    return this;
}

module.exports = controller;