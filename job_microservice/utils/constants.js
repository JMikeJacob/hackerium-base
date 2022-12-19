module.exports = {
    COMMANDS: {
        CREATE_JOB_POST: 'create_job_post',
        EDIT_JOB_POST: 'edit_job_post',
        DELETE_JOB_POST: 'delete_job_post',
        SUBMIT_APPLICATION: 'submit_application',
        WITHDRAW_APPLICATION: 'withdraw_application',
        CHANGE_APPLICATION_STATUS: 'change_application_status',
        SEND_APPLICATION_TEST: 'send_application_test',
        SUBMIT_APPLICATION_TEST_CODE: 'submit_application_test_code',
        UPDATE_APPLICATION_TEST_RESULTS: 'update_application_test_results',
        SEND_NOTIFICATION_TO_SEEKER: 'send_notification_to_seeker',
        SEND_NOTIFICATION_TO_COMPANY: 'send_notification_to_company',
        DELETE_NOTIFICATIONS_OF_COMPANY: 'delete_notifications_of_company',
        DELETE_NOTIFICATIONS_OF_SEEKER: 'delete_notifications_of_seeker',
        SAVE_INTERVIEW_SCRIPT: 'save_interview_script',
        DELETE_INTERVIEW_SCRIPT: 'delete_interview_script' 
    },

    EVENTS: {
        JOB_POST_CREATED: 'job_post_created',
        JOB_POST_EDITED: 'job_post_edited',
        JOB_POST_DELETED: 'job_post_deleted',
        APPLICATION_SUBMITTED: 'application_submitted',
        APPLICATION_WITHDRAWN: 'application_withdrawn',
        APPLICATION_STATUS_CHANGED: 'application_status_changed',
        APPLICATION_TEST_SENT: 'application_test_sent',
        APPLICATION_TEST_CODE_SUBMITTED: 'application_test_code_submitted',
        APPLICATION_TEST_RESULTS_UPDATED: 'application_test_results_updated',
        TEST_CASE_REQUEST_COMPLETED: 'test_case_request_completed',
        NOTIFICATION_TO_SEEKER_SENT: 'notification_to_seeker_sent',
        NOTIFICATION_TO_COMPANY_SENT: 'notification_to_company_sent',
        NOTIFICATIONS_OF_SEEKER_DELETED: 'notifications_of_seeker_deleted',
        NOTIFICATIONS_OF_COMPANY_DELETED: 'notifications_of_company_deleted',
        INTERVIEW_SCRIPT_SAVED: 'interview_script_saved',
        INTERVIEW_SCRIPT_DELETED: 'interview_script_deleted',
        SEEKER_REGISTERED: 'seeker_registered',
        SEEKER_ACCOUNT_EDITED: 'seeker_account_edited',
        SEEKER_PROFILE_EDITED: 'seeker_profile_edited',
        SEEKER_DELETED: 'seeker_deleted',
        COMPANY_REGISTERED: 'company_registered',
        COMPANY_ACCOUNT_EDITED: 'company_account_edited',
        COMPANY_PROFILE_EDITED: 'company_profile_edited',
        COMPANY_DELETED: 'company_deleted',
        TEST_CREATED: 'test_created',
        TEST_EDITED: 'test_edited',
        TEST_DELETED: 'test_deleted',
        TEST_CODE_EXECUTED: 'test_code_executed'
    },

    CONTEXTS: {
        ACCOUNT: 'account',
        JOB: 'job',
        TEST: 'test'
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
        NO_APPLICATION: 'Job application not found',
        INVALID_DATE: 'Invalid date',
        INVALID_ID: 'Invalid ID',
        INVALID_PAGE: 'Invalid page number',
        NO_MATCH: 'No matching jobs found',
        APPLIED: 'Already applied for job',
        NOT_ACCEPTING: 'No longer accepting applications for that job',
        INVALID_FILE: 'Invalid file format',
        APPLICATION_PROCESSED: 'Cannot withdraw processed application',
        REPEATED_COMMAND: 'Command already processed'
    },

    ORDERS: ['date_posted', 'job_name', 'company', 'salary'],

    ROLES: {
        SEEKER: 'seeker',
        EMPLOYER: 'employer'
    },

    APPLICATION_STATUS: {
        ACCEPTED: 'accepted',
        PENDING_TEST: 'pending',
        TEST_SENT: 'testing',
        REVIEWING_TEST: 'reviewing',
        REJECTED: 'rejected',
        INTERVIEWING: 'interviewing',
        PROCESSING_TEST: 'processing'
    },

    JOB_IS_OPEN: {
        OPEN: 'yes',
        CLOSED: 'no'
    },

    AWS: {
        BUCKET: global.config.AWS_S3_BUCKET,
        UPLOAD_TYPES: {
            TEST: 'test'      
        },
        CONTENT_TYPES: {
            TEXT: 'text/plain',
            JSON: 'application/json'
        },
        EXTENSIONS: {
            TEXT: 'txt',
            JSON: 'json'
        }
    },

    TOPICS: {
        JOB_MS_COMMANDS_TOPIC: 'job_microservice_commands',
        JOB_MS_EVENTS_TOPIC: 'job_microservice_events',
        ACCOUNT_MS_EVENTS_TOPIC: 'account_microservice_events',
        TEST_MS_EVENTS_TOPIC: 'test_microservice_events',
        ENGINE_REQUEST_TOPIC: 'engine_request_topic'
    },

    CONSUMER_GROUPS: {
        JOB_MS_COMMANDS_CONSUMER_GROUP: 'job_microservice_commands_group',
        JOB_MS_EVENTS_CONSUMER_GROUP: 'job_microservice_events_group',
        JOB_MS_BOUNDED_CONTEXT_CONSUMER_GROUP: 'job_microservice_bounded_context_group',
        JOB_MS_ENGINE_REQUEST_CONSUMER_GROUP: 'job_microservice_engine_request_consumer_group'
    },

    ENGINE: {
        ACTIONS: {
            REQUEST_MICROSERVICE_TESTS: 'request_microservice_tests',
            RESOLVE_MICROSERVICE_TEST_CASES: 'resolve_microservice_test_cases'
        }
    }
}