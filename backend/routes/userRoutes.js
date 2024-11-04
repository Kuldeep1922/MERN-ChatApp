const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware");

router.post("/", registerUser); // Sign Up
router.post("/login", authUser); // Sign In
router.get("/", protect, allUsers);

module.exports = router;
