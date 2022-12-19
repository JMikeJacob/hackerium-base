const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const ApplicationTestSubmittedEventHandler = new BaseEventHandler();

ApplicationTestSubmittedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.APPLICATION_TEST_CODE_SUBMITTED];
}

ApplicationTestSubmittedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = ApplicationTestSubmittedEventHandler;