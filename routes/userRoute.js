const express = require('express');
const router = express.Router();

// Correct import of fieldsController
const userController = require('../controllers/userController');

// Define your routes using fieldsController
router.post('/signup', userController.signup)
router.post('/signin', userController.signin)
router.get('/gettoolsbardata', userController.gettoolsbardata)
// router.post('/sendhi', fieldsController.sendhi);
// router.post('/sendEmail', fieldsController.sendEmail);
// router.get('/check-session', fieldsController.checksession);
module.exports = router;