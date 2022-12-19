const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const NotificationToCompanySent = new BaseEventHandler();

NotificationToCompanySent.getEvents = function() {
    return [CONSTANTS.EVENTS.NOTIFICATION_TO_COMPANY_SENT];
}

NotificationToCompanySent.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = NotificationToCompanySent;