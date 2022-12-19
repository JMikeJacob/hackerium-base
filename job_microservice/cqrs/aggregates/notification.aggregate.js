const es = require('../../utils/eventStore');
const CONSTANTS = require('../../utils/constants');
const shortid = require('shortid');

class NotificationAggregate {
    constructor() {
        this.eventStream = {
            streamId: '',
            snapshot: {},
            events: [],
            latestRevision: -1
        };
    }
}

NotificationAggregate.prototype.getCurrentState = async (aggregateId) =>  { //change to company
    this.eventStream = await es.getFromSnapshot(aggregateId, CONSTANTS.AGGREGATES.NOTIFICATION, CONSTANTS.CONTEXTS.JOB);

    const notifs = await new Promise((resolve) => {
        let snapshot = this.eventStream.snapshot.data || {};
        
        this.eventStream.events.forEach((event) => {
            event.payload = JSON.parse(event.payload);
            switch(event.payload.eventType) {
                case CONSTANTS.EVENTS.NOTIFICATION_TO_COMPANY_SENT:
                    snapshot.companyId = event.payload.companyId;
                    snapshot.appNotifs = event.payload.appNotifs;
                    snapshot.addedAt = event.payload.sentAt;
                    snapshot.offset = event.payload.offset;
                    break;
                case CONSTANTS.EVENTS.NOTIFICATIONS_OF_COMPANY_DELETED:
                    snapshot.companyId = event.payload.companyId;
                    snapshot.appNotifs = event.payload.appNotifs;
                    snapshot.resetAt = event.payload.resetAt;
                    snapshot.offset = event.payload.offset;
                default:
                    break;
            }
        });

        resolve(snapshot);
    })
    this.eventStream.snapshot = notifs;
    return notifs;
}

NotificationAggregate.prototype.addEvents = async (events) => {
    if(this.eventStream.events.length > CONSTANTS.SNAPSHOT_THRESHOLD) {
        try {
            es.addSnapshot(this.eventStream.streamId, this.eventStream.snapshot, this.eventStream.latestRevision, CONSTANTS.AGGREGATES.NOTIFICATION, CONSTANTS.CONTEXTS.JOB);
        } catch(err) {
            console.error(err);
        }
    }

    let events_array = [];
    await events.forEach((event, index) => {
        events_array.push({
            eventId: shortid.generate(),
            streamId: event.streamId, 
            payload: event.payload,
            revision: this.eventStream.latestRevision + index + 1,
            timestamp: new Date().getTime(),
            aggregate: event.aggregate,
            context: event.context
        });
    });

    await es.addEvents(this.eventStream.streamId, events_array);

}

module.exports = NotificationAggregate;