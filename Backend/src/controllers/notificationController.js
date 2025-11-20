import Notification from "../models/Notification.js";

// Get all notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching notifications for user ID:", userId);
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark a single notification as read
export const markNotificationAsRead = async (req, res) => {
  console.log("HIT NOTIFICATION READ ROUTE:", req.params.id);
  try {
    const userId = req.user.id;
    const { id } = req.params;
    console.log("Marking notification as read:", id, "for user ID:", userId);

    // Only update if the notification belongs to logged-in user
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark all notifications for user as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { user: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
