const BaseCommandHandler = require('../base.command-handler');
const ApplicationAggregate = require('../../aggregates/application.aggregate');

const CONSTANTS = require('../../../utils/constants');

const DeleteInterviewScriptCommandHandler = new BaseCommandHandler();

DeleteInterviewScriptCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.DELETE_INTERVIEW_SCRIPT];
}

DeleteInterviewScriptCommandHandler.getAggregate = function(aggregateId) {
    return new ApplicationAggregate();
}

DeleteInterviewScriptCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

DeleteInterviewScriptCommandHandler.performCommand = async function(payload, aggregateId) {
    //get aggregate here
    const application = await new ApplicationAggregate().getCurrentState(aggregateId);
    const events = await new Promise((resolve) => {
        let events = [];
        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.INTERVIEW_SCRIPT_DELETED,
                interviewId: payload.interviewId
            },
            aggregate: CONSTANTS.AGGREGATES.APPLICATION,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

module.exports = DeleteInterviewScriptCommandHandler;