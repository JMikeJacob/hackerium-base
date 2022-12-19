const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const ApplicationWithdrawnEventHandler = new BaseEventHandler();

ApplicationWithdrawnEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.APPLICATION_WITHDRAWN];
}

ApplicationWithdrawnEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = ApplicationWithdrawnEventHandler;