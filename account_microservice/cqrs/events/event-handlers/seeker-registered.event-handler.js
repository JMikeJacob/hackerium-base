const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const SeekerRegisteredEventHandler = new BaseEventHandler();

SeekerRegisteredEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.SEEKER_REGISTERED];
}

SeekerRegisteredEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = SeekerRegisteredEventHandler;