const express = require('express')
const router = express.Router()
const factory = require('../utils/factory')();

const controller = factory.controller();

//home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Job Post 
router.get('/jobs/all', controller.getJobList) //get list of all jobs
router.get('/jobs/post/:id', controller.getJobById) //get job post by id ?=tags=true
router.get('/jobs/page/:id/', controller.getJobsPerPage) //get jobs sorted per page
router.get('/employer/jobs/page/:id', controller.getJobsPerPageEmployer) //get jobs sorted per page
router.post('/employer/jobs/new', controller.createJobPost) //create job post
router.put('/employer/jobs/:id', controller.editJobPost) //edit job post
router.delete('/employer/jobs/:id', controller.deleteJobPost) //delete job post

//Recommended Jobs
router.get('/seeker/recommended/:id/:page', controller.getRecommendedJobs) //get jobs with matching tags

//Options
router.get('/options', controller.getOptions)

//Applications:Seeker
router.post('/jobs/application/:id', controller.applyForJob) //apply for job
router.get('/jobs/application/:job_id/:user_id', controller.getApplicationStatus) //check if applied
router.get('/seeker/applications', controller.getApplicationsSeeker) //view all seeker's applications
router.get('/seeker/:user_id/applications/:page', controller.getApplicationsSeeker) //view seeker's applications sorted per page
router.delete('/jobs/application/:id', controller.deleteApplication) //delete application
router.post('/seeker/applications/submitTest', controller.submitApplicationTestCode) //user submission for test

//Applications:Employer
router.get('/employer/:posted_by_id/applications/:page', controller.getApplications) //view applications per page
router.get('/employer/applications/:id', controller.getApplicationsForJob) //view applications for job
router.put('/employer/applications/:id', controller.editApplicationStatus) //change app
router.put('/employer/applications/sendTest/:id', controller.sendApplicationTest) //send test to applicant

//Applications:General
router.get('/applications/test/:id', controller.getApplicationTestResultById) //get application test results

//Interviews
router.get('/interview/:id', controller.getInterviewScript);

//Seeding
router.post('/seedJobPost/:amount', controller.seedJobs);
router.post('/seedApps/:amount', controller.seedApps);

module.exports = router;
