require("dotenv").config();
const colors = require("colors");
const mongoose = require("mongoose");
// const mongoURL = process.env.MONGO_URL_LOCAL;
const mongoURL = process.env.MONGO_URL_ONLINE;

mongoose.connect(mongoURL);
const db = mongoose.connection;
db.on("connected", async () => {
  console.log(`MongoDB Connected: ${db.host}`.bgWhite.black);
  try {
    console.log("Data fetched successfully.....".bgBlue.black);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
});
db.on("error", (err) => {
  console.log("MongoDb connection error:", err);
});
db.on("disconnected", () => {
  console.log("MongoDB disconnected...");
});
module.exports = db;
