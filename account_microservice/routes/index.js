const express = require('express')
const router = express.Router()
const factory = require('../utils/factory')();
const controller = factory.controller();


//home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//User CRUD
router.post('/register', controller.createAccount) //create account
router.post('/login', controller.loginAccount) //login account
router.get('/login', controller.checkLogin) //check login
router.put('/account/:id', controller.editAccount) //edit account
router.delete('/account/:id', controller.deleteAccount) //delete account
router.get('/seeker/:id', controller.getSeeker) //get seeker account
router.get('/employer/:id', controller.getEmployer) //get employer account
router.get('/master', controller.getAllUsers)

//Jobseeker Profile
router.get('/seeker/profile/:id', controller.getSeekerProfile) //get seeker profile
router.get('/employer/applications/applicant/:id', controller.getSeekerProfile) //get seeker profile for employer
router.put('/seeker/profile/:id', controller.editSeekerProfile) //edit seeker profile

//Company Profile
router.get('/company/:id', controller.getCompanyProfile) //get company profile
router.put('/company/:id', controller.editCompanyProfile) //edit company profile
router.get('/companies/:page') //get companies per page

//Options
router.get('/options', controller.getOptions)

router.post('/seedUsers/:amount', controller.seedUsers);
router.post('/seedEmployers/:amount', controller.seedEmployers);

module.exports = router;
