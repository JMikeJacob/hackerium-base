const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const TestDeletedEventHandler = new BaseEventHandler();

TestDeletedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.TEST_DELETED];
}

TestDeletedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = TestDeletedEventHandler;