const BaseCommandHandler = require('../base.command-handler');
const NotificationAggregate = require('../../aggregates/notification.aggregate');

const CONSTANTS = require('../../../utils/constants');
const writeRepo = require('../write.repository');

const DeleteNotificationsOfCompanyCommandHandler = new BaseCommandHandler();

DeleteNotificationsOfCompanyCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.DELETE_NOTIFICATIONS_OF_COMPANY];
}

DeleteNotificationsOfCompanyCommandHandler.getAggregate = function(aggregateId) {
    return new NotificationAggregate();
}

DeleteNotificationsOfCompanyCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

DeleteNotificationsOfCompanyCommandHandler.performCommand = async function(payload, aggregateId) {
    //get aggregate here
    const notification = await new NotificationAggregate().getCurrentState(aggregateId);
    const events = await new Promise((resolve) => {
        let events = [];
        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.NOTIFICATION_TO_COMPANY_SENT,
                companyId: payload.companyId,
                resetAt: new Date().getTime()
                // offset: notification.offset + 1
            },
            aggregate: CONSTANTS.AGGREGATES.NOTIFICATION
        });

        resolve(events);
    })
    return events;
}

module.exports = DeleteNotificationsOfCompanyCommandHandler;