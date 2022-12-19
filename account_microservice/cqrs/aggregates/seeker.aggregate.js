const es = require('../../utils/eventStore');
const CONSTANTS = require('../../utils/constants');
const shortid = require('shortid');
//add addEvent function, objectify

class SeekerAggregate {
    constructor() {
        this.eventStream = {
            streamId: '',
            snapshot: {},
            events: [],
            latestRevision: -1
        };
    }
}

SeekerAggregate.prototype.getCurrentState = async (userId) =>  {
    this.eventStream = await es.getFromSnapshot(userId, CONSTANTS.AGGREGATES.SEEKER, CONSTANTS.CONTEXTS.ACCOUNT);

    const seeker = await new Promise((resolve) => {
        let snapshot = this.eventStream.snapshot.data || {};
        
        this.eventStream.events.forEach((event) => {
            event.payload = JSON.parse(event.payload);
            switch(event.payload.eventType) {
                case CONSTANTS.EVENTS.SEEKER_REGISTERED:
                    snapshot.userId = event.payload.userId;
                    snapshot.firstName = event.payload.firstName;
                    snapshot.lastName = event.payload.lastName;
                    snapshot.email = event.payload.email;
                    snapshot.password = event.payload.password;
                    snapshot.role = event.payload.role;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.SEEKER_ACCOUNT_EDITED:
                    snapshot.userId = event.payload.userId;
                    snapshot.firstName = event.payload.firstName;
                    snapshot.lastName = event.payload.lastName;
                    snapshot.email = event.payload.email;
                    snapshot.password = event.payload.password;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.SEEKER_PROFILE_EDITED:
                    snapshot.userId = event.payload.userId
                    snapshot.contactNo = event.payload.contactNo;
                    snapshot.gender = event.payload.gender;
                    snapshot.birthdate = event.payload.birthdate;
                    snapshot.salaryPerMonth = event.payload.salaryPerMonth;
                    snapshot.education = event.payload.education;
                    snapshot.level = event.payload.level;
                    snapshot.picUrl = event.payload.picUrl;
                    snapshot.picUrlOld = event.payload.picUrlOld;
                    snapshot.resumeUrl = event.payload.resumeUrl;
                    snapshot.resumeUrlOld = event.payload.resumeUrlOld;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.SEEKER_DELETED:
                    snapshot.userId = event.payload.userId;
                    snapshot.deletedAt = event.payload.deletedAt;
                    break;
                default:
                    break;
            }
        });

        resolve(snapshot);
    })
    this.eventStream.snapshot = seeker;
    return seeker;
}

SeekerAggregate.prototype.addEvents = async (events) => {
    if(this.eventStream.events.length > CONSTANTS.SNAPSHOT_THRESHOLD) {
        try {
            es.addSnapshot(this.eventStream.streamId, this.eventStream.snapshot, this.eventStream.latestRevision, CONSTANTS.AGGREGATES.SEEKER, CONSTANTS.CONTEXTS.ACCOUNT);
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

module.exports = SeekerAggregate;