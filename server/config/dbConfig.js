const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connection established");
  } catch (err) {
    console.log("Error connecting", err);
  }
};

module.exports = connectDB;
