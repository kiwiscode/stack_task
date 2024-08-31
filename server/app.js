require("dotenv").config();

require("./db");

const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());
// 1. require the body-parser
const bodyParser = require("body-parser");
// 2. let know your app you will be using it
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./config")(app);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const logoutRoutes = require("./routes/logout.routes");
app.use("/logout", logoutRoutes);

const taskRoutes = require("./routes/task.routes");
app.use("/task", taskRoutes);

module.exports = app;
