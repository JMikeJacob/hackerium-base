const BaseBoundedContextHandler = require('../base.bounded-context-handler');
const SeekerAggregate = require('../../aggregates/seeker.aggregate');

const CONSTANTS = require('../../../utils/constants');

const SeekerAggregateBoundedContextHandler = new BaseBoundedContextHandler();

SeekerAggregateBoundedContextHandler.getHandledAggregate = function() {
    return [CONSTANTS.AGGREGATES.SEEKER];
}

SeekerAggregateBoundedContextHandler.getAggregate = function() {
    return new SeekerAggregate();
}

SeekerAggregateBoundedContextHandler.performCopy = async function(event, aggregate) {
    const currentState = await aggregate.getCurrentState(event.streamId);
    console.log(currentState);
    aggregate.addEvents([event]);
}

module.exports = SeekerAggregateBoundedContextHandler;