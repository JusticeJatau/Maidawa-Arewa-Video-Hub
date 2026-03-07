import { sendOtp, checkOtp, resendOtp } from '../controllers/otpController.js';
import express from 'express'

const router = express.Router();

// Routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', checkOtp);
router.post('/resend-otp', resendOtp);

export default router;