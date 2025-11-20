// import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// const EMAIL_USER = process.env.EMAIL_USER || "your_email@example.com";
// const EMAIL_PASS = process.env.EMAIL_PASS || "your_email_password";

// // Function to generate JWT token
// export const generateToken = (payload, expiresIn = "1h") => {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn });
// };
// // Function to verify JWT token
// export const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch (error) {
//     return null;
//   }
// };

// Function to send email

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ProKickTip Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
