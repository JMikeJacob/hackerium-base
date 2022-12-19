const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const JobPostCreatedEventHandler = new BaseEventHandler();

JobPostCreatedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.JOB_POST_CREATED];
}

JobPostCreatedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = JobPostCreatedEventHandler;