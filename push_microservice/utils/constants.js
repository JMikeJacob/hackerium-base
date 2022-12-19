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
        CREATE_JOB_POST: 'create_job_post',
        EDIT_JOB_POST: 'edit_job_post',
        DELETE_JOB_POST: 'delete_job_post',
        SUBMIT_APPLICATION: 'submit_application',
        WITHDRAW_APPLICATION: 'withdraw_application',
        CHANGE_APPLICATION_STATUS: 'change_application_status',
        SEND_APPLICATION_TEST: 'send_application_test',
        CREATE_TEST: 'create_test',
        EDIT_TEST: 'edit_test',
        DELETE_TEST: 'delete_test'
    },

    EVENTS: {
        SEEKER_REGISTERED: 'seeker_registered',
        SEEKER_ACCOUNT_EDITED: 'seeker_account_edited',
        SEEKER_PROFILE_EDITED: 'seeker_profile_edited',
        SEEKER_DELETED: 'seeker_deleted',
        COMPANY_REGISTERED: 'company_registered',
        COMPANY_ACCOUNT_EDITED: 'company_account_edited',
        COMPANY_PROFILE_EDITED: 'company_profile_edited',
        COMPANY_DELETED: 'company_deleted',
        JOB_POST_CREATED: 'job_post_created',
        JOB_POST_EDITED: 'job_post_edited',
        JOB_POST_DELETED: 'job_post_deleted',
        APPLICATION_SUBMITTED: 'application_submitted',
        APPLICATION_WITHDRAWN: 'application_withdrawn',
        APPLICATION_STATUS_CHANGED: 'application_status_changed',
        APPLICATION_TEST_SENT: 'application_test_sent',
        TEST_CREATED: 'test_created',
        TEST_EDITED: 'test_edited',
        TEST_DELETED: 'test_deleted'
    },

    AGGREGATES: {
        SEEKER: 'seeker',
        COMPANY: 'company',
        JOB: 'job',
        TEST: 'test',
        APPLICATION: 'application'
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

    APPLICATION_STATUS: {
        ACCEPTED: 'accepted',
        PENDING: 'pending',
        REJECTED: 'rejected',
    },

    JOB_IS_OPEN: {
        OPEN: 'yes',
        CLOSED: 'no'
    },

    TOPICS: {
        ACCOUNT_MS_EVENTS_TOPIC: 'account_microservice_events',
        JOB_MS_EVENTS_TOPIC: 'job_microservice_events',
        TEST_MS_EVENTS_TOPIC: 'test_microservice_events',
        TEST_MS_CODE_ENGINE_TOPIC: 'test_microservice_engine'
    },

    CONSUMER_GROUPS: {
        EVENTS_CONSUMER_GROUP: 'push_microservice_events_group',       
        PUSH_MS_CODE_ENGINE_CONSUMER_GROUP: 'push_microservice_code_engine_group'
    },

    ENGINE: {
        ACTIONS: {
            RESOLVE_TEST_CASE: 'resolve_test_case'
        }
    },
}