const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const CompanyAccountEditedEventHandler = new BaseEventHandler();

CompanyAccountEditedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.COMPANY_ACCOUNT_EDITED];
}

CompanyAccountEditedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = CompanyAccountEditedEventHandler;