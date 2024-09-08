const mongoose = require("mongoose");

// database url
const MONGO_URI =
  "mongodb+srv://aykutkavdev:x66lL52dkhzbkelo@stack-task.f4amp.mongodb.net/stack-task";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(`Mongoose connected ${databaseName}`);
  })
  .catch((err) => {
    console.log("Error connecting to mongo: ", err);
  });
