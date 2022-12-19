const BaseCommandHandler = require('../base.command-handler');
const JobAggregate = require('../../aggregates/job.aggregate');
const CompanyAggregate = require('../../aggregates/company.aggregate');
//companyAggregate
const CONSTANTS = require('../../../utils/constants');;
const writeRepo = require('../write.repository');

const CreateJobPostCommandHandler = new BaseCommandHandler();

CreateJobPostCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.CREATE_JOB_POST];
}

CreateJobPostCommandHandler.getAggregate = function(aggregateId) {
    return new JobAggregate();
}

CreateJobPostCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            // const companyValidator = await new CompanyAggregate().getCurrentState(payload.companyId);
            // if(payload.companyId !== companyValidator.userId) {
            //     throw new Error(CONSTANTS.ERROR_MESSAGES.NO_COMPANY);
            // }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

CreateJobPostCommandHandler.performCommand = async function(payload, aggregateId) {
    const company = await new CompanyAggregate().getCurrentState(payload.companyId);
    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.JOB_POST_CREATED,
                jobId: payload.jobId,
                companyId: payload.companyId,
                companyName: company.companyName,
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
                tags: payload.tags
            },
            aggregate: CONSTANTS.AGGREGATES.JOB,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

module.exports = CreateJobPostCommandHandler;