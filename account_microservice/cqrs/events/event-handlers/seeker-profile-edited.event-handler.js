const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const SeekerProfileEditedEventHandler = new BaseEventHandler();

SeekerProfileEditedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.SEEKER_PROFILE_EDITED];
}

SeekerProfileEditedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = SeekerProfileEditedEventHandler;