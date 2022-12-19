const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const ApplicationTestResultsUpdatedEventHandler = new BaseEventHandler();

ApplicationTestResultsUpdatedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.APPLICATION_TEST_RESULTS_UPDATED];
}

ApplicationTestResultsUpdatedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = ApplicationTestResultsUpdatedEventHandler;