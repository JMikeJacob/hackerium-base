const BaseCommandHandler = require('../base.command-handler');
const ApplicationAggregate = require('../../aggregates/application.aggregate');

const CONSTANTS = require('../../../utils/constants');;
const writeRepo = require('../write.repository');

const SendApplicationTestCommandHandler = new BaseCommandHandler();

SendApplicationTestCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.SEND_APPLICATION_TEST];
}

SendApplicationTestCommandHandler.getAggregate = function(aggregateId) {
    return new ApplicationAggregate();
}

SendApplicationTestCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            if(payload.appId !== aggregate.appId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_EXISTING);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

SendApplicationTestCommandHandler.performCommand = async function(payload, aggregateId) {
    //get aggregate here
    const application = await new ApplicationAggregate().getCurrentState(aggregateId);
    const events = await new Promise((resolve) => {
        let events = [];
        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.APPLICATION_TEST_SENT,
                testId: payload.testId,
                status: payload.status,
                offset: application.offset + 1
            },
            aggregate: CONSTANTS.AGGREGATES.APPLICATION,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

module.exports = SendApplicationTestCommandHandler;