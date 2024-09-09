const mongoose = require("mongoose");
require("dotenv").config();

// database url
const MONGODB_URL = process.env.MONGODB_URL;
//
console.log("connected to:", MONGODB_URL);
mongoose
  .connect(MONGODB_URL)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(`Mongoose connected ${databaseName}`);
  })
  .catch((err) => {
    console.log("Error connecting to mongo: ", err);
  });
