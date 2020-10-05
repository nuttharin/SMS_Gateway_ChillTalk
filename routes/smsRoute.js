const express = require('express');
const router = express.Router();
const { ensureToken } = require('../controllerrs/authController')


const smsController = require('../controllerrs/smsController');

// get
router.get('/get/test',smsController.test);



// post 

router.post('/post/sendSMSInvitation',ensureToken,smsController.sendSMSInvitation);
router.post('/post/sendSMSMoneyTranfer',ensureToken,smsController.sendSMSMoneyTranfer);



module.exports = router;