const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const ApplicationTestSentEventHandler = new BaseEventHandler();

ApplicationTestSentEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.APPLICATION_TEST_SENT];
}

ApplicationTestSentEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = ApplicationTestSentEventHandler;