const CONSTANTS = require('../../../utils/constants');
const BaseEventHandler = require('../base.event-handler');

const InterviewScriptSavedEventHandler = new BaseEventHandler();

InterviewScriptSavedEventHandler.getEvents = function() {
    return [CONSTANTS.EVENTS.INTERVIEW_SCRIPT_SAVED];
}

InterviewScriptSavedEventHandler.performEvent = function(event) {
    return Promise.resolve([]);
}

module.exports = InterviewScriptSavedEventHandler;