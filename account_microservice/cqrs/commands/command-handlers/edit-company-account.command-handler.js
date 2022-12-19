const BaseCommandHandler = require('../base.command-handler');
const CompanyAggregate = require('../../aggregates/company.aggregate');
const CONSTANTS = require('../../../utils/constants');
const helper = require('../../../utils/helper');
const writeRepo = require('../write.repository');

const EditCompanyAccountCommandHandler = new BaseCommandHandler();

EditCompanyAccountCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.EDIT_COMPANY_ACCOUNT];
}

EditCompanyAccountCommandHandler.getAggregate = function(aggregateId) {
    return new CompanyAggregate();
}

EditCompanyAccountCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            if(!payload.email || !payload.password || !payload.lastName || !payload.firstName) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REQUIRED);
            }
            else if(!helper.validateEmail(payload.email)) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL);
            }
            else if(payload.password.length < 8) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_PASSWORD);
            }

            //check if user exists (aggregate)
            if(payload.userId !== aggregate.userId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_EXISTING);
            }

            const email_validator = await writeRepo.validateCompanyEmailAndName({
                email: payload.email,
                companyName: null
            });
            //same email with another user
            if(payload.email === email_validator.email && payload.userId !== email_validator.userId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REGISTERED);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

EditCompanyAccountCommandHandler.performCommand = async function(payload, aggregateId) {
    const company = await new CompanyAggregate().getCurrentState(aggregateId);
    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.COMPANY_ACCOUNT_EDITED,
                userId: payload.userId,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                password: payload.password,
                offset: company.offset + 1
            },
            aggregate: CONSTANTS.AGGREGATES.COMPANY,
            context: CONSTANTS.CONTEXTS.ACCOUNT
        });

        resolve(events);
    })
    return events;
}

EditCompanyAccountCommandHandler.writeCommands = async function(command, events) {
    events.forEach((event) => {
        //fix
        if(event.payload.eventType === CONSTANTS.EVENTS.COMPANY_ACCOUNT_EDITED) {
            writeRepo.updateCompanyEmail({
                email: event.payload.email,
                aggregateId: command.aggregateId
            })
        }
    })
}

module.exports = EditCompanyAccountCommandHandler;