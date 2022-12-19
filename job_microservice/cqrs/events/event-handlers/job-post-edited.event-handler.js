const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const JobPostEditedEventHandler = new BaseEventHandler();

JobPostEditedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.JOB_POST_EDITED];
}

JobPostEditedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = JobPostEditedEventHandler;