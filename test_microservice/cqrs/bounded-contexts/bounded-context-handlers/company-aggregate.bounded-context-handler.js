const BaseBoundedContextHandler = require('../base.bounded-context-handler');
const CompanyAggregate = require('../../aggregates/company.aggregate');

const CONSTANTS = require('../../../utils/constants');

const CompanyAggregateBoundedContextHandler = new BaseBoundedContextHandler();

CompanyAggregateBoundedContextHandler.getHandledAggregate = function() {
    return [CONSTANTS.AGGREGATES.COMPANY];
}

CompanyAggregateBoundedContextHandler.getAggregate = function() {
    return new CompanyAggregate();
}

CompanyAggregateBoundedContextHandler.performCopy = async function(event, aggregate) {
    const currentState = await aggregate.getCurrentState(event.streamId);
    console.log(currentState);
    aggregate.addEvents([event]);
}

module.exports = CompanyAggregateBoundedContextHandler;