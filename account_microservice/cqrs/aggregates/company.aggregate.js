const es = require('../../utils/eventStore');
const CONSTANTS = require('../../utils/constants');
const shortid = require('shortid');
//add addEvent function, objectify

class CompanyAggregate {
    constructor() {
        this.eventStream = {
            streamId: '',
            snapshot: {},
            events: [],
            latestRevision: -1
        };
    }
}

CompanyAggregate.prototype.getCurrentState = async (userId) =>  { //change to company
    this.eventStream = await es.getFromSnapshot(userId, CONSTANTS.AGGREGATES.COMPANY, CONSTANTS.CONTEXTS.ACCOUNT);

    const company = await new Promise((resolve) => {
        let snapshot = this.eventStream.snapshot.data || {};
        
        this.eventStream.events.forEach((event) => {
            event.payload = JSON.parse(event.payload);
            switch(event.payload.eventType) {
                case CONSTANTS.EVENTS.COMPANY_REGISTERED:
                    snapshot.userId = event.payload.userId;
                    snapshot.companyId = event.payload.companyId;
                    snapshot.email = event.payload.email; 
                    snapshot.password = event.payload.password; 
                    snapshot.lastName = event.payload.lastName; 
                    snapshot.firstName = event.payload.firstName;
                    snapshot.company = event.payload.company;
                    snapshot.companyName = event.payload.companyName; 
                    snapshot.name = event.payload.companyName;
                    snapshot.contact = event.payload.contact;
                    snapshot.role = event.payload.role;
                    snapshot.appNotifications = event.payload.appNotifications;
                    snapshot.website = event.payload.website;
                    snapshot.description = event.payload.description;
                    snapshot.establishmentDate = event.payload.establishmentDate;
                    snapshot.location = event.payload.location;
                    snapshot.picUrl = event.payload.picUrl;
                    snapshot.picUrlOld = event.payload.picUrlOld;
                    snapshot.resumeUrl = event.payload.resumeUrl;
                    snapshot.resumeUrlOld = event.payload.resumeUrlOld;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.COMPANY_ACCOUNT_EDITED:
                    snapshot.email = event.payload.email; 
                    snapshot.password = event.payload.password; 
                    snapshot.lastName = event.payload.lastName; 
                    snapshot.firstName = event.payload.firstName;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.COMPANY_PROFILE_EDITED:
                    snapshot.company = event.payload.companyName;
                    snapshot.companyName = event.payload.companyName; 
                    snapshot.name = event.payload.companyName;
                    snapshot.contact = event.payload.contact;
                    snapshot.appNotifications = event.payload.appNotifications;
                    snapshot.website = event.payload.website;
                    snapshot.description = event.payload.description;
                    snapshot.establishmentDate = event.payload.establishmentDate;
                    snapshot.location = event.payload.location;
                    snapshot.picUrl = event.payload.picUrl;
                    snapshot.picUrlOld = event.payload.picUrlOld;
                    snapshot.resumeUrl = event.payload.resumeUrl;
                    snapshot.resumeUrlOld = event.payload.resumeUrlOld;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.COMPANY_DELETED:
                    snapshot.userId = event.payload.userId;
                    snapshot.deletedAt = event.payload.deletedAt;
                    break;
                default:
                    break;
            }
        });

        resolve(snapshot);
    })
    this.eventStream.snapshot = company;
    return company;
}

CompanyAggregate.prototype.addEvents = async (events) => {
    if(this.eventStream.events.length > CONSTANTS.SNAPSHOT_THRESHOLD) {
        try {
            es.addSnapshot(this.eventStream.streamId, this.eventStream.snapshot, this.eventStream.latestRevision, CONSTANTS.AGGREGATES.COMPANY, CONSTANTS.CONTEXTS.ACCOUNT);
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

module.exports = CompanyAggregate;