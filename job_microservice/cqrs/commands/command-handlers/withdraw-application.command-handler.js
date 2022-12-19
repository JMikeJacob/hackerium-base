const baseCommandHandler = require('../base.command-handler');
const ApplicationAggregate = require('../../aggregates/application.aggregate');

const CONSTANTS = require('../../../utils/constants');
const writeRepo = require('../write.repository');

const WithdrawApplicationCommandHandler = new baseCommandHandler();

WithdrawApplicationCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.WITHDRAW_APPLICATION];
}

WithdrawApplicationCommandHandler.getAggregate = function(aggregateId) {
    return new ApplicationAggregate();
}

WithdrawApplicationCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            if(payload.appId !== aggregate.appId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_EXISTING);
            }
            if(aggregate.status !== CONSTANTS.APPLICATION_STATUS.PENDING_TEST) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.APPLICATION_PROCESSED);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

WithdrawApplicationCommandHandler.performCommand = async function(payload, aggregateId) {
    //get aggregate here

    const events = await new Promise((resolve) => {
        let events = [];
        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.APPLICATION_WITHDRAWN,
                appId: payload.appId,
                deletedAt: new Date().getTime()
            },
            aggregate: CONSTANTS.AGGREGATES.APPLICATION,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

WithdrawApplicationCommandHandler.writeCommands = async function(command, events) {
    events.forEach((event) => {
        //delete validations
        if(event.payload.eventType === CONSTANTS.EVENTS.APPLICATION_WITHDRAWN) {
            writeRepo.deleteApplicationValidations({
                aggregateId: command.aggregateId
            })  
        }
    })
}

module.exports = WithdrawApplicationCommandHandler;