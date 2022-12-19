const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const CompanyProfileEditedEventHandler = new BaseEventHandler();

CompanyProfileEditedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.COMPANY_PROFILE_EDITED];
}

CompanyProfileEditedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = CompanyProfileEditedEventHandler;