const baseCommandHandler = require('../base.command-handler');
const ApplicationAggregate = require('../../aggregates/application.aggregate');
const writeRepo = require('../write.repository');
const CONSTANTS = require('../../../utils/constants');

const UpdateApplicationTestResultsCommandHandler = new baseCommandHandler();

UpdateApplicationTestResultsCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.UPDATE_APPLICATION_TEST_RESULTS];
}

UpdateApplicationTestResultsCommandHandler.getAggregate = function(aggregateId) {
    return new ApplicationAggregate();
}

UpdateApplicationTestResultsCommandHandler.validate = async function(payload, aggregate) {
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

UpdateApplicationTestResultsCommandHandler.performCommand = async function(payload, aggregateId) {
    //get aggregate here
    const events = await new Promise((resolve) => {
        let events = [];
        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.APPLICATION_TEST_RESULTS_UPDATED,
                appId: payload.appId,
                testOutput: payload.testOutput,
                testScore: payload.testScore,
                status: payload.status
            },
            aggregate: CONSTANTS.AGGREGATES.APPLICATION,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

module.exports = UpdateApplicationTestResultsCommandHandler;