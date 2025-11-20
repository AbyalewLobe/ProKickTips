import User from "../models/User.js";
import { sendToken } from "../middleware/auth.Middleware.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import crypto from "crypto";
import { sendEmail } from "../../utils/email.js";
import { sendNotification } from "../../utils/sendNotification.js";
import Notification from "../models/Notification.js";

export const SignUp = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, role, password: hashedPassword });

    await newUser.save();

    // ▶ Create notifications BEFORE sending any response
    const admins = await User.find({ role: "admin" });

    const notifications = admins.map((admin) => ({
      user: admin._id,
      role: "admin",
      title: "New Account Registered",
      message: `New user: ${newUser.name} has registered.`,
    }));

    await Notification.insertMany(notifications);

    // ▶ Send token AFTER creating notifications
    sendToken(res, newUser);

    // ▶ Final response (only ONCE)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        tier: newUser.tier,
        access: newUser.access,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    sendToken(res, user);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        access: user.access,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id name email access role createdAt "
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isValid = await comparePassword(oldPassword, user.password);
    if (!user || !isValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token and expiry to DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // Create reset URL (Front-End page)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Email message
    const message = `
      <p>Hello ${user.name},</p>
      <p>You requested to reset your password. Click the link below to continue:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link expires in <b>15 minutes</b>.</p>
      <p>If you didn’t request this, ignore this email.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Hash the received token before lookup
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
