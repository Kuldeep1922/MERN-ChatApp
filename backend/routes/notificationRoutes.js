const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotifications,
  markNotificationsAsRead,
} = require("../controllers/notificationController");


router.route("/createNotification").post(createNotification);
router.route("/getNotification").post(getNotifications);
router.route("/markNotificationsAsRead").post(markNotificationsAsRead);


module.exports = router;