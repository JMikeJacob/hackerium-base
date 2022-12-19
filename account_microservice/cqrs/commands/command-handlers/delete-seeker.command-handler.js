const BaseCommandHandler = require('../base.command-handler');
const SeekerAggregate = require('../../aggregates/seeker.aggregate');
const CONSTANTS = require('../../../utils/constants');
const writeRepo = require('../write.repository');

const DeleteSeekerCommandHandler = new BaseCommandHandler();

DeleteSeekerCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.DELETE_SEEKER];
}

DeleteSeekerCommandHandler.getAggregate = function(aggregateId) {
    return new SeekerAggregate();
}

DeleteSeekerCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            //check if user exists
            if(payload.userId !== aggregate.userId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_EXISTING);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

DeleteSeekerCommandHandler.performCommand = async function(payload, aggregateId) {

    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.SEEKER_DELETED,
                userId: payload.userId,
                deletedAt: new Date().getTime()
            },
            aggregate: CONSTANTS.AGGREGATES.SEEKER,
            context: CONSTANTS.CONTEXTS.ACCOUNT
        });

        resolve(events);
    })
    return events;
}

DeleteSeekerCommandHandler.writeCommands = async function(command, events) {
    events.forEach((event) => {
        if(event.payload.eventType === CONSTANTS.EVENTS.SEEKER_DELETED) {
            writeRepo.deleteSeekerValidations({
                userId: event.payload.userId
            })
        }
    })
}

module.exports = DeleteSeekerCommandHandler;