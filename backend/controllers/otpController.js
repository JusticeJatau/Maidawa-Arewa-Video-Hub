import { createOtp, verifyOtp } from "../services/otpservice.js";

// Send OTP to email
const sendOtp = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) return res.status(400).json({ success: false, message: "Email and Name are required" });

    await createOtp(email, name);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || "Failed to send OTP" });
  }
};

// Verify OTP
const checkOtp = async (req, res) => {
  try {
    const { email, otp, name } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

    await verifyOtp(email, otp, name);
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) return res.status(400).json({ success: false, message: "Email and Name are required" });

    await createOtp(email, name); // just create a new OTP and send
    res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || "Failed to resend OTP" });
  }
};

export {sendOtp, checkOtp, resendOtp}