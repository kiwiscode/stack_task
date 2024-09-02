const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const saltRounds = 10;

const User = require("../models/User.model");

const jwt = require("jsonwebtoken");

const capitalize = require("../helpers/capitalize");

require("dotenv").config();

router.post("/signup", (req, res, next) => {
  let { name, username, email, password } = req.body;

  name = capitalize(name);
  if (name === "" || username === "" || email === "" || password === "") {
    res.status(500).json({ error: "All fields are mandatory." });
    return;
  }

  if (password.length < 6) {
    res
      .status(402)
      .json({ error: "Your password needs to be at least 6 characters long." });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(402).json({
      error:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        name,
        username,
        email,
        password: hashedPassword,
        profilePicture: "",
      });
    })
    .then((user) => {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h", // Token duration
      });
      res.status(200).json({ token });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(501).json({
          error:
            "Username and email need to be unique.Provide a valid username or email",
        });
      } else if (error.code === 11000) {
        res.status(501).json({
          error:
            "Username and email need to be unique.Provide a valid username or email",
        });
      } else {
        next(error);
      }
    });
});

router.post("/login", (req, res) => {
  const { username, email, password } = req.body;

  if (username === "" || email === "" || password === "") {
    res.status(403).json({
      error:
        "All fields are mandatory.Please provide username,email and password.",
    });
    return;
  }

  if (password.length < 6) {
    return res
      .status(402)
      .json({ error: "Your password needs to be at least 6 characters long." });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ error: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the input password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (
            !isSamePassword ||
            user.username !== username ||
            user.email !== email
          ) {
            res.status(401).json({ error: "Wrong credentials." });
            return;
          }
          user.active = true;
          user.save().then((user) => {
            const { _id, name, username, email, active, profilePicture } = user;

            // with token
            const token = jwt.sign({ userId: _id }, process.env.JWT_SECRET, {
              expiresIn: "24h",
            });

            res.json({
              token,
              user: {
                _id,
                name,
                username,
                email,
                active,
                profilePicture,
              },
            });
          });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

module.exports = router;
