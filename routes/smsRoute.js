const express = require('express');
const router = express.Router();
const { ensureToken } = require('../controllerrs/authController')


const smsController = require('../controllerrs/smsController');


// post 

router.post('/post/sendSMSInvitation',ensureToken,smsController.sendSMSInvitation);




module.exports = router;