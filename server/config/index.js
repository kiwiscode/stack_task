const express = require("express");
const path = require("path");
const logger = require("morgan");

const cors = require("cors");

module.exports = (app) => {
  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.set("views", path.join(__dirname, "..", "views"));

  app.set("view engine", "hbs");

  app.use(express.static(path.join(__dirname, "..", "public")));

  // CORS MIDDLEWARE INSIDE module.exports TO ALLOW CROSS-ORIGIN INTERACTION:
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
};
