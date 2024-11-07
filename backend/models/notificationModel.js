const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The user who will receive this notification
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // The chat where the message was sent
  content: { type: String }, // Content of the message
  seen: { type: Boolean, default: false }, // Whether the user has seen this notification
  timestamp: { type: Date, default: Date.now }, // When the notification was created
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
