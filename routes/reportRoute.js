const express = require('express');
const router = express.Router();

const userController = require('../controllers/reportController');

router.post('/checkinguserdata', userController.checkingUserData);
router.post('/checkingfieldsdata', userController.checkingFieldsData);
router.post('/sendEmail', userController.sendEmail);
module.exports = router;