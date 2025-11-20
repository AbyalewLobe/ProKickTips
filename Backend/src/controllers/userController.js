import Notification from "../models/Notification.js";
import User from "../models/User.js";
//for admin

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name email access createdAt");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id name email access createdAt"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const changeUserAccess = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle Free ↔ Premium
    user.access = user.access === "Free" ? "Premium" : "Free";
    await user.save();

    // Create ONE notification (not map)
    const notification = new Notification({
      user: user._id,
      role: "user",
      title: "Access Change",
      message: `Your access has been changed to ${user.access}.`,
    });

    await notification.save();

    res.status(200).json({
      message: `User access changed to ${user.access}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        access: user.access,
      },
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
