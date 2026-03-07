// services/otpService.js
import OTP from '../models/OTP.js';
import { sendOtpEmail } from './emailService.js';

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Create or update OTP for an email
const createOtp = async (email, name) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  // Upsert OTP: if exists, update, else create
  await OTP.findOneAndUpdate(
    { email },
    { otp, expiresAt, attempts: 0 },
    { upsert: true, new: true }
  );

  await sendOtpEmail(email, otp, name, expiresAt);
  return otp;
};

// Verify OTP
const verifyOtp = async (email, userOtp) => {
  const record = await OTP.findOne({ email });
  if (!record) {
    throw new Error('OTP not found. Please request a new one.');
  }

  if (record.expiresAt < new Date()) {
    await OTP.deleteOne({ email });
    throw new Error('OTP has expired. Please request a new one.');
  }

  if (record.otp !== userOtp) {
    record.attempts += 1;
    await record.save();
    throw new Error('Invalid OTP.');
  }

  // OTP valid: delete record to prevent reuse
  await OTP.deleteOne({ email });
  return true;
};

export { createOtp, verifyOtp };