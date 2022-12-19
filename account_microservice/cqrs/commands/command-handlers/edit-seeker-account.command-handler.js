const BaseCommandHandler = require('../base.command-handler');
const SeekerAggregate = require('../../aggregates/seeker.aggregate');
const CONSTANTS = require('../../../utils/constants');
const helper = require('../../../utils/helper');
const writeRepo = require('../write.repository');

const EditSeekerAccountCommandHandler = new BaseCommandHandler();

EditSeekerAccountCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.EDIT_SEEKER_ACCOUNT];
}

EditSeekerAccountCommandHandler.getAggregate = function(aggregateId) {
    return new SeekerAggregate();
}

EditSeekerAccountCommandHandler.validate = async function(payload, aggregate) {
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

            //check if user exists
            if(payload.userId !== aggregate.userId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_EXISTING);
            }

            const emailValidator = await writeRepo.validateSeekerEmail({
                email: payload.email
            })
            //same email with another user
            if(payload.email === emailValidator.email && payload.userId !== emailValidator.userId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REGISTERED);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

EditSeekerAccountCommandHandler.performCommand = async function(payload, aggregateId) {
    const seeker = await new SeekerAggregate().getCurrentState(aggregateId);
    console.log(seeker);
    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.SEEKER_ACCOUNT_EDITED,
                userId: payload.userId,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                password: payload.password,
                offset: seeker.offset + 1
            },
            aggregate: CONSTANTS.AGGREGATES.SEEKER,
            context: CONSTANTS.CONTEXTS.ACCOUNT
        });

        resolve(events);
    })
    return events;
}

EditSeekerAccountCommandHandler.writeCommands = async function(command, events) {
    events.forEach((event) => {
        if(event.payload.eventType === CONSTANTS.EVENTS.SEEKER_ACCOUNT_EDITED) {
            writeRepo.addSeekerValidations({
                email: event.payload.email,
                userId: event.payload.userId,
                aggregateId: command.aggregateId
            })
        }
    })
}

module.exports = EditSeekerAccountCommandHandler;