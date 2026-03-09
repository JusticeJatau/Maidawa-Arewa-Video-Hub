import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // one OTP per email at a time
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0, // number of verification attempts
  },
  sendCount: {
    type: Number,
    default: 0, // number of OTPs sent in current window
  },
  lastSentAt: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;