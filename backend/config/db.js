const mongoose = require("mongoose");
const Seat = require("../models/seats.model");

const connectionDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/train_booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    );

    console.log("MongoDB Connection Sucessful", conn.connection.host);
  }
  catch (error) {
    console.log("Connection error", error.message);
    process.exit();
  }
};

module.exports = connectionDB;
