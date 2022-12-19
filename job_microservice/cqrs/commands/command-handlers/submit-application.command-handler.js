const baseCommandHandler = require('../base.command-handler');
const ApplicationAggregate = require('../../aggregates/application.aggregate');
const SeekerAggregate = require('../../aggregates/seeker.aggregate');
const CompanyAggregate = require('../../aggregates/company.aggregate');
const JobAggregate = require('../../aggregates/job.aggregate');

const writeRepo = require('../write.repository')
const CONSTANTS = require('../../../utils/constants');

const SubmitApplicationCommandHandler = new baseCommandHandler();

SubmitApplicationCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.SUBMIT_APPLICATION];
}

SubmitApplicationCommandHandler.getAggregate = function(aggregateId) {
    return new ApplicationAggregate();
}

SubmitApplicationCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            if(payload.appId === aggregate.appId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.APPLIED);
            }
            const seekerValidator = await new SeekerAggregate().getCurrentState(payload.userId);
            if(payload.userId !== seekerValidator.userId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_EXISTING);
            }
            const companyValidator = await new CompanyAggregate().getCurrentState(payload.companyId);
            if(payload.companyId !== companyValidator.companyId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_COMPANY);
            }

            const applyValidator = await writeRepo.validateApplicationOfUser({
                jobId: payload.jobId, 
                userId: payload.userId
            });
            if(payload.jobId === applyValidator.jobId && payload.userId === applyValidator.jobId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.APPLIED);
            }

            const jobValidator = await new JobAggregate().getCurrentState(payload.jobId);
            if(payload.jobId !== jobValidator.jobId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_JOB);
            }
            else if(jobValidator.isOpen === CONSTANTS.JOB_IS_OPEN.CLOSED) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NOT_ACCEPTING);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

SubmitApplicationCommandHandler.performCommand = async function(payload, aggregateId) {
    //get aggregate here
    const companyState = await new CompanyAggregate().getCurrentState(payload.companyId);
    const seekerState = await new SeekerAggregate().getCurrentState(payload.userId);
    const jobState = await new JobAggregate().getCurrentState(payload.jobId);

    const events = await new Promise((resolve) => {
        let events = [];
        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.APPLICATION_SUBMITTED,
                appId: payload.appId,
                status: payload.status,
                datePosted: payload.datePosted,
                userId: payload.userId,
                firstName: seekerState.firstName,
                lastName: seekerState.lastName,
                companyId: payload.companyId,
                companyName: companyState.companyName,
                jobId: payload.jobId,
                jobName: jobState.jobName
            },
            aggregate: CONSTANTS.AGGREGATES.APPLICATION,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

SubmitApplicationCommandHandler.writeCommands = async function(command, events) {
    events.forEach((event) => {
        //check if already applied
        if(event.payload.eventType === CONSTANTS.EVENTS.APPLICATION_SUBMITTED) {
            writeRepo.addApplicationValidations({
                jobId: event.payload.jobId,
                userId: event.payload.userId,
                aggregateId: command.aggregateId
            })
        }
    })
}

module.exports = SubmitApplicationCommandHandler;