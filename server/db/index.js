const mongoose = require("mongoose");

// when working on deploy version
// const MONGO_URI = "mongodb://127.0.0.1:27017/mern-todo-list-project";

// when working on deployment version
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(`Mongoose connected ${databaseName}`);
  })
  .catch((err) => {
    console.log("Error connecting to mongo: ", err);
  });
