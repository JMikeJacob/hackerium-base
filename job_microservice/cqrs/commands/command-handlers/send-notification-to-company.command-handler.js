const BaseCommandHandler = require('../base.command-handler');
const NotificationAggregate = require('../../aggregates/notification.aggregate');
const CompanyAggregate = require('../../aggregates/application.aggregate');

const CONSTANTS = require('../../../utils/constants');
const writeRepo = require('../write.repository');

const SendNotificationToCompanyCommandHandler = new BaseCommandHandler();

SendNotificationToCompanyCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.SEND_NOTIFICATION_TO_COMPANY];
}

SendNotificationToCompanyCommandHandler.getAggregate = function(aggregateId) {
    return new NotificationAggregate();
}

SendNotificationToCompanyCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

SendNotificationToCompanyCommandHandler.performCommand = async function(payload, aggregateId) {
    //get aggregate here
    const notification = await new NotificationAggregate().getCurrentState(aggregateId);
    const events = await new Promise((resolve) => {
        let events = [];
        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.NOTIFICATION_TO_COMPANY_SENT,
                companyId: payload.companyId,
                appNotifs: (notification.appNotifs || 0) + 1,
                addedAt: new Date().getTime(),
                offset: (notification.offset || 0) + 1
            },
            aggregate: CONSTANTS.AGGREGATES.NOTIFICATION,
            context: CONSTANTS.CONTEXTS.JOB
        });

        resolve(events);
    })
    return events;
}

module.exports = SendNotificationToCompanyCommandHandler;