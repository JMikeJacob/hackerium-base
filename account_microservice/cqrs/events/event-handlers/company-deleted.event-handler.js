const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const CompanyDeletedEventHandler = new BaseEventHandler();

CompanyDeletedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.COMPANY_DELETED];
}

CompanyDeletedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = CompanyDeletedEventHandler;