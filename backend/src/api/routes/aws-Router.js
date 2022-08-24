const router = require('express').Router();
const OTP = require('../controllers/OTPVerification');
router.get('/SNS-OTP');

router.get('/aws-send-OTP', OTP.sendOTP);
router.get('/aws-verify-OTP', OTP.verifyOTP);

module.exports = router;
