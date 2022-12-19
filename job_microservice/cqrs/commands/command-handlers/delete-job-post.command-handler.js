const BaseCommandHandler = require('../base.command-handler');
const JobAggregate = require('../../aggregates/job.aggregate');

const CONSTANTS = require('../../../utils/constants');;
const writeRepo = require('../write.repository');

const DeleteJobPostCommandHandler = new BaseCommandHandler();

DeleteJobPostCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.DELETE_JOB_POST];
}

DeleteJobPostCommandHandler.getAggregate = function(aggregateId) {
    return new JobAggregate();
}

DeleteJobPostCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            if(payload.jobId !== aggregate.jobId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_JOB);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

DeleteJobPostCommandHandler.performCommand = async function(payload, aggregateId) {

    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.JOB_POST_DELETED,
                jobId: payload.jobId,
                deletedAt: new Date().getTime()
            },
            aggregate: CONSTANTS.AGGREGATES.JOB,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

module.exports = DeleteJobPostCommandHandler;