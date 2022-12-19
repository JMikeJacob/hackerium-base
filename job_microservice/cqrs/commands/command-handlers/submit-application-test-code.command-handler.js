const baseCommandHandler = require('../base.command-handler');
const ApplicationAggregate = require('../../aggregates/application.aggregate');
const SeekerAggregate = require('../../aggregates/seeker.aggregate');
const CompanyAggregate = require('../../aggregates/company.aggregate');
const JobAggregate = require('../../aggregates/job.aggregate');

const writeRepo = require('../write.repository');
const CONSTANTS = require('../../../utils/constants');

const SubmitApplicationTestCodeCommandHandler = new baseCommandHandler();

SubmitApplicationTestCodeCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.SUBMIT_APPLICATION_TEST_CODE];
}

SubmitApplicationTestCodeCommandHandler.getAggregate = function(aggregateId) {
    return new ApplicationAggregate();
}

SubmitApplicationTestCodeCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            if(payload.appId !== aggregate.appId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_EXISTING);
            }
            if(!payload.testFileUrls) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.REPEATED_COMMAND);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

SubmitApplicationTestCodeCommandHandler.performCommand = async function(payload, aggregateId) {
    //get aggregate here
    if(!payload.testTitle) {
        return [];
    }
    const events = await new Promise((resolve) => {
        let events = [];
        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.APPLICATION_TEST_CODE_SUBMITTED,
                testId: payload.testId,
                appId: payload.appId,
                status: payload.status,
                script: payload.script,
                testTitle: payload.testTitle,
                testFileUrls: payload.testFileUrls,
                testParameters: payload.testParameters,
                testExecutionTime: payload.testExecutionTime,
                testTotal: payload.testTotal,
                testCases: payload.testCases,
                testDuration: payload.testDuration,
                dateTaken: payload.dateTaken
            },
            aggregate: CONSTANTS.AGGREGATES.APPLICATION,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

SubmitApplicationTestCodeCommandHandler.writeCommands = async function(command, events) {
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

module.exports = SubmitApplicationTestCodeCommandHandler;