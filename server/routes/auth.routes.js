const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model");

const jwt = require("jsonwebtoken");

const capitalize = require("../helpers/capitalize");

require("dotenv").config();

router.post("/signup", async (req, res) => {
  let { name, username, email, password } = req.body.signUpFormData;

  try {
    name = capitalize(name);
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are mandatory." });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      return res.status(422).json({
        error:
          "Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.",
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { authenticationType, password } = req.body.loginFormData;

  try {
    if (!authenticationType || !password) {
      return res.status(403).json({
        error:
          "All fields are mandatory. Please provide username/email and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Your password needs to be at least 6 characters long.",
      });
    }

    const user = await User.findOne({
      $or: [{ email: authenticationType }, { username: authenticationType }],
    });

    if (!user) {
      return res.status(401).json({ error: "Wrong credentials." });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (!isSamePassword) {
      return res.status(401).json({ error: "Wrong credentials." });
    }

    user.active = true;
    const updatedUser = await user.save();

    const { _id, name, username, email, active, profilePicture } = updatedUser;

    const token = jwt.sign({ userId: _id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.json({
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
