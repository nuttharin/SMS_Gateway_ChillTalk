const express = require('express');
const router = express.Router();

const { ensureToken } = require('../controllerrs/authController');



const smsController = require('../controllerrs/smsController');
const mtController = require('../controllerrs/mtController');

// get
router.get('/get/test',smsController.test);



// post  
router.post('/post/sendSMSInvitation',ensureToken,smsController.sendSMSInvitation);

// router.post('/post/sendSMSMoneyTranfer',ensureToken,mtController.sendSMSMoneyTranfer);
router.post('/mt/post/sendMessage',mtController.sendSMSMt);
router.post('/mt/post/sendOtp',mtController.sendSmsOtp);
router.post('/mt/post/checkOtp',mtController.checkOtp);

 


module.exports = router;