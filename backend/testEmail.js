// testEmail.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Convert port to number and secure to boolean
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),       // Must be number
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,      // logs SMTP communication
  debug: true,       // show connection debug info
});

const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,            // Must match your Gmail or verified alias
      to: "jataujustice200@gmail.com",         // Recipient
      subject: "Test Email from Nodemailer",
      text: "This is a test email from your Node.js app",
    });
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

sendTestEmail();