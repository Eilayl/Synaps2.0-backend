const express = require('express');
const router = express.Router();

// Correct import of fieldsController
const botController = require('../controllers/botController');

// Define your routes using fieldsController
router.post('/APIResponse', botController.APIresponse)
// router.post('/sendhi', fieldsController.sendhi);
// router.post('/sendEmail', fieldsController.sendEmail);
// router.get('/check-session', fieldsController.checksession);
module.exports = router;