const BaseCommandHandler = require('../base.command-handler');
const JobAggregate = require('../../aggregates/job.aggregate');
const CONSTANTS = require('../../../utils/constants');

const EditJobPostCommandHandler = new BaseCommandHandler();

EditJobPostCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.EDIT_JOB_POST];
}

EditJobPostCommandHandler.getAggregate = function(aggregateId) {
    return new JobAggregate();
}

EditJobPostCommandHandler.validate = async function(payload, aggregate) {
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

EditJobPostCommandHandler.performCommand = async function(payload, aggregateId) {
    const job = await new JobAggregate().getCurrentState(aggregateId);
    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.JOB_POST_EDITED,
                jobId: payload.jobId,
                jobName: payload.jobName,
                typeId: payload.typeId,
                typeName: payload.typeName,
                fieldId: payload.fieldId,
                fieldName: payload.fieldName,
                levelId: payload.levelId,
                levelName: payload.levelName,
                jobLocation: payload.jobLocation,
                description: payload.description,
                qualifications: payload.qualifications,
                isOpen: payload.isOpen,
                datePosted: payload.datePosted,
                dateDeadline: payload.dateDeadline,
                tags: payload.tags,
                offset: job.offset + 1
            },
            aggregate: CONSTANTS.AGGREGATES.JOB,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

module.exports = EditJobPostCommandHandler;