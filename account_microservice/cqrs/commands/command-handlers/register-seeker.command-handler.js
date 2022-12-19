const BaseCommandHandler = require('../base.command-handler');
const SeekerAggregate = require('../../aggregates/seeker.aggregate');
const CONSTANTS = require('../../../utils/constants');
const helper = require('../../../utils/helper');
const writeRepo = require('../write.repository');

const RegisterSeekerCommandHandler = new BaseCommandHandler();

RegisterSeekerCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.REGISTER_SEEKER];
}

RegisterSeekerCommandHandler.getAggregate = function(aggregateId) {
    return new SeekerAggregate();
}

RegisterSeekerCommandHandler.validate = async function(payload, aggregate) {
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
            const validator = await writeRepo.validateSeekerEmail({
                email: payload.email
            });
            if(payload.email === validator.email) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REGISTERED);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

RegisterSeekerCommandHandler.performCommand = async function(payload, aggregateId) {

    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.SEEKER_REGISTERED,
                userId: payload.userId,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                password: payload.password,
                role: payload.role
            },
            aggregate: CONSTANTS.AGGREGATES.SEEKER,
            context: CONSTANTS.CONTEXTS.ACCOUNT
        });

        resolve(events);
    })
    return events;
}

RegisterSeekerCommandHandler.writeCommands = async function(command, events) {
    events.forEach((event) => {
        if(event.payload.eventType === CONSTANTS.EVENTS.SEEKER_REGISTERED) {
            writeRepo.addSeekerValidations({
                email: event.payload.email,
                userId: event.payload.userId,
                aggregateId: command.aggregateId
            })
        }
    })
}

module.exports = RegisterSeekerCommandHandler;