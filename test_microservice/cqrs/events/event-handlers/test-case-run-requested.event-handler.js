const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');
const factory = require('../../../utils/factory')();

const broker = factory.broker();

const TestCaseRunRequestedEventHandler = new BaseEventHandler();

TestCaseRunRequestedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.TEST_CASE_RESULT_SENT];
}

TestCaseRunRequestedEventHandler.performEvent = function(event) {

    broker.publish(CONSTANTS.TOPICS.TEST_MS_CODE_ENGINE_TOPIC, {
        commandType: CONSTANTS.ENGINE.EXECUTE_TEST_CASE,
        aggregateId: req.body.testRunId,
        payload: {
            script: req.body.script,
            input: req.body.input,
            output: req.body.output,
            testRunId: req.body.testRunId,
            origin: CONSTANTS.ENGINE.TEST_CASE_ORIGIN.CLIENT
        }
    }, req.body.testRunId);

    return Promise.resolve([]);
}

module.exports = TestCaseRunRequestedEventHandler;