const es = require('../../utils/eventStore');
const CONSTANTS = require('../../utils/constants');
const shortid = require('shortid');
//add addEvent function, objectify

class ApplicationAggregate {
    constructor() {
        this.eventStream = {
            streamId: '',
            snapshot: {},
            events: [],
            latestRevision: -1
        };
    }
}

ApplicationAggregate.prototype.getCurrentState = async (appId) =>  { //change to company
    this.eventStream = await es.getFromSnapshot(appId, CONSTANTS.AGGREGATES.APPLICATION, CONSTANTS.CONTEXTS.JOB);

    const application = await new Promise((resolve) => {
        let snapshot = this.eventStream.snapshot.data || {};
        
        this.eventStream.events.forEach((event) => {
            // event.payload = event.payload.replace('\n', '\\n');
            event.payload = JSON.parse(event.payload);
            switch(event.payload.eventType) {
                case CONSTANTS.EVENTS.APPLICATION_SUBMITTED:
                    snapshot.appId = event.payload.appId;
                    snapshot.userId = event.payload.userId;
                    snapshot.companyId = event.payload.companyId;
                    snapshot.jobId = event.payload.jobId;
                    snapshot.status = event.payload.status;
                    snapshot.datePosted = event.payload.datePosted;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.APPLICATION_WITHDRAWN:
                    snapshot.appId = event.payload.appId;
                    snapshot.deletedAt = event.payload.deletedAt;
                    break;
                case CONSTANTS.EVENTS.APPLICATION_STATUS_CHANGED:
                    snapshot.status = event.payload.status;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.APPLICATION_TEST_SENT:
                    snapshot.status = event.payload.status;
                    snapshot.testId = event.payload.testId;
                    break;
                case CONSTANTS.EVENTS.APPLICATION_TEST_CODE_SUBMITTED:
                    snapshot.status = event.payload.status;
                    snapshot.userId = event.payload.userId;
                    snapshot.testId = event.payload.testId;
                    snapshot.testTitle = event.payload.testTitle;
                    snapshot.testExecutionTime = event.payload.testExecutionTime;
                    snapshot.testScore = event.payload.testScore;
                    snapshot.testFileUrls = event.payload.testFileUrls;
                    snapshot.testParameters = event.payload.testParameters;
                    snapshot.testDuration = event.payload.testDuration;
                    snapshot.testDateTaken = event.payload.testDateTaken;
                    snapshot.testTotal = event.payload.testTotal;
                    break;
                case CONSTANTS.EVENTS.APPLICATION_TEST_RESULTS_UPDATED:
                    snapshot.testOutput = event.payload.testOutput;
                    snapshot.testScore = event.payload.testScore;
                    break;
                case CONSTANTS.EVENTS.INTERVIEW_SCRIPT_SAVED:
                    snapshot.interviewId = event.payload.interviewId;
                    snapshot.interviewScript = event.payload.interviewScript;
                    break;
                case CONSTANTS.EVENTS.INTERVIEW_SCRIPT_DELETED:
                    snapshot.interviewId = event.payload.interviewId;
                default:
                    break;
            }
        });

        resolve(snapshot);
    })
    this.eventStream.snapshot = application;
    return application;
}

ApplicationAggregate.prototype.addEvents = async (events) => {
    if(this.eventStream.events.length > CONSTANTS.SNAPSHOT_THRESHOLD) {
        try {
            es.addSnapshot(this.eventStream.streamId, this.eventStream.snapshot, this.eventStream.latestRevision, CONSTANTS.AGGREGATES.APPLICATION, CONSTANTS.CONTEXTS.JOB);
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

module.exports = ApplicationAggregate;