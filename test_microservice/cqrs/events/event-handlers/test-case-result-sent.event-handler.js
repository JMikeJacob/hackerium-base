const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const TestCaseResultSentEventHandler = new BaseEventHandler();

TestCaseResultSentEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.TEST_CASE_RESULT_SENT];
}

TestCaseResultSentEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = TestCaseResultSentEventHandler;