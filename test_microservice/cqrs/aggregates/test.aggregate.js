const factory = require('../../utils/factory')();
const es = factory.eventStore();
const CONSTANTS = require('../../utils/constants');
const shortid = require('shortid');
//add addEvent function, objectify

class TestAggregate {
    constructor() {
        this.eventStream = {
            streamId: '',
            snapshot: {},
            events: [],
            latestRevision: -1
        };
    }
}

TestAggregate.prototype.getCurrentState = async (aggregateId) =>  { //change to company
    this.eventStream = await es.getFromSnapshot(aggregateId, CONSTANTS.AGGREGATES.TEST, CONSTANTS.CONTEXTS.TEST);

    const test = await new Promise((resolve) => {
        let snapshot = this.eventStream.snapshot.data || {};
        
        this.eventStream.events.forEach((event) => {
            event.payload = JSON.parse(event.payload);
            switch(event.payload.eventType) {
                case CONSTANTS.EVENTS.TEST_CREATED:
                    snapshot.testId = event.payload.testId;
                    snapshot.testTitle = event.payload.testTitle;
                    snapshot.testTotal = event.payload.testTotal;
                    snapshot.testDifficulty = event.payload.testDifficulty;
                    snapshot.testExecutionTime = event.payload.testExecutionTime;
                    snapshot.testFileUrls = event.payload.testFileUrls;
                    snapshot.testParameters = event.payload.testParameters;
                    snapshot.testBoilerplate = event.payload.testBoilerplate;
                    snapshot.companyId = event.payload.companyId;
                    snapshot.createdAt = event.payload.createdAt;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.TEST_EDITED:
                    snapshot.testTitle = event.payload.testTitle;
                    snapshot.testTotal = event.payload.testTotal;
                    snapshot.testDifficulty = event.payload.testDifficulty;
                    snapshot.testExecutionTime = event.payload.testExecutionTime;
                    snapshot.testFileUrls = event.payload.testFileUrls;       
                    snapshot.testParameters = event.payload.testParameters;
                    snapshot.testBoilerplate = event.payload.testBoilerplate;
                    snapshot.companyId = event.payload.companyId;
                    snapshot.updatedAt = event.payload.createdAt;
                    snapshot.offset = event.revision;
                    break;
                case CONSTANTS.EVENTS.TEST_DELETED:
                    snapshot.testId = event.payload.testId;
                    snapshot.deletedAt = event.payload.deletedAt;
                    break;
                default:
                    break;
            }
        });

        resolve(snapshot);
    })
    this.eventStream.snapshot = test;
    return test;
}

TestAggregate.prototype.addEvents = async (events) => {
    if(this.eventStream.events.length > CONSTANTS.SNAPSHOT_THRESHOLD) {
        try {
            es.addSnapshot(this.eventStream.streamId, this.eventStream.snapshot, this.eventStream.latestRevision, CONSTANTS.AGGREGATES.TEST, CONSTANTS.CONTEXTS.TEST);
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

module.exports = TestAggregate;