const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const SeekerAccountEditedEventHandler = new BaseEventHandler();

SeekerAccountEditedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.SEEKER_ACCOUNT_EDITED];
}

SeekerAccountEditedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = SeekerAccountEditedEventHandler;