const BaseCommandHandler = require('../base.command-handler');
const TestAggregate = require('../../aggregates/test.aggregate');
const CONSTANTS = require('../../../utils/constants');

const deleteTestCommandHandler = new BaseCommandHandler();

deleteTestCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.DELETE_TEST];
}

deleteTestCommandHandler.getAggregate = function() {
    return new TestAggregate();
}

deleteTestCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            if(payload.testId !== aggregate.testId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_TEST);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }

    });
}

deleteTestCommandHandler.performCommand = async function(payload, aggregateId) {
    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.TEST_DELETED,
                testId: payload.testId,
                deletedAt: new Date().getTime()
            },
            aggregate: CONSTANTS.AGGREGATES.TEST,
            context: CONSTANTS.CONTEXTS.TEST
        });

        resolve(events);
    })
    return events;
}

module.exports = deleteTestCommandHandler;