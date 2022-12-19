const BaseCommandHandler = require('../base.command-handler');
const SeekerAggregate = require('../../aggregates/seeker.aggregate');
const CONSTANTS = require('../../../utils/constants');

const EditSeekerProfileCommandHandler = new BaseCommandHandler();

EditSeekerProfileCommandHandler.getCommands = function() {
    return [CONSTANTS.COMMANDS.EDIT_SEEKER_PROFILE];
}

EditSeekerProfileCommandHandler.getAggregate = function(aggregateId) {
    return new SeekerAggregate();
}

EditSeekerProfileCommandHandler.validate = async function(payload, aggregate) {
    return new Promise(async (resolve, reject) => {
        try {
            //check if user exists
            if(payload.userId !== aggregate.userId) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.NO_EXISTING);
            }
            resolve(payload);
        } catch(err) {
            console.error(err);
            reject(err);
        }
    })
}

EditSeekerProfileCommandHandler.performCommand = async function(payload, aggregateId) {
    const seeker = await new SeekerAggregate().getCurrentState(aggregateId);
    const events = await new Promise((resolve) => {
        let events = [];

        events.push({
            streamId: aggregateId, 
            payload: {
                eventType: CONSTANTS.EVENTS.SEEKER_PROFILE_EDITED,
                userId: payload.userId,
                contactNo: payload.contactNo,
                gender: payload.gender,
                birthdate: payload.birthdate,
                salaryPerMonth: payload.salaryPerMonth,
                education: payload.education,
                level: payload.level,
                picUrl: payload.picUrl,
                picUrlOld: payload.picUrlOld,
                resumeUrl: payload.resumeUrl,
                resumeUrlOld: payload.resumeUrlOld,
                offset: seeker.offset + 1
            },
            aggregate: CONSTANTS.AGGREGATES.SEEKER,
            context: CONSTANTS.CONTEXTS.ACCOUNT
        });

        resolve(events);
    })
    return events;
}

module.exports = EditSeekerProfileCommandHandler;