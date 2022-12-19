const BaseBoundedContextHandler = require('../base.bounded-context-handler');
const TestAggregate = require('../../aggregates/test.aggregate');

const CONSTANTS = require('../../../utils/constants');

const TestAggregateBoundedContextHandler = new BaseBoundedContextHandler();

TestAggregateBoundedContextHandler.getHandledAggregate = function() {
    return [CONSTANTS.AGGREGATES.COMPANY];
}

TestAggregateBoundedContextHandler.getAggregate = function() {
    return new TestAggregate();
}

TestAggregateBoundedContextHandler.performCopy = async function(event, aggregate) {
    const currentState = await aggregate.getCurrentState(event.streamId);
    aggregate.addEvents([event]);
}

module.exports = TestAggregateBoundedContextHandler;