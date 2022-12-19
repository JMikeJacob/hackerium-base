module.exports = {
    COMMANDS: {
        CREATE_TEST: 'create_test',
        EDIT_TEST: 'edit_test',
        DELETE_TEST: 'delete_test',
        SUBMIT_APPLICATION: 'submit_application',
        WITHDRAW_APPLICATION: 'withdraw_application',
        CHANGE_APPLICATION_STATUS: 'change_application_status',
        SEND_APPLICATION_TEST: 'send_application_test',
        UPDATE_APPLICATION_TEST_RESULTS: 'update_application_test_results',
        REQUEST_TEST_CASE: 'request_test_case',
        SEND_TEST_CASE_RESULT: 'send_test_case_result'
    },

    EVENTS: {
        TEST_CREATED: 'test_created',
        TEST_EDITED: 'test_edited',
        TEST_DELETED: 'test_deleted',
        SEEKER_REGISTERED: 'seeker_registered',
        SEEKER_ACCOUNT_EDITED: 'seeker_account_edited',
        SEEKER_PROFILE_EDITED: 'seeker_profile_edited',
        SEEKER_DELETED: 'seeker_deleted',
        COMPANY_REGISTERED: 'company_registered',
        COMPANY_ACCOUNT_EDITED: 'company_account_edited',
        COMPANY_PROFILE_EDITED: 'company_profile_edited',
        COMPANY_DELETED: 'company_deleted',
        TEST_CASE_REQUESTED: 'test_case_requested',
        TEST_CASE_REQUEST_COMPLETED: 'test_case_request_completed',
        TEST_CASE_RESULT_SENT: 'test_case_result_sent',
        APPLICATION_TEST_CODE_SUBMITTED: 'application_test_code_submitted'
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

    ORDERS: ['date_posted', 'job_name', 'company', 'salary'],

    ENGINE: {
        VERDICTS: {
            CORRECT: 'CORRECT',
            WRONG: 'WRONG',
            ERROR_TIMEOUT: 'ERROR_TIMEOUT',
            ERROR_RUNTIME: 'ERROR_RUNTIME',
            CUSTOM: 'CUSTOM'
        },

        TEST_CASE_ORIGIN: {
            CLIENT: 'client',
            MICROSERVICE: 'microservice'
        },

        ACTIONS: {
            EXECUTE_TEST_CASE: 'execute_test_case',
            RESOLVE_TEST_CASE: 'resolve_test_case',
            EXECUTE_TESTS: 'execute_tests',
            REQUEST_MICROSERVICE_TESTS: 'request_microservice_tests', 
            EXECUTE_MICROSERVICE_TEST_CASES: 'execute_microservice_test_cases',
            RESOLVE_MICROSERVICE_TEST_CASES: 'resolve_microservice_test_cases'
        }
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
        TEST_MS_COMMANDS_TOPIC: 'test_microservice_commands',
        TEST_MS_EVENTS_TOPIC: 'test_microservice_events',
        ACCOUNT_MS_EVENTS_TOPIC: 'account_microservice_events',
        JOB_MS_EVENTS_TOPIC: 'job_microservice_events',
        TEST_MS_CODE_ENGINE_TOPIC: 'test_microservice_engine',
        ENGINE_REQUEST_TOPIC: 'engine_request_topic'
    },

    CONSUMER_GROUPS: {
        TEST_MS_COMMANDS_CONSUMER_GROUP: 'test_microservice_commands_group',
        TEST_MS_EVENTS_CONSUMER_GROUP: 'test_microservice_events_group',
        TEST_MS_BOUNDED_CONTEXT_CONSUMER_GROUP: 'test_microservice_bounded_context_group',
        TEST_MS_CODE_ENGINE_CONSUMER_GROUP: 'test_microservice_code_engine_group',
        TEST_MS_ENGINE_REQUEST_CONSUMER_GROUP: 'test_microservice_engine_request_group'
    }
}