const baseCommandHandler = require('../base.command-handler');
const TestAggregate = require('../../aggregates/test.aggregate');
const CONSTANTS = require('../../../utils/constants');

const SendTestCaseResultCommandHandler = new baseCommandHandler();


SendTestCaseResultCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.SEND_TEST_CASE_RESULT];
}

SendTestCaseResultCommandHandler.getAggregate = function() {
    return new TestAggregate(); //Change to Test Case aggregate? (with applicant and test-case-specific data)
}

SendTestCaseResultCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }

    });
}

SendTestCaseResultCommandHandler.performCommand = async function(payload, aggregateId) {
    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.TEST_CASE_RESULT_SENT,
                output: payload.output,
                verdict: payload.verdict,
                timeTaken: payload.timeTaken,
                script: payload.script,
                errorCode: payload.errorCode,
                testRunId: payload.testRunId
            },
            aggregate: CONSTANTS.AGGREGATES.TEST,
            context: CONSTANTS.CONTEXTS.TEST
        });

        resolve(events);
    })
    return events;
}

module.exports = SendTestCaseResultCommandHandler;