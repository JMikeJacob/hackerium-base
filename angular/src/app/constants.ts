export const CONSTANTS = {
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
        TEST_DELETED: 'test_deleted',
        NOTIFICATION_TO_COMPANY_SENT: 'notification_to_company_sent'
    },

    APPLICATION_STATUS: {
        ACCEPTED: 'accepted',
        PENDING_TEST: 'pending',
        TEST_SENT: 'testing',
        REVIEWING_TEST: 'reviewing',
        REJECTED: 'rejected',
        INTERVIEWING: 'interviewing'
    },

    INTERVIEW_STATUS: {
        NONE: 'none',
        ONGOING: 'ongoing'
    }
}
