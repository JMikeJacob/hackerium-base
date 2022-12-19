const express = require('express')
const router = express.Router()
const factory = require('../utils/factory')();

const controller = factory.controller();

//home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Tests
router.get('/company/:id/tests', controller.getTestsPerCompany) //get tests of a particular company
router.get('/seeker/:id/tests', controller.getTestsTakenApplicant) //get tests taken by the user
router.get('/test/:id/takers', controller.getTestTakers) //get users who took the test
router.get('/test/:id', controller.getTest) //get test
router.put('/test/:id', controller.editTest) //edit test
router.delete('/test/:id', controller.deleteTest) //delete test
router.get('/employer/tests/page/:id', controller.getTestsPerPageEmployer) //get jobs sorted per page
router.post('/createTest', controller.createTest) //create test
router.get('/getSignedUrls', controller.getSignedUrls) //get signed URLs for AWS upload

//Engine
router.post('/run', controller.runScript);
router.post('/runMultiple', controller.runMultipleScripts);

module.exports = router;
