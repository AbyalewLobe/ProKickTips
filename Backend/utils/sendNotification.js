import Notification from "../src/models/Notification.js";

export const sendNotification = async ({
  user = null,
  role,
  title,
  message,
  io = null,
}) => {
  const notification = await Notification.create({
    user,
    role,
    title,
    message,
  });

  // 🔥 Real-time push if Socket.io is used
  if (io) {
    if (user) {
      io.to(user.toString()).emit("notification", notification);
    } else {
      io.to(role).emit("notification", notification);
    }
  }

  return notification;
};
