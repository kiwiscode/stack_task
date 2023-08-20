const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");

// GET home page
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  User.findById(userId)
    .populate("list")
    .then((user) => {
      const list = user.list;

      res.json(list);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
