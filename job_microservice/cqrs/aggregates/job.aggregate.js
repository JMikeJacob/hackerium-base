const es = require('../../utils/eventStore');
const CONSTANTS = require('../../utils/constants');
const shortid = require('shortid');
//add addEvent function, objectify

class JobAggregate {
    constructor() {
        this.eventStream = {
            streamId: '',
            snapshot: {},
            events: [],
            latestRevision: -1
        };
    }
}

JobAggregate.prototype.getCurrentState = async (userId) =>  { //change to company
    this.eventStream = await es.getFromSnapshot(userId, CONSTANTS.AGGREGATES.JOB, CONSTANTS.CONTEXTS.JOB);

    const job = await new Promise((resolve) => {
        let snapshot = this.eventStream.snapshot.data || {};
        
        this.eventStream.events.forEach((event) => {
            event.payload = JSON.parse(event.payload);
            switch(event.payload.eventType) {
                case CONSTANTS.EVENTS.JOB_POST_CREATED:
                    snapshot.jobId = event.payload.jobId;
                    snapshot.companyId = event.payload.companyId;
                    snapshot.jobName = event.payload.jobName;
                    snapshot.typeId = event.payload.typeId;
                    snapshot.typeName = event.payload.typeName;
                    snapshot.fieldId = event.payload.fieldId;
                    snapshot.fieldName = event.payload.fieldName;
                    snapshot.levelId = event.payload.levelId;
                    snapshot.levelName = event.payload.levelName;
                    snapshot.jobLocation = event.payload.jobLocation;
                    snapshot.description = event.payload.description;
                    snapshot.qualifications = event.payload.qualifications;
                    snapshot.isOpen = event.payload.isOpen;
                    snapshot.datePosted = event.payload.datePosted;
                    snapshot.dateDeadline = event.payload.dateDeadline;
                    snapshot.tags = event.payload.tags;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.JOB_POST_EDITED:
                    snapshot.jobName = event.payload.jobName;
                    snapshot.typeId = event.payload.typeId;
                    snapshot.typeName = event.payload.typeName;
                    snapshot.fieldId = event.payload.fieldId;
                    snapshot.fieldName = event.payload.fieldName;
                    snapshot.levelId = event.payload.levelId;
                    snapshot.levelName = event.payload.levelName;
                    snapshot.jobLocation = event.payload.jobLocation;
                    snapshot.description = event.payload.description;
                    snapshot.qualifications = event.payload.qualifications;
                    snapshot.isOpen = event.payload.isOpen;
                    snapshot.datePosted = event.payload.datePosted;
                    snapshot.dateDeadline = event.payload.dateDeadline;
                    snapshot.tags = event.payload.tags;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.JOB_POST_DELETED:
                    snapshot.jobId = event.payload.jobId;
                    snapshot.deletedAt = event.payload.deletedAt;
                    break;
                default:
                    break;
            }
        });

        resolve(snapshot);
    })
    this.eventStream.snapshot = job;
    return job;
}

JobAggregate.prototype.addEvents = async (events) => {
    if(this.eventStream.events.length > CONSTANTS.SNAPSHOT_THRESHOLD) {
        try {
            es.addSnapshot(this.eventStream.streamId, this.eventStream.snapshot, this.eventStream.latestRevision, CONSTANTS.AGGREGATES.JOB, CONSTANTS.CONTEXTS.JOB);
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

module.exports = JobAggregate;