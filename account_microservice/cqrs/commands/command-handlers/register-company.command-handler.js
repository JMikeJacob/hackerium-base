const BaseCommandHandler = require('../base.command-handler');
const CompanyAggregate = require('../../aggregates/company.aggregate');
const CONSTANTS = require('../../../utils/constants');
const helper = require('../../../utils/helper');
const writeRepo = require('../write.repository');

const RegisterCompanyCommandHandler = new BaseCommandHandler();

RegisterCompanyCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.REGISTER_COMPANY];
}

RegisterCompanyCommandHandler.getAggregate = function(aggregateId) {
    return new CompanyAggregate();
}

RegisterCompanyCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            if(!payload.email || !payload.password || !payload.companyName || !payload.contact || !payload.lastName || !payload.firstName) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REQUIRED);
            }
            else if(!helper.validateEmail(payload.email)) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL);
            }
            else if(payload.password.length < 8) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_PASSWORD);
            }
            const validator = await writeRepo.validateCompanyEmailAndName({
                email: payload.email,
                companyName: payload.companyName
            });
            if(payload.email === validator.email) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REGISTERED);
            }
            else if(payload.companyName === validator.companyName) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.COMPANY_EXISTS);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

RegisterCompanyCommandHandler.performCommand = async function(payload, aggregateId) {

    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.COMPANY_REGISTERED,
                userId: payload.userId,
                companyId: payload.userId,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                password: payload.password,
                company: payload.companyName,
                name: payload.companyName,
                companyName: payload.companyName,
                contact: payload.contact,
                role: payload.role,
                appNotifications: payload.appNotifications,
                website: payload.website,
                description: payload.description,
                establishmentDate: payload.establishmentDate,
                location: payload.location,
                picUrl: payload.picUrl,
                picUrlOld: payload.picUrlOld,
                resumeUrl: payload.resumeUrl,
                resumeUrlOld: payload.resumeUrlOld
            },
            aggregate: CONSTANTS.AGGREGATES.COMPANY,
            context: CONSTANTS.CONTEXTS.ACCOUNT
        });

        resolve(events);
    })
    return events;
}

RegisterCompanyCommandHandler.writeCommands = async function(command, events) {
    events.forEach((event) => {
        if(event.payload.eventType === CONSTANTS.EVENTS.COMPANY_REGISTERED) {
            writeRepo.addCompanyValidations({
                email: event.payload.email,
                companyName: event.payload.companyName,
                userId: event.payload.userId,
                aggregateId: command.aggregateId
            })
        }
    })
}

module.exports = RegisterCompanyCommandHandler;