const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const TestCreatedEventHandler = new BaseEventHandler();

TestCreatedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.TEST_CREATED];
}

TestCreatedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = TestCreatedEventHandler;