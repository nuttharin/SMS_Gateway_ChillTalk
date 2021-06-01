const express = require('express');
const router = express.Router();

const { ensureToken } = require('../controllerrs/authController');



const smsController = require('../controllerrs/smsController');
const mtController = require('../controllerrs/mtController');
const appGasController = require('../controllerrs/appGasController')

// get
router.get('/get/test',smsController.test);



// post  
router.post('/post/sendSMSInvitation',ensureToken,smsController.sendSMSInvitation);

// router.post('/post/sendSMSMoneyTranfer',ensureToken,mtController.sendSMSMoneyTranfer);
//mt
router.post('/mt/post/sendMessage',mtController.sendSMSMt);
router.post('/mt/post/sendOtp',mtController.sendSmsOtp);
router.post('/mt/post/checkOtp',mtController.checkOtp);



//App Gas
router.post('/appGas/post/sendMessage',appGasController.sendSMSMessage);
router.post('/appGas/post/sendOtp',appGasController.sendSmsOtp);
router.post('/appGas/post/checkOtp',appGasController.checkOtp);


module.exports = router;