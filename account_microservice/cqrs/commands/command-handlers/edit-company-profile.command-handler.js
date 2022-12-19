const BaseCommandHandler = require('../base.command-handler');
const CompanyAggregate = require('../../aggregates/company.aggregate');
const CONSTANTS = require('../../../utils/constants');
const writeRepo = require('../write.repository');

const EditCompanyProfileCommandHandler = new BaseCommandHandler();

EditCompanyProfileCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.EDIT_COMPANY_PROFILE];
}

EditCompanyProfileCommandHandler.getAggregate = function(aggregateId) {
    return new CompanyAggregate();
}

EditCompanyProfileCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            //check if user exists (aggregate)
            if(payload.userId !== aggregate.userId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_EXISTING);
            }

            const companyValidator = await writeRepo.validateCompanyEmailAndName({
                email: '',
                companyName: payload.companyName
            });

            if(payload.companyName === companyValidator.companyName && payload.userId !== companyValidator.userId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.COMPANY_EXISTS);
            }

            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

EditCompanyProfileCommandHandler.performCommand = async function(payload, aggregateId) {
    const company = await new CompanyAggregate().getCurrentState(aggregateId);
    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.COMPANY_PROFILE_EDITED,
                userId: payload.userId,
                company: payload.companyName,
                name: payload.companyName,
                companyName: payload.companyName,
                contact: payload.contact,
                website: payload.website,
                description: payload.description,
                establishmentDate: payload.establishmentDate,
                location: payload.location,
                picUrl: payload.picUrl,
                picUrlOld: payload.picUrlOld,
                offset: company.offset + 1
            },
            aggregate: CONSTANTS.AGGREGATES.COMPANY,
            context: CONSTANTS.CONTEXTS.ACCOUNT
        });

        resolve(events);
    })
    return events;
}

EditCompanyProfileCommandHandler.writeCommands = async function(command, events) {
    events.forEach((event) => {
        if(event.payload.eventType === CONSTANTS.EVENTS.COMPANY_PROFILE_EDITED) {
            writeRepo.updateCompanyName({
                companyName: event.payload.companyName,
                aggregateId: command.aggregateId
            })
        }
    })
}
module.exports = EditCompanyProfileCommandHandler;