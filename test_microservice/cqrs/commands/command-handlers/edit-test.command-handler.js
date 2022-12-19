const BaseCommandHandler = require('../base.command-handler');
const TestAggregate = require('../../aggregates/test.aggregate');
const CONSTANTS = require('../../../utils/constants');

const editTestCommandHandler = new BaseCommandHandler();

editTestCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.EDIT_TEST];
}

editTestCommandHandler.getAggregate = function() {
    return new TestAggregate();
}

editTestCommandHandler.validate = async function(payload, aggregate) {
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

editTestCommandHandler.performCommand = async function(payload, aggregateId) {
    const test = await new TestAggregate().getCurrentState(aggregateId);
    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.TEST_EDITED,
                testId: payload.testId,
                testTitle: payload.testTitle,
                testTotal: payload.testTotal,
                testDifficulty: payload.testDifficulty,
                testExecutionTime: payload.testExecutionTime,
                testFileUrls: payload.testFileUrls,
                testParameters: payload.testParameters,
                testBoilerplate: payload.testBoilerplate,
                updatedAt: payload.updatedAt,
                offset: test.offset
            },
            aggregate: CONSTANTS.AGGREGATES.TEST,
            context: CONSTANTS.CONTEXTS.TEST
        });

        resolve(events);
    })
    return events;
}

module.exports = editTestCommandHandler;