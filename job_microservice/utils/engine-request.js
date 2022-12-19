const CONSTANTS = require('./constants');


const factory = require('./factory')();
const broker = factory.broker();
const commandHandler = factory.commandHandler();

broker.subscribeToEngineRequests((message) => {
    try {
        if(message.payload.action === CONSTANTS.ENGINE.ACTIONS.RESOLVE_MICROSERVICE_TEST_CASES) {
            message.payload.status = CONSTANTS.APPLICATION_STATUS.REVIEWING_TEST;
            const command = {
                commandType: CONSTANTS.COMMANDS.UPDATE_APPLICATION_TEST_RESULTS,
                aggregateId: message.payload.appId,
                payload: message.payload
            }
    
            commandHandler.sendCommand(command);
        }
    } catch(err) {
        console.error(err);
    }
});