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
}, { timestamps: true });

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;