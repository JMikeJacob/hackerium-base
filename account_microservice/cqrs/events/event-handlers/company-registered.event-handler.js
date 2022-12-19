const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const CompanyRegisteredEventHandler = new BaseEventHandler();

CompanyRegisteredEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.COMPANY_REGISTERED];
}

CompanyRegisteredEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = CompanyRegisteredEventHandler;