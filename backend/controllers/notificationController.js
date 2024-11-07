const mongoose = require("mongoose");
const Notification = require("./../models/notificationModel"); // Adjust path if needed

// Function to create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId, chatId,content } = req.body;
    const notification = await Notification.create({
      userId, // The user who will receive this notification
      chatId, // The chat where the message was sent
      content, // Content of the notification
    });
    res.status(200).send(notification);
  } catch (error) {
    console.error("Error creating notification: ", error);
    throw new Error("Could not create notification.");
  }
};

// Function to retrieve recent notifications for a specific user
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.body;
    const notifications = await Notification.find({ userId }).sort({
      timestamp: -1,
    });
    res.status(200).send(notifications);
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    throw new Error("Could not fetch notifications.");
  }
};

// Function to mark all notifications as read for a specific user
const markNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await Notification.updateMany(
      { userId, seen: false },
      { $set: { seen: true } }
    );
    res.status(200).send(result);
  } catch (error) {
    console.error("Error marking notifications as read: ", error);
    throw new Error("Could not mark notifications as read.");
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationsAsRead,
};
