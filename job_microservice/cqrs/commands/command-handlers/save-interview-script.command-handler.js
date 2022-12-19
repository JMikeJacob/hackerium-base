const BaseCommandHandler = require('../base.command-handler');
const ApplicationAggregate = require('../../aggregates/application.aggregate');

const CONSTANTS = require('../../../utils/constants');

const SaveInterviewScriptCommandHandler = new BaseCommandHandler();

SaveInterviewScriptCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.SAVE_INTERVIEW_SCRIPT];
}

SaveInterviewScriptCommandHandler.getAggregate = function(aggregateId) {
    return new ApplicationAggregate();
}

SaveInterviewScriptCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            if(!payload.interviewScript) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REPEATED_COMMAND);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

SaveInterviewScriptCommandHandler.performCommand = async function(payload, aggregateId) {
    //get aggregate here
    if(!payload.interviewScript) return [];
    const application = await new ApplicationAggregate().getCurrentState(aggregateId);
    const events = await new Promise((resolve) => {
        let events = [];
        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.INTERVIEW_SCRIPT_SAVED,
                interviewId: payload.interviewId,
                interviewScript: payload.interviewScript,
                offset: application.offset + 1
            },
            aggregate: CONSTANTS.AGGREGATES.APPLICATION,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

module.exports = SaveInterviewScriptCommandHandler;