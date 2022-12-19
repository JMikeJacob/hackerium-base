module.exports = {
    COMMANDS: {
        REGISTER_SEEKER: 'register_seeker',
        EDIT_SEEKER_ACCOUNT: 'edit_seeker_account',
        EDIT_SEEKER_PROFILE: 'edit_seeker_profile',
        DELETE_SEEKER: 'delete_seeker',
        REGISTER_COMPANY: 'register_company',
        EDIT_COMPANY_ACCOUNT: 'edit_company_account',
        EDIT_COMPANY_PROFILE: 'edit_company_profile',
        DELETE_COMPANY: 'delete_company',
    },

    EVENTS: {
        SEEKER_REGISTERED: 'seeker_registered',
        SEEKER_ACCOUNT_EDITED: 'seeker_account_edited',
        SEEKER_PROFILE_EDITED: 'seeker_profile_edited',
        SEEKER_DELETED: 'seeker_deleted',
        COMPANY_REGISTERED: 'company_registered',
        COMPANY_ACCOUNT_EDITED: 'company_account_edited',
        COMPANY_PROFILE_EDITED: 'company_profile_edited',
        COMPANY_DELETED: 'company_deleted'
    },

    CONTEXTS: {
        ACCOUNT: 'account',
        JOB: 'job',
        TEST: 'test'
    },

    AGGREGATES: {
        SEEKER: 'seeker',
        COMPANY: 'company'
    },

    SNAPSHOT_THRESHOLD: 5,

    ERROR_MESSAGES: {
        REGISTERED: 'Email already registered!',
        SERVER: 'Something went wrong in our server. Please try again after a while!',
        REQUIRED: 'Required fields should not be left blank!',
        INVALID_EMAIL: 'Not a valid email address',
        INVALID_PASSWORD: 'Password should be 8 or more characters long',
        CONTACT: 'Contact number should only contain numbers and be less than 20 characters long',
        COMPANY_EXISTS: 'Company name already registered!',
        NO_ACCOUNT: 'Incorrect email/password',
        NO_EXISTING: 'Account not registered',
        NO_COMPANY: 'Company not registered',
        NO_TEST: 'Test not created',
        NO_JOB: 'Job not posted',
        INVALID_DATE: 'Invalid date',
        INVALID_ID: 'Invalid ID',
        INVALID_PAGE: 'Invalid page number',
        NO_MATCH: 'No matching jobs found',
        APPLIED: 'Already applied for job',
        NOT_ACCEPTING: 'No longer accepting applications for that job',
        INVALID_FILE: 'Invalid file format',
        APPLICATION_PROCESSED: 'Cannot withdraw processed application'
    },

    ROLES: {
        SEEKER: 'seeker',
        EMPLOYER: 'employer'
    },

    TOPICS: {
        ACCOUNT_MS_COMMANDS_TOPIC: 'account_microservice_commands',
        ACCOUNT_MS_EVENTS_TOPIC: 'account_microservice_events'
    },

    CONSUMER_GROUPS: {
        ACCOUNT_MS_COMMANDS_CONSUMER_GROUP: 'account_microservice_commands_group',
        ACCOUNT_MS_EVENTS_CONSUMER_GROUP: 'account_microservice_events_group'
    }
}