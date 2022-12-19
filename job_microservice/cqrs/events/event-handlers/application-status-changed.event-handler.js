const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const ApplicationStatusChangedEventHandler = new BaseEventHandler();

ApplicationStatusChangedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.APPLICATION_STATUS_CHANGED];
}

ApplicationStatusChangedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = ApplicationStatusChangedEventHandler;