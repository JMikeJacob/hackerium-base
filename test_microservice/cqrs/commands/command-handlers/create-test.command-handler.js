const BaseCommandHandler = require('../base.command-handler');
const TestAggregate = require('../../aggregates/test.aggregate');
const CompanyAggregate = require('../../aggregates/company.aggregate');
const CONSTANTS = require('../../../utils/constants');

const CreateTestCommandHandler = new BaseCommandHandler();

CreateTestCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.CREATE_TEST];
}

CreateTestCommandHandler.getAggregate = function() {
    return new TestAggregate();
}

CreateTestCommandHandler.validate = async function(payload, aggregate) {
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

    });
}

CreateTestCommandHandler.performCommand = async function(payload, aggregateId) {
    const company = await new CompanyAggregate().getCurrentState(payload.companyId);
    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.TEST_CREATED,
                testId: payload.testId,
                testTitle: payload.testTitle,
                testTotal: payload.testTotal,
                testDifficulty: payload.testDifficulty,
                testExecutionTime: payload.testExecutionTime,
                testFileUrls: payload.testFileUrls,
                testParameters: payload.testParameters,
                testBoilerplate: payload.testBoilerplate,
                companyId: payload.companyId,
                companyName: company.companyName,
                createdAt: payload.createdAt
            },
            aggregate: CONSTANTS.AGGREGATES.TEST,
            context: CONSTANTS.CONTEXTS.TEST
        });

        resolve(events);
    })
    return events;
}

module.exports = CreateTestCommandHandler;

