const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const TestEditedEventHandler = new BaseEventHandler();

TestEditedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.TEST_EDITED];
}

TestEditedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = TestEditedEventHandler;