const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const ApplicationSubmittedEventHandler = new BaseEventHandler();

ApplicationSubmittedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.APPLICATION_SUBMITTED];
}

ApplicationSubmittedEventHandler.performEvent = async function(event) {
    return Promise.resolve([{
        commandType: CONSTANTS.COMMANDS.SEND_NOTIFICATION_TO_COMPANY,
        aggregateId: event.payload.companyId,
        payload: {
            companyId: event.payload.companyId,
        }
    }]);
}

module.exports = ApplicationSubmittedEventHandler;