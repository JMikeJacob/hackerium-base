const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const JobPostDeletedEventHandler = new BaseEventHandler();

JobPostDeletedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.JOB_POST_DELETED];
}

JobPostDeletedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = JobPostDeletedEventHandler;