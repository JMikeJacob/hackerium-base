const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const InterviewScriptSavedEventHandler = new BaseEventHandler();

InterviewScriptSavedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.INTERVIEW_SCRIPT_DELETED];
}

InterviewScriptSavedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = InterviewScriptSavedEventHandler;