const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const SeekerDeletedEventHandler = new BaseEventHandler();

SeekerDeletedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.SEEKER_DELETED];
}

SeekerDeletedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = SeekerDeletedEventHandler;