require("dotenv").config();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const router = require("../routes/userRoutes");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("Decoded User ID: ", decode.id);

      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorize, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not autherize, no token");
  }
});

module.exports = { protect };
